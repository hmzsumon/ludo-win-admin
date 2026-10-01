// /app/(auth)/withdrawals/[withdrawId]/page.tsx
"use client";

/* ────────── imports ────────── */
import { withdrawCurrency, withdrawAmount, withdrawNet, withdrawMethod, formatWithdrawMoney } from "@/lib/withdrawDisplay";
import CopyToClipboard from "@/lib/CopyToClipboard";
import {
  useAdminApproveWithdrawMutation,
  useGetSingleWithdrawRequestQuery,
  useRejectWithdrawMutation,
} from "@/redux/features/withdraw/withdrawApi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { toast } from "react-toastify";

import Badge from "@/components/new-ui/Badge";
import Button from "@/components/new-ui/Button";
import Card from "@/components/new-ui/Card";
import { Row } from "@/components/new-ui/DetailsList";

/* ⬇️ শোন: shadcn/ui sheet থেকে named import লাগবে */
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/* ────────── helpers ────────── */
const timestamp = (value?: string) => value ? new Date(value).toLocaleString("en-GB", { timeZone: "Asia/Dhaka", dateStyle: "medium", timeStyle: "medium" }) + " (Dhaka)" : "Not recorded";

export default function SingleWithdraw({
  params,
}: {
  params: { withdrawId: string };
}) {
  const router = useRouter();
  const { withdrawId } = params;

  /* ────────── query ────────── */
  const { data } = useGetSingleWithdrawRequestQuery(withdrawId);
  const withdraw = data?.withdraw;

  const {
    amount,
    netAmount,
    charge,
    customerId,
    name,
    phone,
    status,
    userId,
    _id,
    method,
    createdAt,

    netWorkAddress,
    netWork,
  } = withdraw ?? {};

  const currency = withdrawCurrency(withdraw || {});
  const payout = withdrawAmount(withdraw || {});
  const netPayout = withdrawNet(withdraw || {});
  const destination = method?.accountNumber || netWorkAddress || "";
  const crypto = currency !== "BDT";
  const mobileWallet = ["bkash", "nagad", "rocket"].includes(String(method?.name || "").toLowerCase());
  const fmt = (value: number) => formatWithdrawMoney(value, currency);
  /* ────────── mutations ────────── */
  const [
    adminApproveWithdraw,
    {
      isLoading: a_isLoading,
      isSuccess: a_isSuccess,
      isError: a_isError,
      error: a_error,
    },
  ] = useAdminApproveWithdrawMutation();

  const [
    rejectWithdraw,
    {
      isSuccess: r_isSuccess,
      isError: r_isError,
      error: r_error,
      isLoading: r_isLoading,
    },
  ] = useRejectWithdrawMutation();

  /* ────────── local state ────────── */
  const [txnId, setTxnId] = useState("");
  const [reason, setReason] = useState("Transaction Id not matching");
  const [openApprove, setOpenApprove] = useState(false);
  const [openReject, setOpenReject] = useState(false);

  /* ────────── handlers ────────── */
  const handleApprove = async () => adminApproveWithdraw({ id: withdraw?.id || _id, txnId: txnId.trim() || undefined });
  const handleReject = async () => rejectWithdraw({ id: withdraw?.id || _id, reason });

  /* ────────── effects ────────── */
  useEffect(() => {
    if (a_isSuccess) {
      setOpenApprove(false);
      toast.success("Withdraw approved successfully");
      router.push("/withdrawals/all");
    }
    if (a_isError && a_error) toast.error((a_error as any).data?.message);
  }, [a_isSuccess, a_isError]);

  useEffect(() => {
    if (r_isSuccess) {
      setOpenReject(false);
      toast.success("Withdraw rejected successfully");
      router.push("/withdrawals/all");
    }
    if (r_isError && r_error) toast.error((r_error as any).data?.message);
  }, [r_isSuccess, r_isError]);

  /* ────────── UI ────────── */
  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-5xl px-2 py-4 sm:p-6">
        <Card className="px-4 overflow-hidden">
          {/* ────────── header ────────── */}
          <div className="border-b border-[rgb(var(--app-border))] p-6 text-center">
            <h2 className="text-xl font-semibold">
              <span
                className={`mr-2 ${
                  status === "pending"
                    ? "text-[#FF6A1A]"
                    : status === "approved"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {status ? status.charAt(0).toUpperCase() + status.slice(1) : ""}
              </span>
              <span className="text-[rgb(var(--app-text-muted))]">Withdraw Details</span>
            </h2>
          </div>

          {/* ────────── content ────────── */}
          <div className="px-2 py-4">
            <div className="rounded-lg border border-[rgb(var(--app-border))]">
              <div className="grid border border-[rgb(var(--app-border))] grid-cols-2 gap-2 ">
                <div className="border-r border-[rgb(var(--app-border))]">
                  <Row label="User name:">
                    <span className="font-semibold">{name || "-"}</span>
                  </Row>
                </div>
                <div>
                  <Row label="User Id:">
                    <span className="flex items-center gap-2 font-semibold">
                      {customerId || "-"}
                      {userId && (
                        <Link
                          href={`/users/${userId}`}
                          className="text-[#21D3B3]"
                          title="Open profile"
                        >
                          <FaArrowUpRightFromSquare />
                        </Link>
                      )}
                    </span>
                  </Row>
                </div>
              </div>

              <div className="grid border border-[rgb(var(--app-border))]   grid-cols-2 gap-2 ">
                <div className="border-r border-[rgb(var(--app-border))]">
                  <Row label="Phone:">
                    <span className="font-semibold">{phone || "-"}</span>
                  </Row>
                </div>
                <div>
                  <Row label="Amount:">
                    <span className="font-semibold">{fmt(payout)}</span>
                  </Row>
                </div>
              </div>

              <div className="grid border border-[rgb(var(--app-border))]   grid-cols-2 gap-2 ">
                <div className="border-r border-[rgb(var(--app-border))]">
                  <Row label="Net Amount:">
                    <span className="flex items-center gap-2 font-semibold text-emerald-400">
                      {fmt(netPayout)}
                      {netAmount !== undefined && (
                        <CopyToClipboard text={String(netPayout)} />
                      )}
                    </span>
                  </Row>
                </div>
                <div>
                  <Row label="Charge:">
                    <span className="font-semibold">{fmt(Math.max(0, payout - netPayout))}</span>
                  </Row>
                </div>
              </div>

              <Row label="Payment method:">
                <span className="font-semibold">{withdrawMethod(withdraw || {})}</span>
              </Row>
              {crypto && <Row label="Network:"><span className="font-semibold">{method?.name === "crypto" ? "TRC-20" : method?.name === "binance" ? "Binance Pay" : netWork || "Not recorded"}</span></Row>}
              <Row label={crypto ? method?.name === "binance" ? "Binance Pay ID / UID:" : "Wallet address:" : "Account number:"}>
                <span className="flex min-w-0 items-center gap-2 break-all font-semibold">
                  {destination || "Not recorded"}

                  {destination && <CopyToClipboard text={destination} />}
                </span>
              </Row>

              <Row label="Requested at:">
                <span className="font-semibold">
                  {timestamp(createdAt)}
                </span>
              </Row>

              <Row label="Status:">
                {status ? (
                  <Badge status={status} />
                ) : (
                  <span className="text-[rgb(var(--app-text-muted))]">-</span>
                )}
              </Row>
            </div>

            <Row label="Payout currency:"><span>{currency}</span></Row>
            <Row label="Assigned agent:"><span>{withdraw?.assignedAgent?.name || withdraw?.assignedAgentName || withdraw?.assignedAgentId || (crypto ? "Admin processing" : "Not recorded")}</span></Row>
            {withdraw?.txnId && <Row label="Transaction ID:"><span>{withdraw.txnId}</span></Row>}
            <Row label="Withdrawal ID:"><span>{withdraw?.id || _id || "Not recorded"}</span></Row>
            <Row label="Withdrawal code:"><span>{withdraw?.withdrawCode || "Not recorded"}</span></Row>
            <Row label="Requested diamonds:"><span>💎 {Number(withdraw?.diamonds_requested || amount || 0).toFixed(2)}</span></Row>
            <Row label="Fee diamonds:"><span>💎 {Number(withdraw?.fee_diamonds ?? charge ?? 0).toFixed(2)}</span></Row>
            <Row label="Net diamonds:"><span>💎 {Number(withdraw?.diamonds_requested ? withdraw.net_diamonds : withdraw?.net_diamonds || amount || 0).toFixed(2)}</span></Row>
            <Row label="Fee (%):"><span>{withdraw?.fee_percent ?? 0}%</span></Row>
            <Row label="User email:"><span>{withdraw?.email || "Not recorded"}</span></Row>
            <Row label="Exchange rate:"><span>{withdraw?.exchange_rate ?? "Not recorded"}</span></Row>
            <Row label="Assigned agent type:"><span>{withdraw?.assignedAgentType || "Not recorded"}</span></Row>
            <Row label="Assigned agent ID:"><span>{withdraw?.assignedAgent?.customerId || withdraw?.assignedAgentId || "Not recorded"}</span></Row>
            <Row label="Processed by:"><span>{withdraw?.processedBy?.name || withdraw?.processedById || "Not recorded"} {withdraw?.processedByRole && "(" + withdraw.processedByRole + ")"}</span></Row>
            <Row label="Processor ID:"><span>{withdraw?.processedBy?.customerId || withdraw?.processedById || "Not recorded"}</span></Row>
            <Row label="Approved at:"><span>{timestamp(withdraw?.approvedAt)}</span></Row>
            <Row label="Processed at:"><span>{timestamp(withdraw?.processedAt)}</span></Row>
            {status === "rejected" && <Row label="Rejected at:"><span>{timestamp(withdraw?.processedAt)}</span></Row>}
            {withdraw?.cancelledAt && <Row label="Cancelled at:"><span>{timestamp(withdraw.cancelledAt)}</span></Row>}
            <Row label="Last updated:"><span>{timestamp(withdraw?.updatedAt)}</span></Row>
            {withdraw?.agentNumber && <Row label="Agent payout number:"><span>{withdraw.agentNumber}</span></Row>}
            {status === "rejected" && <Row label="Rejection reason:"><span>{withdraw?.rejected_reason || "Not recorded"}</span></Row>}
            {withdraw?.note && <Row label="Note:"><span>{withdraw.note}</span></Row>}
            {/* ────────── actions ────────── */}
            {status === "pending" && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {!mobileWallet && <Button variant="primary" onClick={() => setOpenApprove(true)}>Approve</Button>}
                {mobileWallet && <p className="text-sm text-[rgb(var(--app-text-muted))]">Approval is handled by the assigned agent.</p>}
                <Button variant="warning" onClick={() => setOpenReject(true)}>
                  Reject
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ────────── Approve Drawer ────────── */}
      <Sheet open={openApprove} onOpenChange={setOpenApprove}>
        <SheetContent
          side="bottom"
          className="w-full max-w-2xl mx-auto rounded-t-2xl"
        >
          <SheetHeader>
            <SheetTitle>Approve Withdraw</SheetTitle>
            <SheetDescription>
              Confirm to approve this request.
            </SheetDescription>
          </SheetHeader>

          <p className="mt-2 text-sm text-[rgb(var(--app-text-soft))]">
            Confirm payment of{" "}
            <span className="text-[rgb(var(--app-text))]">{fmt(netPayout)} {currency}</span>?
          </p>

          <label className="mt-4 block text-sm">Payment transaction ID / reference<input className="mt-2 w-full rounded-lg border border-[rgb(var(--app-border))] bg-transparent p-3" value={txnId} onChange={event => setTxnId(event.target.value)} placeholder="Payment reference" /></label>
          <SheetFooter className="mt-4">
            <button
              onClick={() => setOpenApprove(false)}
              className="rounded-lg px-4 py-2 bg-[rgb(var(--app-surface-2))]/70 text-[rgb(var(--app-text))] hover:bg-[rgb(var(--app-surface-3))]/80"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={a_isLoading}
              className="rounded-lg px-4 py-2 bg-[#21D3B3] text-[#0B0D12] hover:bg-[#1EC6A7] disabled:opacity-50"
            >
              {a_isLoading ? "Approving..." : "Confirm Approve"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* ────────── Reject Drawer ────────── */}
      <Sheet open={openReject} onOpenChange={setOpenReject}>
        <SheetContent
          side="bottom"
          className="w-full max-w-2xl mx-auto rounded-t-2xl"
        >
          <SheetHeader>
            <SheetTitle>Reject Withdraw</SheetTitle>
            <SheetDescription>
              Provide a short reason and confirm.
            </SheetDescription>
          </SheetHeader>

          {r_isLoading ? (
            <div className="flex items-center justify-center py-6">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-r-transparent" />
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <label className="text-sm text-[rgb(var(--app-text-soft))]">Reason</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/10"
                placeholder="Write a short reason…"
              />
              <p className="text-xs text-[rgb(var(--app-text-muted))]">
                This note will be stored with the rejection.
              </p>
            </div>
          )}

          <SheetFooter className="mt-4">
            <button
              onClick={() => setOpenReject(false)}
              className="rounded-lg px-4 py-2 bg-[rgb(var(--app-surface-2))]/70 text-[rgb(var(--app-text))] hover:bg-[rgb(var(--app-surface-3))]/80"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={r_isLoading}
              className="rounded-lg px-4 py-2 bg-[#FF6A1A] text-[rgb(var(--app-text))] hover:bg-[#ff7d38] disabled:opacity-50"
            >
              {r_isLoading ? "Rejecting..." : "Reject"}
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </main>
  );
}
