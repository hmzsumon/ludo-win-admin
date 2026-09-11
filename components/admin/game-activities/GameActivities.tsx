"use client";

import Link from "next/link";
import { useState } from "react";
import { Gamepad2, RefreshCw } from "lucide-react";
import { ActivityFilters as Filters, useGetUserGameActivitiesQuery } from "@/redux/features/admin/gameActivitiesApi";
import ActivityFilters from "./ActivityFilters";
import ActivityTable, { activityMoney } from "./ActivityTable";

/* ────────── 🎮 User Game Activities ──────────
   ১৫ সেকেন্ড পরপর persisted state refresh হবে। নতুন game registry থেকে আসবে।
────────────────────────────────────────────── */
export default function GameActivities({ userId }: { userId: string }) {
  const [filters, setFilters] = useState<Filters>({ game: "all", status: "all", from: "", to: "", page: 1 });
  const { currentData: data, data: previousData, isFetching, isError, error, refetch, fulfilledTimeStamp } = useGetUserGameActivitiesQuery(
    { id: userId, ...filters }, { pollingInterval: 15000, skipPollingIfUnfocused: true },
  );
  const options = data ?? previousData;
  const summary = data?.summary;
  const message = (error as { data?: { message?: string } } | undefined)?.data?.message;
  return (
    <main className="mx-auto max-w-7xl space-y-5 p-4 text-[rgb(var(--app-text))] sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><h1 className="flex items-center gap-2 text-2xl font-bold"><Gamepad2 className="text-teal-400" />Game Activities</h1>
          <p className="mt-1 text-sm text-[rgb(var(--app-text-muted))]">{options?.user.name ?? "User"} · {options?.user.customerId ?? userId}</p></div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-teal-500">
          <Link href={`/users/${userId}`}>User Details</Link><Link href="/users">All Users</Link>
          <button onClick={() => void refetch()} disabled={isFetching} className="inline-flex items-center gap-1 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />Refresh</button>
        </div>
      </div>
      <ActivityFilters value={filters} games={options?.games ?? []} statuses={options?.statuses ?? []} onChange={setFilters} />
      <p className="text-xs text-[rgb(var(--app-text-muted))]">সংরক্ষিত গেমের অবস্থা ১৫ সেকেন্ড পরপর আপডেট হয়। চলমান বাজির নিট ফল এখনো নির্ধারিত নয়।{fulfilledTimeStamp ? ` সর্বশেষ: ${new Date(fulfilledTimeStamp).toLocaleTimeString()}` : ""}</p>
      {isError && <p role="alert" className="rounded-xl bg-rose-500/10 p-4 text-sm text-rose-500">{message || "গেম অ্যাক্টিভিটি লোড হয়নি। Refresh দিয়ে আবার চেষ্টা করুন।"}</p>}
      {summary && <section aria-label="Filtered activity summary" className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {[
          ["মোট রেকর্ড", summary.total], ["চলমান / অপেক্ষায়", summary.active],
          ["মোট বাজি 💎", summary.totalBet], ["Payout 💎", summary.totalPayout],
          ["Refund 💎", summary.totalRefund], ["নিষ্পত্তিকৃত নিট ফল 💎", summary.net],
        ].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-4"><p className="text-xs text-[rgb(var(--app-text-muted))]">{label}</p><p className="mt-2 text-lg font-bold">{activityMoney(Number(value))}</p></div>)}
      </section>}
      <p className="text-xs text-[rgb(var(--app-text-muted))]">সারসংক্ষেপ বর্তমান ফিল্টারের সব পৃষ্ঠার হিসাব। Aviator-এর প্রতিটি slot/bet একটি রেকর্ড।</p>
      {!data && isFetching ? <p role="status" className="py-10 text-center">অ্যাক্টিভিটি লোড হচ্ছে…</p> : data && <ActivityTable rows={data.activities} games={data.games} />}
      {data && <div className="flex items-center justify-between gap-3 text-sm">
        <button disabled={filters.page <= 1 || isFetching} onClick={() => setFilters({ ...filters, page: filters.page - 1 })} className="rounded-lg border border-[rgb(var(--app-border))] px-3 py-2 disabled:opacity-40">Previous</button>
        <span>Page {filters.page} / {Math.max(1, data.pagination.totalPages)} · {data.pagination.total} records</span>
        <button disabled={filters.page >= data.pagination.totalPages || isFetching} onClick={() => setFilters({ ...filters, page: filters.page + 1 })} className="rounded-lg border border-[rgb(var(--app-border))] px-3 py-2 disabled:opacity-40">Next</button>
      </div>}
      <Link className="inline-block text-sm text-teal-500 underline" href={`/users/${userId}/game-history`}>Ludo refund audit / পুরোনো Game History →</Link>
    </main>
  );
}
