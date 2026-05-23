/* ──────────  IncomeSummarySection.tsx  ──────────
   Summary of the company's overall income and expenses.
   Income = Game Commission + Bot Win Amount
   Expense = All Bonuses + Bot Loss Amount
─────────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";

/* ──────────  Types  ────────── */
interface IncomeSummarySectionProps {
  totalIncome: number;
  todayIncome: number;
  totalExpense: number;
  todayExpense: number;
  totalNetProfit: number;
  todayNetProfit: number;
  loading?: boolean;
}

/* ──────────  Diamond Formatter  ────────── */
const fmt = (n: number) =>
  n.toLocaleString("en-BD", { maximumFractionDigits: 0 });

/* ──────────  Net Profit Card  ────────── */
function NetProfitHero({ total, today }: { total: number; today: number }) {
  const isProfit = total >= 0;
  const isTodayProfit = today >= 0;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 flex items-center justify-between",
        isProfit
          ? "bg-emerald-400/5 border-emerald-400/20"
          : "bg-rose-400/5 border-rose-400/20",
      )}
    >
      <div>
        <p className="text-xs text-[rgb(var(--app-text-muted))] mb-1">Total Net Profit / Loss</p>
        <p
          className={cn(
            "text-2xl font-bold",
            isProfit ? "text-emerald-400" : "text-rose-400",
          )}
        >
          {isProfit ? "+" : ""}
          {fmt(total)} 💎
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-[rgb(var(--app-text-muted))] mb-1">Today</p>
        <p
          className={cn(
            "text-base font-semibold",
            isTodayProfit ? "text-emerald-400" : "text-rose-400",
          )}
        >
          {isTodayProfit ? "+" : ""}
          {fmt(today)} 💎
        </p>
        <div className="mt-1 flex items-center justify-end gap-1">
          {isTodayProfit ? (
            <TrendingUp className="h-3 w-3 text-emerald-400" />
          ) : (
            <TrendingDown className="h-3 w-3 text-rose-400" />
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────  Half Column  ────────── */
function Column({
  title,
  total,
  today,
  color,
  icon,
}: {
  title: string;
  total: number;
  today: number;
  color: "green" | "red";
  icon: React.ReactNode;
}) {
  const colors = {
    green: {
      text: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/10",
    },
    red: {
      text: "text-rose-400",
      bg: "bg-rose-400/10",
      border: "border-rose-400/10",
    },
  };
  const c = colors[color];

  return (
    <div className={cn("rounded-xl border p-4", c.bg, c.border)}>
      <div className="flex items-center gap-2 mb-3">
        <span className={c.text}>{icon}</span>
        <span className={cn("text-xs font-semibold", c.text)}>{title}</span>
      </div>
      <p className={cn("text-xl font-bold", c.text)}>{fmt(total)} 💎</p>
      <p className="text-[10px] text-[rgb(var(--app-text-muted))] mt-0.5">Total</p>
      <div className="mt-2 pt-2 border-t border-white/5">
        <p className={cn("text-sm font-semibold", c.text)}>{fmt(today)} 💎</p>
        <p className="text-[10px] text-[rgb(var(--app-text-muted))]">Today</p>
      </div>
    </div>
  );
}

/* ──────────  Skeleton  ────────── */
function IncomeSkeleton() {
  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5 animate-pulse h-56" />
  );
}

/* ──────────  Main Component  ────────── */
export default function IncomeSummarySection({
  totalIncome,
  todayIncome,
  totalExpense,
  todayExpense,
  totalNetProfit,
  todayNetProfit,
  loading = false,
}: IncomeSummarySectionProps) {
  if (loading) return <IncomeSkeleton />;

  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 py-5 px-2">
      {/* ──────────  Section Header  ────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10">
          <BarChart3 className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
            Income & Expense Summary
          </h3>
          <p className="text-[10px] text-[rgb(var(--app-text-muted))]">Company overall P&L</p>
        </div>
      </div>

      {/* ──────────  Net Profit Hero  ────────── */}
      <NetProfitHero total={totalNetProfit} today={todayNetProfit} />

      {/* ──────────  Income vs Expense Columns  ────────── */}
      <div className="grid grid-cols-1 gap-3 mt-4">
        <Column
          title="Total Income"
          total={totalIncome}
          today={todayIncome}
          color="green"
          icon={<TrendingUp className="h-3.5 w-3.5" />}
        />
        <Column
          title="Total Expense"
          total={totalExpense}
          today={todayExpense}
          color="red"
          icon={<TrendingDown className="h-3.5 w-3.5" />}
        />
      </div>

      {/* ──────────  Income Breakdown Note  ────────── */}
      <div className="mt-4 rounded-xl bg-white/[0.02] border border-white/5 px-4 py-3 text-[10px] text-[rgb(var(--app-text))]/25 leading-5">
        <span className="text-emerald-400/60">Income</span> = game commission
        (5%) + bot win amount
        <br />
        <span className="text-rose-400/60">Expense</span> = all bonuses + bot
        loss amount
      </div>
    </div>
  );
}
