"use client";

/* ────────── imports ────────── */
import AdminFloatRequestDetails, {
  type AdminFloatRequest,
} from "@/components/float/AdminFloatRequestDetails";
import AdminFloatRequestsTable from "@/components/float/AdminFloatRequestsTable";
import Card from "@/components/new-ui/Card";
import Tabs, { Tab } from "@/components/new-ui/Tabs";
import { useAdminGetFloatRequestsQuery } from "@/redux/features/admin/adminSettlementApi";
import { useMemo, useState } from "react";

/* ────────── helpers ────────── */
const fmtNum = (n?: number, suffix = "") =>
  `${Number(n ?? 0).toLocaleString("en-US", {
    maximumFractionDigits: 3,
  })}${suffix}`;

/* ────────── page ────────── */
export default function AdminFloatRequestsPage() {
  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending",
  );
  const [type, setType] = useState<"" | "topup" | "return">("");
  const [channel, setChannel] = useState<
    "" | "manual" | "binance" | "blockbee"
  >("");
  const [selected, setSelected] = useState<AdminFloatRequest | null>(null);

  // paymentChannel API type এ না থাকায় এখানে পাঠানো হয়নি
  // channel filter নিচে local ভাবে করা হয়েছে
  const { data, isLoading, refetch } = useAdminGetFloatRequestsQuery({
    status,
    type,
  });

  const list = (data?.data || []) as AdminFloatRequest[];

  /* ────────── local channel filter fallback ────────── */
  const rows = useMemo(() => {
    if (!channel) return list;
    return list.filter((item) => (item.paymentChannel || "manual") === channel);
  }, [channel, list]);

  /* ────────── summary numbers ────────── */
  const summary = useMemo(() => {
    return rows.reduce(
      (acc, item) => {
        acc.count += 1;
        acc.usdt += Number(item.amount || 0);
        acc.float += Number(item.diamondsAmount || 0);
        return acc;
      },
      { count: 0, usdt: 0, float: 0 },
    );
  }, [rows]);

  const tabs: Tab[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* ────────── header ────────── */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#21D3B3]">
              Agent Float
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Float Requests
            </h1>

            <p className="mt-1 text-sm text-[rgb(var(--app-text-muted))]">
              Binance Pay / Crypto USDT request preview, approve and reject.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-4 py-2 text-sm text-[rgb(var(--app-text-soft))] hover:bg-[rgb(var(--app-surface-3))]/80"
          >
            Refresh
          </button>
        </div>

        {/* ────────── summary cards ────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3">
              <span className="text-[rgb(var(--app-text-muted))]">
                Requests
              </span>

              <span className="ml-auto text-lg font-semibold">
                {summary.count}
              </span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="text-[rgb(var(--app-text-muted))]">
                USDT Amount
              </span>

              <span className="ml-auto text-lg font-semibold">
                {fmtNum(summary.usdt, " USDT")}
              </span>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <span className="text-[rgb(var(--app-text-muted))]">
                Float Amount
              </span>

              <span className="ml-auto text-lg font-semibold text-emerald-400">
                {fmtNum(summary.float, " 💎")}
              </span>
            </div>
          </Card>
        </div>

        {/* ────────── filters ────────── */}
        <Card className="mt-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <Tabs
              tabs={tabs}
              active={status}
              onChange={(k) => setStatus(k as typeof status)}
            />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[420px]">
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as "" | "topup" | "return")
                }
                className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
              >
                <option value="">All Type</option>
                <option value="topup">Topup</option>
                <option value="return">Return</option>
              </select>

              <select
                value={channel}
                onChange={(e) =>
                  setChannel(
                    e.target.value as "" | "manual" | "binance" | "blockbee",
                  )
                }
                className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm text-[rgb(var(--app-text))] outline-none"
              >
                <option value="">All Method</option>
                <option value="binance">Binance Pay</option>
                <option value="blockbee">Crypto USDT</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
        </Card>

        {/* ────────── request table ────────── */}
        <Card className="mt-5 overflow-hidden p-0">
          {isLoading ? (
            <div className="p-6 text-sm text-[rgb(var(--app-text-muted))]">
              Loading float requests...
            </div>
          ) : (
            <AdminFloatRequestsTable
              rows={rows}
              pendingMode={status === "pending"}
              onPreview={setSelected}
              onDone={refetch}
            />
          )}
        </Card>

        {/* ────────── preview drawer ────────── */}
        <AdminFloatRequestDetails
          open={!!selected}
          request={selected}
          onClose={() => setSelected(null)}
        />
      </div>
    </main>
  );
}
