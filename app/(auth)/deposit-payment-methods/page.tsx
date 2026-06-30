"use client";

/* ────────── Imports ────────── */
import PaymentMethodForm, {
  initialPaymentMethodForm,
} from "@/components/deposit-payment-methods/PaymentMethodForm";
import PaymentMethodTable from "@/components/deposit-payment-methods/PaymentMethodTable";
import {
  Agent,
  DepositPaymentMethod,
  FormState,
} from "@/components/deposit-payment-methods/types";
import { useGetAgentsQuery } from "@/redux/features/agent/agentApi";
import {
  useCreateDepositPaymentMethodMutation,
  useDeleteDepositPaymentMethodMutation,
  useGetDepositPaymentMethodsQuery,
  useToggleDepositPaymentMethodMutation,
  useUpdateDepositPaymentMethodMutation,
} from "@/redux/features/deposit/depositApi";
import { FormEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";

/* ────────── Page ────────── */
export default function DepositPaymentMethodsPage() {
  const { data, isLoading, refetch } = useGetDepositPaymentMethodsQuery();
  const { data: agentsData, isLoading: isAgentsLoading } = useGetAgentsQuery();

  const [createMethod, { isLoading: isCreating }] =
    useCreateDepositPaymentMethodMutation();
  const [updateMethod, { isLoading: isUpdating }] =
    useUpdateDepositPaymentMethodMutation();
  const [toggleMethod] = useToggleDepositPaymentMethodMutation();
  const [deleteMethod] = useDeleteDepositPaymentMethodMutation();

  const [form, setForm] = useState<FormState>(initialPaymentMethodForm);
  const [search, setSearch] = useState("");

  /* ────────── Data Prepare ────────── */
  const methods: DepositPaymentMethod[] = data?.data || [];
  const agents: Agent[] = agentsData?.data || [];

  const activeAgents = useMemo(() => {
    return agents.filter((agent) => {
      const status = agent?.statusDoc?.status;
      return agent?.is_active !== false && status !== "blocked";
    });
  }, [agents]);

  const filteredMethods = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return methods;

    return methods.filter((method) => {
      return [
        method.title,
        method.methodName,
        method.methodType,
        method.accountNumber,
        method.owner?.name,
        method.owner?.customerId,
      ]
        .filter(Boolean)
        .some((item) => String(item).toLowerCase().includes(q));
    });
  }, [methods, search]);

  const resetForm = () => setForm(initialPaymentMethodForm);

  /* ────────── Add / Update Number ────────── */
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.ownerId) {
      toast.error("Please select an agent owner.");
      return;
    }

    const body = {
      accountNumber: form.accountNumber.trim(),
      methodName: form.methodName,
      methodType: form.methodType,
      title: form.title.trim(),
      ownerId: form.ownerId,
      isActive: form.isActive,
      isDefault: form.isDefault,
    };

    try {
      if (form.id) {
        await updateMethod({ id: form.id, body }).unwrap();
        toast.success("Payment number updated");
      } else {
        await createMethod(body).unwrap();
        toast.success("Payment number added");
      }
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.error || "Action failed",
      );
    }
  };

  const handleEdit = (method: DepositPaymentMethod) => {
    setForm({
      id: method._id,
      accountNumber: method.accountNumber || "",
      methodName: method.methodName || "Bkash",
      methodType: method.methodType || "payment",
      title: method.title || "",
      ownerId: method.owner?.id || "",
      isActive: Boolean(method.isActive),
      isDefault: Boolean(method.isDefault),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleMethod(id).unwrap();
      toast.success("Status updated");
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.error || "Status update failed",
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this payment number?")) return;

    try {
      await deleteMethod(id).unwrap();
      toast.success("Payment number deleted");
      refetch();
    } catch (error: any) {
      toast.error(
        error?.data?.message || error?.data?.error || "Delete failed",
      );
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ────────── Header ────────── */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Deposit Payment Methods</h1>
              <p className="text-sm text-slate-300">
                Admin can add multiple Bkash, Nagad and Rocket numbers, assign
                owner agent, set type and preview auto active schedule.
              </p>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search method, number, owner..."
              className="rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
            />
          </div>
        </section>

        <PaymentMethodForm
          form={form}
          setForm={setForm}
          agents={activeAgents}
          isAgentsLoading={isAgentsLoading}
          isBusy={isCreating || isUpdating}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <PaymentMethodTable
          methods={filteredMethods}
          isLoading={isLoading}
          onEdit={handleEdit}
          onToggle={handleToggle}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
