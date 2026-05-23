/* ──────────  BonusReportSection.tsx  ──────────
   Report of all company bonus expenses.
   Separate reporting for each bonus type.
────────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import {
  Banknote,
  BanknoteArrowUp,
  Gift,
  RefreshCw,
  Settings,
  Star,
  Users,
} from "lucide-react";

/* ──────────  Types  ────────── */
interface BonusReportSectionProps {
  totalDepositBonus: number;
  todayDepositBonus: number;
  totalReferralBonus: number;
  todayReferralBonus: number;
  totalDailyBonus: number;
  todayDailyBonus: number;
  totalSpinBonus: number;
  todaySpinBonus: number;
  totalManualBonus: number;
  todayManualBonus: number;
  totalBonusExpense: number;
  todayBonusExpense: number;
  loading?: boolean;
  totalCashback: number;
  todayCashback: number;
}

/* ──────────  Diamond Formatter  ────────── */
const fmt = (n: number) =>
  n.toLocaleString("en-BD", { maximumFractionDigits: 0 });

/* ──────────  Bonus Row Item  ────────── */
function BonusRow({
  icon,
  iconBg,
  label,
  total,
  today,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  total: number;
  today: number;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            iconBg,
          )}
        >
          {icon}
        </div>
        <span className="text-sm text-[rgb(var(--app-text-muted))]">{label}</span>
      </div>
      <div className="flex items-center gap-6 text-right">
        <div>
          <p className="text-[10px] text-[rgb(var(--app-text))]/25">Today</p>
          <p className="text-xs font-semibold text-amber-400">
            {fmt(today)} 💎
          </p>
        </div>
        <div className="w-24">
          <p className="text-[10px] text-[rgb(var(--app-text))]/25">Total</p>
          <p className="text-sm font-semibold text-rose-400">{fmt(total)} 💎</p>
        </div>
      </div>
    </div>
  );
}

/* ──────────  Skeleton  ────────── */
function BonusSkeleton() {
  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5 animate-pulse h-80" />
  );
}

/* ──────────  Main Component  ────────── */
export default function BonusReportSection({
  totalDepositBonus,
  todayDepositBonus,
  totalReferralBonus,
  todayReferralBonus,
  totalDailyBonus,
  todayDailyBonus,
  totalSpinBonus,
  todaySpinBonus,
  totalManualBonus,
  todayManualBonus,
  totalBonusExpense,
  todayBonusExpense,

  totalCashback,
  todayCashback,
  loading = false,
}: BonusReportSectionProps) {
  if (loading) return <BonusSkeleton />;

  const bonusTypes = [
    {
      icon: <Banknote className="h-4 w-4 text-emerald-400" />,
      iconBg: "bg-emerald-400/10",
      label: "Deposit Bonus",
      total: totalDepositBonus,
      today: todayDepositBonus,
    },
    {
      icon: <Users className="h-4 w-4 text-sky-400" />,
      iconBg: "bg-sky-400/10",
      label: "Referral Bonus",
      total: totalReferralBonus,
      today: todayReferralBonus,
    },
    {
      icon: <Star className="h-4 w-4 text-amber-400" />,
      iconBg: "bg-amber-400/10",
      label: "Daily Bonus",
      total: totalDailyBonus,
      today: todayDailyBonus,
    },
    {
      icon: <BanknoteArrowUp className="h-4 w-4 text-amber-400" />,
      iconBg: "bg-amber-400/10",
      label: "Cashback",
      total: totalCashback,
      today: todayCashback,
    },

    {
      icon: <RefreshCw className="h-4 w-4 text-violet-400" />,
      iconBg: "bg-violet-400/10",
      label: "Spin Bonus",
      total: totalSpinBonus,
      today: todaySpinBonus,
    },
    {
      icon: <Settings className="h-4 w-4 text-rose-400" />,
      iconBg: "bg-rose-400/10",
      label: "Manual Bonus",
      total: totalManualBonus,
      today: todayManualBonus,
    },
  ];

  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5">
      {/* ──────────  Section Header  ────────── */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-400/10">
            <Gift className="h-4 w-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
              Bonus Expense Report
            </h3>
            <p className="text-[10px] text-[rgb(var(--app-text-muted))]">Company bonus spending</p>
          </div>
        </div>
        {/* ──────────  Total Bonus Summary Badge  ────────── */}
        <div className="text-right">
          <p className="text-[10px] text-[rgb(var(--app-text))]/25">Total Bonus Expense</p>
          <p className="text-sm font-bold text-rose-400">
            {fmt(totalBonusExpense)} 💎
          </p>
        </div>
      </div>

      {/* ──────────  Today Total Bar  ────────── */}
      <div className="mb-4 rounded-xl bg-rose-400/5 border border-rose-400/10 px-4 py-2.5 flex items-center justify-between">
        <span className="text-xs text-[rgb(var(--app-text-muted))]">
          Today's Total Bonus Expense
        </span>
        <span className="text-sm font-bold text-rose-400">
          {fmt(todayBonusExpense)} 💎
        </span>
      </div>

      {/* ──────────  Bonus Type Rows  ────────── */}
      <div>
        {bonusTypes.map((b) => (
          <BonusRow key={b.label} {...b} />
        ))}
      </div>
    </div>
  );
}
