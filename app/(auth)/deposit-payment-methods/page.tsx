"use client";

/* ────────── Imports ────────── */
import { useGetAgentsQuery } from "@/redux/features/agent/agentApi";
import {
  useCreateDepositPaymentMethodMutation,
  useDeleteDepositPaymentMethodMutation,
  useGetDepositPaymentMethodsQuery,
  useToggleDepositPaymentMethodMutation,
  useUpdateDepositPaymentMethodMutation,
} from "@/redux/features/deposit/depositApi";
import { FormEvent, useMemo, useState } from "react";

/* ────────── Types ────────── */
type DepositPaymentMethod = {
  _id: string;
  accountNumber: string;
  methodName: "Bkash" | "Nagad" | "Rocket";
  methodType: "personal" | "agent" | "payment" | "merchant";
  title: string;
  totalReceiveAmount?: number;
  isActive?: boolean;
  isDefault?: boolean;
  owner?: {
    id?: string;
    name?: string;
    customerId?: string;
    role?: string;
  };
};

type Agent = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  customerId?: string;
  is_active?: boolean;
  statusDoc?: {
    status?: string;
    agentType?: "e-wallet" | "cash";
  };
};

type FormState = {
  id?: string;
  accountNumber: string;
  methodName: "Bkash" | "Nagad" | "Rocket";
  methodType: "personal" | "agent" | "payment" | "merchant";
  title: string;
  ownerId: string;
  isActive: boolean;
  isDefault: boolean;
};

/* ────────── Initial Form State ────────── */
const initialForm: FormState = {
  accountNumber: "",
  methodName: "Bkash",
  methodType: "payment",
  title: "",
  ownerId: "",
  isActive: true,
  isDefault: false,
};

/* ────────── Formatter ────────── */
const formatAmount = (value?: number) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

/* ────────── Page ────────── */
export default function DepositPaymentMethodsPage() {
  const { data, isLoading } = useGetDepositPaymentMethodsQuery();
  const { data: agentsData, isLoading: isAgentsLoading } = useGetAgentsQuery();

  const [createMethod, { isLoading: isCreating }] =
    useCreateDepositPaymentMethodMutation();

  const [updateMethod, { isLoading: isUpdating }] =
    useUpdateDepositPaymentMethodMutation();

  const [toggleMethod] = useToggleDepositPaymentMethodMutation();
  const [deleteMethod] = useDeleteDepositPaymentMethodMutation();

  const [form, setForm] = useState<FormState>(initialForm);
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
        method.accountNumber,
        method.owner?.name,
        method.owner?.customerId,
      ]
        .filter(Boolean)
        .some((item) => String(item).toLowerCase().includes(q));
    });
  }, [methods, search]);

  /* ────────── Form Handlers ────────── */
  const resetForm = () => setForm(initialForm);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.ownerId) {
      alert("Please select an agent owner.");
      return;
    }

    const body = {
      accountNumber: form.accountNumber.trim(),
      methodName: form.methodName,
      methodType: form.methodType,
      title: form.title.trim(),

      // ✅ selected agent will be owner
      ownerId: form.ownerId,

      isActive: form.isActive,
      isDefault: form.isDefault,
    };

    if (form.id) {
      await updateMethod({ id: form.id, body }).unwrap();
    } else {
      await createMethod(body).unwrap();
    }

    resetForm();
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
  };

  /* ────────── Render ────────── */
  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ────────── Header ────────── */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Deposit Payment Methods</h1>
              <p className="text-sm text-slate-300">
                Admin can create, update, delete, active/inactive Bkash, Nagad
                and Rocket methods.
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

        {/* ────────── Create Update Form ────────── */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-slate-300">Title</label>

              <input
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                  }))
                }
                required
                placeholder="BKASH VIP - 01"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300">
                Method
              </label>

              <select
                value={form.methodName}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    methodName: event.target.value as FormState["methodName"],
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
              >
                <option>Bkash</option>
                <option>Nagad</option>
                <option>Rocket</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300">Type</label>

              <select
                value={form.methodType}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    methodType: event.target.value as FormState["methodType"],
                  }))
                }
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
              >
                <option value="payment">payment</option>
                <option value="personal">personal</option>
                <option value="agent">agent</option>
                <option value="merchant">merchant</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-slate-300">
                Account Number
              </label>

              <input
                value={form.accountNumber}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    accountNumber: event.target.value,
                  }))
                }
                required
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
              />
            </div>

            {/* ✅ Agent Owner Select */}
            <div className="md:col-span-3">
              <label className="mb-1 block text-xs text-slate-300">
                Owner Agent
              </label>

              <select
                value={form.ownerId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    ownerId: event.target.value,
                  }))
                }
                required
                disabled={isAgentsLoading}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400 disabled:opacity-60"
              >
                <option value="">
                  {isAgentsLoading ? "Loading agents..." : "Select owner agent"}
                </option>

                {activeAgents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name || "Unnamed Agent"} —{" "}
                    {agent.customerId || "No ID"}{" "}
                    {agent.statusDoc?.agentType
                      ? `(${agent.statusDoc.agentType})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-3 md:col-span-3">
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: event.target.checked,
                    }))
                  }
                />
                Active
              </label>

              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      isDefault: event.target.checked,
                    }))
                  }
                />
                Default
              </label>
            </div>

            <div className="flex items-end gap-2 md:col-span-6">
              <button
                type="submit"
                disabled={isCreating || isUpdating || isAgentsLoading}
                className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
              >
                {form.id ? "Update" : "Create"}
              </button>

              {form.id && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/10 px-5 py-2 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ────────── Methods Table ────────── */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/10 text-xs uppercase text-slate-300">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Number</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-slate-300"
                      colSpan={7}
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredMethods.length === 0 ? (
                  <tr>
                    <td
                      className="px-4 py-6 text-center text-slate-300"
                      colSpan={7}
                    >
                      No payment methods found.
                    </td>
                  </tr>
                ) : (
                  filteredMethods.map((method) => (
                    <tr key={method._id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-medium">{method.title}</td>

                      <td className="px-4 py-3">{method.methodName}</td>

                      <td className="px-4 py-3">{method.accountNumber}</td>

                      <td className="px-4 py-3">
                        <div className="font-medium">
                          {method.owner?.name || "-"}
                        </div>

                        <div className="text-xs text-slate-400">
                          {method.owner?.customerId || "No customer ID"} •{" "}
                          {method.owner?.role || "agent"}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        {formatAmount(method.totalReceiveAmount)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            method.isActive
                              ? "bg-emerald-400/20 text-emerald-300"
                              : "bg-rose-400/20 text-rose-300"
                          }`}
                        >
                          {method.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(method)}
                            className="rounded-lg border border-white/10 px-3 py-1 text-xs"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => toggleMethod(method._id)}
                            className="rounded-lg border border-amber-400/30 px-3 py-1 text-xs text-amber-300"
                          >
                            Toggle
                          </button>

                          <button
                            onClick={() => deleteMethod(method._id)}
                            className="rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
