"use client";

/* ────────── imports ────────── */
import CustomLoadingOverlay from "@/components/CustomLoadingOverlay";
import CustomNoRowsOverlay from "@/components/CustomNoRowsOverlay";
import StatusChip from "@/components/new-ui/StatusChip";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AdminFloatRequestActions from "./AdminFloatRequestActions";
import type { AdminFloatRequest } from "./AdminFloatRequestDetails";

/* ────────── helpers ────────── */
const fmtNum = (n?: number, suffix = "") =>
  `${Number(n ?? 0).toLocaleString("en-US", { maximumFractionDigits: 3 })}${suffix}`;

const fmtDate = (d: any) => {
  const iso = typeof d === "string" ? d : d?.$date ? d.$date : "";
  return iso
    ? new Date(iso).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "-";
};

export default function AdminFloatRequestsTable({
  rows,
  pendingMode,
  onPreview,
  onDone,
}: {
  rows: AdminFloatRequest[];
  pendingMode: boolean;
  onPreview: (row: AdminFloatRequest) => void;
  onDone: () => void;
}) {
  /* ────────── table columns ────────── */
  const columns: GridColDef<(AdminFloatRequest & { id: string })>[] = [
    {
      field: "createdAt",
      headerName: "Created",
      width: 135,
      renderCell: (p) => <span className="text-xs">{fmtDate(p.row.createdAt)}</span>,
    },
    {
      field: "customerId",
      headerName: "Agent",
      width: 135,
      renderCell: (p) => (
        <span className="text-xs font-semibold">{p.row.customerId || "-"}</span>
      ),
    },
    {
      field: "paymentChannel",
      headerName: "Method",
      width: 120,
      renderCell: (p) => (
        <span className="text-xs uppercase">
          {p.row.paymentChannel || "manual"}
          {p.row.paymentNetwork ? `/${p.row.paymentNetwork}` : ""}
        </span>
      ),
    },
    {
      field: "amount",
      headerName: "Paid",
      width: 125,
      renderCell: (p) => (
        <span className="text-xs">
          {fmtNum(p.row.amount, ` ${p.row.paidCurrency || "USDT"}`)}
        </span>
      ),
    },
    {
      field: "diamondsAmount",
      headerName: "Float",
      width: 125,
      renderCell: (p) => (
        <span className="text-xs text-emerald-400">
          {fmtNum(p.row.diamondsAmount, " 💎")}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 115,
      renderCell: (p) => <StatusChip status={p.row.status || "pending"} />,
    },
    {
      field: "orderId",
      headerName: "Order / Txn",
      width: 170,
      renderCell: (p) => (
        <span className="truncate text-xs" title={p.row.orderId || p.row.txnId || ""}>
          {p.row.orderId || p.row.txnId || "-"}
        </span>
      ),
    },
    {
      field: "preview",
      headerName: "Preview",
      width: 95,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (p) => (
        <button
          onClick={() => onPreview(p.row)}
          className="rounded-lg border border-[#21D3B3]/30 bg-[#21D3B3]/10 px-3 py-1 text-xs text-[#21D3B3] hover:bg-[#21D3B3]/20"
        >
          View
        </button>
      ),
    },
    ...(pendingMode
      ? [
          {
            field: "actions",
            headerName: "Action",
            width: 260,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (p: any) => (
              <div className="w-full py-2">
                <AdminFloatRequestActions id={p.row._id} onDone={onDone} />
              </div>
            ),
          } as GridColDef<(AdminFloatRequest & { id: string })>,
        ]
      : []),
  ];

  return (
    <DataGrid
      rows={rows.map((r) => ({ id: r._id, ...r }))}
      columns={columns}
      getRowHeight={() => (pendingMode ? 116 : 56)}
      autoHeight
      disableRowSelectionOnClick
      pageSizeOptions={[10, 25, 50]}
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      slots={{
        loadingOverlay: CustomLoadingOverlay,
        noRowsOverlay: CustomNoRowsOverlay,
      }}
      sx={{
        border: "0",
        color: "rgb(var(--app-text))",
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: "rgb(var(--app-surface-2))",
        },
        "& .MuiDataGrid-cell": {
          borderColor: "rgb(var(--app-border))",
          alignItems: "center",
        },
        "& .MuiDataGrid-footerContainer": {
          borderColor: "rgb(var(--app-border))",
        },
      }}
    />
  );
}
