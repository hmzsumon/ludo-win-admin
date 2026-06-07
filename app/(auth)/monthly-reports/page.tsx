/* ──────────  monthly-reports/page.tsx  ──────────
   SystemMonthlyReport collection এর monthly snapshot/report দেখানোর admin page।
────────────────────────────────────────────────── */

"use client";

import {
  ISystemMonthlyReport,
  useGetMonthlyReportsQuery,
} from "@/redux/features/admin/adminApi";
import {
  Bot,
  CalendarDays,
  ChevronRight,
  Coins,
  Gift,
  HandCoins,
  RefreshCw,
  Trophy,
  Wallet,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

const money = (value?: number) => {
  const n = Number(value || 0);
  return `${n.toLocaleString("en-BD", { maximumFractionDigits: 2 })} 💎`;
};

const dateText = (value?: string) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

const monthText = (monthKey?: string) => {
  if (!monthKey) return "Monthly Report";
  const [year, month] = monthKey.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-BD", { year: "numeric", month: "long" });
};

function statusClass(status?: string) {
  if (status === "profit")
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  if (status === "loss")
    return "border-rose-400/20 bg-rose-400/10 text-rose-300";
  return "border-sky-400/20 bg-sky-400/10 text-sky-300";
}

function PageHeader({
  onRefresh,
  loading,
}: {
  onRefresh: () => void;
  loading: boolean;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[rgb(var(--app-text))]">
          <CalendarDays className="h-6 w-6 text-cyan-300" />
          Monthly Reports
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--app-text-muted))]">
          প্রতি মাসের ১ তারিখে আগের মাসের income, cost এবং profit snapshot এখানে
          দেখা যাবে।
        </p>
      </div>

      <button
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/5 bg-[rgb(var(--app-surface-2))]/70 px-4 py-2 text-xs font-semibold text-[rgb(var(--app-text-soft))] transition-all hover:bg-[rgb(var(--app-surface-3))]/80 disabled:opacity-40"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
        Refresh
      </button>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  note,
  tone,
}: {
  title: string;
  value: string;
  note?: string;
  tone: "income" | "cost" | "profit";
}) {
  const toneClass =
    tone === "income"
      ? "from-emerald-500/15 to-cyan-500/10 text-emerald-300"
      : tone === "cost"
        ? "from-rose-500/15 to-orange-500/10 text-rose-300"
        : "from-violet-500/15 to-fuchsia-500/10 text-violet-200";

  return (
    <div
      className={`rounded-2xl border border-white/5 bg-gradient-to-br ${toneClass} p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)]`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[rgb(var(--app-text-muted))]">
        {title}
      </p>
      <div className="mt-3 text-2xl font-black tracking-tight text-[rgb(var(--app-text))]">
        {value}
      </div>
      {note ? (
        <p className="mt-2 text-xs text-[rgb(var(--app-text-muted))]">{note}</p>
      ) : null}
    </div>
  );
}

function BreakdownItem({
  icon,
  label,
  value,
  type,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  type: "income" | "cost";
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-[rgb(var(--app-surface-2))]/60 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${type === "income" ? "bg-emerald-400/10 text-emerald-300" : "bg-rose-400/10 text-rose-300"}`}
        >
          {icon}
        </span>
        <span className="truncate text-sm font-medium text-[rgb(var(--app-text-soft))]">
          {label}
        </span>
      </div>
      <span
        className={`shrink-0 text-sm font-bold ${type === "income" ? "text-emerald-300" : "text-rose-300"}`}
      >
        {money(value)}
      </span>
    </div>
  );
}

function ReportDetails({ report }: { report?: ISystemMonthlyReport }) {
  if (!report) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-8 text-center">
        <p className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
          Monthly report not found
        </p>
        <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
          প্রথম monthly cron চলার পরে এখানে report দেখা যাবে।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/5 bg-[rgb(var(--app-surface))] p-5 shadow-[0_22px_80px_rgba(0,0,0,0.22)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-black text-[rgb(var(--app-text))]">
              {monthText(report.monthKey)}
            </h2>
            <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
              Period: {dateText(report.periodStart)} -{" "}
              {dateText(report.periodEnd)}
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusClass(report.profit?.status)}`}
          >
            {report.profit?.status?.replace("_", " ") || "break even"}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
          <SummaryCard
            title="Gross Income"
            value={money(report.profit?.grossIncome)}
            tone="income"
            note="Game fee + bot win"
          />
          <SummaryCard
            title="Total Cost"
            value={money(report.profit?.totalCost)}
            tone="cost"
            note="Commission + bonus + bot loss"
          />
          <SummaryCard
            title="Net Profit"
            value={money(report.profit?.netProfit)}
            tone="profit"
            note="Income - Cost"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-300">
            <Coins className="h-4 w-4" /> Income Breakdown
          </h3>
          <div className="space-y-3">
            <BreakdownItem
              icon={<Trophy className="h-4 w-4" />}
              label="Game Fee Income"
              value={report.income?.gameFee}
              type="income"
            />
            <BreakdownItem
              icon={<Bot className="h-4 w-4" />}
              label="Bot Win Income"
              value={report.income?.botWin}
              type="income"
            />
            <BreakdownItem
              icon={<Wallet className="h-4 w-4" />}
              label="Total Income"
              value={report.income?.totalIncome}
              type="income"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-rose-300">
            <HandCoins className="h-4 w-4" /> Cost Breakdown
          </h3>
          <div className="space-y-3">
            <BreakdownItem
              icon={<HandCoins className="h-4 w-4" />}
              label="Agent Commission"
              value={report.cost?.agentCommission}
              type="cost"
            />
            <BreakdownItem
              icon={<HandCoins className="h-4 w-4" />}
              label="Deposit Commission"
              value={report.cost?.agentDepositCommission}
              type="cost"
            />
            <BreakdownItem
              icon={<HandCoins className="h-4 w-4" />}
              label="Withdraw Commission"
              value={report.cost?.agentWithdrawCommission}
              type="cost"
            />
            <BreakdownItem
              icon={<Bot className="h-4 w-4" />}
              label="Bot Loss"
              value={report.cost?.botLoss}
              type="cost"
            />
            <BreakdownItem
              icon={<Gift className="h-4 w-4" />}
              label="Total Bonus"
              value={report.cost?.totalBonus}
              type="cost"
            />
            <BreakdownItem
              icon={<Gift className="h-4 w-4" />}
              label="Deposit Bonus"
              value={report.cost?.depositBonus}
              type="cost"
            />
            <BreakdownItem
              icon={<Gift className="h-4 w-4" />}
              label="Referral Bonus"
              value={report.cost?.referralBonus}
              type="cost"
            />
            <BreakdownItem
              icon={<Gift className="h-4 w-4" />}
              label="Daily Bonus"
              value={report.cost?.dailyBonus}
              type="cost"
            />
            <BreakdownItem
              icon={<Gift className="h-4 w-4" />}
              label="Spin Bonus"
              value={report.cost?.spinBonus}
              type="cost"
            />
            <BreakdownItem
              icon={<Gift className="h-4 w-4" />}
              label="Manual Bonus"
              value={report.cost?.manualBonus}
              type="cost"
            />
            <BreakdownItem
              icon={<Gift className="h-4 w-4" />}
              label="VIP Cashback"
              value={report.cost?.vipCashback}
              type="cost"
            />
            <BreakdownItem
              icon={<Gift className="h-4 w-4" />}
              label="Welcome Bonus"
              value={report.cost?.welcomeBonus}
              type="cost"
            />
            <BreakdownItem
              icon={<Wallet className="h-4 w-4" />}
              label="Total Cost"
              value={report.cost?.totalCost}
              type="cost"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsTable({
  reports,
  selectedId,
  onSelect,
}: {
  reports: ISystemMonthlyReport[];
  selectedId?: string;
  onSelect: (report: ISystemMonthlyReport) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[rgb(var(--app-text-soft))]">
          Report History
        </h3>
        <span className="text-xs text-[rgb(var(--app-text-muted))]">
          {reports.length} reports
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/5">
        <div className="hidden grid-cols-[1.2fr_1fr_1fr_1fr_42px] bg-[rgb(var(--app-surface-2))] px-4 py-3 text-xs font-bold uppercase tracking-wider text-[rgb(var(--app-text-muted))] md:grid">
          <span>Month</span>
          <span>Income</span>
          <span>Cost</span>
          <span>Net Profit</span>
          <span />
        </div>

        <div className="divide-y divide-white/5">
          {reports.map((report) => {
            const active = selectedId === report._id;
            return (
              <button
                key={report._id}
                type="button"
                onClick={() => onSelect(report)}
                className={`grid w-full grid-cols-1 gap-2 px-4 py-4 text-left transition hover:bg-[rgb(var(--app-surface-2))]/70 md:grid-cols-[1.2fr_1fr_1fr_1fr_42px] md:items-center ${active ? "bg-cyan-400/10" : "bg-transparent"}`}
              >
                <div>
                  <div className="font-bold text-[rgb(var(--app-text))]">
                    {monthText(report.monthKey)}
                  </div>
                  <div className="mt-0.5 text-xs text-[rgb(var(--app-text-muted))]">
                    {dateText(report.periodStart)} -{" "}
                    {dateText(report.periodEnd)}
                  </div>
                </div>
                <div className="text-sm font-semibold text-emerald-300">
                  {money(report.profit?.grossIncome)}
                </div>
                <div className="text-sm font-semibold text-rose-300">
                  {money(report.profit?.totalCost)}
                </div>
                <div className="flex items-center gap-2 text-sm font-black text-[rgb(var(--app-text))]">
                  {money(report.profit?.netProfit)}
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusClass(report.profit?.status)}`}
                  >
                    {report.profit?.status?.replace("_", " ")}
                  </span>
                </div>
                <div className="hidden justify-end md:flex">
                  <ChevronRight className="h-4 w-4 text-[rgb(var(--app-text-muted))]" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-2xl bg-[rgb(var(--app-surface-2))]/70"
        />
      ))}
    </div>
  );
}

export default function MonthlyReportsPage() {
  const { data, isLoading, isFetching, refetch } = useGetMonthlyReportsQuery({
    page: 1,
    limit: 24,
  });
  const reports = useMemo(() => data?.reports || [], [data?.reports]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedReport = useMemo(() => {
    if (!reports.length) return undefined;
    return reports.find((report) => report._id === selectedId) || reports[0];
  }, [reports, selectedId]);

  const loading = isLoading || isFetching;

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <PageHeader onRefresh={refetch} loading={loading} />

      {loading ? (
        <LoadingState />
      ) : reports.length ? (
        <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1fr)_430px]">
          <ReportDetails report={selectedReport} />
          <ReportsTable
            reports={reports}
            selectedId={selectedReport?._id}
            onSelect={(report) => setSelectedId(report._id)}
          />
        </div>
      ) : (
        <ReportDetails />
      )}
    </main>
  );
}
