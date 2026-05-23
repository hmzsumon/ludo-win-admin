/* ────────── imports ────────── */
"use client";

import { AdminUserRow } from "@/redux/features/admin/adminUsersApi";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { useMemo } from "react";

/* ────────── helpers ────────── */
const StatusPill = ({ active }: { active: boolean }) => (
  <span
    className={
      active
        ? "rounded-full border border-emerald-400/30 bg-emerald-400/15 px-2 py-0.5 text-xs text-emerald-400"
        : "rounded-full border border-rose-400/30 bg-rose-400/15 px-2 py-0.5 text-xs text-rose-400"
    }
  >
    {active ? "active" : "inactive"}
  </span>
);

/* ────────── safe access helpers ────────── */
const toDateMs = (iso?: string | null) =>
  iso ? new Date(iso).getTime() : null;
const toDateLabel = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "-";

/* ────────── columns ────────── */
const columns: GridColDef<AdminUserRow>[] = [
  { field: "customerId", headerName: "Customer ID", width: 140 },
  { field: "name", headerName: "Name", width: 200 },
  {
    field: "m_balance",
    headerName: "Balance",
    width: 160,
    align: "right",
    headerAlign: "right",
    renderCell: (p: GridRenderCellParams<AdminUserRow>) => {
      const balance = Number(p.row?.m_balance || 0);

      return (
        <span className="font-medium text-emerald-300">
          {balance.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
          })}{" "}
          💎
        </span>
      );
    },
  },

  {
    field: "view",
    headerName: "View",
    width: 80,
    align: "center",
    headerAlign: "center",
    sortable: false,
    renderCell: (p: GridRenderCellParams<AdminUserRow>) => {
      const id = p?.row?._id;
      return id ? (
        <Link
          href={`/users/${p.row._id}`}
          className="text-teal-300 hover:underline"
        >
          View
        </Link>
      ) : (
        <span className="text-[rgb(var(--app-text-muted))]">—</span>
      );
    },
  },
];

/* ────────── component ────────── */
export default function AdminUsersTable(props: {
  rows: AdminUserRow[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  onPageSizeChange: (n: number) => void;
  onSortChange: (m: GridSortModel) => void;
  initialSort?: GridSortModel;
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
  } = props;

  const dgRows = useMemo(
    () => rows.map((u) => ({ id: u._id ?? crypto.randomUUID(), ...u })),
    [rows],
  );

  return (
    <div className="h-[calc(100vh-260px)]">
      <DataGrid
        rows={dgRows}
        columns={columns}
        loading={loading}
        paginationMode="server"
        sortingMode="server"
        rowCount={total}
        pageSizeOptions={[10, 20, 50, 100, 200]}
        paginationModel={{ page: page - 1, pageSize }}
        onPaginationModelChange={(m) => {
          onPageChange(m.page + 1);
          onPageSizeChange(m.pageSize);
        }}
        onSortModelChange={onSortChange}
        initialState={
          initialSort ? { sorting: { sortModel: initialSort } } : undefined
        }
        disableRowSelectionOnClick
        columnHeaderHeight={44}
        getRowHeight={() => 56}
        sx={{
          bgcolor: "#0E1014",
          color: "#E6E6E6",
          border: "1px solid rgba(255,255,255,0.08)",
          "& .MuiDataGrid-columnHeaders": {
            bgcolor: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.85)",
            fontSize: 12,
          },
          "& .MuiDataGrid-cell": {
            borderColor: "rgba(255,255,255,0.06)",
            fontSize: 12,
          },
          "& .MuiDataGrid-row:hover": { bgcolor: "rgba(255,255,255,0.03)" },
          "& .MuiTablePagination-root": { color: "rgba(255,255,255,0.75)" },
        }}
      />
    </div>
  );
}
