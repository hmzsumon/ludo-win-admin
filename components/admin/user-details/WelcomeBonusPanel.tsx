"use client";

import {
  useGrantWelcomeBonusMutation,
  type WelcomeBonusDetails,
} from "@/redux/features/admin/welcomeBonusApi";
import { Gift } from "lucide-react";
import { useState } from "react";

const getError = (error: any) =>
  error?.data?.error || error?.data?.message || error?.message || "Request failed";

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleString("en-US") : "—";

export default function WelcomeBonusPanel({
  userId,
  welcomeBonus,
  onDone,
}: {
  userId: string;
  welcomeBonus: WelcomeBonusDetails;
  onDone: () => void;
}) {
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [grant, { isLoading }] = useGrantWelcomeBonusMutation();

  const runGrant = async () => {
    if (!confirm("Grant the fixed 50 💎 welcome bonus to this user?")) return;
    try {
      const result = await grant({
        userId,
        note: note.trim() || "Granted after support review",
      }).unwrap();
      setMessage(result.message);
      setNote("");
      onDone();
    } catch (error) {
      setMessage(getError(error));
    }
  };

  const granted = welcomeBonus.status === "granted";

  return (
    <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-300" />
            <h3 className="font-semibold">Welcome Bonus Review</h3>
          </div>
          <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
            Exact transaction status, device decision and admin override
          </p>
        </div>
        <span
          className={`w-fit rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide ${
            granted
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
              : welcomeBonus.status === "denied"
                ? "border-rose-500/30 bg-rose-500/15 text-rose-300"
                : "border-amber-500/30 bg-amber-500/15 text-amber-300"
          }`}
        >
          {welcomeBonus.status}
        </span>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Amount", `${welcomeBonus.amount || 0} 💎`],
          ["Reason code", welcomeBonus.reasonCode || "—"],
          ["Device key", welcomeBonus.deviceKey || "Not available"],
          ["Source", welcomeBonus.source || "—"],
          ["Checked", formatDate(welcomeBonus.checkedAt)],
          ["Granted", formatDate(welcomeBonus.grantedAt)],
          ["Granted by", welcomeBonus.grantedByName || "—"],
          ["Attempts", String(welcomeBonus.attempts || 0)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-[rgb(var(--app-surface-2))] p-3">
            <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--app-text-muted))]">{label}</p>
            <p className="mt-1 break-words text-xs font-bold">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 p-3">
        <p className="text-[10px] uppercase tracking-wider text-[rgb(var(--app-text-muted))]">Decision reason</p>
        <p className="mt-1 text-sm leading-6">{welcomeBonus.reason}</p>
        {welcomeBonus.manualNote && (
          <p className="mt-2 text-xs text-amber-300">Admin note: {welcomeBonus.manualNote}</p>
        )}
      </div>

      {welcomeBonus.canGrantManually && (
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Support note (optional)"
            className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2.5 text-sm outline-none focus:border-amber-500/60"
          />
          <button
            onClick={runGrant}
            disabled={isLoading}
            className="rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-black text-slate-950 disabled:opacity-50"
          >
            {isLoading ? "Granting..." : "Grant Welcome Bonus 50 💎"}
          </button>
        </div>
      )}

      {message && <p className="mt-3 text-xs font-semibold text-amber-300">{message}</p>}
    </section>
  );
}
