/* ──────────  BonusOverviewSection.tsx  ──────────
   সব ধরনের বোনাস খরচ একসাথে।
   মোট বোনাস expense summary শেষে দেখাবে।
──────────────────────────────────────────────── */

"use client";

import {
  Crown,
  DollarSign,
  Gift,
  RefreshCw,
  Star,
  UserPlus,
  Zap,
} from "lucide-react";
import OverviewSection from "./OverviewSection";
import OverviewStatCard, { fmt } from "./OverviewStatCard";

/* ──────────  Types  ────────── */
interface BonusOverviewSectionProps {
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
  totalVipCashback: number;
  todayVipCashback: number;
  totalBonusExpense: number;
  todayBonusExpense: number;
}

/* ──────────  Total Expense Summary Card  ────────── */
function BonusTotalCard({
  totalBonusExpense,
  todayBonusExpense,
}: {
  totalBonusExpense: number;
  todayBonusExpense: number;
}) {
  return (
    <div className="col-span-2 sm:col-span-3 rounded-xl bg-rose-400/5 border border-rose-500/15 p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign className="h-3.5 w-3.5 text-rose-400" />
        <p className="text-[11px] font-semibold text-rose-300/70">
          Total Bonus Expense
        </p>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9px] text-[rgb(var(--app-text))]/25 mb-0.5">All Time</p>
          <p className="text-lg font-bold text-rose-400">
            {fmt(totalBonusExpense)} 💎
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-[rgb(var(--app-text))]/25 mb-0.5">Today</p>
          <p className="text-sm font-semibold text-rose-300">
            {fmt(todayBonusExpense)} 💎
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────  Main Component  ────────── */
export default function BonusOverviewSection({
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
  totalVipCashback,
  todayVipCashback,
  totalBonusExpense,
  todayBonusExpense,
}: BonusOverviewSectionProps) {
  return (
    <OverviewSection
      title="Bonus Stats"
      description="সব ধরনের বোনাস ও VIP ক্যাশব্যাক খরচ"
      icon={<Gift className="h-4 w-4" />}
      iconBg="bg-pink-400/10"
      iconColor="text-pink-400"
      accentColor="border-pink-500/10"
    >
      {/* ──────────  Deposit Bonus  ────────── */}
      <OverviewStatCard
        label="Deposit Bonus"
        totalValue={totalDepositBonus}
        todayValue={todayDepositBonus}
        icon={<Gift className="h-3.5 w-3.5" />}
        iconBg="bg-pink-400/10"
        iconColor="text-pink-400"
        totalLabel="Total"
        todayLabel="Today"
        isDiamond
      />

      {/* ──────────  Referral Bonus  ────────── */}
      <OverviewStatCard
        label="Referral Bonus"
        totalValue={totalReferralBonus}
        todayValue={todayReferralBonus}
        icon={<UserPlus className="h-3.5 w-3.5" />}
        iconBg="bg-violet-400/10"
        iconColor="text-violet-400"
        totalLabel="Total"
        todayLabel="Today"
        isDiamond
      />

      {/* ──────────  VIP Cashback  ────────── */}
      <OverviewStatCard
        label="VIP Cashback"
        totalValue={totalVipCashback}
        todayValue={todayVipCashback}
        icon={<Crown className="h-3.5 w-3.5" />}
        iconBg="bg-yellow-400/10"
        iconColor="text-yellow-400"
        totalLabel="Total"
        todayLabel="Today"
        isDiamond
      />

      {/* ──────────  Daily Login Bonus  ────────── */}
      <OverviewStatCard
        label="Daily Bonus"
        totalValue={totalDailyBonus}
        todayValue={todayDailyBonus}
        icon={<Star className="h-3.5 w-3.5" />}
        iconBg="bg-amber-400/10"
        iconColor="text-amber-400"
        totalLabel="Total"
        todayLabel="Today"
        isDiamond
      />

      {/* ──────────  Spin Bonus  ────────── */}
      <OverviewStatCard
        label="Spin Bonus"
        totalValue={totalSpinBonus}
        todayValue={todaySpinBonus}
        icon={<RefreshCw className="h-3.5 w-3.5" />}
        iconBg="bg-cyan-400/10"
        iconColor="text-cyan-400"
        totalLabel="Total"
        todayLabel="Today"
        isDiamond
      />

      {/* ──────────  Manual Bonus  ────────── */}
      <OverviewStatCard
        label="Manual Bonus"
        totalValue={totalManualBonus}
        todayValue={todayManualBonus}
        icon={<Zap className="h-3.5 w-3.5" />}
        iconBg="bg-orange-400/10"
        iconColor="text-orange-400"
        totalLabel="Total"
        todayLabel="Today"
        isDiamond
      />

      {/* ──────────  Total Expense Summary  ────────── */}
      {/* <BonusTotalCard
        totalBonusExpense={totalBonusExpense}
        todayBonusExpense={todayBonusExpense}
      /> */}
    </OverviewSection>
  );
}
