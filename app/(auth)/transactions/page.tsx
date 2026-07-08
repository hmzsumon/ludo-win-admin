"use client";

import {
  useDeleteAdminTransactionsMutation,
  useGetAdminTransactionsQuery,
} from "@/redux/features/admin/adminApi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { useMemo, useState } from "react";
import { HiEye, HiTrash } from "react-icons/hi2";
import { toast } from "react-toastify";

const AdminTransactionsPage = () => {
  /* ────────── local state section ────────── */
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  /* ────────── api section ────────── */
  const { data, isLoading } = useGetAdminTransactionsQuery({
    page: page + 1,
    limit: pageSize,
    search,
  });
  const [deleteTransactions, { isLoading: isDeleting }] =
    useDeleteAdminTransactionsMutation();

  /* ────────── rows section ────────── */
  const rows = useMemo(() => {
    return (data?.transactions || []).map((tx: any) => ({
      id: tx._id,
      unique_id: tx.unique_id,
      userName: tx.userId?.name || "N/A",
      customerId: tx.customerId || tx.userId?.customerId || "N/A",
      accountType: tx.userId?.is_bot ? "Bot" : "User",
      transactionType: tx.transactionType,
      purpose: tx.purpose,
      amount: tx.amount,
      previous_m_balance: tx.previous_m_balance,
      current_m_balance: tx.current_m_balance,
      createdAt: tx.createdAt,
    }));
  }, [data?.transactions]);

  /* ────────── delete handler section ────────── */
  const handleDelete = async (ids: string[]) => {
    if (!ids.length) return toast.error("Select transaction first");
    if (!confirm("Are you sure you want to delete selected transaction(s)?")) return;

    try {
      await deleteTransactions({ transactionIds: ids }).unwrap();
      setSelectedIds([]);
      toast.success("Transaction deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Transaction delete failed");
    }
  };

  /* ────────── datagrid columns section ────────── */
  const columns: GridColDef[] = [
    { field: "unique_id", headerName: "Transaction ID", minWidth: 190, flex: 1 },
    { field: "userName", headerName: "User", minWidth: 160, flex: 1 },
    { field: "customerId", headerName: "Customer ID", minWidth: 140 },
    { field: "accountType", headerName: "Type", minWidth: 100 },
    { field: "transactionType", headerName: "TX Type", minWidth: 120 },
    { field: "purpose", headerName: "Purpose", minWidth: 170, flex: 1 },
    {
      field: "amount",
      headerName: "Amount",
      minWidth: 120,
      valueFormatter: ({ value }) => Number(value || 0).toFixed(2),
    },
    {
      field: "createdAt",
      headerName: "Date",
      minWidth: 180,
      valueFormatter: ({ value }) =>
        value ? new Date(value as string).toLocaleString() : "N/A",
    },
    {
      field: "action",
      headerName: "Action",
      sortable: false,
      filterable: false,
      minWidth: 130,
      renderCell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Link href={`/transactions/${row.id}`} className="text-blue-600">
            <HiEye className="text-xl" />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete([row.id])}
            className="text-red-600"
          >
            <HiTrash className="text-xl" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">All Transactions</h1>
        <button
          type="button"
          onClick={() => handleDelete(selectedIds)}
          disabled={isDeleting || selectedIds.length === 0}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Delete Selected
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => {
          setPage(0);
          setSearch(e.target.value);
        }}
        className="w-full rounded-lg border border-gray-300 p-3 dark:border-gray-700 dark:bg-gray-800"
        placeholder="Search transaction id, customer id, purpose..."
      />

      <div className="h-[650px] w-full bg-white dark:bg-boxdark">
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={data?.pagination?.total || 0}
          loading={isLoading}
          checkboxSelection
          paginationMode="server"
          paginationModel={{ page, pageSize }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setPageSize(model.pageSize);
          }}
          pageSizeOptions={[10, 20, 50, 100]}
          onRowSelectionModelChange={(ids) => setSelectedIds(ids as string[])}
          disableRowSelectionOnClick
        />
      </div>
    </div>
  );
};

export default AdminTransactionsPage;
