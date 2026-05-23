/* ────────── imports ────────── */
"use client";
import React from "react";

/* ────────── component ────────── */
export default function UserKeyStat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-4">
      <div className="text-xs uppercase tracking-wide text-[rgb(var(--app-text-muted))]">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-[rgb(var(--app-text))]">{value}</div>
    </div>
  );
}
