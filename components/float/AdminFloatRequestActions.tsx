"use client";

/* ────────── imports ────────── */
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/new-ui/Button";
import {
  useAdminApproveFloatRequestMutation,
  useAdminRejectFloatRequestMutation,
} from "@/redux/features/admin/adminSettlementApi";

/* ────────── action buttons ────────── */
export default function AdminFloatRequestActions({
  id,
  onDone,
}: {
  id: string;
  onDone?: () => void;
}) {
  const [note, setNote] = useState("");
  const [approve, { isLoading: approving }] =
    useAdminApproveFloatRequestMutation();
  const [reject, { isLoading: rejecting }] =
    useAdminRejectFloatRequestMutation();

  const busy = approving || rejecting;

  /* ────────── approve handler ────────── */
  const handleApprove = async () => {
    try {
      await approve({ id, adminNote: note }).unwrap();
      toast.success("Float request approved");
      setNote("");
      onDone?.();
    } catch (e: any) {
      toast.error(e?.data?.message || "Approve failed");
    }
  };

  /* ────────── reject handler ────────── */
  const handleReject = async () => {
    try {
      await reject({ id, adminNote: note }).unwrap();
      toast.success("Float request rejected");
      setNote("");
      onDone?.();
    } catch (e: any) {
      toast.error(e?.data?.message || "Reject failed");
    }
  };

  return (
    <div className="space-y-2">
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Admin note optional"
        className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-xs text-[rgb(var(--app-text))] outline-none placeholder:text-[rgb(var(--app-text-muted))]"
      />
      <div className="grid grid-cols-2 gap-2">
        <Button loading={approving} disabled={busy} onClick={handleApprove}>
          Approve
        </Button>
        <Button
          variant="warning"
          loading={rejecting}
          disabled={busy}
          onClick={handleReject}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
