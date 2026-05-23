/* ──────────  PeriodStatCard.tsx  ──────────
   SystemStats smart period object দেখানোর common card.
   প্রতিটা stat এ total / today / thisMonth / lastMonth থাকে।
──────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import type { IPeriodStats } from "@/redux/features/admin/adminApi";

/* ──────────  Types  ────────── */
interface PeriodStatCardProps {
  title: string;
  stat?: Partial<IPeriodStats> | null;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  isDiamond?: boolean;
  colorMode?: "neutral" | "income" | "cost" | "auto";
  note?: string;
}

/* ──────────  Number Helpers  ────────── */
const n = (value: any) => Number(value || 0);

export const fmt = (value: number) =>
  n(value).toLocaleString("en-BD", { maximumFractionDigits: 2 });

/* ──────────  Color Helper  ────────── */
const valueColor = (value: number, mode: PeriodStatCardProps["colorMode"]) => {
  if (mode === "income") return "text-emerald-400";
  if (mode === "cost") return "text-rose-400";
  if (mode === "auto") {
    if (value > 0) return "text-emerald-400";
    if (value < 0) return "text-rose-400";
    return "text-[rgb(var(--app-text-muted))]";
  }
  return "text-[rgb(var(--app-text))]";
};

/* ──────────  Small Period Item  ────────── */
function PeriodItem({
  label,
  value,
  suffix,
  color,
}: {
  label: string;
  value: number;
  suffix: string;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-white/[0.025] border border-white/[0.04] px-2.5 py-2">
      <p className="text-[9px] uppercase tracking-wide text-[rgb(var(--app-text))]/25">
        {label}
      </p>
      <p className={cn("mt-1 text-xs font-semibold", color)}>
        {fmt(value)}
        {suffix}
      </p>
    </div>
  );
}

/* ──────────  Main Component  ────────── */
export default function PeriodStatCard({
  title,
  stat,
  icon,
  iconBg = "bg-[rgb(var(--app-surface-2))]/70",
  iconColor = "text-[rgb(var(--app-text-muted))]",
  isDiamond = false,
  colorMode = "neutral",
  note,
}: PeriodStatCardProps) {
  const total = n(stat?.total);
  const today = n(stat?.today);
  const thisMonth = n(stat?.thisMonth);
  const lastMonth = n(stat?.lastMonth);
  const suffix = isDiamond ? " 💎" : "";
  const totalColor = valueColor(total, colorMode);

  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-4">
      {/* ──────────  Card Header  ────────── */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                iconBg,
              )}
            >
              <span className={iconColor}>{icon}</span>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
              {title}
            </h3>
            {note && (
              <p className="mt-0.5 text-[10px] text-[rgb(var(--app-text-muted))]">
                {note}
              </p>
            )}
          </div>
        </div>

        {/* ──────────  Total Highlight  ────────── */}
      </div>

      {/* ──────────  Period Grid  ────────── */}
      <div className="grid grid-cols-2 gap-2 ">
        <PeriodItem
          label="Today"
          value={total}
          suffix={suffix}
          color={valueColor(today, colorMode)}
        />
        <PeriodItem
          label="Total"
          value={thisMonth}
          suffix={suffix}
          color={valueColor(thisMonth, colorMode)}
        />
      </div>
    </div>
  );
}
