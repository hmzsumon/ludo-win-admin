/* ──────────  total-overview/page.tsx  ──────────
   SystemStats smart structure এর complete overview page।
   এখানে formatted data থেকে সব total / today / thisMonth / lastMonth দেখা যাবে।
──────────────────────────────────────────────── */

"use client";

import PeriodStatCard, {
  fmt,
} from "@/components/admin/system-stats/PeriodStatCard";
import { useGetTotalOverviewQuery } from "@/redux/features/admin/adminApi";
import {
  Banknote,
  Bot,
  Building2,
  Coins,
  Gift,
  HandCoins,
  Landmark,
  RefreshCw,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";

/* ──────────  Page Header  ────────── */
function OverviewHeader({
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
          Total Overview
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

/* ──────────  Section Divider  ────────── */
function SectionDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex items-center gap-3 first:mt-0">
      <div className="h-px flex-1 bg-[rgb(var(--app-surface-2))]/70" />
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[rgb(var(--app-text))]/20">
        {children}
      </span>
      <div className="h-px flex-1 bg-[rgb(var(--app-surface-2))]/70" />
    </div>
  );
}

/* ──────────  Company Info Card  ────────── */
function CompanyInfoCard({
  companyInfo,
  balance,
}: {
  companyInfo: any;
  balance: any;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10">
          <Building2 className="h-5 w-5 text-violet-400" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
            {companyInfo?.companyName || "Company"}
          </h2>
          <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
            {companyInfo?.shortName || "System overview"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoItem label="Currency" value={companyInfo?.currency || "DIAMOND"} />
        <InfoItem
          label="Country"
          value={companyInfo?.country || "Bangladesh"}
        />
        <InfoItem
          label="Current Balance"
          value={`${fmt(Number(balance?.currentBalance || 0))} 💎`}
        />
        <InfoItem
          label="Total Added"
          value={`${fmt(Number(balance?.totalAdded || 0))} 💎`}
        />
      </div>
    </div>
  );
}

/* ──────────  Small Info Item  ────────── */
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.025] p-3">
      <p className="text-[9px] uppercase tracking-wide text-[rgb(var(--app-text))]/25">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-[rgb(var(--app-text))]">
        {value}
      </p>
    </div>
  );
}

