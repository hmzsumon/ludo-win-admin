/* ──────────  dashboard/page.tsx  ──────────
   Smart SystemStats অনুযায়ী Admin Dashboard।
   companyBalance বাদ দেওয়া হয়েছে। এখন dashboard-এ financials,
   income/cost breakdown, bonuses.total, welcome bonus এবং সব period stats দেখা যাবে।
─────────────────────────────────────────── */

"use client";

import CompanyBalanceCard from "@/components/admin/dashboard/CompanyBalanceCard";
import FinancialSummaryCard from "@/components/admin/system-stats/FinancialSummaryCard";
import PeriodStatCard from "@/components/admin/system-stats/PeriodStatCard";
import { useGetAdminDashboardQuery } from "@/redux/features/admin/adminApi";
import {
  Activity,
  Banknote,
  Bot,
  Coins,
  Download,
  Gift,
  HandCoins,
  Landmark,
  RefreshCw,
  Smartphone,
  Trophy,
  Users,
  Wallet,
  Wifi,
} from "lucide-react";
import Link from "next/link";

/* ──────────  Page Header  ────────── */
function DashboardHeader({
  onRefresh,
  isLoading,
}: {
  onRefresh: () => void;
  isLoading: boolean;
}) {
  const now = new Date().toLocaleDateString("en-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--app-text))]">
          Admin Dashboard
        </h1>
        <p className="mt-0.5 text-sm text-[rgb(var(--app-text-muted))]">
          {now}
        </p>
      </div>
      <button
        onClick={onRefresh}
        disabled={isLoading}
        className="flex items-center gap-2 rounded-xl border border-white/5 bg-[rgb(var(--app-surface-2))]/70 px-4 py-2 text-xs text-[rgb(var(--app-text-muted))] transition-all hover:bg-[rgb(var(--app-surface-3))]/80 disabled:opacity-40"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`}
        />
        Refresh
      </button>
    </div>
  );
}

/* ──────────  Section Label  ────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-[rgb(var(--app-surface-2))]/70" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[rgb(var(--app-text))]/20">
        {children}
      </span>
      <div className="h-px flex-1 bg-[rgb(var(--app-surface-2))]/70" />
    </div>
  );
}

/* ──────────  Empty State  ────────── */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-8 text-center">
      <p className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
        Dashboard data not found
      </p>
      <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
        SystemStats singleton তৈরি হলে এখানে সব রিপোর্ট দেখা যাবে।
      </p>
    </div>
  );
}

function AppMetricCard({
  title,
  value,
  note,
  icon,
  color,
}: {
  title: string;
  value: number;
  note: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-[rgb(var(--app-text-muted))]">{title}</p>
          <p className="mt-2 text-2xl font-bold">
            {Number(value || 0).toLocaleString("en-US")}
          </p>
          <p className="mt-1 text-[10px] text-[rgb(var(--app-text-muted))]">
            {note}
          </p>
        </div>
        <div className={`rounded-xl p-2.5 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

/* ──────────  Main Dashboard Page  ────────── */
export default function AdminDashboardPage() {
  const { data, isLoading, isFetching, refetch } = useGetAdminDashboardQuery();
  const d = data?.dashboardData;
  const loading = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto w-full">
        {/* ──────────  Page Header  ────────── */}
        <DashboardHeader onRefresh={refetch} isLoading={loading} />

        {!loading && !d ? (
          <EmptyState />
        ) : (
          <>
            {/* ──────────  ROW 1: Profit/Loss  ────────── */}
            <SectionLabel>Company Profit / Loss</SectionLabel>
            <div className="mb-8 grid grid-cols-1 gap-4">
              <FinancialSummaryCard
                financials={d?.financials}
                loading={loading}
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex-1">
                <SectionLabel>App Analytics</SectionLabel>
              </div>
              <Link
                href="/app-analytics"
                className="ml-4 shrink-0 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-400"
              >
                View details
              </Link>
            </div>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <AppMetricCard
                title="APK Downloads"
                value={d?.appAnalytics?.totalDownloads || 0}
                note="Download requests"
                icon={<Download className="h-5 w-5" />}
                color="bg-violet-500/10 text-violet-400"
              />
              <AppMetricCard
                title="Opened Installations"
                value={d?.appAnalytics?.openedInstallations || 0}
                note="Installed and opened"
                icon={<Smartphone className="h-5 w-5" />}
                color="bg-cyan-500/10 text-cyan-400"
              />
              <AppMetricCard
                title="Online App Devices"
                value={d?.appAnalytics?.onlineNow || 0}
                note="Seen within 2 minutes"
                icon={<Wifi className="h-5 w-5" />}
                color="bg-emerald-500/10 text-emerald-400"
              />
              <AppMetricCard
                title="Active Today"
                value={d?.appAnalytics?.activeToday || 0}
                note="Unique installations"
                icon={<Activity className="h-5 w-5" />}
                color="bg-amber-500/10 text-amber-400"
              />
            </div>

            {/* ──────────  ROW 2: Income Breakdown  ────────── */}
            <SectionLabel>Company Income Breakdown</SectionLabel>
            <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PeriodStatCard
                title="Game Fee Income"
                note="প্রতি game থেকে company 10% fee"
                stat={d?.incomeBreakdown?.gameFee}
                isDiamond
                colorMode="income"
                icon={<Trophy className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />
              <PeriodStatCard
                title="Bot Win Income"
                note="Bot game জিতলে company income"
                stat={d?.incomeBreakdown?.botWin}
                isDiamond
                colorMode="income"
                icon={<Bot className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />
              <PeriodStatCard
                title="Bot Loss Cost"
                stat={d?.costBreakdown?.botLoss}
                isDiamond
                colorMode="cost"
                icon={<Bot className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />

              <PeriodStatCard
                title="Bot Net PnL"
                stat={d?.bots?.netPnL}
                isDiamond
                colorMode="auto"
                icon={<Bot className="h-4 w-4" />}
                iconBg="bg-violet-400/10"
                iconColor="text-violet-400"
              />
            </div>

            {/* ──────────  ROW 3: Cost Breakdown  ────────── */}
            <SectionLabel>Company Cost Breakdown</SectionLabel>
            {/* ──────────  Total Bonus Cost Summary  ────────── */}
            <div className="mb-4 grid grid-cols-1 gap-4">
              <CompanyBalanceCard
                stat={d?.bonuses?.total || d?.costBreakdown?.bonuses?.total}
                loading={loading}
              />
            </div>
            <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <PeriodStatCard
                title="Agent Commission Cost"
                note="Deposit + withdraw approve commission"
                stat={d?.costBreakdown?.agentCommission}
                isDiamond
                colorMode="cost"
                icon={<HandCoins className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Deposit Commission"
                note="cash 4%, e-wallet 2%"
                stat={d?.costBreakdown?.agentDepositCommission}
                isDiamond
                colorMode="cost"
                icon={<Banknote className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Withdraw Commission"
                note="সব agent type 2%"
                stat={d?.costBreakdown?.agentWithdrawCommission}
                isDiamond
                colorMode="cost"
                icon={<Wallet className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />

              <PeriodStatCard
                title="Total Bonus Cost"
                note="সব bonus মিলিয়ে মোট cost"
                stat={d?.costBreakdown?.bonuses?.total || d?.bonuses?.total}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Welcome Bonus Cost"
                stat={d?.costBreakdown?.bonuses?.welcome || d?.bonuses?.welcome}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Deposit Bonus Cost"
                stat={d?.costBreakdown?.bonuses?.deposit}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Referral Bonus Cost"
                stat={d?.costBreakdown?.bonuses?.referral}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Daily Bonus Cost"
                stat={d?.costBreakdown?.bonuses?.daily}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Spin Bonus Cost"
                stat={d?.costBreakdown?.bonuses?.spin}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Manual Bonus Cost"
                stat={d?.costBreakdown?.bonuses?.manual}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="VIP Cashback Cost"
                stat={d?.costBreakdown?.bonuses?.vipCashback}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
            </div>

            {/* ──────────  ROW 4: Finance  ────────── */}
            <SectionLabel>Deposits & Withdrawals</SectionLabel>
            <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <PeriodStatCard
                title="User Deposit Amount"
                stat={d?.finance?.deposits?.amount}
                isDiamond
                icon={<Coins className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />
              <PeriodStatCard
                title="User Deposit Count"
                stat={d?.finance?.deposits?.count}
                icon={<Coins className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />
              <PeriodStatCard
                title="Agent Topup / Deposit"
                stat={d?.finance?.agentDeposits?.amount}
                isDiamond
                icon={<Landmark className="h-4 w-4" />}
                iconBg="bg-violet-400/10"
                iconColor="text-violet-400"
              />
              <PeriodStatCard
                title="Agent Current Balance"
                stat={{
                  total: d?.agents?.currentBalance ?? 0,
                  today: d?.agents?.currentBalance ?? 0,
                  thisMonth: d?.agents?.currentBalance ?? 0,
                  lastMonth: d?.agents?.currentBalance ?? 0,
                }}
                isDiamond
                icon={<Landmark className="h-4 w-4" />}
                iconBg="bg-violet-400/10"
                iconColor="text-violet-400"
              />
              <PeriodStatCard
                title="Withdraw Amount"
                stat={d?.finance?.withdrawals?.amount}
                isDiamond
                icon={<Wallet className="h-4 w-4" />}
                iconBg="bg-amber-400/10"
                iconColor="text-amber-400"
              />
              <PeriodStatCard
                title="Withdraw Count"
                stat={d?.finance?.withdrawals?.count}
                icon={<Wallet className="h-4 w-4" />}
                iconBg="bg-amber-400/10"
                iconColor="text-amber-400"
              />
            </div>

            {/* ──────────  ROW 5: Games, Bots, Users, Agents  ────────── */}
            <SectionLabel>Games, Bots, Users & Agents</SectionLabel>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <PeriodStatCard
                title="Match Count"
                stat={d?.games?.count}
                icon={<Trophy className="h-4 w-4" />}
                iconBg="bg-amber-400/10"
                iconColor="text-amber-400"
              />

              <PeriodStatCard
                title="Users"
                stat={d?.users?.count}
                icon={<Users className="h-4 w-4" />}
                iconBg="bg-sky-400/10"
                iconColor="text-sky-400"
              />

              <PeriodStatCard
                title="Agents"
                stat={d?.agents?.count}
                icon={<Users className="h-4 w-4" />}
                iconBg="bg-violet-400/10"
                iconColor="text-violet-400"
              />

              <PeriodStatCard
                title="Active Users"
                stat={d?.users?.active}
                icon={<Users className="h-4 w-4" />}
                iconBg="bg-sky-400/10"
                iconColor="text-sky-400"
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
