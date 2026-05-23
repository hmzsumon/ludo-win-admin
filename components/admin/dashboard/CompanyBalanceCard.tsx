/* ──────────  CompanyBalanceCard.tsx  ──────────
   companyBalance backend থেকে remove করা হয়েছে।

   ✅ এখন এই card টি Bonus Total Cost দেখাবে:
   bonuses.total.total
   bonuses.total.today
   bonuses.total.thisMonth
   bonuses.total.lastMonth
──────────────────────────────────────────── */

"use client";

import type { IPeriodStats } from "@/redux/features/admin/adminApi";
import { Gift } from "lucide-react";

/* ──────────  Props  ────────── */
interface CompanyBalanceCardProps {
  stat?: Partial<IPeriodStats> | null;
  loading?: boolean;
}

/* ──────────  Number Helpers  ────────── */
const n = (value: any) => Number(value || 0);

const fmt = (value: number) =>
  n(value).toLocaleString("en-BD", { maximumFractionDigits: 2 });

/* ──────────  Small Period Item  ────────── */
function PeriodItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.025] px-3 py-2.5">
      <p className="text-[9px] uppercase tracking-wide text-[rgb(var(--app-text))]/25">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-rose-400">
        {fmt(value)} 💎
      </p>
    </div>
  );
}

/* ──────────  Bonus Total Cost Card  ──────────
   Note:
   নাম CompanyBalanceCard রাখা হয়েছে যাতে পুরনো import/build না ভাঙে।
   কিন্তু এখন এটি company balance নয়, সব bonus মিলিয়ে total cost দেখায়।
──────────────────────────────────────────── */
export default function CompanyBalanceCard({
  stat,
  loading = false,
}: CompanyBalanceCardProps) {
  const total = n(stat?.total);
  const today = n(stat?.today);
  const thisMonth = n(stat?.thisMonth);
  const lastMonth = n(stat?.lastMonth);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5">
        <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5">
      {/* ──────────  Card Header  ────────── */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-400/10 text-rose-400">
            <Gift className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
              Total Bonus Cost
            </h3>
            <p className="mt-0.5 text-[10px] text-[rgb(var(--app-text-muted))]">
              Deposit + referral + daily + spin + manual + VIP cashback +
              welcome
            </p>
          </div>
        </div>

        {/* ──────────  Total Highlight  ────────── */}
        <div className="text-right">
          <p className="text-[9px] uppercase tracking-wide text-[rgb(var(--app-text))]/25">
            All Time
          </p>
          <p className="text-lg font-bold text-rose-400">{fmt(total)} 💎</p>
        </div>
      </div>

      {/* ──────────  Period Grid  ────────── */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <PeriodItem label="Today" value={today} />
        <PeriodItem label="This Month" value={thisMonth} />
        <PeriodItem label="Last Month" value={lastMonth} />
        <PeriodItem label="Total" value={total} />
      </div>
    </div>
  );
}
