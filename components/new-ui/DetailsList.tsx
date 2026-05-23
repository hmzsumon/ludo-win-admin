// /components/ui/DetailsList.tsx
/* ────────── key-value list rows ────────── */
import { ReactNode } from "react";

export function Row({
  label,
  children,
}: {
  label: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 px-4 gap-2 border-t border-[rgb(var(--app-border))] py-4 md:grid-cols-12 first:border-t-0">
      <div className="md:col-span-3 text-[rgb(var(--app-text-soft))]">{label}</div>
      <div className="md:col-span-9">{children}</div>
    </div>
  );
}
