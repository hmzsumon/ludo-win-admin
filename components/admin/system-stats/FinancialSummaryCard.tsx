/* ──────────  FinancialSummaryCard.tsx  ──────────
   Company income / cost / net profit-loss summary.
   financials object থেকে total/today/thisMonth/lastMonth দেখায়।
──────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import type { IFinancialPeriodStats } from "@/redux/features/admin/adminApi";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";

/* ──────────  Types  ────────── */
interface FinancialSummaryCardProps {
  financials?: IFinancialPeriodStats | null;
  loading?: boolean;
}

/* ──────────  Helpers  ────────── */
const n = (value: any) => Number(value || 0);
const fmt = (value: number) =>
  n(value).toLocaleString("en-BD", { maximumFractionDigits: 2 });

const statusLabel = (value: number) => {
  if (value > 0) return "Profit";
  if (value < 0) return "Loss";
  return "Break Even";
};

/* ──────────  One Period Row  ────────── */
function FinancialPeriodRow({
  title,
  income,
  cost,
  netProfit,
}: {
  title: string;
  income: number;
  cost: number;
  netProfit: number;
}) {
  const isProfit = netProfit >= 0;

  return (
    <div className="rounded-xl bg-white/[0.025] border border-white/[0.04] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-[rgb(var(--app-text-muted))]">
          {title}
        </p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-semibold",
            isProfit
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-rose-400/10 text-rose-400",
          )}
        >
          {statusLabel(netProfit)}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <p className="text-[9px] text-[rgb(var(--app-text))]/25">Income</p>
          <p className="text-xs font-semibold text-emerald-400">
            {fmt(income)} 💎
          </p>
        </div>
        <div>
          <p className="text-[9px] text-[rgb(var(--app-text))]/25">Cost</p>
          <p className="text-xs font-semibold text-rose-400">
            {fmt(cost)} 💎
          </p>
        </div>
        <div>
          <p className="text-[9px] text-[rgb(var(--app-text))]/25">Net</p>
          <p
            className={cn(
              "text-xs font-bold",
              isProfit ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {isProfit ? "+" : ""}
            {fmt(netProfit)} 💎
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────  Skeleton  ────────── */
function Skeleton() {
  return (
    <div className="h-80 animate-pulse rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))]" />
  );
}

/* ──────────  Main Component  ────────── */
export default function FinancialSummaryCard({
  financials,
  loading = false,
}: FinancialSummaryCardProps) {
  if (loading) return <Skeleton />;

  const total = financials?.total;
  const today = financials?.today;
  const thisMonth = financials?.thisMonth;
  const lastMonth = financials?.lastMonth;
  const totalNet = n(total?.netProfit);
  const isProfit = totalNet >= 0;

  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5">
      {/* ──────────  Header  ────────── */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10">
            <BarChart3 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
              Company Profit / Loss
            </h2>
            <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
              Income - Cost auto calculated from SystemStats
            </p>
          </div>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
            isProfit
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-rose-400/10 text-rose-400",
          )}
        >
          {isProfit ? (
            <TrendingUp className="h-3.5 w-3.5" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" />
          )}
          {statusLabel(totalNet)}
        </div>
      </div>

      {/* ──────────  Hero Net Profit  ────────── */}
      <div
        className={cn(
          "mb-4 rounded-xl border px-4 py-4",
          isProfit
            ? "bg-emerald-400/5 border-emerald-400/20"
            : "bg-rose-400/5 border-rose-400/20",
        )}
      >
        <p className="text-[10px] uppercase tracking-wide text-[rgb(var(--app-text-muted))]">
          Total Net Profit / Loss
        </p>
        <p
          className={cn(
            "mt-1 text-3xl font-bold",
            isProfit ? "text-emerald-400" : "text-rose-400",
          )}
        >
          {isProfit ? "+" : ""}
          {fmt(totalNet)} 💎
        </p>
      </div>

      {/* ──────────  Period Rows  ────────── */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <FinancialPeriodRow
          title="Today"
          income={n(today?.income)}
          cost={n(today?.cost)}
          netProfit={n(today?.netProfit)}
        />
        <FinancialPeriodRow
          title="This Month"
          income={n(thisMonth?.income)}
          cost={n(thisMonth?.cost)}
          netProfit={n(thisMonth?.netProfit)}
        />
        <FinancialPeriodRow
          title="Last Month"
          income={n(lastMonth?.income)}
          cost={n(lastMonth?.cost)}
          netProfit={n(lastMonth?.netProfit)}
        />
        <FinancialPeriodRow
          title="All Time"
          income={n(total?.income)}
          cost={n(total?.cost)}
          netProfit={n(total?.netProfit)}
        />
      </div>
    </div>
  );
}
