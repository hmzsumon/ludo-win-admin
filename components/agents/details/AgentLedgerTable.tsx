"use client";

import SectionCard from "@/components/ui/SectionCard";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { useMemo, useState } from "react";

type LedgerTab = "all" | "topup" | "deposit" | "commission" | "withdraw";

const tabs: { key: LedgerTab; label: string; type?: string }[] = [
  { key: "all", label: "All" },
  { key: "topup", label: "Topup", type: "credit_issue" },
  { key: "deposit", label: "Deposit", type: "float_debit_deposit" },
  { key: "commission", label: "Commission", type: "commission_credit" },
  { key: "withdraw", label: "Withdraw", type: "withdraw_cash_paid" },
];

export default function AgentLedgerTable({
  rows,
  loading,
}: {
  rows: any[];
  loading: boolean;
}) {
  const [activeTab, setActiveTab] = useState<LedgerTab>("all");

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "createdAt", sort: "desc" },
  ]);

  const getRowId = (row: any) => {
    return row?.id || row?._id?.$oid || row?._id;
  };

  const getLedgerDate = (row: any) => {
    return (
      row?.createdAt?.$date ||
      row?.createdAt ||
      row?.created_at?.$date ||
      row?.created_at ||
      row?.updatedAt?.$date ||
      row?.updatedAt ||
      row?.amount ||
      null
    );
  };

  const formatDate = (row: any) => {
    const date = getLedgerDate(row);
    if (!date) return "-";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "-";

    return parsed.toLocaleString();
  };

  const numberOrNull = (value: any) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  };

  const amountFromNote = (note: string) => {
    if (!note) return null;

    const equalMatch = note.match(/=\s*([+-]?\d+(?:\.\d+)?)\s*💎/);
    if (equalMatch) return numberOrNull(equalMatch[1]);

    const arrowMatch = note.match(/→\s*([+-]?\d+(?:\.\d+)?)\s*💎/);
    if (arrowMatch) return numberOrNull(arrowMatch[1]);

    const deltaMatch = note.match(
      /(?:Rolling|Float|CompanyDue)\s*([+-]?\d+(?:\.\d+)?)/i,
    );
    if (deltaMatch) return Math.abs(Number(deltaMatch[1]));

    return null;
  };

  const getAmount = (row: any) => {
    const type = String(row?.type || "").toLowerCase();
    const meta = row?.meta || {};

    if (type === "credit_issue") {
      return (
        numberOrNull(meta.diamonds) ??
        numberOrNull(row?.rollingDelta) ??
        numberOrNull(meta.bdtAmount) ??
        amountFromNote(row?.note || "")
      );
    }

    if (type === "float_debit_deposit") {
      return (
        numberOrNull(row?.amount) ??
        numberOrNull(meta.diamondsCredited) ??
        numberOrNull(meta.depAmountDiamonds) ??
        numberOrNull(meta.bdtAmount) ??
        numberOrNull(Math.abs(row?.rollingDelta || 0)) ??
        amountFromNote(row?.note || "")
      );
    }

    if (type === "commission_credit") {
      return (
        numberOrNull(meta.commissionDiamonds) ?? amountFromNote(row?.note || "")
      );
    }

    if (type === "withdraw_cash_paid") {
      return (
        numberOrNull(meta.netDiamonds) ??
        numberOrNull(meta.wAmount) ??
        numberOrNull(meta.rawWithdrawAmount) ??
        numberOrNull(row?.rollingDelta) ??
        amountFromNote(row?.note || "")
      );
    }

    return (
      numberOrNull(row?.amount) ??
      numberOrNull(row?.netDelta) ??
      amountFromNote(row?.note || "")
    );
  };

  const getAmountType = (row: any) => {
    const type = String(row?.type || "").toLowerCase();

    if (type === "commission_credit") return "Commission";
    if (type === "withdraw_cash_paid") return "Withdraw";
    if (type === "float_debit_deposit") return "Deposit";
    if (type === "credit_issue") return "Topup";

    return "Amount";
  };

  const formatType = (type: string) => {
    return String(type || "-").toUpperCase();
  };

  const getTabCount = (tab: LedgerTab) => {
    if (tab === "all") return rows?.length || 0;

    const tabInfo = tabs.find((item) => item.key === tab);

    return (rows || []).filter(
      (row) => String(row?.type || "").toLowerCase() === tabInfo?.type,
    ).length;
  };

  const filteredRows = useMemo(() => {
    if (activeTab === "all") return rows || [];

    const tabInfo = tabs.find((item) => item.key === activeTab);

    return (rows || []).filter(
      (row) => String(row?.type || "").toLowerCase() === tabInfo?.type,
    );
  }, [rows, activeTab]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "type",
        headerName: "Type",
        minWidth: 210,
        flex: 0.8,
        renderCell: (params: GridRenderCellParams) => (
          <span className="inline-flex text-[11px] font-bold uppercase tracking-wide text-[rgb(var(--app-text))]">
            {formatType(params.row?.type)}
          </span>
        ),
      },
      {
        field: "amount",
        headerName: "Amount",
        minWidth: 180,
        flex: 0.7,
        sortable: true,
        valueGetter: (_value: any, row: any) => getAmount(row) || 0,
        renderCell: (params: GridRenderCellParams) => {
          const amount = getAmount(params.row);
          const amountType = getAmountType(params.row);

          return (
            <div className="flex h-full w-full items-center gap-2 overflow-hidden">
              <span className="whitespace-nowrap text-sm font-extrabold text-[rgb(var(--app-text))]">
                {amount !== null && amount !== undefined ? `${amount} 💎` : "-"}
              </span>

              {amount !== null && amount !== undefined ? (
                <span className="whitespace-nowrap  py-0.5 text-[10px] font-semibold text-[rgb(var(--app-text-muted))]">
                  {amountType}
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        field: "createdAt",
        headerName: "Time",
        minWidth: 190,
        flex: 0.8,
        sortable: true,
        valueGetter: (_value: any, row: any) => {
          const date = getLedgerDate(row);
          return date ? new Date(date).getTime() : 0;
        },
        renderCell: (params: GridRenderCellParams) => (
          <span className="whitespace-nowrap text-xs font-medium text-[rgb(var(--app-text-muted))]">
            {formatDate(params.row)}
          </span>
        ),
      },
      {
        field: "note",
        headerName: "Note",
        minWidth: 420,
        flex: 1.5,
        renderCell: (params: GridRenderCellParams) => (
          <div
            title={params.row?.note || "-"}
            className="line-clamp-2 text-xs font-semibold leading-5 text-[rgb(var(--app-text))]"
          >
            {params.row?.note || "-"}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <SectionCard title="Recent Ledger" subtitle="Last audit records">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-[rgb(var(--app-text))]">
              Ledger Activity
            </h3>
            <p className="text-xs text-[rgb(var(--app-text-muted))]">
              Latest audit logs and transaction history
            </p>
          </div>

          <div className="w-fit rounded-full border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-1 text-xs text-[rgb(var(--app-text-muted))]">
            {filteredRows.length} records
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="flex min-w-max gap-1 rounded-2xl border border-[rgb(var(--app-border))] bg-white/[0.03] p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    "flex items-center gap-2 rounded-xl px-2 py-2 text-xs font-semibold transition",
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "text-[rgb(var(--app-text-muted))] hover:bg-white/[0.06] hover:text-[rgb(var(--app-text))]",
                  ].join(" ")}
                >
                  <span>{tab.label}</span>
                  <span
                    className={[
                      "rounded-full px-2 py-0.5 text-[10px]",
                      isActive
                        ? "bg-black/10 text-black"
                        : "bg-white/[0.06] text-[rgb(var(--app-text-muted))]",
                    ].join(" ")}
                  >
                    {getTabCount(tab.key)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[rgb(var(--app-border))] bg-white/[0.03]">
          <div className="h-[520px] w-full sm:h-[470px]">
            <DataGrid
              rows={filteredRows}
              columns={columns}
              loading={loading}
              sortModel={sortModel}
              onSortModelChange={setSortModel}
              getRowId={getRowId}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              rowHeight={66}
              columnHeaderHeight={56}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                    page: 0,
                  },
                },
              }}
              slots={{
                noRowsOverlay: () => (
                  <div className="flex h-full items-center justify-center px-4 text-center">
                    <div>
                      <div className="text-sm font-medium text-[rgb(var(--app-text))]">
                        No {activeTab === "all" ? "ledger" : activeTab} rows
                      </div>
                      <div className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                        Records will appear here once available.
                      </div>
                    </div>
                  </div>
                ),
              }}
              sx={{
                border: "none",
                color: "rgb(var(--app-text))",
                fontSize: "12px",

                "& .MuiDataGrid-main": {
                  borderRadius: "16px",
                },

                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "rgba(255,255,255,0.04)",
                  color: "rgb(var(--app-text-muted))",
                  borderBottom: "1px solid rgb(var(--app-border))",
                },

                "& .MuiDataGrid-columnHeader": {
                  outline: "none !important",
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 800,
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                },

                "& .MuiDataGrid-cell": {
                  borderTop: "1px solid rgb(var(--app-border))",
                  borderBottom: "none",
                  outline: "none !important",
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                },

                "& .MuiDataGrid-cellContent": {
                  overflow: "hidden",
                },

                "& .MuiDataGrid-row": {
                  transition: "background-color 0.15s ease",
                },

                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(255,255,255,0.04)",
                },

                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid rgb(var(--app-border))",
                  color: "rgb(var(--app-text-muted))",
                  minHeight: "52px",
                },

                "& .MuiTablePagination-root": {
                  color: "rgb(var(--app-text-muted))",
                },

                "& .MuiSvgIcon-root": {
                  color: "rgb(var(--app-text-muted))",
                },

                "& .MuiDataGrid-overlay": {
                  backgroundColor: "transparent",
                },

                "& .MuiDataGrid-virtualScroller": {
                  overflowX: "auto",
                },

                "@media (max-width: 640px)": {
                  "& .MuiDataGrid-cell": {
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  },

                  "& .MuiDataGrid-columnHeader": {
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  },

                  "& .MuiDataGrid-footerContainer": {
                    justifyContent: "center",
                  },

                  "& .MuiTablePagination-toolbar": {
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  },

                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                    {
                      fontSize: "11px",
                    },
                },
              }}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
