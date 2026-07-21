"use client";
import {
  useGetUserGameHistoryQuery,
  useRefundGameWagerMutation,
} from "@/redux/features/admin/adminUsersApi";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UserGameHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetUserGameHistoryQuery({
    id,
    page,
    limit: 20,
  });
  const [refund, { isLoading: refunding }] = useRefundGameWagerMutation();
  const runRefund = async (m: any) => {
    const note = window.prompt(
      "Refund reason / system issue details",
      m.systemIssueDetails || "System issue refund",
    );
    if (note === null) return;
    try {
      await refund({ id, matchId: m._id, amount: m.betAmount, note }).unwrap();
      toast.success("Wager refunded");
    } catch (e: any) {
      toast.error(e?.data?.error || e?.data?.message || "Refund failed");
    }
  };
  return (
    <main className="min-h-screen p-6 text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold">User Game History</h1>
        <p className="mt-1 text-sm text-[rgb(var(--app-text-muted))]">
          Completion, leave/disconnect, system issue and refund audit.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))]">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-[rgb(var(--app-surface-2))]">
              <tr>
                {[
                  "Date",
                  "Room",
                  "Opponent",
                  "Bet",
                  "Payout",
                  "Result",
                  "End reason",
                  "Completed",
                  "User left",
                  "System issue",
                  "Refund",
                ].map((x) => (
                  <th key={x} className="p-3 text-left">
                    {x}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="p-6" colSpan={11}>
                    Loading...
                  </td>
                </tr>
              ) : (
                (data?.matches || []).map((m: any) => (
                  <tr
                    key={m._id}
                    className="border-t border-[rgb(var(--app-border))]"
                  >
                    <td className="p-3">
                      {new Date(m.settledAt).toLocaleString()}
                    </td>
                    <td className="p-3 font-mono">{m.roomName}</td>
                    <td className="p-3">{m.opponentName}</td>
                    <td className="p-3">{m.betAmount}</td>
                    <td className="p-3">{m.payoutAmount}</td>
                    <td className="p-3 font-semibold">{m.result}</td>
                    <td className="p-3">{m.endReason || "completed"}</td>
                    <td className="p-3">
                      {m.userCompletedGame === false ? "No" : "Yes"}
                    </td>
                    <td className="p-3">
                      {m.userLeftIntentionally ? "Yes" : "No"}
                    </td>
                    <td className="p-3 max-w-[220px]">
                      {m.systemIssue ? m.systemIssueDetails || "Yes" : "No"}
                    </td>
                    <td className="p-3">
                      {m.refundedAmount > 0 ? (
                        `Refunded ${m.refundedAmount}`
                      ) : (
                        <button
                          disabled={refunding || m.result !== "lose"}
                          onClick={() => runRefund(m)}
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 disabled:opacity-35"
                        >
                          Return wager
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border px-3 py-2 disabled:opacity-30"
          >
            Previous
          </button>
          <span className="px-3 py-2">Page {page}</span>
          <button
            disabled={page >= (data?.pagination?.totalPages || 1)}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border px-3 py-2 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
