/* ──────────  AgentOverviewSection.tsx  ──────────
   Agent সংক্রান্ত সব stat — সংখ্যা, ব্যালেন্স, কমিশন।
──────────────────────────────────────────────────── */

"use client";

import { Briefcase, Gem, TrendingUp, UserPlus } from "lucide-react";
import OverviewSection from "./OverviewSection";
import OverviewStatCard from "./OverviewStatCard";

/* ──────────  Types  ────────── */
interface AgentOverviewSectionProps {
  total: number;
  todayNew: number;
  loggedIn: number;
  totalAgentCurrentBalance: number;
  totalAgentCommission: number;
  todayAgentCommission: number;
  totalAgentDeposits: number;
  todayAgentDeposits: number;
}

/* ──────────  Main Component  ────────── */
export default function AgentOverviewSection({
  total,
  todayNew,
  loggedIn,
  totalAgentCurrentBalance,
  totalAgentCommission,
  todayAgentCommission,
  totalAgentDeposits,
  todayAgentDeposits,
}: AgentOverviewSectionProps) {
  return (
    <OverviewSection
      title="Agent Stats"
      description="এজেন্ট সংখ্যা, ব্যালেন্স ও কমিশন"
      icon={<Briefcase className="h-4 w-4" />}
      iconBg="bg-orange-400/10"
      iconColor="text-orange-400"
      accentColor="border-orange-500/10"
    >
      {/* ──────────  Total Agents  ────────── */}
      <OverviewStatCard
        label="Total Agents"
        totalValue={total}
        todayValue={todayNew}
        icon={<Briefcase className="h-3.5 w-3.5" />}
        iconBg="bg-orange-400/10"
        iconColor="text-orange-400"
        totalLabel="All Time"
        todayLabel="Today New"
      />

      {/* ──────────  Agent Current Balance  ────────── */}
      <OverviewStatCard
        label="Current Balance"
        totalValue={totalAgentCurrentBalance}
        icon={<Gem className="h-3.5 w-3.5" />}
        iconBg="bg-violet-400/10"
        iconColor="text-violet-400"
        totalLabel="Current Total"
        isDiamond
      />

      {/* ──────────  Agent Commission  ────────── */}
      <OverviewStatCard
        label="Total Commission"
        totalValue={totalAgentCommission}
        todayValue={todayAgentCommission}
        icon={<TrendingUp className="h-3.5 w-3.5" />}
        iconBg="bg-amber-400/10"
        iconColor="text-amber-400"
        totalLabel="Total Earned"
        todayLabel="Today"
        isDiamond
      />

      {/* ──────────  Agent Deposits  ────────── */}
      <OverviewStatCard
        label="Agent Total Deposits"
        totalValue={totalAgentDeposits}
        todayValue={todayAgentDeposits}
        icon={<UserPlus className="h-3.5 w-3.5" />}
        iconBg="bg-sky-400/10"
        iconColor="text-sky-400"
        totalLabel="Total"
        todayLabel="Today"
        isDiamond
      />
    </OverviewSection>
  );
}
