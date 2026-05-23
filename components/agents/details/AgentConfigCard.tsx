"use client";

import SectionCard from "@/components/ui/SectionCard";
import {
  useDeleteAgentMutation,
  useSetAgentCreditLimitMutation,
  useUpdateAgentMutation,
} from "@/redux/features/agent/agentApi";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AgentConfigCard({
  agent,
  statusDoc,
  commissionConfigReadOnly,
  depositMethodStats,
  agentId,
  onRefetch,
}: {
  agent: any;
  statusDoc: any;
  commissionConfigReadOnly: any;
  depositMethodStats?: any;
  agentId: string;
  onRefetch: () => void;
}) {
  const [updateAgent, { isLoading: updating }] = useUpdateAgentMutation();
  const [setLimit, { isLoading: limitUpdating }] =
    useSetAgentCreditLimitMutation();
  const [deleteAgent, { isLoading: deleting }] = useDeleteAgentMutation();

  const [status, setStatus] = useState<"active" | "inactive" | "blocked">(
    "active",
  );
  const [creditLimit, setCreditLimit] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  /* ────────── server data theke local state sync ────────── */
  useEffect(() => {
    if (statusDoc?.status) setStatus(statusDoc.status);
    if (typeof statusDoc?.creditLimit === "number") {
      setCreditLimit(statusDoc.creditLimit);
    }
    if (typeof agent?.is_active === "boolean") setIsActive(agent.is_active);
  }, [agent?._id, agent?.is_active, statusDoc?.status, statusDoc?.creditLimit]);

  const onSave = async () => {
    try {
      await updateAgent({
        agentId: agentId,
        status,
        creditLimit,
        is_active: isActive,
      } as any).unwrap();
      toast.success("Saved ✅");
      onRefetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Save failed");
    }
  };

  /* ────────── active/inactive toggle ──────────
   * Switch OFF korle agent inactive + deposit method inactive.
   * Switch ON korle agent active + deposit method active.
   * Backend e same request er moddhei sync kora ache.
   * ─────────────────────────────────────────── */
  const onToggleActive = async (checked: boolean) => {
    const prevActive = isActive;
    const prevStatus = status;
    const nextStatus = checked ? "active" : "inactive";

    setIsActive(checked);
    setStatus(nextStatus);

    try {
      const res = await updateAgent({
        agentId,
        is_active: checked,
        status: nextStatus,
      } as any).unwrap();

      const updated = res?.data?.depositMethodsUpdated ?? 0;
      toast.success(
        checked
          ? `Agent active ✅ Deposit methods updated: ${updated}`
          : `Agent inactive ✅ Deposit methods updated: ${updated}`,
      );
      onRefetch();
    } catch (err: any) {
      setIsActive(prevActive);
      setStatus(prevStatus);
      toast.error(err?.data?.message || err?.error || "Status update failed");
    }
  };

  const onLimitOnly = async () => {
    try {
      await setLimit({ id: agentId, creditLimit }).unwrap();
      toast.success("Limit updated ✅");
      onRefetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Limit update failed");
    }
  };

  const onDisable = async () => {
    try {
      await deleteAgent(agentId).unwrap();
      toast.success("Agent disabled ✅");
      onRefetch();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Disable failed");
    }
  };

  const totalDepositMethods = depositMethodStats?.total ?? 0;
  const activeDepositMethods = depositMethodStats?.active ?? 0;
  const inactiveDepositMethods = depositMethodStats?.inactive ?? 0;

  return (
    <SectionCard title="Config" subtitle="Status • creditLimit • is_active">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
        <select
          value={status}
          onChange={(e) => {
            const nextStatus = e.target.value as any;
            setStatus(nextStatus);
            setIsActive(nextStatus === "active");
          }}
          className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm"
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="blocked">blocked</option>
        </select>

        <input
          type="number"
          value={creditLimit}
          onChange={(e) => setCreditLimit(Number(e.target.value || 0))}
          placeholder="Credit Limit"
          className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm"
        />

        <label className="flex items-center justify-between gap-3 rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 px-3 py-2 text-sm">
          <span>
            <span className="block font-semibold">Agent Active</span>
            <span className="text-[10px] text-[rgb(var(--app-text-muted))]">
              Deposit methods auto sync
            </span>
          </span>

          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => onToggleActive(e.target.checked)}
            disabled={updating}
            className="sr-only peer"
          />
          <span className="relative h-6 w-11 rounded-full bg-white/15 transition after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:bg-teal-600 peer-checked:after:translate-x-5 peer-disabled:opacity-60" />
        </label>

        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={updating}
            className="w-full rounded-lg bg-teal-600/80 px-3 py-2 text-sm font-semibold hover:bg-teal-600 disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save"}
          </button>
          <button
            onClick={onLimitOnly}
            disabled={limitUpdating}
            className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm hover:bg-[rgb(var(--app-surface-3))]/80 disabled:opacity-50"
          >
            {limitUpdating ? "Updating..." : "Limit Only"}
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-[rgb(var(--app-text-muted))] sm:grid-cols-2">
        <div>
          Commission Override (read-only):{" "}
          <b>
            {commissionConfigReadOnly?.depositPercent ?? "-"}% deposit /{" "}
            {commissionConfigReadOnly?.withdrawPercent ?? "-"}% withdraw
          </b>{" "}
          • Active: <b>{commissionConfigReadOnly?.isActive ? "yes" : "no"}</b>
        </div>

        <div className="sm:text-right">
          Deposit Methods: <b>{activeDepositMethods}</b> active /{" "}
          <b>{inactiveDepositMethods}</b> inactive /{" "}
          <b>{totalDepositMethods}</b> total
        </div>
      </div>

      <div className="mt-3">
        <button
          onClick={onDisable}
          disabled={deleting}
          className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-300 hover:bg-rose-400/15 disabled:opacity-50"
        >
          {deleting ? "Disabling..." : "Disable Agent"}
        </button>
      </div>
    </SectionCard>
  );
}
