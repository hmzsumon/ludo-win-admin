"use client";

import { GatewayStatusBadge } from "@/components/admin/sms-gateway/GatewayStatusBadge";
import { useGetSmsGatewayDetailsQuery, useUpdateSmsGatewayStatusMutation } from "@/redux/features/sms-gateway/smsGatewayApi";
import { ArrowLeft, Battery, Clock3, MessageSquareText, Power, RefreshCw, Router, Send, Smartphone, Wifi } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

const dateTime = (value?: string) => value ? new Date(value).toLocaleString("en-BD") : "Never";

export default function SmsGatewayDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isFetching, refetch } = useGetSmsGatewayDetailsQuery(id, { skip: !id });
  const [updateStatus, { isLoading: updating }] = useUpdateSmsGatewayStatusMutation();
  const device = data?.data.device;
  const stats = data?.data.stats || {};

  const setStatus = async (status: "offline" | "disabled") => {
    try { const r = await updateStatus({ id, status }).unwrap(); toast.success(r.message); }
    catch (e: any) { toast.error(e?.data?.message || e?.data?.error || "Update failed"); }
  };

  if (isLoading) return <div className="p-10 text-sm text-[rgb(var(--app-text-muted))]">Loading gateway...</div>;
  if (!device) return <div className="p-10 text-sm text-rose-300">Gateway not found.</div>;

  return (
    <main className="min-h-screen bg-transparent p-4 text-[rgb(var(--app-text))] md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3"><Link href="/sms-gateways" className="mt-1 grid h-9 w-9 place-items-center rounded-xl border border-white/5 bg-[rgb(var(--app-surface))]"><ArrowLeft className="h-4 w-4" /></Link><div><h1 className="text-2xl font-black">{device.name}</h1><p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">{device.deviceModel || "Unknown device"} • {device.deviceUid}</p></div></div>
          <div className="flex gap-2"><button onClick={() => refetch()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/5 bg-[rgb(var(--app-surface))] px-4 text-xs font-bold"><RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />Refresh</button><button disabled={updating} onClick={() => setStatus(device.status === "disabled" ? "offline" : "disabled")} className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-xs font-black ${device.status === "disabled" ? "bg-emerald-400 text-slate-950" : "bg-rose-500 text-white"}`}><Power className="h-4 w-4" />{device.status === "disabled" ? "Enable gateway" : "Disable gateway"}</button></div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-gradient-to-br from-indigo-500/15 to-cyan-500/10 p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between"><div><div className="mb-3"><GatewayStatusBadge status={device.status} /></div><h2 className="text-2xl font-black">{device.selectedSimLabel || "Auto / Default SIM"}</h2><p className="mt-2 text-sm text-[rgb(var(--app-text-muted))]">Last heartbeat: {dateTime(device.lastSeenAt)}</p></div><div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4"><Info icon={<Battery />} label="Battery" value={`${device.batteryLevel ?? "—"}%`} /><Info icon={<Wifi />} label="Network" value={device.networkType || "Unknown"} /><Info icon={<Router />} label="App" value={device.appVersion || "—"} /><Info icon={<Smartphone />} label="SIM ID" value={device.selectedSimSubscriptionId == null ? "Auto" : String(device.selectedSimSubscriptionId)} /></div></div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Sent today" value={device.sentToday || 0} icon={<Send />} /><Stat label="Failed today" value={device.failedToday || 0} icon={<MessageSquareText />} /><Stat label="All sent" value={stats.sent || 0} icon={<Send />} /><Stat label="All failed" value={stats.failed || 0} icon={<Clock3 />} /></div>

        <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5"><h2 className="mb-4 text-lg font-black">Recent device messages</h2><div className="space-y-3">{data?.data.recentMessages?.length ? data.data.recentMessages.map((m) => <div key={m._id} className="flex flex-col gap-3 rounded-xl bg-[rgb(var(--app-surface-2))]/60 p-4 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex items-center gap-2"><span className="font-black">{m.phone}</span><GatewayStatusBadge status={m.status} /></div><p className="mt-2 truncate text-xs text-[rgb(var(--app-text-muted))]">{m.message}</p>{m.lastError ? <p className="mt-1 text-xs text-rose-300">{m.lastError}</p> : null}</div><div className="shrink-0 text-right text-[11px] text-[rgb(var(--app-text-muted))]"><p>{m.purpose.toUpperCase()}</p><p className="mt-1">{dateTime(m.updatedAt)}</p></div></div>) : <p className="py-8 text-center text-sm text-[rgb(var(--app-text-muted))]">No message history for this gateway yet.</p>}</div></div>
      </div>
    </main>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="min-w-[110px] rounded-xl border border-white/5 bg-black/10 p-3"><span className="flex items-center gap-2 text-[11px] text-[rgb(var(--app-text-muted))]">{icon}<span>{label}</span></span><p className="mt-2 truncate font-black">{value}</p></div>; }
function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) { return <div className="rounded-2xl border border-white/5 bg-[rgb(var(--app-surface))] p-5"><span className="text-cyan-300">{icon}</span><p className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">{label}</p></div>; }
