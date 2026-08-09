"use client";

import {
  useGetWelcomeBonusRecordsQuery,
  useGetWelcomeBonusSummaryQuery,
  useGrantWelcomeBonusMutation,
  type WelcomeBonusRecord,
  type WelcomeBonusStatus,
} from "@/redux/features/admin/welcomeBonusApi";
import { AlertTriangle, CheckCircle2, Gift, Search, ShieldX } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const getError = (error: any) =>
  error?.data?.error || error?.data?.message || error?.message || "Request failed";

const statusStyle: Record<WelcomeBonusStatus, string> = {
  granted: "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  denied: "border-rose-500/30 bg-rose-500/15 text-rose-300",
  failed: "border-amber-500/30 bg-amber-500/15 text-amber-300",
  pending: "border-cyan-500/30 bg-cyan-500/15 text-cyan-300",
  untracked: "border-slate-500/30 bg-slate-500/15 text-slate-300",
};

function StatusPill({ status }: { status: WelcomeBonusStatus }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${statusStyle[status]}`}
    >
      {status}
    </span>
  );
}

export default function WelcomeBonusesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<WelcomeBonusStatus | "all">("all");
  const [reasonCode, setReasonCode] = useState("");
  const [selected, setSelected] = useState<WelcomeBonusRecord | null>(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { data, isLoading, isFetching, refetch } =
    useGetWelcomeBonusRecordsQuery({
      page,
      limit,
      search: search || undefined,
      status,
      reasonCode: reasonCode || undefined,
    });
  const { data: summaryData, refetch: refetchSummary } =
    useGetWelcomeBonusSummaryQuery();
  const [grantBonus, { isLoading: granting }] =
    useGrantWelcomeBonusMutation();

  const summary = summaryData?.summary;
  const records = data?.records || [];
  const pagination = data?.pagination;

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const confirmGrant = async () => {
    if (!selected) return;
    try {
      const result = await grantBonus({
        userId: selected.userId,
        note: note.trim() || "Granted after user complaint review",
      }).unwrap();
      setMessage({ type: "success", text: result.message });
      setSelected(null);
      setNote("");
      await Promise.all([refetch(), refetchSummary()]);
    } catch (error) {
      setMessage({ type: "error", text: getError(error) });
    }
  };

  const cards = [
    {
      label: "Granted",
      value: summary?.granted,
      icon: CheckCircle2,
      cardClass: "border-emerald-500/25 bg-emerald-500/10",
      iconClass: "text-emerald-300",
    },
    {
      label: "Same Device Denied",
      value: summary?.sameDeviceDenied,
      icon: ShieldX,
      cardClass: "border-rose-500/25 bg-rose-500/10",
      iconClass: "text-rose-300",
    },
    {
      label: "Failed / Review",
      value: summary?.failed,
      icon: AlertTriangle,
      cardClass: "border-amber-500/25 bg-amber-500/10",
      iconClass: "text-amber-300",
    },
    {
      label: "Admin Granted",
      value: summary?.manualGranted,
      icon: Gift,
      cardClass: "border-cyan-500/25 bg-cyan-500/10",
      iconClass: "text-cyan-300",
    },
  ] as const;

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
        <div>
          <h1 className="text-xl font-bold">Welcome Bonus Control</h1>
          <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
            Device-only eligibility, rejection reasons and manual support grant
          </p>
        </div>

        <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/8 p-4 text-xs leading-5 text-cyan-100">
          <b>Eligibility rule:</b> only the saved device token is checked. Same
          Wi-Fi, IP address or mobile network never blocks a new device.
        </div>

        {message && (
          <div
            className={`rounded-xl border px-4 py-3 text-sm ${
              message.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map(({ label, value, icon: Icon, cardClass, iconClass }) => (
            <div
              key={label}
              className={`rounded-2xl border p-4 ${cardClass}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-[rgb(var(--app-text-muted))]">{label}</p>
                <Icon className={`h-5 w-5 ${iconClass}`} />
              </div>
              <p className="mt-2 text-2xl font-black">{value ?? 0}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-4">
          <form onSubmit={submitSearch} className="grid gap-3 lg:grid-cols-[1fr_180px_250px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[rgb(var(--app-text-muted))]" />
              <input
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search name, phone, customer ID or device key"
                className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-500/60"
              />
            </div>

            <select
              value={status}
              onChange={(event) => {
                setPage(1);
                setStatus(event.target.value as WelcomeBonusStatus | "all");
              }}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2.5 text-sm"
            >
              <option value="all">All statuses</option>
              <option value="granted">Granted</option>
              <option value="denied">Denied</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
              <option value="untracked">Legacy / Untracked</option>
            </select>

            <select
              value={reasonCode}
              onChange={(event) => {
                setPage(1);
                setReasonCode(event.target.value);
              }}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2.5 text-sm"
            >
              <option value="">All reasons</option>
              <option value="GRANTED_REGISTRATION">Automatic grant</option>
              <option value="SAME_DEVICE_ALREADY_USED">Same device used</option>
              <option value="DEVICE_ID_MISSING">Device ID missing</option>
              <option value="BONUS_PROCESSING_FAILED">Processing failed</option>
              <option value="GRANTED_BY_ADMIN">Granted by admin</option>
            </select>

            <button className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950">
              Search
            </button>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs">
              <thead className="bg-[rgb(var(--app-surface-2))] text-[10px] uppercase tracking-wider text-[rgb(var(--app-text-muted))]">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Amount / Source</th>
                  <th className="px-4 py-3">Checked</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {(isLoading || isFetching) && records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[rgb(var(--app-text-muted))]">
                      Loading welcome bonus records...
                    </td>
                  </tr>
                ) : records.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-[rgb(var(--app-text-muted))]">
                      No matching users found.
                    </td>
                  </tr>
                ) : (
                  records.map((record) => (
                    <tr key={record.userId} className="border-t border-[rgb(var(--app-border))]/70 align-top">
                      <td className="px-4 py-4">
                        <Link href={`/users/${record.userId}`} className="font-bold text-cyan-300 hover:underline">
                          {record.name}
                        </Link>
                        <p className="mt-1 text-[rgb(var(--app-text-muted))]">ID: {record.customerId}</p>
                        <p className="text-[rgb(var(--app-text-muted))]">{record.phone || record.email || "—"}</p>
                      </td>
                      <td className="px-4 py-4"><StatusPill status={record.status} /></td>
                      <td className="max-w-[320px] px-4 py-4">
                        <p className="font-bold text-[rgb(var(--app-text))]">{record.reasonCode}</p>
                        <p className="mt-1 leading-5 text-[rgb(var(--app-text-muted))]">{record.reason}</p>
                      </td>
                      <td className="px-4 py-4 font-mono text-amber-300">{record.deviceKey || "Not available"}</td>
                      <td className="px-4 py-4">
                        <p className="font-bold text-emerald-300">{record.amount || 0} 💎</p>
                        <p className="mt-1 capitalize text-[rgb(var(--app-text-muted))]">{record.source}</p>
                      </td>
                      <td className="px-4 py-4 text-[rgb(var(--app-text-muted))]">{formatDate(record.checkedAt || record.registeredAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <Link href={`/users/${record.userId}`} className="rounded-lg border border-cyan-500/35 px-3 py-2 text-center font-semibold text-cyan-300">
                            View details
                          </Link>
                          {record.canGrantManually && (
                            <button
                              onClick={() => {
                                setMessage(null);
                                setSelected(record);
                              }}
                              className="rounded-lg bg-amber-400 px-3 py-2 font-bold text-slate-950"
                            >
                              Grant 50 💎
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-[rgb(var(--app-border))] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[rgb(var(--app-text-muted))]">
              Page {pagination?.page || page} of {pagination?.totalPages || 1} • {pagination?.total || 0} users
            </p>
            <div className="flex items-center gap-2">
              <select
                value={limit}
                onChange={(event) => {
                  setPage(1);
                  setLimit(Number(event.target.value));
                }}
                className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-2 py-2 text-xs"
              >
                {[10, 20, 50, 100].map((value) => <option key={value} value={value}>{value} / page</option>)}
              </select>
              <button
                disabled={page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="rounded-lg border border-[rgb(var(--app-border))] px-3 py-2 text-xs disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={!pagination?.hasMore}
                onClick={() => setPage((value) => value + 1)}
                className="rounded-lg border border-[rgb(var(--app-border))] px-3 py-2 text-xs disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-amber-500/30 bg-[rgb(var(--app-surface))] shadow-2xl">
            <div className="border-b border-[rgb(var(--app-border))] px-5 py-4">
              <h2 className="font-bold">Grant Welcome Bonus</h2>
              <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                {selected.name} • Customer {selected.customerId}
              </p>
            </div>
            <div className="space-y-4 p-5">
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs leading-5 text-amber-200">
                This overrides the device rejection and credits the fixed 50 💎 welcome bonus once. Duplicate transactions are blocked by the API.
              </div>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="Support note (for example: verified genuine new device)"
                className="w-full resize-none rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2.5 text-sm outline-none focus:border-amber-500/60"
              />
              <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={granting}
                  onClick={() => {
                    setSelected(null);
                    setNote("");
                  }}
                  className="rounded-xl border border-[rgb(var(--app-border))] py-2.5 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  disabled={granting}
                  onClick={confirmGrant}
                  className="rounded-xl bg-amber-400 py-2.5 text-sm font-black text-slate-950 disabled:opacity-50"
                >
                  {granting ? "Granting..." : "Confirm 50 💎"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
