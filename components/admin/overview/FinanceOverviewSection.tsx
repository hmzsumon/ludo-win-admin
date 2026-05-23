/* ──────────  FinanceOverviewSection.tsx  ──────────
   Deposit ও Withdraw সব stat একসাথে।
   Pending amount / count আলাদা করে highlight করা।
────────────────────────────────────────────────── */

"use client";

import {
  AlertCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Hash,
  Zap,
} from "lucide-react";
import OverviewSection from "./OverviewSection";
import OverviewStatCard from "./OverviewStatCard";

/* ──────────  Types  ────────── */
interface FinanceOverviewSectionProps {
  /* Deposit */
  depositTotal: number;
  depositToday: number;
  depositCountTotal: number;
  depositCountToday: number;
  depositPendingAmount: number;
  depositPendingCount: number;
  /* Withdraw */
  withdrawTotal: number;
  withdrawToday: number;
  withdrawCountTotal: number;
  withdrawCountToday: number;
  withdrawPendingAmount: number;
  withdrawPendingCount: number;
  withdrawTotalCharge: number;
}

/* ──────────  Main Component  ────────── */
export default function FinanceOverviewSection({
  depositTotal,
  depositToday,
  depositCountTotal,
  depositCountToday,
  depositPendingAmount,
  depositPendingCount,
  withdrawTotal,
  withdrawToday,
  withdrawCountTotal,
  withdrawCountToday,
  withdrawPendingAmount,
  withdrawPendingCount,
  withdrawTotalCharge,
}: FinanceOverviewSectionProps) {
  return (
    <div className="space-y-4">
      {/* ──────────  Deposit Section  ────────── */}
      <OverviewSection
        title="Deposit Stats"
        icon={<ArrowDownLeft className="h-4 w-4" />}
        iconBg="bg-emerald-400/10"
        iconColor="text-emerald-400"
        accentColor="border-emerald-500/10"
      >
        {/* ──────────  Total Amount  ────────── */}
        <OverviewStatCard
          label="Deposit Amount"
          totalValue={depositTotal}
          todayValue={depositToday}
          icon={<Banknote className="h-3.5 w-3.5" />}
          iconBg="bg-emerald-400/10"
          iconColor="text-emerald-400"
          totalLabel="All Time"
          todayLabel="Today"
          isDiamond
          colorMode="positive"
        />

        {/* ──────────  Count  ────────── */}
        <OverviewStatCard
          label="Deposit Count"
          totalValue={depositCountTotal}
          todayValue={depositCountToday}
          icon={<Hash className="h-3.5 w-3.5" />}
          iconBg="bg-sky-400/10"
          iconColor="text-sky-400"
          totalLabel="Total Txns"
          todayLabel="Today"
        />

        {/* ──────────  Pending  ────────── */}
        <OverviewStatCard
          label="Pending Deposits"
          totalValue={depositPendingAmount}
          todayValue={depositPendingCount}
          icon={<AlertCircle className="h-3.5 w-3.5" />}
          iconBg="bg-amber-400/10"
          iconColor="text-amber-400"
          totalLabel="Pending Amt"
          todayLabel="Count"
          isDiamond
        />
      </OverviewSection>

      {/* ──────────  Withdraw Section  ────────── */}
      <OverviewSection
        title="Withdraw Stats"
        description="ইউজার উইথড্রয়ের সম্পূর্ণ তথ্য"
        icon={<ArrowUpRight className="h-4 w-4" />}
        iconBg="bg-rose-400/10"
        iconColor="text-rose-400"
        accentColor="border-rose-500/10"
      >
        {/* ──────────  Total Amount  ────────── */}
        <OverviewStatCard
          label="Withdraw Amount"
          totalValue={withdrawTotal}
          todayValue={withdrawToday}
          icon={<Banknote className="h-3.5 w-3.5" />}
          iconBg="bg-rose-400/10"
          iconColor="text-rose-400"
          totalLabel="All Time"
          todayLabel="Today"
          isDiamond
          colorMode="negative"
        />

        {/* ──────────  Count  ────────── */}
        <OverviewStatCard
          label="Withdraw Count"
          totalValue={withdrawCountTotal}
          todayValue={withdrawCountToday}
          icon={<Hash className="h-3.5 w-3.5" />}
          iconBg="bg-sky-400/10"
          iconColor="text-sky-400"
          totalLabel="Total Txns"
          todayLabel="Today"
        />

        {/* ──────────  Pending  ────────── */}
        <OverviewStatCard
          label="Pending Withdraw"
          totalValue={withdrawPendingAmount}
          todayValue={withdrawPendingCount}
          icon={<AlertCircle className="h-3.5 w-3.5" />}
          iconBg="bg-amber-400/10"
          iconColor="text-amber-400"
          totalLabel="Pending Amt"
          todayLabel="Count"
          isDiamond
        />

        {/* ──────────  Total Charge  ────────── */}
        <OverviewStatCard
          label="Withdraw Charge"
          totalValue={withdrawTotalCharge}
          icon={<Zap className="h-3.5 w-3.5" />}
          iconBg="bg-violet-400/10"
          iconColor="text-violet-400"
          totalLabel="Total Collected"
          isDiamond
          colorMode="positive"
        />
      </OverviewSection>
    </div>
  );
}
