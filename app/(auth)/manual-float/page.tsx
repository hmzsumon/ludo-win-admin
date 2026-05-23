// /app/(admin)/manual-float/page.tsx
"use client";

/* ────────── imports ────────── */
import Button from "@/components/new-ui/Button";
import Card from "@/components/new-ui/Card";

import { useAdminManualFloatMutation } from "@/redux/features/admin/adminFloatApi";
import {
  useGetAgentsQuery,
  useLazyGetAgentByIdQuery,
} from "@/redux/features/agent/agentApi";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// ✅ react-hot-toast
import { toast } from "react-hot-toast";

/* ────────── helpers ────────── */
const fmtUSD = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });

/* ────────── types ────────── */
type PreviewData = {
  ok: boolean;
  agent: {
    _id: string;
    name: string;
    email: string;
    customerId: string;
    phone?: string;
  };
  type: "topup" | "return";
  amount: number;
  current: { floatBalance: number };
  next: { floatBalance: number };
  note?: string;
  txnId: string;
};

export default function AdminManualFloatPage() {
  const router = useRouter();

  /* ────────── local state ────────── */
  const [search, setSearch] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState("");

  const [type, setType] = useState<"topup" | "return">("topup");
  const [amount, setAmount] = useState<string>("");
  const [txnId, setTxnId] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [preview, setPreview] = useState<PreviewData | null>(null);

  /* ────────── api hooks ────────── */
  const { data: agentsRes, isLoading: agentsLoading } = useGetAgentsQuery();
  const [triggerAgentDetails, { isLoading: isAgentLoading }] =
    useLazyGetAgentByIdQuery();

  const [manualFloat, { isLoading: isCreating }] =
    useAdminManualFloatMutation();

  const agents = agentsRes?.data ?? [];

  /* ────────── dropdown list (search filtered) ────────── */
  const filteredAgents = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return agents;
    return agents.filter((a: any) =>
      `${a?.name} ${a?.email} ${a?.phone} ${a?.customerId}`
        .toLowerCase()
        .includes(q),
    );
  }, [agents, search]);

  const selectedAgent = useMemo(() => {
    return agents.find((a: any) => a?._id === selectedAgentId) || null;
  }, [agents, selectedAgentId]);

  /* ────────── handlers ────────── */
  const handlePreview = async () => {
    const amt = Number(amount);

    if (!selectedAgentId) {
      toast.error("Select an agent");
      return;
    }
    if (!Number.isFinite(amt) || amt <= 0) {
      toast.error("Invalid amount");
      return;
    }
    if (!txnId.trim()) {
      toast.error("txnId required");
      return;
    }

    try {
      const res = await triggerAgentDetails(selectedAgentId).unwrap();

      /* ────────── IMPORTANT: response shape fix ──────────
       res = { success:true, data:{ agent:{...}, statusDoc:{...} } }
       so: agent = res.data.agent
    ───────────────────────────────────────────────────── */
      const wrapper = res?.data || {};
      const agentPayload = wrapper?.agent || null;
      const statusDoc = wrapper?.statusDoc || agentPayload?.statusDoc || {};

      if (!agentPayload?._id) {
        toast.error("Agent data not found in response");
        setPreview(null);
        return;
      }

      const currentFloat = Number(statusDoc?.ggrBalance ?? 0);

      const nextFloat =
        type === "topup" ? currentFloat + amt : currentFloat - amt;

      /* ────────── return safety check ────────── */
      if (type === "return" && nextFloat < 0) {
        toast.error("Insufficient float balance for return");
        setPreview(null);
        return;
      }

      setPreview({
        ok: true,
        agent: {
          _id: agentPayload._id,
          name: agentPayload.name,
          email: agentPayload.email,
          customerId: agentPayload.customerId,
          phone: agentPayload.phone,
        },
        type,
        amount: amt,
        current: { floatBalance: currentFloat },
        next: { floatBalance: nextFloat },
        note: note || "",
        txnId: txnId.trim(),
      });

      toast.success("Preview loaded");
    } catch (err: any) {
      setPreview(null);
      toast.error(err?.data?.message || "Preview failed");
    }
  };

  const handleConfirm = async () => {
    if (!preview?.ok) return;

    try {
      const res = await manualFloat({
        agentId: preview.agent._id,
        type: preview.type,
        amount: preview.amount,
        txnId: preview.txnId,
        note: preview.note || undefined,
      }).unwrap();

      toast.success(res?.message || "Manual float updated");
      router.push("/agents"); // চাইলে অন্য কোথাও redirect দিন
    } catch (err: any) {
      toast.error(err?.data?.message || "Manual float failed");
    }
  };

  const resetAll = () => {
    setPreview(null);
    setSearch("");
    setSelectedAgentId("");
    setType("topup");
    setAmount("");
    setTxnId("");
    setNote("");
  };

  /* ────────── UI ────────── */
  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      {/* If you already have a global <Toaster />, remove this */}

      <div className="mx-auto max-w-4xl p-6 md:p-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">
          Admin Manual Float
        </h2>

        {/* ────────── form card ────────── */}
        <Card className="p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Search */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-[rgb(var(--app-text-soft))]">
                Search Agent
              </label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name / email / phone / customerId..."
                className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>

            {/* Agent Dropdown */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-[rgb(var(--app-text-soft))]">
                Select Agent
              </label>

              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                disabled={agentsLoading}
              >
                <option value="">
                  {agentsLoading ? "Loading agents..." : "Select an agent"}
                </option>

                {filteredAgents.map((a: any) => (
                  <option className="text-gray-600" key={a._id} value={a._id}>
                    {a?.name} ({a?.customerId})
                  </option>
                ))}
              </select>

              {selectedAgent ? (
                <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                  Selected: {selectedAgent?.name} • {selectedAgent?.customerId}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                  Tip: Search লিখলে dropdown auto filter হবে।
                </p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="mb-1 block text-sm text-[rgb(var(--app-text-soft))]">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
              >
                <option value="topup">Topup (Add Float)</option>
                <option value="return">Return (Reduce Float)</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-1 block text-sm text-[rgb(var(--app-text-soft))]">
                Amount (USDT)
              </label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                inputMode="decimal"
                placeholder="100"
                className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>

            {/* txnId */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-[rgb(var(--app-text-soft))]">
                txnId (unique)
              </label>
              <input
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="MANUAL-FLOAT-2026-0001"
                className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
              />
              <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                Same txnId দিলে duplicate apply হবে না (idempotent)।
              </p>
            </div>

            {/* Note */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm text-[rgb(var(--app-text-soft))]">
                Note (optional)
              </label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any note for audit"
                className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
              />
            </div>
          </div>

          {/* ────────── actions ────────── */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              onClick={handlePreview}
              disabled={agentsLoading || isAgentLoading || isCreating}
            >
              {isAgentLoading ? "Loading..." : "Preview"}
            </Button>

            <Button
              variant="ghost"
              onClick={resetAll}
              disabled={agentsLoading || isAgentLoading || isCreating}
            >
              Reset
            </Button>
          </div>
        </Card>

        {/* ────────── preview panel ────────── */}
        {preview && (
          <Card className="mt-4 p-4">
            <div className="rounded-xl border font-x border-[rgb(var(--app-border))] p-4">
              <h3 className="mb-3 text-sm font-semibold text-neutral-200">
                Preview
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name" value={preview.agent.name} />
                <Field label="Customer ID" value={preview.agent.customerId} />
                <Field label="Email" value={preview.agent.email} />
                <Field label="Phone" value={preview.agent.phone || "-"} />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <Stat title="Type" value={preview.type.toUpperCase()} accent />
                <Stat title="Amount" value={fmtUSD(preview.amount)} />
                <Stat title="txnId" value={preview.txnId} />
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Stat
                  title="Current Float"
                  value={fmtUSD(preview.current.floatBalance)}
                />
                <Stat
                  title="Next Float"
                  value={fmtUSD(preview.next.floatBalance)}
                  accent
                />
              </div>

              {/* ────────── confirm actions ────────── */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleConfirm}
                  disabled={isCreating}
                >
                  {isCreating ? "Processing..." : "Confirm"}
                </Button>

                <Button
                  variant="warning"
                  onClick={() => setPreview(null)}
                  disabled={isCreating}
                >
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ────────── tips ────────── */}
        <p className="mt-4 text-xs text-[rgb(var(--app-text-muted))]">
          Tip: Return করলে float কমবে। Preview এ insufficient দেখালে confirm
          করবেন না।
        </p>
      </div>
    </main>
  );
}

/* ────────── small UI helpers (manual deposit page style) ────────── */
function Field({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2">
      <div className="text-[11px] text-[rgb(var(--app-text-muted))]">{label}</div>
      <div className="text-sm text-[rgb(var(--app-text))]">{value ?? "-"}</div>
    </div>
  );
}

function Stat({
  title,
  value,
  accent,
}: {
  title: string;
  value: any;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg border border-[rgb(var(--app-border))] px-3 py-2 ${
        accent ? "bg-[rgb(var(--app-surface-3))]/80" : "bg-[rgb(var(--app-surface-2))]/70"
      }`}
    >
      <div className="text-[11px] text-[rgb(var(--app-text-muted))]">{title}</div>
      <div className="text-sm text-[rgb(var(--app-text))]">{value ?? "-"}</div>
    </div>
  );
}
