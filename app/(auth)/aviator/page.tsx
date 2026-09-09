"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import Link from "next/link";
import DailyReport from "./DailyReport";
import baseUrl from "@/config/baseUrl";
import socketUrl from "@/config/socketUrl";

type Round = { _id: string; roundId: string; status: string; crashPoint?: number; totalBet: number; totalPayout: number; realPlayers: number; createdAt: string };
type Settings = { enabled: boolean; minBet: number; maxBet: number; waitingSeconds: number; houseEdgePercent: number; maxMultiplier: number; simulatedBotsEnabled: boolean; simulatedBotsMin: number; simulatedBotsMax: number };
type Overview = { live: { state?: { roundId: string; phase: string; multiplier: number }; realPlayers: number; joinedBets: number; wagered: number; paid: number }; totals: { rounds: number; wagered: number; paid: number; playerEntries: number; profit: number } };
const defaults: Settings = { enabled: true, minBet: 1, maxBet: 10000, waitingSeconds: 7, houseEdgePercent: 3, maxMultiplier: 1000, simulatedBotsEnabled: true, simulatedBotsMin: 150, simulatedBotsMax: 500 };

export default function AviatorAdminPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [settings, setSettings] = useState<Settings>(defaults);
  const settingsLoaded = useRef(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [overviewRes, roundsRes, settingsRes] = await Promise.all([
      fetch(`${baseUrl}/admin/aviator/overview`, { credentials: "include" }),
      fetch(`${baseUrl}/admin/aviator/rounds?limit=10`, { credentials: "include" }),
      fetch(`${baseUrl}/admin/aviator/settings`, { credentials: "include" }),
    ]);
    if (!overviewRes.ok || !roundsRes.ok || !settingsRes.ok) throw new Error("Unable to load Aviator data");
    const [o, r, s] = await Promise.all([overviewRes.json(), roundsRes.json(), settingsRes.json()]);
    setOverview(o);
    setRounds(r.rounds || []);
    if (!settingsLoaded.current) { setSettings(s.settings || defaults); settingsLoaded.current = true; }
  }, []);

  useEffect(() => {
    void load().catch(error => toast.error(error.message));
    const socket = io(socketUrl, { withCredentials: true, transports: ["websocket"] });
    socket.on("connect", () => socket.emit("AVIATOR_JOIN"));
    const timer = window.setInterval(() => void load().catch(() => {}), 10000);
    socket.on("AVIATOR_CRASHED", () => void load().catch(() => {}));
    return () => { socket.disconnect(); window.clearInterval(timer); };
  }, [load]);

  const save = async () => {
    if (settings.minBet < 1 || settings.maxBet < settings.minBet) {
      toast.error("Maximum bet must be at least the minimum bet, and minimum bet must be 1 BDT or more");
      return;
    }
    if (settings.simulatedBotsMin < 0 || settings.simulatedBotsMax < settings.simulatedBotsMin || settings.simulatedBotsMax > 1000) {
      toast.error("Simulated bot range must be between 0 and 1,000");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${baseUrl}/admin/aviator/settings`, {
        method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body?.message || "Settings update failed");
      setSettings(body.settings);
      toast.success("Settings saved. Effective from the next new round.");
    } catch (error: any) { toast.error(error?.message || "Settings update failed"); }
    finally { setSaving(false); }
  };

  const cards = useMemo(() => [
    ["Live real users", overview?.live.realPlayers || 0],
    ["Live bets", overview?.live.joinedBets || 0],
    ["Current wager", `৳${(overview?.live.wagered || 0).toFixed(2)}`],
    ["Unsettled balance (not profit)", `৳${((overview?.live.wagered || 0) - (overview?.live.paid || 0)).toFixed(2)}`],
    ["All rounds", overview?.totals.rounds || 0],
    ["Settled gross profit", `৳${(overview?.totals.profit || 0).toFixed(2)}`],
  ], [overview]);

  return <div className="space-y-6 p-4 md:p-7">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-2xl font-bold">Aviator Control</h1><p className="text-sm text-muted-foreground">Live real-user activity, fair-game settings and round history</p></div><div className="rounded-xl bg-emerald-500/10 px-4 py-2 text-emerald-500">{overview?.live.state?.phase || "CONNECTING"} · {(overview?.live.state?.multiplier || 1).toFixed(2)}x</div></div>
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">{cards.map(([label, value]) => <div key={String(label)} className="rounded-xl border bg-card p-4 shadow-sm"><div className="text-xs text-muted-foreground">{label}</div><div className="mt-2 text-2xl font-bold">{value}</div></div>)}</div>
    <DailyReport />
    <section className="rounded-xl border bg-card p-5"><h2 className="mb-4 text-lg font-semibold">Game settings</h2><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <label className="space-y-2 text-sm"><span>Game status</span><select className="w-full rounded-md border bg-background p-2" value={settings.enabled ? "on" : "off"} onChange={e => setSettings(s => ({...s, enabled:e.target.value === "on"}))}><option value="on">Enabled</option><option value="off">Paused</option></select></label>
      {([['minBet','Minimum bet'],['maxBet','Maximum bet'],['waitingSeconds','Betting seconds'],['houseEdgePercent','House edge %'],['maxMultiplier','Maximum multiplier']] as const).map(([key,label]) => <label key={key} className="space-y-2 text-sm"><span>{label}</span><input className="w-full rounded-md border bg-background p-2" type="number" min={key === 'minBet' || key === 'maxBet' ? '1' : '0'} step={key === 'houseEdgePercent' ? '.1' : '1'} value={settings[key]} onChange={e => setSettings(s => ({...s,[key]:Number(e.target.value)}))}/></label>)}
    </div><p className="mt-4 text-xs text-muted-foreground">Changes apply from the next new round. Current round settings are locked. House edge is a long-run mathematical parameter, not guaranteed daily profit.</p><button className="mt-4 rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save settings"}</button></section>
    <section className="rounded-xl border bg-card p-5"><h2 className="text-lg font-semibold">Simulated participants</h2><p className="mt-1 text-xs text-muted-foreground">Display-only BOT-labelled participants. They never affect real balances, wagers, payouts or profit.</p><div className="mt-4 grid gap-4 sm:grid-cols-3"><label className="space-y-2 text-sm"><span>Simulation</span><select className="w-full rounded-md border bg-background p-2" value={settings.simulatedBotsEnabled ? "on" : "off"} onChange={e => setSettings(s => ({...s, simulatedBotsEnabled:e.target.value === "on"}))}><option value="off">Disabled</option><option value="on">Enabled (BOT labelled)</option></select></label><label className="space-y-2 text-sm"><span>Minimum participants</span><input className="w-full rounded-md border bg-background p-2" type="number" min="0" max="1000" value={settings.simulatedBotsMin} onChange={e => setSettings(s => ({...s, simulatedBotsMin:Number(e.target.value)}))}/></label><label className="space-y-2 text-sm"><span>Maximum participants</span><input className="w-full rounded-md border bg-background p-2" type="number" min="0" max="1000" value={settings.simulatedBotsMax} onChange={e => setSettings(s => ({...s, simulatedBotsMax:Number(e.target.value)}))}/></label></div></section>
    <section className="overflow-hidden rounded-xl border bg-card"><div className="flex items-center justify-between gap-3 border-b p-5"><h2 className="text-lg font-semibold">Recent rounds (10)</h2><Link href="/aviator/rounds" className="rounded-lg border px-4 py-2 text-sm font-medium text-sky-500">View all</Link></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-muted/50 text-left"><tr>{["Round","Status","Result","Real users","Bets","Payout","Gross profit","Time","Details"].map(h => <th className="p-3" key={h}>{h}</th>)}</tr></thead><tbody>{rounds.map(round => <tr className="border-t" key={round._id}><td className="p-3 font-mono text-xs">{round.roundId}</td><td className="p-3">{round.status}</td><td className="p-3 font-semibold text-sky-500">{round.crashPoint ? `${round.crashPoint.toFixed(2)}x` : "—"}</td><td className="p-3">{round.realPlayers}</td><td className="p-3">৳{round.totalBet.toFixed(2)}</td><td className="p-3">৳{round.totalPayout.toFixed(2)}</td><td className="p-3">৳{(round.totalBet-round.totalPayout).toFixed(2)}</td><td className="p-3 whitespace-nowrap">{new Date(round.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Dhaka" })}</td><td className="p-3"><Link className="text-sky-500 underline" href={`/aviator/rounds/${encodeURIComponent(round.roundId)}`}>View</Link></td></tr>)}</tbody></table></div></section>
  </div>;
}
