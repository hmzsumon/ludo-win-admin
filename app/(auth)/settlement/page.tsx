"use client";

/* ─────────────────────────────────────────────────────────────
 * Admin Settlement Center
 * - Float Requests (topup/return) approve/reject
 * - Commission settlement (cash/balance)
 * - CompanyDue cash settlement (receive/pay)
 * - txnId required for idempotency
 * ──────────────────────────────────────────────────────────── */

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* NOTE:
   নিচের hooks গুলো আপনাকে RTK query তে add করতে হবে (C section এ দেয়া আছে)
*/
import {
  useAdminApproveFloatRequestMutation,
  useAdminGetFloatRequestsQuery,
  useAdminRejectFloatRequestMutation,
  useAdminSettleAgentCommissionMutation,
  useAdminSettleCompanyDueMutation,
} from "@/redux/features/admin/adminSettlementApi";

export default function AdminSettlementCenterPage() {
  /* ────────── Float Requests ────────── */
  const {
    data: frRes,
    isLoading: frLoading,
    refetch,
  } = useAdminGetFloatRequestsQuery({
    status: "pending",
  });

  const floatRequests = frRes?.data || [];

  const [approveFloatRequest] = useAdminApproveFloatRequestMutation();
  const [rejectFloatRequest] = useAdminRejectFloatRequestMutation();

  /* ────────── Commission Settlement Form ────────── */
  const [agentId, setAgentId] = useState("");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [commissionPayout, setCommissionPayout] = useState<"cash" | "balance">(
    "cash",
  );
  const [commissionTxnId, setCommissionTxnId] = useState("");

  const [settleCommission, { isLoading: settlingCommission }] =
    useAdminSettleAgentCommissionMutation();

  /* ────────── CompanyDue Settlement Form ────────── */
  const [dueAgentId, setDueAgentId] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [dueAction, setDueAction] = useState<
    "receive_from_agent" | "pay_to_agent"
  >("receive_from_agent");
  const [dueTxnId, setDueTxnId] = useState("");

  const [settleCompanyDue, { isLoading: settlingDue }] =
    useAdminSettleCompanyDueMutation();

  const pendingCount = useMemo(() => floatRequests.length, [floatRequests]);

  /* ────────── Float approve/reject handlers ────────── */
  const handleApprove = async (id: string) => {
    try {
      await approveFloatRequest({ id, adminNote: "" }).unwrap();
      toast.success("Approved");
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Approve failed");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectFloatRequest({ id, adminNote: "" }).unwrap();
      toast.success("Rejected");
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Reject failed");
    }
  };

  /* ────────── Commission settlement submit ────────── */
  const submitCommission = async () => {
    if (!agentId) return toast.error("AgentId required");
    const amt = Number(commissionAmount || 0);
    if (!amt || amt <= 0) return toast.error("Invalid amount");
    if (!commissionTxnId) return toast.error("txnId required");

    try {
      await settleCommission({
        agentId,
        amount: amt,
        payoutMethod: commissionPayout,
        txnId: commissionTxnId,
        note: "",
      }).unwrap();

      toast.success("Commission settled");
      setCommissionAmount("");
      setCommissionTxnId("");
    } catch (e: any) {
      toast.error(e?.data?.message || "Settlement failed");
    }
  };

  /* ────────── CompanyDue settlement submit ────────── */
  const submitDue = async () => {
    if (!dueAgentId) return toast.error("AgentId required");
    const amt = Number(dueAmount || 0);
    if (!amt || amt <= 0) return toast.error("Invalid amount");
    if (!dueTxnId) return toast.error("txnId required");

    try {
      await settleCompanyDue({
        agentId: dueAgentId,
        amount: amt,
        action: dueAction,
        txnId: dueTxnId,
        note: "",
      }).unwrap();

      toast.success("CompanyDue settled");
      setDueAmount("");
      setDueTxnId("");
    } catch (e: any) {
      toast.error(e?.data?.message || "Settlement failed");
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Settlement Center
          </h1>
          <p className="text-sm text-[rgb(var(--app-text-muted))]">
            Manage agent float requests, commission settlement, and company due
            cash settlement.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Left */}
          <div className="lg:col-span-7 space-y-4">
            {/* Float requests */}
            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[rgb(var(--app-text))]">
                  Float Requests (Pending){" "}
                  <span className="text-xs text-[rgb(var(--app-text-muted))]">
                    ({pendingCount})
                  </span>
                </CardTitle>

                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => refetch()}
                >
                  Refresh
                </Button>
              </CardHeader>

              <CardContent>
                {frLoading ? (
                  <div className="text-sm text-[rgb(var(--app-text-muted))]">Loading...</div>
                ) : floatRequests.length === 0 ? (
                  <div className="text-sm text-[rgb(var(--app-text-muted))]">
                    No pending requests
                  </div>
                ) : (
                  <div className="space-y-3">
                    {floatRequests.map((r: any) => (
                      <div
                        key={r._id}
                        className="rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/40 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[rgb(var(--app-text))]">
                              {r.type?.toUpperCase()} — {r.amount}
                            </p>
                            <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                              Agent: {r.agentId} • txnId: {r.txnId}
                            </p>
                            {r.agentNote ? (
                              <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                                Note: {r.agentNote}
                              </p>
                            ) : null}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              className="rounded-2xl"
                              onClick={() => handleApprove(r._id)}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="secondary"
                              className="rounded-2xl"
                              onClick={() => handleReject(r._id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Company due settlement */}
            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base text-[rgb(var(--app-text))]">
                  Company Due Cash Settlement
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/40 p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">Agent ID</p>
                      <input
                        value={dueAgentId}
                        onChange={(e) => setDueAgentId(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                        placeholder="agentId"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">Amount</p>
                      <input
                        value={dueAmount}
                        onChange={(e) => setDueAmount(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                        placeholder="e.g. 5000"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">Action</p>
                      <select
                        value={dueAction}
                        onChange={(e) => setDueAction(e.target.value as any)}
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                      >
                        <option value="receive_from_agent">
                          Receive cash from agent (agent owes company)
                        </option>
                        <option value="pay_to_agent">
                          Pay cash to agent (company owes agent)
                        </option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">txnId</p>
                      <input
                        value={dueTxnId}
                        onChange={(e) => setDueTxnId(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                        placeholder="unique id"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      className="rounded-2xl"
                      onClick={submitDue}
                      disabled={settlingDue}
                    >
                      {settlingDue ? "Processing..." : "Settle Cash"}
                    </Button>
                  </div>

                  <p className="mt-3 text-xs text-[rgb(var(--app-text-muted))]">
                    Rule: receive_from_agent only allowed if companyDueBalance
                    &gt; 0, pay_to_agent only allowed if companyDueBalance &lt;
                    0.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right */}
          <div className="lg:col-span-5 space-y-4">
            {/* Commission settlement */}
            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base text-[rgb(var(--app-text))]">
                  Commission Settlement
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/40 p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">Agent ID</p>
                      <input
                        value={agentId}
                        onChange={(e) => setAgentId(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                        placeholder="agentId"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">Amount</p>
                      <input
                        value={commissionAmount}
                        onChange={(e) => setCommissionAmount(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                        placeholder="e.g. 1200"
                      />
                    </div>

                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">Payout Method</p>
                      <select
                        value={commissionPayout}
                        onChange={(e) =>
                          setCommissionPayout(e.target.value as any)
                        }
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                      >
                        <option value="cash">Cash</option>
                        <option value="balance">Add to Balance</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">txnId</p>
                      <input
                        value={commissionTxnId}
                        onChange={(e) => setCommissionTxnId(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                        placeholder="unique id"
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      className="rounded-2xl"
                      onClick={submitCommission}
                      disabled={settlingCommission}
                    >
                      {settlingCommission
                        ? "Processing..."
                        : "Settle Commission"}
                    </Button>
                  </div>

                  <Separator className="my-4 bg-[rgb(var(--app-surface-3))]/80" />

                  <p className="text-xs text-[rgb(var(--app-text-muted))]">
                    Cash: pending decreases, wallet unchanged. <br />
                    Balance: pending decreases, wallet.available increases.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base text-[rgb(var(--app-text))]">Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[rgb(var(--app-text-muted))] space-y-2">
                <p>• Float Requests control agent float (ggrBalance).</p>
                <p>• CompanyDue settlement is always cash (agent ↔ company).</p>
                <p>• All actions are recorded in AgentLedger for reports.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