/* ──────────  Main Overview Page  ────────── */
export default function TotalOverviewPage() {
  const { data, isLoading, isFetching, refetch } = useGetTotalOverviewQuery();
  const ov = data?.overview;
  console.log("Total Overview Data:", ov);
  const f = ov?.formatted;
  const loading = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto w-full">
        {/* ──────────  Page Header  ────────── */}
        <OverviewHeader onRefresh={refetch} isLoading={loading} />

        {loading ? (
          <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-8 text-center">
            <RefreshCw className="mx-auto h-5 w-5 animate-spin text-[rgb(var(--app-text-muted))]" />
            <p className="mt-3 text-sm text-[rgb(var(--app-text-muted))]">
              Loading overview...
            </p>
          </div>
        ) : !ov || !f ? (
          <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-8 text-center">
            <p className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
              Overview data not found
            </p>
            <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
              SystemStats singleton তৈরি হলে overview দেখা যাবে।
            </p>
          </div>
        ) : (
          <>
            {/* ──────────  Income  ────────── */}
            <SectionDivider>Income Sources</SectionDivider>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <PeriodStatCard
                title="Game Fee Income"
                note="Company 10% game fee"
                stat={f.matches.feeCollected}
                isDiamond
                colorMode="income"
                icon={<Trophy className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />
              <PeriodStatCard
                title="Bot Win Income"
                stat={f.bots.wonAmount}
                isDiamond
                colorMode="income"
                icon={<Bot className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />

              <PeriodStatCard
                title="Bot Loss"
                stat={f.bots.lostAmount}
                isDiamond
                colorMode="cost"
                icon={<Bot className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Bot Games Played"
                stat={f.bots.gamesPlayed}
                icon={<Bot className="h-4 w-4" />}
                iconBg="bg-violet-400/10"
                iconColor="text-violet-400"
              />
              <PeriodStatCard
                title="Bot Games Won"
                stat={f.bots.gamesWon}
                icon={<Bot className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />
              <PeriodStatCard
                title="Bot Games Lost"
                stat={f.bots.gamesLost}
                icon={<Bot className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
            </div>

            {/* ──────────  Cost  ────────── */}
            <SectionDivider>Cost Sources</SectionDivider>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <PeriodStatCard
                title="Agent TopUp"
                stat={f.agents.topUp}
                isDiamond
                colorMode="cost"
                icon={<Landmark className="h-4 w-4" />}
                iconBg="bg-violet-400/10"
                iconColor="text-violet-400"
              />

              <PeriodStatCard
                title="Agent Current Balance"
                stat={{
                  total: f.agents.currentBalance,
                  today: f.agents.currentBalance,
                  thisMonth: f.agents.currentBalance,
                  lastMonth: f.agents.currentBalance,
                }}
                isDiamond
                icon={<Landmark className="h-4 w-4" />}
                iconBg="bg-violet-400/10"
                iconColor="text-violet-400"
              />

              <PeriodStatCard
                title="Agent Commission"
                stat={f.agents.commission}
                isDiamond
                colorMode="cost"
                icon={<HandCoins className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Deposit Commission"
                stat={f.agents.depositCommission}
                isDiamond
                colorMode="cost"
                icon={<Banknote className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Withdraw Commission"
                stat={f.agents.withdrawCommission}
                isDiamond
                colorMode="cost"
                icon={<Wallet className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />

              <PeriodStatCard
                title="Deposit Bonus"
                stat={f.bonuses.deposit}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Referral Bonus"
                stat={f.bonuses.referral}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Daily Bonus"
                stat={f.bonuses.daily}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Spin Bonus"
                stat={f.bonuses.spin}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="Manual Bonus"
                stat={f.bonuses.manual}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
              <PeriodStatCard
                title="VIP Cashback"
                stat={f.bonuses.vipCashback}
                isDiamond
                colorMode="cost"
                icon={<Gift className="h-4 w-4" />}
                iconBg="bg-rose-400/10"
                iconColor="text-rose-400"
              />
            </div>

            {/* ──────────  Finance  ────────── */}
            <SectionDivider>Finance</SectionDivider>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <PeriodStatCard
                title="User Deposits Amount"
                stat={f.deposits.amount}
                isDiamond
                icon={<Coins className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />
              <PeriodStatCard
                title="User Deposits Count"
                stat={f.deposits.count}
                icon={<Coins className="h-4 w-4" />}
                iconBg="bg-emerald-400/10"
                iconColor="text-emerald-400"
              />
              <PeriodStatCard
                title="Withdraw Amount"
                stat={f.withdrawals.amount}
                isDiamond
                icon={<Wallet className="h-4 w-4" />}
                iconBg="bg-amber-400/10"
                iconColor="text-amber-400"
              />
              <PeriodStatCard
                title="Withdraw Count"
                stat={f.withdrawals.count}
                icon={<Wallet className="h-4 w-4" />}
                iconBg="bg-amber-400/10"
                iconColor="text-amber-400"
              />
            </div>

            {/* ──────────  Games / Bots  ────────── */}
            <SectionDivider>Games & Bots</SectionDivider>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <PeriodStatCard
                title="Match Count"
                stat={f.matches.count}
                icon={<Trophy className="h-4 w-4" />}
                iconBg="bg-amber-400/10"
                iconColor="text-amber-400"
              />
            </div>

            {/* ──────────  Users & Agents  ────────── */}
            <SectionDivider>Users & Agents</SectionDivider>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
              <PeriodStatCard
                title="Users"
                stat={f.users.count}
                icon={<Users className="h-4 w-4" />}
                iconBg="bg-sky-400/10"
                iconColor="text-sky-400"
              />
              <PeriodStatCard
                title="Active Users"
                stat={f.users.active}
                icon={<Users className="h-4 w-4" />}
                iconBg="bg-sky-400/10"
                iconColor="text-sky-400"
              />
              <PeriodStatCard
                title="Agents"
                stat={f.agents.count}
                icon={<Users className="h-4 w-4" />}
                iconBg="bg-violet-400/10"
                iconColor="text-violet-400"
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
