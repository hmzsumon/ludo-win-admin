"use client";

/* ─────────────────────────────────────────────────────────────
 * Admin Float Requests UI
 * - Filter pending/approved/rejected + topup/return
 * - Approve/Reject with admin note
 * ──────────────────────────────────────────────────────────── */

import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  useAdminApproveFloatRequestMutation,
  useAdminGetFloatRequestsQuery,
  useAdminRejectFloatRequestMutation,
} from "@/redux/features/admin/adminSettlementApi";

export default function AdminFloatRequestsPage() {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );
  const [type, setType] = useState<"" | "topup" | "return">("");

  const {
    data: res,
    isLoading,
    refetch,
  } = useAdminGetFloatRequestsQuery({ status, type });

  const list = res?.data || [];

  const [approve, { isLoading: approving }] =
    useAdminApproveFloatRequestMutation();
  const [reject, { isLoading: rejecting }] =
    useAdminRejectFloatRequestMutation();

  const busy = approving || rejecting;

  const count = useMemo(() => list.length, [list]);

  /* ────────── approve / reject ────────── */
  const handleApprove = async (id: string) => {
    const adminNote = prompt("Admin note (optional)") || "";
    try {
      await approve({ id, adminNote }).unwrap();
      toast.success("Approved");
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Approve failed");
    }
  };

  const handleReject = async (id: string) => {
    const adminNote = prompt("Admin note (optional)") || "";
    try {
      await reject({ id, adminNote }).unwrap();
      toast.success("Rejected");
      refetch();
    } catch (e: any) {
      toast.error(e?.data?.message || "Reject failed");
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Float Requests
          </h1>
          <p className="text-sm text-[rgb(var(--app-text-muted))]">
            Approve/Reject agent topup/return requests.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Filters */}
          <div className="lg:col-span-4">
            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base text-[rgb(var(--app-text))]">
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/40 p-4 space-y-3">
                  <div>
                    <p className="text-xs text-[rgb(var(--app-text-muted))]">Status</p>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <p className="text-xs text-[rgb(var(--app-text-muted))]">Type</p>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="mt-1 w-full rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/60 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
                    >
                      <option value="">All</option>
                      <option value="topup">Topup</option>
                      <option value="return">Return</option>
                    </select>
                  </div>

                  <Button
                    variant="secondary"
                    className="w-full rounded-2xl"
                    onClick={() => refetch()}
                  >
                    Refresh
                  </Button>

                  <div className="text-xs text-[rgb(var(--app-text-muted))]">
                    Showing: <span className="text-[rgb(var(--app-text-soft))]">{count}</span>{" "}
                    requests
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* List */}
          <div className="lg:col-span-8">
            <Card className="rounded-2xl border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base text-[rgb(var(--app-text))]">
                  Requests
                </CardTitle>
                <Button
                  variant="secondary"
                  className="rounded-2xl"
                  onClick={() => refetch()}
                  disabled={busy}
                >
                  Refresh
                </Button>
              </CardHeader>

              <CardContent>
                {isLoading ? (
                  <div className="text-sm text-[rgb(var(--app-text-muted))]">Loading...</div>
                ) : list.length === 0 ? (
                  <div className="text-sm text-[rgb(var(--app-text-muted))]">No requests</div>
                ) : (
                  <div className="space-y-3">
                    {list.map((r: any) => (
                      <div
                        key={r._id}
                        className="rounded-2xl border border-[rgb(var(--app-border))] bg-transparent/40 p-4"
                      >
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[rgb(var(--app-text))]">
                              {String(r.type || "").toUpperCase()} • {r.amount}
                            </p>
                            <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                              Status:{" "}
                              <span className="text-[rgb(var(--app-text-soft))]">{r.status}</span>{" "}
                              • txnId:{" "}
                              <span className="text-[rgb(var(--app-text-soft))]">{r.txnId}</span>
                            </p>
                            <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                              Agent:{" "}
                              <span className="text-[rgb(var(--app-text-soft))]">{r.agentId}</span>
                            </p>
                            {r.agentNote ? (
                              <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                                Agent note: {r.agentNote}
                              </p>
                            ) : null}
                          </div>

                          {status === "pending" ? (
                            <div className="flex gap-2">
                              <Button
                                className="rounded-2xl"
                                onClick={() => handleApprove(r._id)}
                                disabled={busy}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="secondary"
                                className="rounded-2xl"
                                onClick={() => handleReject(r._id)}
                                disabled={busy}
                              >
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <div className="text-xs text-[rgb(var(--app-text-muted))]">
                              {r.updatedAt
                                ? new Date(r.updatedAt).toLocaleString()
                                : ""}
                            </div>
                          )}
                        </div>

                        <Separator className="my-3 bg-[rgb(var(--app-surface-3))]/80" />

                        <div className="text-xs text-[rgb(var(--app-text-muted))]">
                          Admin Note:{" "}
                          <span className="text-[rgb(var(--app-text-soft))]">
                            {r.adminNote || "-"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
