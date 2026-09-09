"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import baseUrl from "@/config/baseUrl";
type Day = { day: string; rounds: number; wagered: number; paid: number; profit: number; actualRtp: number | null; status: string };
const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
export default function DailyReport() {
  const [date, setDate] = useState("");
  const [days, setDays] = useState<Day[]>([]);
  const [rounds, setRounds] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState("");
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const day = date || today();
        const responses = await Promise.all([`daily?day=${day}`, `rounds?day=${day}&limit=25&page=${page}`, "audit"].map(path => fetch(`${baseUrl}/admin/aviator/${path}`, { credentials: "include", cache: "no-store" })));
        if (responses.some(r => !r.ok)) throw new Error("Daily report could not be refreshed");
        const [d, r, a] = await Promise.all(responses.map(r => r.json()));
        if (!alive) return;
        setDays(d.days); setRounds(r.rounds); setCount(r.count); setAudit(a.audit); setUpdated(d.generatedAt); setError("");
      } catch (e: any) { if (alive) setError(e.message); }
    };
    void load(); const timer = window.setInterval(load, 10000);
    return () => { alive = false; window.clearInterval(timer); };
  }, [date, page]);
  const selected = days[0];
  return <section className="space-y-4 rounded-xl border bg-card p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold">Daily Aviator accounts · Bangladesh time</h2><div className="flex gap-2"><input aria-label="Report date" type="date" max={today()} value={date} onChange={e => { setDate(e.target.value); setPage(1); }} className="rounded border bg-background p-2" /><button onClick={() => { setDate(""); setPage(1); }} className="rounded border px-3">Today (live)</button></div></div>
    <p className="text-xs text-muted-foreground">Automatic midnight rollover (Asia/Dhaka). A round belongs to the day it finishes. Only settled real bets count; fun mode and simulated bots are excluded. Gross profit = bets − payouts, before salaries, fees and other costs.</p>
    {error && <p role="alert" className="text-red-500">{error} — displayed data may be stale.</p>}
    {selected && <div className="grid gap-3 sm:grid-cols-4">{[["Day / status", `${selected.day} · ${selected.status}`], ["Real bets", selected.wagered.toFixed(2)], ["Payouts", selected.paid.toFixed(2)], [selected.profit < 0 ? "Gross loss BDT" : "Gross profit BDT", selected.profit.toFixed(2)]].map(([label, value]) => <div key={label} className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{label}</p><strong>{value}</strong></div>)}</div>}
    <p className="text-xs text-muted-foreground">Updated: {updated ? new Date(updated).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }) : "Loading…"}. Active rounds are not final profit.</p>
    <div className="max-h-80 overflow-auto"><table className="w-full text-left text-sm"><thead><tr>{["Day", "Status", "Rounds", "Bets BDT", "Payout BDT", "Gross profit/loss", "Actual RTP"].map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead><tbody>{days.map(d => <tr key={d.day} className="border-t"><td className="p-2"><button className="text-sky-500 underline" onClick={() => { setDate(d.day); setPage(1); }}>{d.day}</button></td><td>{d.status}</td><td>{d.rounds}</td><td>{d.wagered.toFixed(2)}</td><td>{d.paid.toFixed(2)}</td><td className={d.profit < 0 ? "text-red-500" : "text-emerald-500"}>{d.profit.toFixed(2)}</td><td>{d.actualRtp === null ? "—" : `${d.actualRtp.toFixed(2)}%`}</td></tr>)}</tbody></table></div>
    <h3 className="font-semibold">Selected day — settled rounds ({count})</h3>
    <div className="max-h-64 overflow-auto">{rounds.map(r => <div key={r.roundId} className="flex flex-wrap justify-between gap-2 border-b py-2 text-sm"><span>{r.roundId} · {r.crashPoint?.toFixed(2)}x</span><span>Gross: {(r.totalBet - r.totalPayout).toFixed(2)} BDT · <Link href={`/aviator/rounds/${encodeURIComponent(r.roundId)}`} className="text-sky-500 underline">View</Link></span></div>)}{!rounds.length && <p>No settled rounds for this day.</p>}</div>
    <div className="flex items-center gap-3 text-sm"><button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="rounded border p-2 disabled:opacity-40">Previous</button><span>Page {page}</span><button disabled={page * 25 >= count} onClick={() => setPage(p => p + 1)} className="rounded border p-2 disabled:opacity-40">Next</button></div>
    <details><summary className="cursor-pointer font-semibold">Settings change log (latest 100)</summary><div className="max-h-64 overflow-auto">{audit.map((a, i) => <div key={i} className="border-b py-2 text-xs"><p>{new Date(a.at).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })} · Admin {a.adminId} · Next new round</p><pre className="whitespace-pre-wrap">{JSON.stringify(a.changes, null, 2)}</pre></div>)}</div></details>
  </section>;
}
