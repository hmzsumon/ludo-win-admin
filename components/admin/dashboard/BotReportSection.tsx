/* ──────────  BotReportSection.tsx  ──────────
   Full report of the company's bot users.
   How many games they played, won, and lost
   and the total diamond gain/loss.
────────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import { Bot, TrendingDown, TrendingUp } from "lucide-react";

/* ──────────  Types  ────────── */
interface BotReportSectionProps {
  totalGamesPlayed: number;
  todayGamesPlayed: number;
  totalGamesWon: number;
  todayGamesWon: number;
  totalGamesLost: number;
  todayGamesLost: number;
  totalWonAmount: number;
  todayWonAmount: number;
  totalLostAmount: number;
  todayLostAmount: number;
  totalBotNetPnL: number;
  todayBotNetPnL: number;
  loading?: boolean;
}

/* ──────────  Diamond Formatter  ────────── */
const fmt = (n: number) =>
  n.toLocaleString("en-BD", { maximumFractionDigits: 0 });

/* ──────────  Win Rate Bar  ────────── */
function WinRateBar({ won, lost }: { won: number; lost: number }) {
  const total = won + lost;
  if (total === 0) return null;
  const winPct = Math.round((won / total) * 100);

  return (
    <div className="mt-1">
      <div className="flex justify-between text-[10px] text-[rgb(var(--app-text-muted))] mb-1">
        <span className="text-emerald-400">Wins {winPct}%</span>
        <span className="text-rose-400">Losses {100 - winPct}%</span>
      </div>
      <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-rose-400/20">
        <div
          className="h-full rounded-full bg-emerald-400 transition-all duration-700"
          style={{ width: `${winPct}%` }}
        />
      </div>
    </div>
  );
}

/* ──────────  PnL Badge  ────────── */
function PnLBadge({ value }: { value: number }) {
  const isPos = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        isPos
          ? "bg-emerald-400/10 text-emerald-400"
          : "bg-rose-400/10 text-rose-400",
      )}
    >
      {isPos ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {isPos ? "+" : ""}
      {fmt(value)} 💎
    </span>
  );
}

/* ──────────  Skeleton  ────────── */
function BotSkeleton() {
  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5 animate-pulse h-72" />
  );
}

/* ──────────  Main Component  ────────── */
export default function BotReportSection({
  totalGamesPlayed,
  todayGamesPlayed,
  totalGamesWon,
  todayGamesWon,
  totalGamesLost,
  todayGamesLost,
  totalWonAmount,
  todayWonAmount,
  totalLostAmount,
  todayLostAmount,
  totalBotNetPnL,
  todayBotNetPnL,
  loading = false,
}: BotReportSectionProps) {
  if (loading) return <BotSkeleton />;

  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 py-5  px-2">
      {/* ──────────  Section Header  ────────── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10">
            <Bot className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
              Bot Report
            </h3>
            <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
              Company bot performance
            </p>
          </div>
        </div>
        {/* ──────────  Today Net PnL Badge  ────────── */}
        <PnLBadge value={todayBotNetPnL} />
      </div>

      {/* ──────────  Today vs Total Tabs  ────────── */}
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* Today Column */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3">
          <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-2 font-medium uppercase tracking-wide">
            Today
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[rgb(var(--app-text-muted))]">Played</span>
              <span className="text-[rgb(var(--app-text))] font-semibold">
                {fmt(todayGamesPlayed)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-emerald-400/70">Won</span>
              <span className="text-emerald-400 font-semibold">
                {fmt(todayGamesWon)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-rose-400/70">Lost</span>
              <span className="text-rose-400 font-semibold">
                {fmt(todayGamesLost)}
              </span>
            </div>
            <WinRateBar won={todayGamesWon} lost={todayGamesLost} />
          </div>
        </div>

        {/* Total Column */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3">
          <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-2 font-medium uppercase tracking-wide">
            Total
          </p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-[rgb(var(--app-text-muted))]">Played</span>
              <span className="text-[rgb(var(--app-text))] font-semibold">
                {fmt(totalGamesPlayed)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-emerald-400/70">Won</span>
              <span className="text-emerald-400 font-semibold">
                {fmt(totalGamesWon)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-rose-400/70">Lost</span>
              <span className="text-rose-400 font-semibold">
                {fmt(totalGamesLost)}
              </span>
            </div>
            <WinRateBar won={totalGamesWon} lost={totalGamesLost} />
          </div>
        </div>
      </div>

      {/* ──────────  Amount Section  ────────── */}
      <div className="space-y-3">
        {/* ──────────  Total Section  ────────── */}
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-1">
                Total Bot Income
              </p>
              <p className="text-sm font-bold text-emerald-400">
                {fmt(totalWonAmount)} 💎
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-1">
                Today Bot Income
              </p>
              <p className="text-sm font-bold text-emerald-400">
                {fmt(todayWonAmount)} 💎
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-1">
                Total Bot Expense
              </p>
              <p className="text-sm font-bold text-rose-400">
                {fmt(totalLostAmount)} 💎
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-1">
                Today Bot Expense
              </p>
              <p className="text-sm font-bold text-rose-400">
                {fmt(todayLostAmount)} 💎
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-1">
                Total Net P&L
              </p>
              <p
                className={cn(
                  "text-sm font-bold",
                  totalBotNetPnL >= 0 ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {totalBotNetPnL >= 0 ? "+" : ""}
                {fmt(totalBotNetPnL)} 💎
              </p>
            </div>

            <div className="rounded-xl bg-white/[0.02] border border-white/5 p-3 text-center">
              <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-1">
                Today Net P&L
              </p>
              <p
                className={cn(
                  "text-sm font-bold",
                  todayBotNetPnL >= 0 ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {todayBotNetPnL >= 0 ? "+" : ""}
                {fmt(todayBotNetPnL)} 💎
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
