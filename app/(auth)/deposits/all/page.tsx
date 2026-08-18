"use client";

/* ────────── imports ────────── */
import CustomLoadingOverlay from "@/components/CustomLoadingOverlay";
import CustomNoRowsOverlay from "@/components/CustomNoRowsOverlay";
import Card from "@/components/new-ui/Card";
import Tabs, { Tab } from "@/components/new-ui/Tabs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { useMemo, useState } from "react";

/* ────────── API ────────── */
import { useGetAllDepositRequestsQuery } from "@/redux/features/deposit/depositApi";

/* ────────── helpers ────────── */
// /* ────────── Comments lik this ────────── */
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

/* ────────── types ────────── */
type Deposit = {
  _id: string;
  userId?: string;
  orderId?: string;
  name?: string;
  phone?: string;
  email?: string;
  customerId?: string;
  amount: number;
  requestAmount?: number;
  paymentType?: "bdt" | "crypto";
  paid_currency?: string;
  paid_amount?: number;
  currency?: string;
  walletTitle?: string;
  charge?: number;
  receivedAmount?: number;
  destinationAddress?: string;
  qrCode?: string; // base64
  chain?: string; // e.g. "usdt"
  status:
    | "pending"
    | "approved"
    | "confirmed"
    | "rejected"
    | "failed"
    | "expired";
  isApproved?: boolean;
  isExpired?: boolean;
  confirmations?: number;
  isManual?: boolean;
  callbackUrl?: string;
  note?: string;
  createdAt?: string | { $date: string };
  updatedAt?: string | { $date: string };
  approvedAt?: string | { $date: string };
  callbackReceivedAt?: string | { $date: string };
  txId?: string;
  sl_no?: number;
};

type StatusTab = "all" | "pending" | "approved" | "rejected";

const getCurrency = (deposit: Deposit): "BDT" | "USD" => {
  const rawCurrency = String(
    deposit.paid_currency || deposit.currency || deposit.chain || "",
  )
    .trim()
    .toUpperCase();

  if (
    deposit.paymentType === "bdt" ||
    rawCurrency === "BDT" ||
    ["BKASH", "NAGAD", "ROCKET"].includes(
      String(deposit.walletTitle || "").toUpperCase(),
    )
  ) {
    return "BDT";
  }

  /* USDT deposits are presented as USD as requested. */
  return "USD";
};

const getPaidAmount = (deposit: Deposit) => {
  const paidAmount = Number(deposit.paid_amount || 0);
  if (paidAmount > 0) return paidAmount;

  const requestAmount = Number(deposit.requestAmount || 0);
  if (requestAmount > 0) return requestAmount;

  return Number(deposit.amount || 0);
};

const getReceivedAmount = (deposit: Deposit) => {
  const received = Number(deposit.receivedAmount || 0);
  if (received > 0) return received;
  return deposit.isApproved ||
    ["approved", "confirmed"].includes(deposit.status)
    ? getPaidAmount(deposit)
    : 0;
};

const fmtMoney = (amount: number, currency: "BDT" | "USD") =>
  `${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: currency === "USD" ? 2 : 0,
    maximumFractionDigits: currency === "USD" ? 3 : 2,
  })} ${currency}`;

const fmtCurrencyTotals = (totals: { BDT: number; USD: number }) => {
  const parts = (["BDT", "USD"] as const)
    .filter((currency) => totals[currency] > 0)
    .map((currency) => fmtMoney(totals[currency], currency));

  return parts.length ? parts.join(" • ") : "0 BDT";
};

const statusGroup = (status: Deposit["status"]): Exclude<StatusTab, "all"> => {
  if (["approved", "confirmed"].includes(status)) return "approved";
  if (["rejected", "failed", "expired"].includes(status)) return "rejected";
  return "pending";
};

const createdAtTimestamp = (deposit: Deposit) => {
  const value = deposit.createdAt;
  const raw = typeof value === "string" ? value : value?.$date;
  const timestamp = raw ? new Date(raw).getTime() : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
};

