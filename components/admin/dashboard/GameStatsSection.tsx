/* ──────────  GameStatsSection.tsx  ──────────
   Full report of Ludo games.
   Total matches, today's matches, and the company's 5% commission.
────────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import { Percent, Swords, TrendingUp, Trophy } from "lucide-react";

/* ──────────  Types  ────────── */
interface GameStatsSectionProps {
  totalMatches: number;
  todayMatches: number;
  totalFeeCollected: number;
  todayFeeCollected: number;
  loading?: boolean;
}

/* ──────────  Diamond Formatter  ────────── */
const fmt = (n: number) =>
  n.toLocaleString("en-BD", { maximumFractionDigits: 0 });

/* ──────────  Stat Tile  ────────── */
function StatTile({
  icon,
  label,
  value,
  sub,
  iconBg,
  valueColor = "text-[rgb(var(--app-text))]",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconBg: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
          iconBg,
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-[rgb(var(--app-text-muted))] truncate">{label}</p>
        <p className={cn("text-lg font-bold mt-0.5", valueColor)}>{value}</p>
        {sub && <p className="text-[10px] text-[rgb(var(--app-text))]/25 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ──────────  Skeleton  ────────── */
function GameStatsSkeleton() {
  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5 animate-pulse h-56" />
  );
}

/* ──────────  Main Component  ────────── */
export default function GameStatsSection({
  totalMatches,
  todayMatches,
  totalFeeCollected,
  todayFeeCollected,
  loading = false,
}: GameStatsSectionProps) {
  if (loading) return <GameStatsSkeleton />;

  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 py-5 px-2">
      {/* ──────────  Section Header  ────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10">
          <Swords className="h-4 w-4 text-sky-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">Game Report</h3>
          <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
            Ludo matches and commission
          </p>
        </div>
      </div>

      {/* ──────────  Stats Grid  ────────── */}
      <div className="grid grid-cols-1 gap-3">
        <StatTile
          icon={<Trophy className="h-5 w-5 text-sky-400" />}
          iconBg="bg-sky-400/10"
          label="Total Matches"
          value={fmt(totalMatches)}
          sub="All Time"
        />
        <StatTile
          icon={<Swords className="h-5 w-5 text-violet-400" />}
          iconBg="bg-violet-400/10"
          label="Today's Matches"
          value={fmt(todayMatches)}
          sub="Played today"
        />
        <StatTile
          icon={<Percent className="h-5 w-5 text-emerald-400" />}
          iconBg="bg-emerald-400/10"
          label="Total Commission (5%)"
          value={`${fmt(totalFeeCollected)} 💎`}
          sub="Company income"
          valueColor="text-emerald-400"
        />
        <StatTile
          icon={<TrendingUp className="h-5 w-5 text-amber-400" />}
          iconBg="bg-amber-400/10"
          label="Today's Commission"
          value={`${fmt(todayFeeCollected)} 💎`}
          sub="Today's income"
          valueColor="text-amber-400"
        />
      </div>
    </div>
  );
}
