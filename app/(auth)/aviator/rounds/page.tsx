"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import baseUrl from "@/config/baseUrl";

type Round = { roundId: string; status: string; crashPoint?: number; realPlayers: number; totalBet: number; totalPayout: number; createdAt: string };
const PAGE_SIZE = 25;

export default function AviatorRoundHistory() {
  const [page, setPage] = useState(1);
  const [day, setDay] = useState("");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError("");
    const query = new URLSearchParams({ limit: String(PAGE_SIZE), page: String(page) });
    if (day) query.set("day", day);
    void (async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/aviator/rounds?${query}`, { credentials: "include", cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load round history. Please retry.");
        const data = await response.json();
        if (!controller.signal.aborted) { setRounds(data.rounds || []); setCount(data.count || 0); }
      } catch (e: any) { if (!controller.signal.aborted) setError(e.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [page, day, reload]);

  const pages = Math.max(1, Math.ceil(count / PAGE_SIZE));
  return <main className="space-y-5 p-4 md:p-7">
    <Link href="/aviator" className="text-sm text-sky-500 underline">← Aviator Control</Link>
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Aviator round history</h1><p className="text-sm text-muted-foreground">25 rounds per page · Times in Bangladesh time</p></div><div className="flex flex-wrap gap-2"><input aria-label="Filter by settlement date" type="date" value={day} onChange={e => { setDay(e.target.value); setPage(1); }} className="rounded-lg border bg-background p-2" /><button className="rounded-lg border px-3 py-2" onClick={() => { setDay(""); setPage(1); }}>All dates</button><button disabled={loading} className="rounded-lg border px-3 py-2 disabled:opacity-50" onClick={() => { setPage(1); setReload(v => v + 1); }}>Refresh latest</button></div></div>
    {day && <p className="text-xs text-muted-foreground">Showing rounds settled on {day} (Asia/Dhaka).</p>}
    {error && <p role="alert" className="text-red-500">{error} <button className="underline" onClick={() => setReload(v => v + 1)}>Retry</button></p>}
    <section className="overflow-x-auto rounded-xl border bg-card" aria-busy={loading}>
      <table className="w-full whitespace-nowrap text-left text-sm"><thead className="bg-muted/50"><tr>{["Round", "Status", "Result", "Real users", "Bets BDT", "Payout BDT", "Gross profit/loss", "Created (Dhaka)", "Details"].map(h => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>
        {loading ? <tr><td colSpan={9} className="p-5 text-center">Loading…</td></tr> : error ? null : rounds.length === 0 ? <tr><td colSpan={9} className="p-5 text-center">No rounds found.</td></tr> : rounds.map(r => <tr key={r.roundId} className="border-t"><td className="p-3 font-mono text-xs">{r.roundId}</td><td className="p-3">{r.status}</td><td className="p-3">{r.crashPoint === undefined ? "—" : `${r.crashPoint.toFixed(2)}x`}</td><td className="p-3">{r.realPlayers}</td><td className="p-3">{r.totalBet.toFixed(2)}</td><td className="p-3">{r.totalPayout.toFixed(2)}</td><td className="p-3">{r.status === "CRASHED" ? (r.totalBet - r.totalPayout).toFixed(2) : "Pending"}</td><td className="p-3">{new Date(r.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</td><td className="p-3"><Link className="text-sky-500 underline" href={`/aviator/rounds/${encodeURIComponent(r.roundId)}`}>View</Link></td></tr>)}
      </tbody></table>
    </section>
    <nav aria-label="Round history pagination" className="flex flex-wrap items-center justify-between gap-3 text-sm"><span>{count} rounds · Page {page} of {pages}</span><div className="flex gap-2"><button disabled={loading || page <= 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Previous</button><button disabled={loading || !!error || page >= pages} onClick={() => setPage(p => p + 1)} className="rounded-lg border px-4 py-2 disabled:opacity-40">Next</button></div></nav>
  </main>;
}
