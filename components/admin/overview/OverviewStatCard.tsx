/* ──────────  OverviewStatCard.tsx  ──────────
   Total Overview পেইজের সব ছোট stat card এটাই।
   Total ও Today দুটো value পাশাপাশি দেখায়।
   Positive/Negative value রঙ দিয়ে বোঝানো হয়।
──────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";

/* ──────────  Types  ────────── */
interface OverviewStatCardProps {
  label: string;
  totalValue: string | number;
  todayValue?: string | number;
  totalLabel?: string;
  todayLabel?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  /* value টা diamond হলে suffix দেখাবে */
  isDiamond?: boolean;
  /* positive/negative color logic */
  colorMode?: "neutral" | "positive" | "negative" | "auto";
}

/* ──────────  Diamond Formatter  ────────── */
export const fmt = (n: number | string) => {
  if (typeof n === "string") return n;
  return n.toLocaleString("en-BD", { maximumFractionDigits: 0 });
};

/* ──────────  Color Helper  ────────── */
function getValueColor(
  value: number | string,
  mode: OverviewStatCardProps["colorMode"],
) {
  if (mode === "neutral") return "text-[rgb(var(--app-text))]";
  if (mode === "positive") return "text-emerald-400";
  if (mode === "negative") return "text-rose-400";
  if (mode === "auto" && typeof value === "number") {
    if (value > 0) return "text-emerald-400";
    if (value < 0) return "text-rose-400";
    return "text-[rgb(var(--app-text-muted))]";
  }
  return "text-[rgb(var(--app-text))]";
}

/* ──────────  Main Component  ────────── */
export default function OverviewStatCard({
  label,
  totalValue,
  todayValue,
  totalLabel = "Total",
  todayLabel = "Today",
  icon,
  iconBg = "bg-[rgb(var(--app-surface-2))]/70",
  iconColor = "text-[rgb(var(--app-text-muted))]",
  isDiamond = false,
  colorMode = "neutral",
}: OverviewStatCardProps) {
  const suffix = isDiamond ? " 💎" : "";
  const totalColor = getValueColor(totalValue, colorMode);

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3.5 flex items-start justify-between">
      {/* ──────────  Card Label Row  ────────── */}
      <div className="flex items-center gap-2">
        {icon && (
          <div
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
              iconBg,
            )}
          >
            <span className={cn("text-sm", iconColor)}>{icon}</span>
          </div>
        )}
        <p className="text-[11px] font-medium text-[rgb(var(--app-text-muted))] truncate">
          {label}
        </p>
      </div>

      {/* ──────────  Values Row  ────────── */}
      <div className="flex items-end justify-between gap-2">
        {/* Total Value */}
        <div>
          <p className={cn("text-base font-bold leading-none", totalColor)}>
            {fmt(totalValue)}
            {suffix}
          </p>
        </div>
      </div>
    </div>
  );
}
