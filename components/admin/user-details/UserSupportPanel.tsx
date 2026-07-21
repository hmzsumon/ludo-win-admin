"use client";
import CopyToClipboard from "@/lib/CopyToClipboard";
import { useRepairLegacyUserMutation } from "@/redux/features/admin/adminUsersApi";
import Link from "next/link";
import { useState } from "react";

export default function UserSupportPanel({
  user,
  onDone,
}: {
  user: any;
  onDone: () => void;
}) {
  const [repair, { isLoading }] = useRepairLegacyUserMutation();
  const [message, setMessage] = useState("");
  const runRepair = async () => {
    try {
      const r = await repair({ id: user._id }).unwrap();
      setMessage(r.message);
      onDone();
    } catch (e: any) {
      setMessage(e?.data?.error || e?.data?.message || "Repair failed");
    }
  };
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
        <h3 className="font-semibold">OTP & Verification</h3>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-xl bg-[rgb(var(--app-surface-2))] p-3">
            <span>Channel</span>
            <b>{user.verification_channel || "-"}</b>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-[rgb(var(--app-surface-2))] p-3">
            <span>Current OTP</span>
            <span className="flex items-center gap-2 font-mono text-lg font-bold text-amber-300">
              {user.verify_code || "No active OTP"}
              {user.verify_code && <CopyToClipboard text={user.verify_code} />}
            </span>
          </div>
          <div className="text-xs text-[rgb(var(--app-text-muted))]">
            Expires:{" "}
            {user.verification_code_expires_at
              ? new Date(user.verification_code_expires_at).toLocaleString()
              : "-"}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
        <h3 className="font-semibold">Legacy Account Support</h3>
        <p className="mt-2 text-xs text-[rgb(var(--app-text-muted))]">
          Normalizes old Bangladesh phone formats and keeps previous users able
          to sign in.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={runRepair}
            disabled={isLoading}
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-50"
          >
            {isLoading ? "Repairing..." : "Repair This User"}
          </button>
          <Link
            href={`/users/${user._id}/game-history`}
            className="rounded-xl border border-emerald-500/40 px-4 py-2 text-sm font-semibold text-emerald-300"
          >
            View Game History
          </Link>
        </div>
        {message && <p className="mt-3 text-xs text-amber-300">{message}</p>}
      </div>
    </section>
  );
}
