"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import baseUrl from "@/config/baseUrl";
export default function RoundDetails({ params }: { params: { roundId: string } }) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/aviator/rounds/${encodeURIComponent(params.roundId)}`, { credentials: "include", cache: "no-store" });
        if (!response.ok) throw new Error(response.status === 404 ? "Round not found" : "Unable to load round");
        const result = await response.json(); if (alive) { setData(result); setError(""); }
      } catch (e: any) { if (alive) setError(e.message); }
    };
    void load(); const timer = window.setInterval(load, 10000);
    return () => { alive = false; window.clearInterval(timer); };
  }, [params.roundId]);
  const r = data?.round;
  return <main className="space-y-5 p-5"><Link href="/aviator" className="text-sky-500 underline">← Aviator Control</Link><h1 className="text-2xl font-bold">Round details</h1>{error && <p role="alert" className="text-red-500">{error}</p>}{!r ? <p>Loading round…</p> : <>
    <div className="grid gap-3 rounded-xl border p-4 sm:grid-cols-2"><p>Round: {r.roundId}</p><p>Status: {r.status}</p><p>Crash: {r.crashPoint === undefined ? "Hidden until settled" : `${r.crashPoint.toFixed(2)}x`}</p><p>House edge: {r.houseEdgePercent === undefined ? "Not recorded (legacy round)" : `${r.houseEdgePercent}%`}</p><p>Maximum multiplier: {r.maxMultiplier ?? "Not recorded"}</p><p>Real players: {r.realPlayers}</p><p>Settled bets: {r.totalBet.toFixed(2)} BDT</p><p>Payout: {r.totalPayout.toFixed(2)} BDT</p><p>Gross profit/loss: {r.status === "CRASHED" ? `${(r.totalBet - r.totalPayout).toFixed(2)} BDT` : "Pending settlement"}</p><p>Finished (Dhaka): {r.crashedAt ? new Date(r.crashedAt).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" }) : "—"}</p></div>
    <section className="space-y-2 break-all rounded-xl border p-4 text-sm"><h2 className="font-bold">Result verification</h2><p>Algorithm version: {r.fairnessVersion ?? "Legacy"}</p><p>Seed hash: {r.serverSeedHash}</p><p>Revealed seed: {r.serverSeed || "Hidden until settled"}</p><p>{data.verification ? data.verification.valid ? "Verified: seed hash and calculated crash point match." : "Verification FAILED" : "Verification unavailable: round is active or legacy settings were not recorded."}</p></section>
    <section className="overflow-x-auto rounded-xl border p-4"><h2 className="mb-3 font-bold">Real-user bets ({data.bets.length})</h2><table className="w-full text-left text-sm"><thead><tr>{["Customer", "Player", "Slot", "Stake", "Status", "Cash out", "Payout", "Time (Dhaka)"].map(h => <th key={h} className="p-2">{h}</th>)}</tr></thead><tbody>{data.bets.map((b: any) => <tr key={b._id} className="border-t"><td className="p-2">{b.customerId}</td><td>{b.playerName}</td><td>{b.slot}</td><td>{b.amount.toFixed(2)}</td><td>{b.status}</td><td>{b.cashoutMultiplier ? `${b.cashoutMultiplier.toFixed(2)}x` : "—"}</td><td>{b.payout.toFixed(2)}</td><td>{new Date(b.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</td></tr>)}</tbody></table></section>
  </>}</main>;
}
