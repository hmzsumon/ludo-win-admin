/* ──────────  IncomeBalanceOverviewSection.tsx  ──────────
   Company-র সামগ্রিক আয়-ব্যয় ও Diamond Balance।
   Net Profit positive হলে সবুজ, negative হলে লাল।
────────────────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import { Gem, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { fmt } from "./OverviewStatCard";

/* ──────────  Types  ────────── */
interface IncomeBalanceOverviewSectionProps {
  /* Income */
  totalIncome: number;
  todayIncome: number;
  totalExpense: number;
  todayExpense: number;
  totalNetProfit: number;
  todayNetProfit: number;
  /* Balance */
  initialBalance: number;
  currentBalance: number;
  totalAdded: number;
  lastTopUpAt?: string;
}

/* ──────────  Big Metric Card  ────────── */
function BigMetricCard({
  label,
  totalValue,
  todayValue,
  icon,
  iconBg,
  iconColor,
  totalColor,
  todayColor,
  isDiamond = true,
}: {
  label: string;
  totalValue: number;
  todayValue: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  totalColor: string;
  todayColor?: string;
  isDiamond?: boolean;
}) {
  const suffix = isDiamond ? " 💎" : "";
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2 mb-3">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          <span className={iconColor}>{icon}</span>
        </div>
        <p className="text-xs font-medium text-[rgb(var(--app-text-muted))]">{label}</p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className={cn("text-xl font-bold leading-none", totalColor)}>
            {fmt(totalValue)}
            {suffix}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────  Balance Progress Bar  ────────── */
function BalanceBar({
  current,
  initial,
}: {
  current: number;
  initial: number;
}) {
  const pct = Math.min(100, Math.max(0, (current / (initial || 1)) * 100));
  const color =
    pct > 60 ? "bg-emerald-400" : pct > 30 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="mt-3">
      <div className="flex justify-between text-[10px] text-[rgb(var(--app-text-muted))] mb-1">
        <span>Balance Remaining</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[rgb(var(--app-surface-2))]/70">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            color,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ──────────  Main Component  ────────── */
export default function IncomeBalanceOverviewSection({
  totalIncome,
  todayIncome,
  totalExpense,
  todayExpense,
  totalNetProfit,
  todayNetProfit,
  initialBalance,
  currentBalance,
  totalAdded,
  lastTopUpAt,
}: IncomeBalanceOverviewSectionProps) {
  const profitPos = totalNetProfit >= 0;
  const todayProfitPos = todayNetProfit >= 0;

  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-violet-500/10 py-4 px-2 shadow-[0_0_30px_rgba(139,92,246,0.05)]">
      {/* ──────────  Section Header  ────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-400/10">
          <Wallet className="h-4 w-4 text-violet-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
            Income & Balance
          </h3>
        </div>
      </div>

      {/* ──────────  Diamond Pool Balance  ────────── */}
      <div className="rounded-xl bg-violet-500/5 border border-violet-500/15 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Gem className="h-3.5 w-3.5 text-violet-400" />
          <p className="text-xs font-medium text-violet-300/60">
            Company Diamond Pool
          </p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] text-[rgb(var(--app-text))]/25 mb-1">Current Balance</p>
            <p className="text-2xl font-bold text-[rgb(var(--app-text))]">
              {fmt(currentBalance)}{" "}
              <span className="text-violet-400 text-xl">💎</span>
            </p>
          </div>
        </div>
      </div>

      {/* ──────────  Income / Expense / Profit Grid  ────────── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-4">
        {/* Income */}
        <BigMetricCard
          label="Total Income"
          totalValue={totalIncome}
          todayValue={todayIncome}
          icon={<TrendingUp className="h-4 w-4" />}
          iconBg="bg-emerald-400/10"
          iconColor="text-emerald-400"
          totalColor="text-emerald-400"
        />

        {/* Expense */}
        <BigMetricCard
          label="Total Expense"
          totalValue={totalExpense}
          todayValue={todayExpense}
          icon={<TrendingDown className="h-4 w-4" />}
          iconBg="bg-rose-400/10"
          iconColor="text-rose-400"
          totalColor="text-rose-400"
        />

        {/* Net Profit */}
        <div className="rounded-xl bg-white/[0.02] border border-white/5 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl",
                profitPos ? "bg-emerald-400/10" : "bg-rose-400/10",
              )}
            >
              {profitPos ? (
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              ) : (
                <TrendingDown className="h-4 w-4 text-rose-400" />
              )}
            </div>
            <p className="text-xs font-medium text-[rgb(var(--app-text-muted))]">Net Profit</p>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p
                className={cn(
                  "text-xl font-bold leading-none",
                  profitPos ? "text-emerald-400" : "text-rose-400",
                )}
              >
                {profitPos ? "+" : ""}
                {fmt(totalNetProfit)} 💎
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
