/* ════════════════════════════════════════════════════════════════
   AdminUserTransactionsPage
   — server-side table + bulk delete + selection
   ════════════════════════════════════════════════════════════════ */
"use client";
import UserTransactionsTable from "@/components/admin/UserTransactionsTable";
import UserTransactionsToolbar from "@/components/admin/UserTransactionsToolbar";
import {
  useAdminDeleteTransactionsMutation,
  useGetUserByIdQuery,
  useGetUserTransactionsQuery,
} from "@/redux/features/admin/adminUsersApi";
import {
  GridRowId,
  GridRowSelectionModel,
  GridSortModel,
} from "@mui/x-data-grid";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

/* ────────── helper: GridRowSelectionModel → string[] ────────── */
/* MUI v8 তে GridRowSelectionModel হল object { type, ids: Set<GridRowId> }
   আবার পুরোনো v6/v7 তে এটা GridRowId[] ছিল।
   দুটো কেসেই নিরাপদে string[] বের করি।                         */
const selectionToIds = (model: GridRowSelectionModel): string[] => {
  /* ── MUI v8 style: { type: 'include'|'exclude', ids: Set<GridRowId> } ── */
  if (
    model !== null &&
    typeof model === "object" &&
    !Array.isArray(model) &&
    "ids" in (model as any)
  ) {
    return Array.from((model as any).ids as Set<GridRowId>).map(String);
  }
  /* ── MUI v6/v7 style: GridRowId[] ── */
  if (Array.isArray(model)) {
    return (model as GridRowId[]).map(String);
  }
  return [];
};

/* ────────── page ────────── */
export default function AdminUserTransactionsPage() {
  /* ────────── params ────────── */
  const params = useParams<{ id: string }>();
  const id = params.id;

  /* ────────── UI state ────────── */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [transactionType, setTransactionType] = useState<string | undefined>();
  const [isCashIn, setIsCashIn] = useState<"true" | "false" | undefined>();
  const [isCashOut, setIsCashOut] = useState<"true" | "false" | undefined>();

  /* ────────── selection state — MUI-version-safe ────────── */
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>(
    /* MUI v8 এর default empty model */
    (() => {
      try {
        /* MUI v8: { type: 'include', ids: Set } */
        return { type: "include" as const, ids: new Set<GridRowId>() };
      } catch {
        return [] as unknown as GridRowSelectionModel;
      }
    })(),
  );

  /* derived: plain string[] — সব জায়গায় এটাই ব্যবহার হবে */
  const selectedIds = useMemo(
    () => selectionToIds(selectionModel),
    [selectionModel],
  );

  const [deleteConfirm, setDeleteConfirm] = useState(false);

  /* ────────── toast ────────── */
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ────────── user header ────────── */
  const { data: userData } = useGetUserByIdQuery({ id });
  const user = userData?.user;

  /* ────────── data ────────── */
  const { data, isLoading, isFetching, refetch } = useGetUserTransactionsQuery({
    id,
    page,
    limit: pageSize,
    search: search || undefined,
    sortBy,
    sortOrder,
    transactionType,
    isCashIn,
    isCashOut,
  });

  const rows = data?.transactions ?? [];
  const total = data?.pagination?.total ?? 0;

  /* ────────── delete mutation ────────── */
  const [deleteTransactions, { isLoading: deleteLoading }] =
    useAdminDeleteTransactionsMutation();

  /* ────────── grid sort handler ────────── */
  const handleSortChange = (m: GridSortModel) => {
    const first = m[0];
    if (first?.field) setSortBy(first.field);
    if (first?.sort) setSortOrder(first.sort);
  };

  const initialSort = useMemo(
    () => [{ field: sortBy, sort: sortOrder }] as GridSortModel,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /* ────────── clear selection helper ────────── */
  const clearSelection = () => {
    try {
      setSelectionModel({
        type: "include" as const,
        ids: new Set<GridRowId>(),
      });
    } catch {
      setSelectionModel([] as unknown as GridRowSelectionModel);
    }
  };

  /* ────────── delete handler ────────── */
  const handleDelete = async () => {
    if (!selectedIds.length) return;
    try {
      const res = await deleteTransactions({
        id,
        transactionIds: selectedIds,
      }).unwrap();
      showToast(res.message);
      clearSelection();
      setDeleteConfirm(false);
      refetch();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Delete failed", "error");
    }
  };

  /* ────────── render ────────── */
  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      {/* ────────── toast ────────── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] rounded-xl border px-4 py-3 text-sm font-medium shadow-xl ${
            toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/15 text-rose-300"
          }`}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-7xl p-6 space-y-4">
        {/* ────────── header ────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Transactions</h1>
            <p className="text-xs text-[rgb(var(--app-text-muted))] mt-0.5">
              {user ? `${user.name} (${user.customerId})` : "User"} ·{" "}
              <span className="text-teal-300">{total}</span> total transactions
            </p>
          </div>
          <Link
            href={`/users/${id}`}
            className="text-sm text-teal-300 hover:underline shrink-0"
          >
            ← Back to user
          </Link>
        </div>

        {/* ────────── toolbar ────────── */}
        <UserTransactionsToolbar
          search={search}
          onSearchChange={(v) => {
            setPage(1);
            setSearch(v);
          }}
          transactionType={transactionType}
          onTypeChange={(v) => {
            setPage(1);
            setTransactionType(v);
          }}
          isCashIn={isCashIn}
          onCashInChange={(v) => {
            setPage(1);
            setIsCashIn(v);
          }}
          isCashOut={isCashOut}
          onCashOutChange={(v) => {
            setPage(1);
            setIsCashOut(v);
          }}
          pageSize={pageSize}
          onPageSizeChange={(n) => {
            setPage(1);
            setPageSize(n);
          }}
        />

        {/* ────────── selection action bar ────────── */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between rounded-xl border border-rose-500/30 bg-rose-500/8 px-4 py-3">
            <span className="text-sm text-[rgb(var(--app-text))]">
              <span className="font-bold text-rose-400">
                {selectedIds.length}
              </span>{" "}
              transaction(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={clearSelection}
                className="text-xs text-[rgb(var(--app-text-muted))] hover:text-[rgb(var(--app-text))]"
              >
                Clear
              </button>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="rounded-xl border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/25 transition-colors"
              >
                🗑 Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* ────────── table ────────── */}
        <UserTransactionsTable
          rows={rows}
          loading={isLoading || isFetching}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(n) => {
            setPage(1);
            setPageSize(n);
          }}
          onSortChange={handleSortChange}
          initialSort={initialSort}
          selectionModel={selectionModel}
          onSelectionChange={setSelectionModel}
        />
      </div>

      {/* ────────── Delete Confirm Modal ────────── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-rose-600/30 bg-[rgb(var(--app-surface))] p-6 shadow-2xl">
            <h3 className="font-bold text-[rgb(var(--app-text))] mb-2">
              🗑 Delete Transactions?
            </h3>
            <p className="text-sm text-[rgb(var(--app-text-muted))] mb-5">
              <span className="text-rose-400 font-semibold">
                {selectedIds.length}
              </span>{" "}
              টি transaction permanently delete হয়ে যাবে। এই অ্যাকশন
              অপরিবর্তনীয়।
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 rounded-xl border border-[rgb(var(--app-border))] py-2 text-sm text-[rgb(var(--app-text-muted))] hover:text-[rgb(var(--app-text))] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex-1 rounded-xl border border-rose-600/40 bg-rose-600/20 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-600/30 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
