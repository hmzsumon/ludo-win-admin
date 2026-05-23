/* ════════════════════════════════════════════════════════════════
   UserTransactionsTable
   — server-side pagination + সিলেকশন + bulk delete support
   MUI v8 compatible GridRowSelectionModel
   ════════════════════════════════════════════════════════════════ */
"use client";
import { AdminTransactionRow } from "@/redux/features/admin/adminUsersApi";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import { useMemo } from "react";

/* ────────── helpers ────────── */
const fmtCurrency = (n?: number) =>
  `৳ ${Number(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

/* ────────── columns ────────── */
const columns: GridColDef<AdminTransactionRow>[] = [
  {
    field: "unique_id",
    headerName: "Txn ID",
    width: 170,
    renderCell: (p) => (
      <span className="font-mono text-teal-300 text-[11px]">
        {p.row.unique_id}
      </span>
    ),
  },
  {
    field: "transactionType",
    headerName: "Type",
    width: 110,
    renderCell: (p) => (
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase border ${
          p.row.isCashIn
            ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-400"
            : "border-rose-500/30 bg-rose-500/15 text-rose-400"
        }`}
      >
        {p.row.isCashIn ? "Cash In" : "Cash Out"}
      </span>
    ),
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 130,
    type: "number",
    renderCell: (p: GridRenderCellParams<AdminTransactionRow>) => (
      <span
        className={
          p.row.isCashIn
            ? "text-emerald-400 font-semibold"
            : "text-rose-400 font-semibold"
        }
      >
        {p.row.isCashIn ? "+" : "-"}
        {fmtCurrency(p.row.amount)}
      </span>
    ),
  },
  { field: "purpose", headerName: "Purpose", width: 180 },
  { field: "description", headerName: "Description", width: 260 },
  {
    field: "previous_m_balance",
    headerName: "Prev Balance",
    width: 130,
    renderCell: (p) => (
      <span className="text-[rgb(var(--app-text-muted))] text-xs">
        {fmtCurrency(p.row.previous_m_balance ?? 0)}
      </span>
    ),
  },
  {
    field: "current_m_balance",
    headerName: "Curr Balance",
    width: 130,
    renderCell: (p) => (
      <span className="text-[rgb(var(--app-text))] text-xs font-medium">
        {fmtCurrency(p.row.current_m_balance ?? 0)}
      </span>
    ),
  },
  {
    field: "createdAt",
    headerName: "Time",
    width: 170,
    valueGetter: (p: any) => {
      const iso = p?.row?.createdAt as string | undefined;
      return iso ? new Date(iso).getTime() : null;
    },
    renderCell: (p) => (
      <span className="text-[rgb(var(--app-text-muted))] text-xs">
        {fmtDate(p.row.createdAt)}
      </span>
    ),
  },
];

/* ────────── component ────────── */
export default function UserTransactionsTable(props: {
  rows: AdminTransactionRow[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
  onSortChange: (m: GridSortModel) => void;
  initialSort?: GridSortModel;
  /* ────────── selection: MUI-native model pass-through ────────── */
  selectionModel: GridRowSelectionModel;
  onSelectionChange: (model: GridRowSelectionModel) => void;
}) {
  const {
    rows,
    loading,
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    initialSort,
    selectionModel,
    onSelectionChange,
  } = props;

  const dgRows = useMemo(
    () => rows.map((t) => ({ id: t._id ?? crypto.randomUUID(), ...t })),
    [rows],
  );

  return (
    <div style={{ height: "calc(100vh - 340px)", minHeight: 420 }}>
      <DataGrid
        rows={dgRows}
        columns={columns}
        loading={loading}
        /* ────────── pagination ────────── */
        paginationMode="server"
        sortingMode="server"
        rowCount={total}
        pageSizeOptions={[10, 20, 50, 100, 200]}
        paginationModel={{ page: page - 1, pageSize }}
        onPaginationModelChange={(m) => {
          onPageChange(m.page + 1);
          onPageSizeChange(m.pageSize);
        }}
        /* ────────── sorting ────────── */
        onSortModelChange={onSortChange}
        initialState={
          initialSort ? { sorting: { sortModel: initialSort } } : undefined
        }
        /* ────────── selection ────────── */
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={onSelectionChange}
        /* ────────── layout ────────── */
        columnHeaderHeight={44}
        getRowHeight={() => 52}
        /* ────────── dark theme sx ────────── */
        sx={{
          bgcolor: "#0E1014",
          color: "#E6E6E6",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          overflow: "hidden",
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.7)",
            fontSize: 11,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-cell": {
            borderColor: "rgba(255,255,255,0.05)",
            fontSize: 12,
          },
          "& .MuiDataGrid-row:hover": {
            bgcolor: "rgba(255,255,255,0.025)",
          },
          /* ────────── selected row teal highlight ────────── */
          "& .MuiDataGrid-row.Mui-selected": {
            bgcolor: "rgba(20,184,166,0.08) !important",
          },
          "& .MuiDataGrid-row.Mui-selected:hover": {
            bgcolor: "rgba(20,184,166,0.12) !important",
          },
          "& .MuiTablePagination-root": {
            color: "rgba(255,255,255,0.6)",
          },
          "& .MuiCheckbox-root": {
            color: "rgba(255,255,255,0.35)",
          },
          "& .MuiCheckbox-root.Mui-checked": {
            color: "#14b8a6",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid rgba(255,255,255,0.06)",
          },
          "& .MuiDataGrid-columnSeparator": {
            color: "rgba(255,255,255,0.06)",
          },
        }}
      />
    </div>
  );
}