/* ────────── page ────────── */
const AllDepositPage = () => {
  const { data, isLoading } = useGetAllDepositRequestsQuery(undefined);
  const deposits = (data?.deposits ?? []) as Deposit[];

  const [selectedTab, setSelectedTab] = useState<StatusTab>("all");

  /* ────────── filter/sum ────────── */
  const filtered = useMemo(() => {
    if (selectedTab === "all") return deposits;
    return deposits.filter((d) => statusGroup(d.status) === selectedTab);
  }, [deposits, selectedTab]);

  const totals = useMemo(
    () =>
      filtered.reduce(
        (acc, deposit) => {
          const currency = getCurrency(deposit);
          acc.amount[currency] += getPaidAmount(deposit);
          acc.received[currency] += getReceivedAmount(deposit);
          return acc;
        },
        {
          amount: { BDT: 0, USD: 0 },
          received: { BDT: 0, USD: 0 },
        },
      ),
    [filtered],
  );

  const statusCounts = useMemo(() => {
    const base = { all: deposits.length, pending: 0, approved: 0, rejected: 0 };
    deposits.forEach((d) => {
      base[statusGroup(d.status)] += 1;
    });
    return base;
  }, [deposits]);

  /* ────────── columns ────────── */
  const columns: GridColDef<Deposit & { id: string }>[] = [
    { field: "sl_no", headerName: "SL No", width: 80 },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 160,
      renderCell: (p) => (
        <span className="text-xs">{fmtDate(p.row.createdAt)}</span>
      ),
    },
    { field: "customerId", headerName: "Customer ID", width: 120 },
    { field: "name", headerName: "Name", width: 160 },
    {
      field: "paid_currency",
      headerName: "Currency",
      width: 90,
      renderCell: (p) => (
        <span className="text-xs font-semibold">{getCurrency(p.row)}</span>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      renderCell: (p) => (
        <span className="text-xs">
          {fmtMoney(getPaidAmount(p.row), getCurrency(p.row))}
        </span>
      ),
    },
    {
      field: "receivedAmount",
      headerName: "Received",
      width: 130,
      renderCell: (p) => (
        <span className="text-xs text-emerald-400">
          {fmtMoney(getReceivedAmount(p.row), getCurrency(p.row))}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      sortable: false,
      renderCell: (p) => (
        <span
          className={
            statusGroup(p.row.status) === "pending"
              ? "rounded-full border border-[#FF8A1A]/30 bg-[#FF8A1A]/15 px-2 py-0.5 text-xs text-[#FF8A1A]"
              : statusGroup(p.row.status) === "approved"
                ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-400"
                : "rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-xs text-rose-400"
          }
        >
          {p.row.status}
        </span>
      ),
    },
    {
      field: "view",
      headerName: "",
      width: 72,
      align: "center",
      headerAlign: "center",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (p) => (
        <div className="w-full flex items-center justify-center">
          <Link href={`/deposits/${p.row.id || p.row._id}`} aria-label="View">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="opacity-80 hover:opacity-100"
            >
              <path
                fill="currentColor"
                d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 11a4 4 0 1 1 0-8a4 4 0 0 1 0 8Z"
              />
            </svg>
          </Link>
        </div>
      ),
    },
  ];

  const rows = filtered
    .slice()
    .sort(
      (a, b) =>
        createdAtTimestamp(b) - createdAtTimestamp(a) ||
        String(b._id).localeCompare(String(a._id)),
    )
    .map((d, index) => ({ ...d, id: d._id, sl_no: index + 1 }));

  const tabs: Tab[] = [
    { key: "all", label: "All deposit", badge: statusCounts.all },
    { key: "pending", label: "Pending", badge: statusCounts.pending },
    { key: "approved", label: "Approved", badge: statusCounts.approved },
    { key: "rejected", label: "Rejected", badge: statusCounts.rejected },
  ];

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">
          All Deposit
        </h2>

        {/* ────────── summary cards ────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <div className="flex items-center gap-3">
              <span className="text-[rgb(var(--app-text-muted))]">
                Total Requests
              </span>
              <span className="ml-auto text-lg font-semibold">
                {filtered.length}
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <span className="text-[rgb(var(--app-text-muted))]">Amount</span>
              <span className="ml-auto text-lg font-semibold">
                {fmtCurrencyTotals(totals.amount)}
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <span className="text-[rgb(var(--app-text-muted))]">
                Received
              </span>
              <span className="ml-auto text-lg font-semibold text-emerald-400">
                {fmtCurrencyTotals(totals.received)}
              </span>
            </div>
          </Card>
        </div>

        {/* ────────── tabs ────────── */}
        <Card
          className="mt-4"
          right={
            <span className="text-xs text-[rgb(var(--app-text-muted))]">
              Filter by status
            </span>
          }
        >
          <Tabs
            tabs={tabs}
            active={selectedTab}
            onChange={(k) => setSelectedTab(k as any)}
          />
        </Card>

        {/* ────────── table ────────── */}
        <div className="mt-4 h-[calc(100vh-320px)]">
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(r) => r.id || (r as any)._id}
            loading={isLoading}
            disableRowSelectionOnClick
            density="compact"
            columnHeaderHeight={48}
            getRowHeight={() => 56}
            slots={{
              noRowsOverlay: CustomNoRowsOverlay,
              loadingOverlay: CustomLoadingOverlay,
            }}
            sx={{
              bgcolor: "#0E1014",
              color: "#E6E6E6",
              borderColor: "rgba(255,255,255,0.08)",
              "& .MuiDataGrid-columnSeparator": { display: "none" },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.85)",
                fontSize: 12,
              },
              "& .MuiDataGrid-cell": {
                fontSize: 13,
                borderColor: "rgba(255,255,255,0.06)",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "rgba(255,255,255,0.03)",
              },
              "& .MuiTablePagination-root": { color: "rgba(255,255,255,0.75)" },
              "& .MuiDataGrid-cell[data-field='view']": {
                display: "flex",
                justifyContent: "center",
              },
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default AllDepositPage;
