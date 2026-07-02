"use client";

/* ─────────────────────────────────────────────────────────────
 * Admin Settlement Center
 * - Agent ID দিয়ে আগে preview দেখা হবে
 * - Preview confirm হওয়ার পরে commission settle করা যাবে
 * - Float Request + Company Due section এই page থেকে remove করা হয়েছে
 * ──────────────────────────────────────────────────────────── */

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  useAdminGetSettlementAgentsQuery,
  useAdminSettleAgentCommissionMutation,
  useLazyAdminGetSettlementAgentPreviewQuery,
  useLazyAdminSearchAgentsQuery,
} from "@/redux/features/admin/adminSettlementApi";

const money = (value: any) =>
  Number(value || 0).toLocaleString("en-BD", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export default function AdminSettlementCenterPage() {
  /* ────────── Commission settlement form ────────── */
  const [agentIdInput, setAgentIdInput] = useState("");
  const [resolvedAgentId, setResolvedAgentId] = useState("");
  const [commissionAmount, setCommissionAmount] = useState("");
  const [commissionPayout, setCommissionPayout] = useState<"cash" | "balance">(
    "balance",
  );
  const [commissionTxnId, setCommissionTxnId] = useState("");
  const [adminNote, setAdminNote] = useState("");

  const {
    data: agentsRes,
    isLoading: agentsLoading,
    isFetching: agentsFetching,
  } = useAdminGetSettlementAgentsQuery();

  const [loadAgentPreview, { data: previewRes, isFetching: previewLoading }] =
    useLazyAdminGetSettlementAgentPreviewQuery();
  const [searchAgents, { isFetching: searchingAgent }] =
    useLazyAdminSearchAgentsQuery();

  const [settleCommission, { isLoading: settlingCommission }] =
    useAdminSettleAgentCommissionMutation();

  const agents = useMemo(() => agentsRes?.data || [], [agentsRes]);
  const preview = resolvedAgentId ? previewRes?.data || null : null;
  const agent = preview?.agent || null;
  const statusDoc = preview?.statusDoc || null;
  const walletDoc = preview?.walletDoc || null;

  const pendingTotal = Number(walletDoc?.pendingTotal || 0);
  const settleAmount = Number(commissionAmount || 0);

  /* ────────── Pending bucket normalize ──────────
   * কোনো পুরোনো data inconsistency থাকলে pendingTotal <= 0 হলে
   * pendingDeposit/pendingWithdraw UI তেও 0 দেখানো হবে।
   * ───────────────────────────────────────────── */
  const showPendingDeposit =
    pendingTotal > 0 ? Number(walletDoc?.pendingDeposit || 0) : 0;
  const showPendingWithdraw =
    pendingTotal > 0 ? Number(walletDoc?.pendingWithdraw || 0) : 0;

  const previewCards = useMemo(
    () => [
      {
        label: "Pending Total",
        value: money(pendingTotal),
      },
      {
        label: "Pending Deposit",
        value: money(showPendingDeposit),
      },
      {
        label: "Pending Withdraw",
        value: money(showPendingWithdraw),
      },
      {
        label: "Rolling Balance",
        value: money(statusDoc?.rollingBalance),
      },
    ],
    [pendingTotal, showPendingDeposit, showPendingWithdraw, statusDoc],
  );

  /* ────────── Dropdown থেকে agent select করলে auto preview ────────── */
  const handleSelectAgent = async (id: string) => {
    setAgentIdInput(id);
    setResolvedAgentId("");
    setCommissionAmount("");
    setCommissionTxnId("");
    setAdminNote("");
    setCommissionPayout("balance");

    if (!id) return;

    try {
      const res = await loadAgentPreview({ agentId: id }).unwrap();
      setResolvedAgentId(res?.data?.agent?._id || id);
      toast.success("Agent preview loaded");
    } catch (e: any) {
      setResolvedAgentId("");
      toast.error(e?.data?.message || "Agent preview failed");
    }
  };

  /* ────────── Agent preview handler ────────── */
  const handlePreviewAgent = async () => {
    const q = agentIdInput.trim();
    if (!q) return toast.error("Agent ID লিখুন");

    try {
      /*
       * প্রথমে direct MongoDB _id ধরে preview করা হচ্ছে।
       * যদি admin customerId/name দেয়, তাহলে search করে exact/first agent নিয়ে preview করা হবে।
       */
      try {
        const direct = await loadAgentPreview({ agentId: q }).unwrap();
        const directId = direct?.data?.agent?._id;
        setResolvedAgentId(directId || q);
        toast.success("Agent preview loaded");
        return;
      } catch {
        const search = await searchAgents({ q }).unwrap();
        const found =
          search?.data?.find((a: any) => String(a?.customerId || "") === q) ||
          search?.data?.[0];

        if (!found?._id) {
          setResolvedAgentId("");
          return toast.error("এই Agent ID দিয়ে agent পাওয়া যায়নি");
        }

        const next = await loadAgentPreview({ agentId: found._id }).unwrap();
        setResolvedAgentId(next?.data?.agent?._id || found._id);
        toast.success("Agent preview loaded");
      }
    } catch (e: any) {
      setResolvedAgentId("");
      toast.error(e?.data?.message || "Agent preview failed");
    }
  };

  /* ────────── Commission settlement submit ────────── */
  const submitCommission = async () => {
    if (!resolvedAgentId || !agent) {
      return toast.error("আগে Agent Preview দেখুন");
    }

    if (!settleAmount || settleAmount <= 0) {
      return toast.error("Invalid amount");
    }

    if (settleAmount > pendingTotal) {
      return toast.error("Amount pending commission থেকে বেশি হতে পারবে না");
    }

    if (commissionPayout === "cash" && !commissionTxnId.trim()) {
      return toast.error("Cash Paid হলে txnId required");
    }

    if (commissionPayout === "cash" && !adminNote.trim()) {
      return toast.error("Cash Paid হলে Admin Note required");
    }

    try {
      await settleCommission({
        agentId: resolvedAgentId,
        amount: settleAmount,
        payoutMethod: commissionPayout,
        txnId: commissionPayout === "cash" ? commissionTxnId.trim() : undefined,
        note: commissionPayout === "cash" ? adminNote.trim() : undefined,
      }).unwrap();

      toast.success(
        commissionPayout === "balance"
          ? "Commission added to rolling balance"
          : "Commission cash paid successfully",
      );
      setCommissionAmount("");
      setCommissionTxnId("");
      setAdminNote("");
      await loadAgentPreview({ agentId: resolvedAgentId }).unwrap();
    } catch (e: any) {
      toast.error(e?.data?.message || "Settlement failed");
    }
  };

  const canSettle = !!agent && !!resolvedAgentId && pendingTotal > 0;

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Settlement Center
          </h1>
          <p className="text-sm text-[rgb(var(--app-text-muted))]">
            Agent ID দিয়ে আগে agent preview দেখুন, pending commission check
            করুন, তারপর settle করুন।
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-4">
            {/* ────────── Agent preview ────────── */}
            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base text-[rgb(var(--app-text))]">
                  Agent Preview
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/40 p-4">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {/* ────────── Agent list dropdown ────────── */}
                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">
                        Agent List থেকে select করুন
                      </p>
                      <select
                        value={agent?._id || ""}
                        onChange={(e) => handleSelectAgent(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-[#020617] px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={
                          agentsLoading || agentsFetching || previewLoading
                        }
                      >
                        <option value="" className="bg-[#020617] text-white">
                          {agentsLoading || agentsFetching
                            ? "Loading agents..."
                            : "-- Agent Select করুন --"}
                        </option>
                        {agents.map((item: any) => (
                          <option
                            key={item?._id}
                            value={item?._id}
                            className="bg-[#020617] text-white"
                          >
                            {item?.name || "Unknown"} • ID:{" "}
                            {item?.customerId || "N/A"} •{" "}
                            {item?.email || item?.phone || "No contact"}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-[11px] text-[rgb(var(--app-text-muted))]">
                        Dropdown থেকে select করলেই auto preview দেখাবে।
                      </p>
                    </div>

                    {/* ────────── Manual ID search option ────────── */}
                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">
                        অথবা Agent ID / Customer ID / Name দিয়ে খুঁজুন
                      </p>
                      <div className="mt-2 flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
                        <input
                          value={agentIdInput}
                          onChange={(e) => {
                            setAgentIdInput(e.target.value);
                            setResolvedAgentId("");
                          }}
                          className="w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                          placeholder="agent _id / customerId / name"
                        />
                        <Button
                          className="rounded-2xl whitespace-nowrap"
                          onClick={handlePreviewAgent}
                          disabled={previewLoading || searchingAgent}
                        >
                          {previewLoading || searchingAgent
                            ? "Loading..."
                            : "Preview"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {agent ? (
                  <div className="space-y-4 rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/40 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-[rgb(var(--app-text))]">
                          {agent?.name || "Unknown Agent"}
                        </h2>
                        <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                          Customer ID: {agent?.customerId || "N/A"} • Mongo ID:{" "}
                          {agent?._id}
                        </p>
                        <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                          Phone: {agent?.phone || "N/A"} • Email:{" "}
                          {agent?.email || "N/A"}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          agent?.is_active
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {agent?.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {previewCards.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-1))]/50 p-3"
                        >
                          <p className="text-xs text-[rgb(var(--app-text-muted))]">
                            {item.label}
                          </p>
                          <p className="mt-1 text-lg font-semibold text-[rgb(var(--app-text))]">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {pendingTotal <= 0 ? (
                      <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                        এই agent-এর কোনো pending commission নেই। তাই এখন settle
                        করার মতো amount নেই।
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-[rgb(var(--app-border))] p-6 text-center text-sm text-[rgb(var(--app-text-muted))]">
                    Agent list থেকে select করলে অথবা Agent ID দিয়ে preview করলে
                    এখানে agent-এর wallet, pending commission এবং rolling
                    balance দেখা যাবে।
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-4">
            {/* ────────── Commission settlement ────────── */}
            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base text-[rgb(var(--app-text))]">
                  Commission Settlement
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/40 p-4">
                  <div className="mb-3 rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-1))]/50 p-3 text-xs text-[rgb(var(--app-text-muted))]">
                    Selected Agent:{" "}
                    {agent
                      ? `${agent.name} (${agent.customerId})`
                      : "Preview করা হয়নি"}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">
                        Amount
                      </p>
                      <input
                        value={commissionAmount}
                        onChange={(e) => setCommissionAmount(e.target.value)}
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        placeholder="e.g. 1200"
                        disabled={!canSettle}
                      />
                    </div>

                    <div>
                      <p className="text-xs text-[rgb(var(--app-text-muted))]">
                        Payout Method
                      </p>
                      <select
                        value={commissionPayout}
                        onChange={(e) =>
                          setCommissionPayout(
                            e.target.value as "cash" | "balance",
                          )
                        }
                        className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-[#020617] px-3 py-2 text-sm text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={!canSettle}
                      >
                        <option
                          value="balance"
                          className="bg-[#020617] text-white"
                        >
                          Add to Rolling Balance
                        </option>
                        <option
                          value="cash"
                          className="bg-[#020617] text-white"
                        >
                          Cash Paid
                        </option>
                      </select>
                    </div>

                    {commissionPayout === "cash" ? (
                      <>
                        <div className="sm:col-span-2">
                          <p className="text-xs text-[rgb(var(--app-text-muted))]">
                            txnId
                          </p>
                          <input
                            value={commissionTxnId}
                            onChange={(e) => setCommissionTxnId(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            placeholder="cash payment transaction id"
                            disabled={!canSettle}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-xs text-[rgb(var(--app-text-muted))]">
                            Admin Note
                          </p>
                          <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            className="mt-1 min-h-20 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                            placeholder="cash paid note লিখুন"
                            disabled={!canSettle}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>

                  {agent && settleAmount > pendingTotal ? (
                    <p className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                      Amount pending commission ({money(pendingTotal)}) থেকে
                      বেশি।
                    </p>
                  ) : null}

                  <div className="mt-3 flex gap-2">
                    <Button
                      className="rounded-2xl"
                      onClick={submitCommission}
                      disabled={!canSettle || settlingCommission}
                    >
                      {settlingCommission
                        ? "Processing..."
                        : commissionPayout === "balance"
                          ? "Add to Rolling Balance"
                          : "Settle Cash Paid"}
                    </Button>
                  </div>

                  <Separator className="my-4 bg-[rgb(var(--app-surface-3))]/80" />

                  <p className="text-xs text-[rgb(var(--app-text-muted))]">
                    Default: Add to Rolling Balance — pending commission কমবে
                    এবং agent-এর rolling balance বাড়বে।
                    <br />
                    Cash Paid: admin বাইরে cash payment করলে pending commission
                    কমবে; txnId এবং note required।
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base text-[rgb(var(--app-text))]">
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-[rgb(var(--app-text-muted))]">
                <p>• আগে Preview না করলে settlement button কাজ করবে না।</p>
                <p>
                  • Amount কখনো pending commission থেকে বেশি settle করা যাবে না।
                </p>
                <p>
                  • Balance settlement হলে AgentLedger record, rolling balance
                  update এবং agent notification তৈরি হবে।
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
