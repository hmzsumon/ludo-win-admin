"use client";

/* ────────── imports ────────── */
import CopyToClipboard from "@/lib/CopyToClipboard";
import Sheet from "@/components/new-ui/Sheet";
import StatusChip from "@/components/new-ui/StatusChip";
import { Row } from "@/components/new-ui/DetailsList";

/* ────────── helpers ────────── */
const fmtNum = (n?: number, suffix = "") =>
  `${Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 3 })}${suffix}`;

const fmtDate = (d: any) => {
  const iso =
    typeof d === "string"
      ? d
      : d?.$date
        ? d.$date
        : d?._seconds
          ? new Date(d._seconds * 1000).toISOString()
          : "";
  return iso
    ? new Date(iso).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "-";
};

const dataUrlFromBase64 = (b64?: string) =>
  b64 ? `data:image/png;base64,${b64}` : "";

/* ────────── types ────────── */
export type AdminFloatRequest = {
  _id: string;
  agentId?: string;
  customerId?: string;
  type?: "topup" | "return";
  status?: "pending" | "approved" | "rejected";
  amount?: number;
  paidCurrency?: string;
  exchangeRate?: number;
  diamondsAmount?: number;
  paymentChannel?: "manual" | "binance" | "blockbee";
  paymentNetwork?: string;
  orderId?: string;
  txnId?: string;
  txHash?: string;
  destinationAddress?: string;
  qrCode?: string;
  callbackUrl?: string;
  confirmations?: number;
  agentNote?: string;
  adminNote?: string;
  autoApprovedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function AdminFloatRequestDetails({
  open,
  request,
  onClose,
}: {
  open: boolean;
  request?: AdminFloatRequest | null;
  onClose: () => void;
}) {
  const r = request;

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[rgb(var(--app-text-muted))]">
              Agent Float Preview
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[rgb(var(--app-text))]">
              {r?.customerId || r?.agentId || "Request details"}
            </h3>
          </div>
          {r?.status ? <StatusChip status={r.status} /> : null}
        </div>
      }
    >
      {!r ? (
        <div className="p-4 text-sm text-[rgb(var(--app-text-muted))]">
          No request selected
        </div>
      ) : (
        <div className="rounded-xl border border-[rgb(var(--app-border))]">
          {/* ────────── Agent info ────────── */}
          <Row label="Request ID:">
            <span className="flex items-center gap-2 break-all font-semibold">
              {r._id}
              <CopyToClipboard text={r._id} />
            </span>
          </Row>
          <Row label="Agent ID:">
            <span className="flex items-center gap-2 break-all font-semibold">
              {r.agentId || "-"}
              {r.agentId ? <CopyToClipboard text={String(r.agentId)} /> : null}
            </span>
          </Row>
          <Row label="Customer ID:">
            <span className="font-semibold">{r.customerId || "-"}</span>
          </Row>

          {/* ────────── Amount calculation ────────── */}
          <Row label="Type:">
            <span className="font-semibold uppercase">{r.type || "-"}</span>
          </Row>
          <Row label="USDT Amount:">
            <span className="font-semibold">
              {fmtNum(r.amount, ` ${r.paidCurrency || "USDT"}`)}
            </span>
          </Row>
          <Row label="Exchange Rate:">
            <span className="font-semibold">{fmtNum(r.exchangeRate)}</span>
          </Row>
          <Row label="Float/Diamond Amount:">
            <span className="font-semibold text-emerald-400">
              {fmtNum(r.diamondsAmount, " 💎")}
            </span>
          </Row>

          {/* ────────── Payment info ────────── */}
          <Row label="Payment Channel:">
            <span className="font-semibold uppercase">
              {r.paymentChannel || "manual"}
            </span>
          </Row>
          <Row label="Network:">
            <span className="font-semibold uppercase">
              {r.paymentNetwork || "-"}
            </span>
          </Row>
          <Row label="Order ID:">
            <span className="flex items-center gap-2 break-all font-semibold">
              {r.orderId || "-"}
              {r.orderId ? <CopyToClipboard text={r.orderId} /> : null}
            </span>
          </Row>
          <Row label="Txn ID:">
            <span className="flex items-center gap-2 break-all font-semibold">
              {r.txnId || "-"}
              {r.txnId ? <CopyToClipboard text={r.txnId} /> : null}
            </span>
          </Row>
          <Row label="Tx Hash:">
            <span className="flex items-center gap-2 break-all font-semibold">
              {r.txHash || "-"}
              {r.txHash ? <CopyToClipboard text={r.txHash} /> : null}
            </span>
          </Row>
          <Row label="Payment Address:">
            <span className="flex items-center gap-2 break-all font-semibold">
              {r.destinationAddress || "-"}
              {r.destinationAddress ? (
                <CopyToClipboard text={r.destinationAddress} />
              ) : null}
            </span>
          </Row>
          <Row label="Confirmations:">
            <span className="font-semibold">{r.confirmations ?? 0}</span>
          </Row>
          <Row label="Callback URL:">
            <span className="break-all text-sm text-[rgb(var(--app-text-soft))]">
              {r.callbackUrl || "-"}
            </span>
          </Row>

          {/* ────────── Notes ────────── */}
          <Row label="Agent Note:">
            <span className="text-[rgb(var(--app-text-soft))]">
              {r.agentNote || "-"}
            </span>
          </Row>
          <Row label="Admin Note:">
            <span className="text-[rgb(var(--app-text-soft))]">
              {r.adminNote || "-"}
            </span>
          </Row>

          {/* ────────── Dates ────────── */}
          <Row label="Created At:">
            <span className="font-semibold">{fmtDate(r.createdAt)}</span>
          </Row>
          <Row label="Updated At:">
            <span className="font-semibold">{fmtDate(r.updatedAt)}</span>
          </Row>
          <Row label="Auto Approved At:">
            <span className="font-semibold">{fmtDate(r.autoApprovedAt)}</span>
          </Row>

          {/* ────────── QR ────────── */}
          {r.qrCode ? (
            <Row label="QR Code:">
              <img
                src={dataUrlFromBase64(r.qrCode)}
                alt="Float payment QR"
                className="h-28 w-28 rounded-lg border border-[rgb(var(--app-border))] bg-white/5 object-contain p-1"
              />
            </Row>
          ) : null}
        </div>
      )}
    </Sheet>
  );
}
