import type { GatewayStatus, SmsStatus } from "@/redux/features/sms-gateway/smsGatewayApi";

export function GatewayStatusBadge({ status }: { status: GatewayStatus | SmsStatus }) {
  const cls =
    status === "online" || status === "sent"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : status === "processing"
        ? "border-sky-400/20 bg-sky-400/10 text-sky-300"
        : status === "pending"
          ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
          : status === "disabled" || status === "failed"
            ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
            : "border-slate-400/20 bg-slate-400/10 text-slate-300";

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${cls}`}>
      {status}
    </span>
  );
}
