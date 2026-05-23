/* ──────────  FinanceSection.tsx  ──────────
   Full report of deposits and withdrawals.
   Shows total, today, count, and pending values.
────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";

/* ──────────  Types  ────────── */
interface FinanceProps {
  totalDeposits: number;
  todayDeposits: number;
  depositCountTotal: number;
  depositCountToday: number;
  pendingDepositAmount: number;
  pendingDepositCount: number;

  totalWithdrawals: number;
  todayWithdrawals: number;
  withdrawCountTotal: number;
  withdrawCountToday: number;
  pendingWithdrawAmount: number;
  pendingWithdrawCount: number;
  totalWithdrawCharge: number;

  loading?: boolean;
}

/* ──────────  Diamond Formatter  ────────── */
const fmt = (n: number) =>
  n.toLocaleString("en-BD", { maximumFractionDigits: 0 });

/* ──────────  Single Stat Row  ────────── */
function StatRow({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub?: string;
  highlight?: "green" | "red" | "amber";
}) {
  const colors = {
    green: "text-emerald-400",
    red: "text-rose-400",
    amber: "text-amber-400",
  };

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.04] last:border-0">
      <span className="text-xs text-[rgb(var(--app-text-muted))]">{label}</span>
      <div className="text-right">
        <span
          className={cn(
            "text-sm font-semibold",
            highlight ? colors[highlight] : "text-[rgb(var(--app-text))]",
          )}
        >
          {value}
        </span>
        {sub && <p className="text-[10px] text-[rgb(var(--app-text))]/25 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ──────────  Half Panel  ────────── */
function Panel({
  title,
  icon,
  iconBg,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5">
      {/* ──────────  Panel Header  ────────── */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-xl",
            iconBg,
          )}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

/* ──────────  Skeleton  ────────── */
function FinanceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5 animate-pulse h-52"
        />
      ))}
    </div>
  );
}

/* ──────────  Main Component  ────────── */
export default function FinanceSection({
  totalDeposits,
  todayDeposits,
  depositCountTotal,
  depositCountToday,
  pendingDepositAmount,
  pendingDepositCount,
  totalWithdrawals,
  todayWithdrawals,
  withdrawCountTotal,
  withdrawCountToday,
  pendingWithdrawAmount,
  pendingWithdrawCount,
  totalWithdrawCharge,
  loading = false,
}: FinanceProps) {
  if (loading) return <FinanceSkeleton />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* ──────────  Deposit Panel  ────────── */}
      <Panel
        title="Deposit Report"
        icon={<ArrowDownToLine className="h-4 w-4 text-emerald-400" />}
        iconBg="bg-emerald-400/10"
      >
        <StatRow
          label="Total Deposits"
          value={`${fmt(totalDeposits)} 💎`}
          sub={`${fmt(depositCountTotal)} transactions`}
          highlight="green"
        />
        <StatRow
          label="Today's Deposits"
          value={`${fmt(todayDeposits)} 💎`}
          sub={`Today ${fmt(depositCountToday)}`}
        />
        <StatRow
          label="Pending Deposits"
          value={`${fmt(pendingDepositAmount)} 💎`}
          sub={`${pendingDepositCount} pending`}
          highlight={pendingDepositCount > 0 ? "amber" : undefined}
        />
      </Panel>

      {/* ──────────  Withdraw Panel  ────────── */}
      <Panel
        title="Withdrawal Report"
        icon={<ArrowUpFromLine className="h-4 w-4 text-rose-400" />}
        iconBg="bg-rose-400/10"
      >
        <StatRow
          label="Total Withdrawals"
          value={`${fmt(totalWithdrawals)} 💎`}
          sub={`${fmt(withdrawCountTotal)} transactions`}
          highlight="red"
        />
        <StatRow
          label="Today's Withdrawals"
          value={`${fmt(todayWithdrawals)} 💎`}
          sub={`Today ${fmt(withdrawCountToday)}`}
        />
        <StatRow
          label="Pending Withdrawals"
          value={`${fmt(pendingWithdrawAmount)} 💎`}
          sub={`${pendingWithdrawCount} pending`}
          highlight={pendingWithdrawCount > 0 ? "amber" : undefined}
        />
        <StatRow
          label="Total Withdrawal Charges"
          value={`${fmt(totalWithdrawCharge)} 💎`}
          highlight="green"
        />
      </Panel>
    </div>
  );
}
