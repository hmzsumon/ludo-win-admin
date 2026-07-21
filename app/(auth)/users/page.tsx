/* ────────── imports ────────── */
"use client";
import AdminUsersTable from "@/components/admin/AdminUsersTable";
import AdminUsersToolbar from "@/components/admin/AdminUsersToolbar";
import {
  useGetAdminUserStatsQuery,
  useGetAllUsersQuery,
  useMigrateLegacyUsersMutation,
} from "@/redux/features/admin/adminUsersApi";

import { useMemo, useState } from "react";

/* ────────── page ────────── */
const AllUsersPage = () => {
  /* ────────── UI state ────────── */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<string | undefined>();
  const [is_active, setIsActive] = useState<"true" | "false" | undefined>();
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  /* ────────── data ────────── */
  const { data, isLoading, isFetching } = useGetAllUsersQuery({
    page,
    limit: pageSize,
    search: search || undefined,
    role,
    is_active,
    is_bot: "false",
    sortBy,
    sortOrder,
  });

  const { data: statsData } = useGetAdminUserStatsQuery();
  const [migrateLegacy, { isLoading: migrating }] =
    useMigrateLegacyUsersMutation();
  const [migrationMessage, setMigrationMessage] = useState("");

  const runMigration = async (dryRun: boolean) => {
    try {
      const r = await migrateLegacy({ dryRun }).unwrap();
      setMigrationMessage(
        `${dryRun ? "Preview" : "Migration"}: ${JSON.stringify(r.summary)}`,
      );
    } catch (e: any) {
      setMigrationMessage(
        e?.data?.error || e?.data?.message || "Migration failed",
      );
    }
  };

  const users = data?.users ?? [];
  const total = data?.pagination?.total ?? 0;

  const onlyUsers = users.filter((u) => !u.is_bot);

  /* ────────── sort handler ────────── */
  const handleSortChange = (m: any) => {
    const first = Array.isArray(m) && m.length ? m[0] : undefined;
    if (first?.field) setSortBy(first.field);
    if (first?.sort) setSortOrder(first.sort);
  };

  /* ────────── initial sort for grid ────────── */
  const initialSort = useMemo(
    () => [{ field: sortBy, sort: sortOrder }] as any,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">All Users</h1>
            <p className="text-xs text-[rgb(var(--app-text-muted))]">
              Admin dashboard • manage users
            </p>
          </div>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total users", value: statsData?.stats.total },
            { label: "Today", value: statsData?.stats.today },
            { label: "Previous", value: statsData?.stats.previous },
          ].map((x) => (
            <div
              key={x.label}
              className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-4"
            >
              <p className="text-xs text-[rgb(var(--app-text-muted))]">
                {x.label}
              </p>
              <p className="mt-1 text-2xl font-bold">{x.value ?? 0}</p>
            </div>
          ))}
        </div>
        <div className="mb-5 rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <b>Legacy user repair</b>
            <button
              disabled={migrating}
              onClick={() => runMigration(true)}
              className="rounded-lg border border-cyan-400/40 px-3 py-2 text-xs text-cyan-300"
            >
              Preview
            </button>
            <button
              disabled={migrating}
              onClick={() =>
                confirm("Update all valid old human users?") &&
                runMigration(false)
              }
              className="rounded-lg bg-amber-400 px-3 py-2 text-xs font-bold text-slate-950"
            >
              Repair all valid users
            </button>
          </div>
          {migrationMessage && (
            <p className="mt-2 break-all text-xs text-amber-300">
              {migrationMessage}
            </p>
          )}
        </div>

        <AdminUsersToolbar
          search={search}
          onSearchChange={(v) => {
            setPage(1);
            setSearch(v);
          }}
          role={role}
          onRoleChange={(v) => {
            setPage(1);
            setRole(v);
          }}
          is_active={is_active}
          onActiveChange={(v) => {
            setPage(1);
            setIsActive(v);
          }}
          pageSize={pageSize}
          onPageSizeChange={(n) => {
            setPage(1);
            setPageSize(n);
          }}
        />

        <AdminUsersTable
          rows={onlyUsers}
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
        />
      </div>
    </main>
  );
};

export default AllUsersPage;
