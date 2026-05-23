/* ──────────  MetricCard.tsx  ──────────
   Dashboard এর ছোট summary card।
   variant prop দিয়ে color accent পরিবর্তন করা যায়।
────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/* ──────────  Types  ────────── */
type Variant = "default" | "green" | "yellow" | "red" | "purple" | "blue";

interface MetricCardProps {
  title: string;
  value: string | number;
  subValue?: string; // secondary line, e.g. "আজকে: 500 💎"
  icon?: ReactNode;
  variant?: Variant;
  badge?: string; // small top-right badge
  loading?: boolean;
}

/* ──────────  Variant Colour Map  ────────── */
const variantStyles: Record<
  Variant,
  { dot: string; badge: string; glow: string }
> = {
  default: { dot: "bg-white/30", badge: "bg-[rgb(var(--app-surface-3))]/80 text-[rgb(var(--app-text-soft))]", glow: "" },
  green: {
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(52,211,153,0.07)]",
  },
  yellow: {
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-400",
    glow: "shadow-[0_0_20px_rgba(251,191,36,0.07)]",
  },
  red: {
    dot: "bg-rose-400",
    badge: "bg-rose-400/10 text-rose-400",
    glow: "shadow-[0_0_20px_rgba(251,113,133,0.07)]",
  },
  purple: {
    dot: "bg-violet-400",
    badge: "bg-violet-400/10 text-violet-400",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.07)]",
  },
  blue: {
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-400",
    glow: "shadow-[0_0_20px_rgba(56,189,248,0.07)]",
  },
};

/* ──────────  Skeleton Loader  ────────── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5 animate-pulse">
      <div className="h-3 w-24 rounded bg-[rgb(var(--app-surface-3))]/80 mb-3" />
      <div className="h-7 w-32 rounded bg-[rgb(var(--app-surface-3))]/80 mb-2" />
      <div className="h-3 w-20 rounded bg-[rgb(var(--app-surface-2))]/70" />
    </div>
  );
}

/* ──────────  Component  ────────── */
export default function MetricCard({
  title,
  value,
  subValue,
  icon,
  variant = "default",
  badge,
  loading = false,
}: MetricCardProps) {
  if (loading) return <SkeletonCard />;

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5 transition-all duration-200 hover:border-[rgb(var(--app-border))]",
        styles.glow,
      )}
    >
      {/* ──────────  Header Row  ────────── */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", styles.dot)} />
          <p className="text-sm text-[rgb(var(--app-text-muted))] font-medium">{title}</p>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span
              className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                styles.badge,
              )}
            >
              {badge}
            </span>
          )}
          {icon && <span className="text-[rgb(var(--app-text-muted))]">{icon}</span>}
        </div>
      </div>

      {/* ──────────  Main Value  ────────── */}
      <h3 className="text-2xl font-bold tracking-tight text-[rgb(var(--app-text))]">{value}</h3>

      {/* ──────────  Sub Value  ────────── */}
      {subValue && <p className="mt-1.5 text-xs text-[rgb(var(--app-text-muted))]">{subValue}</p>}
    </div>
  );
}
