/* ────────── imports ────────── */
"use client";
import { ReactNode } from "react";

/* ────────── component ────────── */
export default function UserPropertyItem({
  label,
  value,
  addon,
}: {
  label: string;
  value?: ReactNode;
  addon?: ReactNode; // optional right-side slot (e.g., link icon)
}) {
  return (
    <div className="flex items-center justify-between border-b border-[rgb(var(--app-border))] py-2 last:border-b-0">
      <div className="space-y-1">
        <div className="text-xs uppercase tracking-wide text-[rgb(var(--app-text-muted))]">
          {label}
        </div>
        <div className="text-sm font-medium text-[rgb(var(--app-text))]">{value ?? "-"}</div>
      </div>
      {addon ? <div className="shrink-0">{addon}</div> : null}
    </div>
  );
}
