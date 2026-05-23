// /components/admin/TeamSummaryList.tsx
"use client";

/* ────────── Comments lik this ────────── */
/* right side list of levels and commissions */

export type TeamRow = { level: string; commission: number };

export default function TeamSummaryList({ rows }: { rows: TeamRow[] }) {
  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5">
      <p className="text-sm text-[rgb(var(--app-text-muted))] mb-3">Team Summary</p>
      <ul className="space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.level} className="flex items-center justify-between">
            <span className="text-[rgb(var(--app-text-soft))]">{r.level}</span>
            <span
              className={`${
                r.commission >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {r.commission >= 0 ? "$" : "-$"}
              {Math.abs(r.commission).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
