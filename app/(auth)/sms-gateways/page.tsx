"use client";

import { GatewayStatusBadge } from "@/components/admin/sms-gateway/GatewayStatusBadge";
import {
  SmsGatewayDevice,
  SmsGatewayMessage,
  useGetSmsGatewayMessagesQuery,
  useGetSmsGatewayOverviewQuery,
  useGetSmsGatewaysQuery,
  useRetrySmsGatewayMessageMutation,
} from "@/redux/features/sms-gateway/smsGatewayApi";
import {
  Activity,
  BatteryCharging,
  CircleX,
  Clock3,
  MessageSquareText,
  RefreshCw,
  Router,
  Search,
  Send,
  Smartphone,
  Wifi,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

const dateTime = (value?: string) => value ? new Date(value).toLocaleString("en-BD") : "Never";
const deviceName = (value?: SmsGatewayMessage["processedBy"]) =>
  typeof value === "object" && value ? value.name : "—";

function Metric({ label, value, icon, note }: { label: string; value: number; icon: React.ReactNode; note: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5 shadow-[0_16px_50px_rgba(0,0,0,.18)]">
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">{icon}</span>
        <span className="text-3xl font-black text-[rgb(var(--app-text))]">{value}</span>
      </div>
      <p className="mt-4 text-sm font-bold text-[rgb(var(--app-text-soft))]">{label}</p>
      <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">{note}</p>
    </div>
  );
}

function DeviceCard({ device }: { device: SmsGatewayDevice }) {
  return (
    <Link href={`/sms-gateways/${device._id}`} className="group rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/20">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-black text-[rgb(var(--app-text))]">{device.name}</h3>
          <p className="mt-1 truncate text-xs text-[rgb(var(--app-text-muted))]">{device.deviceModel || "Unknown Android device"}</p>
        </div>
        <GatewayStatusBadge status={device.status} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl bg-[rgb(var(--app-surface-2))]/70 p-3"><span className="text-[rgb(var(--app-text-muted))]">SIM</span><p className="mt-1 truncate font-bold text-[rgb(var(--app-text-soft))]">{device.selectedSimLabel || "Auto / Default"}</p></div>
        <div className="rounded-xl bg-[rgb(var(--app-surface-2))]/70 p-3"><span className="text-[rgb(var(--app-text-muted))]">Battery</span><p className="mt-1 font-bold text-[rgb(var(--app-text-soft))]">{device.batteryLevel ?? "—"}%</p></div>
        <div className="rounded-xl bg-[rgb(var(--app-surface-2))]/70 p-3"><span className="text-[rgb(var(--app-text-muted))]">Sent today</span><p className="mt-1 font-bold text-emerald-300">{device.sentToday || 0}</p></div>
        <div className="rounded-xl bg-[rgb(var(--app-surface-2))]/70 p-3"><span className="text-[rgb(var(--app-text-muted))]">Failed today</span><p className="mt-1 font-bold text-rose-300">{device.failedToday || 0}</p></div>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-[rgb(var(--app-text-muted))]"><span>{device.networkType || "Unknown network"}</span><span>Seen {dateTime(device.lastSeenAt)}</span></div>
    </Link>
  );
}

export default function SmsGatewaysPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const { data: overview, refetch: refetchOverview, isFetching: overviewLoading } = useGetSmsGatewayOverviewQuery();
  const { data: gateways, refetch: refetchGateways, isFetching: gatewaysLoading } = useGetSmsGatewaysQuery({ page: 1, limit: 50, search: search || undefined, status: status || undefined });
  const { data: messages, refetch: refetchMessages, isFetching: messagesLoading } = useGetSmsGatewayMessagesQuery({ page: 1, limit: 25, status: messageStatus || undefined });
  const [retryMessage, { isLoading: retrying }] = useRetrySmsGatewayMessageMutation();

  const refreshAll = () => { refetchOverview(); refetchGateways(); refetchMessages(); };
  const retry = async (id: string) => {
    try { const r = await retryMessage(id).unwrap(); toast.success(r.message); }
    catch (e: any) { toast.error(e?.data?.message || e?.data?.error || "Retry failed"); }
  };
  const o = overview?.data;

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl space-y-7 p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-black"><Smartphone className="h-7 w-7 text-cyan-300" />SMS Gateway Monitoring</h1>
            <p className="mt-1 text-sm text-[rgb(var(--app-text-muted))]">Live Android gateway status, queue health and SMS delivery logs.</p>
          </div>
          <button onClick={refreshAll} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/5 bg-[rgb(var(--app-surface))] px-4 text-xs font-bold hover:bg-[rgb(var(--app-surface-2))]">
            <RefreshCw className={`h-4 w-4 ${overviewLoading || gatewaysLoading || messagesLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Online gateways" value={o?.devices.online || 0} note={`${o?.devices.total || 0} total registered`} icon={<Activity className="h-5 w-5" />} />
          <Metric label="Pending SMS" value={o?.messages.pending || 0} note={`${o?.messages.processing || 0} currently processing`} icon={<Clock3 className="h-5 w-5" />} />
          <Metric label="Sent today" value={o?.messages.sentToday || 0} note="Successfully delivered to Android" icon={<Send className="h-5 w-5" />} />
          <Metric label="Failed today" value={o?.messages.failedToday || 0} note="Needs review or retry" icon={<CircleX className="h-5 w-5" />} />
        </div>

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-lg font-black">Gateway devices</h2><p className="text-xs text-[rgb(var(--app-text-muted))]">Open a device to inspect health and history.</p></div>
            <div className="flex gap-2">
              <label className="flex h-10 items-center gap-2 rounded-xl border border-white/5 bg-[rgb(var(--app-surface))] px-3"><Search className="h-4 w-4 text-[rgb(var(--app-text-muted))]" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search device" className="w-36 bg-transparent text-sm outline-none" /></label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-xl border border-white/5 bg-[rgb(var(--app-surface))] px-3 text-sm outline-none"><option value="">All status</option><option value="online">Online</option><option value="offline">Offline</option><option value="disabled">Disabled</option></select>
            </div>
          </div>
          {gateways?.data?.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{gateways.data.map((d) => <DeviceCard key={d._id} device={d} />)}</div> : <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center text-sm text-[rgb(var(--app-text-muted))]">No gateway device found.</div>}
        </section>

        <section className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-4 md:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="flex items-center gap-2 text-lg font-black"><MessageSquareText className="h-5 w-5 text-cyan-300" />Recent SMS queue</h2><p className="text-xs text-[rgb(var(--app-text-muted))]">Latest 25 queued messages across all gateways.</p></div><select value={messageStatus} onChange={(e) => setMessageStatus(e.target.value)} className="h-10 rounded-xl border border-white/5 bg-[rgb(var(--app-surface-2))] px-3 text-sm outline-none"><option value="">All messages</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="sent">Sent</option><option value="failed">Failed</option><option value="cancelled">Cancelled</option></select></div>
          <div className="overflow-x-auto"><table className="min-w-[900px] w-full text-left text-xs"><thead><tr className="border-b border-white/5 text-[rgb(var(--app-text-muted))]"><th className="px-3 py-3">Created</th><th className="px-3 py-3">Phone</th><th className="px-3 py-3">Purpose</th><th className="px-3 py-3">Gateway</th><th className="px-3 py-3">Attempts</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Action</th></tr></thead><tbody>{messages?.data?.map((m) => <tr key={m._id} className="border-b border-white/[.04] text-[rgb(var(--app-text-soft))]"><td className="px-3 py-3 whitespace-nowrap">{dateTime(m.createdAt)}</td><td className="px-3 py-3 font-bold">{m.phone}</td><td className="px-3 py-3 capitalize">{m.purpose}</td><td className="px-3 py-3">{deviceName(m.processedBy)}</td><td className="px-3 py-3">{m.attempts}/{m.maxAttempts}</td><td className="px-3 py-3"><GatewayStatusBadge status={m.status} /></td><td className="px-3 py-3">{m.status === "failed" || m.status === "cancelled" ? <button disabled={retrying} onClick={() => retry(m._id)} className="rounded-lg bg-cyan-400/10 px-3 py-1.5 font-bold text-cyan-300 hover:bg-cyan-400/20 disabled:opacity-50">Retry</button> : <span className="text-[rgb(var(--app-text-muted))]">—</span>}</td></tr>)}</tbody></table></div>
        </section>
      </div>
    </main>
  );
}
