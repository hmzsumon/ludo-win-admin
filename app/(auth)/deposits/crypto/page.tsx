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
  chain?: string;
  network?: string;
  walletType?: string;
  walletTitle?: string;
  charge?: number;
  receivedAmount?: number;
  destinationAddress?: string;
  status:
    | "pending"
    | "approved"
    | "confirmed"
    | "rejected"
    | "failed"
    | "expired";
  isApproved?: boolean;
  isManual?: boolean;
  note?: string;
  createdAt?: string | { $date: string };
  txId?: string;
  sl_no?: number;
};

type StatusTab = "all" | "pending" | "approved" | "rejected";
type MethodTab = "all" | "crypto" | "binance";

/* ────────── crypto / binance classification ────────── */
const isBinancePay = (d: Deposit) => {
  const walletType = String(d.walletType || "").toLowerCase();
  const walletTitle = String(d.walletTitle || "").toLowerCase();
  const chain = String(d.chain || "").toUpperCase();
  return (
    walletType === "binance" ||
    walletTitle.includes("binance") ||
    chain === "BINANCE_PAY"
  );
};

const isCryptoDeposit = (d: Deposit) => {
  if (d.paymentType === "crypto") return true;
  if (isBinancePay(d)) return true;
  /* BlockBee crypto deposits always carry an on-chain destination + chain. */
  return Boolean(d.destinationAddress && d.chain && d.paymentType !== "bdt");
};

const methodLabel = (d: Deposit) =>
  isBinancePay(d) ? "Binance Pay" : "Crypto";

const getCurrency = (d: Deposit) =>
  String(d.paid_currency || d.currency || "USDT").trim().toUpperCase() || "USDT";

const getPaidAmount = (d: Deposit) => {
  const paid = Number(d.paid_amount || 0);
  if (paid > 0) return paid;
  const req = Number(d.requestAmount || 0);
  if (req > 0) return req;
  return Number(d.amount || 0);
};

const getReceivedAmount = (d: Deposit) => {
  const received = Number(d.receivedAmount || 0);
  if (received > 0) return received;
  return d.isApproved || ["approved", "confirmed"].includes(d.status)
    ? getPaidAmount(d)
    : 0;
};

const fmtMoney = (amount: number, currency: string) =>
  `${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  })} ${currency}`;

const statusGroup = (status: Deposit["status"]): Exclude<StatusTab, "all"> => {
  if (["approved", "confirmed"].includes(status)) return "approved";
  if (["rejected", "failed", "expired"].includes(status)) return "rejected";
  return "pending";
};

const createdAtTimestamp = (d: Deposit) => {
  const value = d.createdAt;
  const raw = typeof value === "string" ? value : value?.$date;
  const ts = raw ? new Date(raw).getTime() : 0;
  return Number.isFinite(ts) ? ts : 0;
};

/* ────────── page ────────── */
const CryptoDepositsPage = () => {
  const { data, isLoading } = useGetAllDepositRequestsQuery(undefined);
  const allDeposits = (data?.deposits ?? []) as Deposit[];

  /* Only crypto + Binance Pay deposits belong on this screen. */
  const cryptoDeposits = useMemo(
    () => allDeposits.filter(isCryptoDeposit),
    [allDeposits],
  );

  const [statusTab, setStatusTab] = useState<StatusTab>("all");
  const [methodTab, setMethodTab] = useState<MethodTab>("all");

  const filtered = useMemo(() => {
    return cryptoDeposits.filter((d) => {
      const statusOk =
        statusTab === "all" || statusGroup(d.status) === statusTab;
      const methodOk =
        methodTab === "all" ||
        (methodTab === "binance" ? isBinancePay(d) : !isBinancePay(d));
      return statusOk && methodOk;
    });
  }, [cryptoDeposits, statusTab, methodTab]);

  const totalPaid = useMemo(
    () => filtered.reduce((sum, d) => sum + getPaidAmount(d), 0),
    [filtered],
  );
  const totalReceived = useMemo(
    () => filtered.reduce((sum, d) => sum + getReceivedAmount(d), 0),
    [filtered],
  );

  const statusCounts = useMemo(() => {
    const base = {
      all: cryptoDeposits.length,
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    cryptoDeposits.forEach((d) => {
      base[statusGroup(d.status)] += 1;
    });
    return base;
  }, [cryptoDeposits]);

  const methodCounts = useMemo(() => {
    const base = { all: cryptoDeposits.length, crypto: 0, binance: 0 };
    cryptoDeposits.forEach((d) => {
      if (isBinancePay(d)) base.binance += 1;
      else base.crypto += 1;
    });
    return base;
  }, [cryptoDeposits]);

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
    { field: "name", headerName: "Name", width: 150 },
    {
      field: "method",
      headerName: "Method",
      width: 120,
      sortable: false,
      renderCell: (p) => (
        <span
          className={
            isBinancePay(p.row)
              ? "rounded-full border border-[#F0B90B]/30 bg-[#F0B90B]/15 px-2 py-0.5 text-xs text-[#F0B90B]"
              : "rounded-full border border-cyan-400/30 bg-cyan-400/15 px-2 py-0.5 text-xs text-cyan-300"
          }
        >
          {methodLabel(p.row)}
        </span>
      ),
    },
    {
      field: "chain",
      headerName: "Chain / Network",
      width: 140,
      renderCell: (p) => (
        <span className="text-xs uppercase">
          {p.row.chain || p.row.network || "-"}
        </span>
      ),
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 130,
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

  const statusTabs: Tab[] = [
    { key: "all", label: "All", badge: statusCounts.all },
    { key: "pending", label: "Pending", badge: statusCounts.pending },
    { key: "approved", label: "Approved", badge: statusCounts.approved },
    { key: "rejected", label: "Rejected", badge: statusCounts.rejected },
  ];

  const methodTabs: Tab[] = [
    { key: "all", label: "All methods", badge: methodCounts.all },
    { key: "crypto", label: "Crypto", badge: methodCounts.crypto },
    { key: "binance", label: "Binance Pay", badge: methodCounts.binance },
  ];

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl p-6 md:p-8">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">
          Crypto &amp; Binance Pay Deposits
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
                {fmtMoney(totalPaid, "USDT")}
              </span>
            </div>
          </Card>
          <Card>
            <div className="flex items-center gap-3">
              <span className="text-[rgb(var(--app-text-muted))]">
                Received
              </span>
              <span className="ml-auto text-lg font-semibold text-emerald-400">
                {fmtMoney(totalReceived, "USDT")}
              </span>
            </div>
          </Card>
        </div>

        {/* ────────── method filter ────────── */}
        <Card
          className="mt-4"
          right={
            <span className="text-xs text-[rgb(var(--app-text-muted))]">
              Filter by method
            </span>
          }
        >
          <Tabs
            tabs={methodTabs}
            active={methodTab}
            onChange={(k) => setMethodTab(k as MethodTab)}
          />
        </Card>

        {/* ────────── status filter ────────── */}
        <Card
          className="mt-4"
          right={
            <span className="text-xs text-[rgb(var(--app-text-muted))]">
              Filter by status
            </span>
          }
        >
          <Tabs
            tabs={statusTabs}
            active={statusTab}
            onChange={(k) => setStatusTab(k as StatusTab)}
          />
        </Card>

        {/* ────────── table ────────── */}
        <div className="mt-4 h-[calc(100vh-380px)]">
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

export default CryptoDepositsPage;
