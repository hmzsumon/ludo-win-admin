/* ────────── imports ────────── */
"use client";
import type { AdminUserRow } from "@/redux/features/admin/adminUsersApi";
import Link from "next/link";
import { Badge } from "./UserDetailsShared";

/* ────────── header ────────── */
export default function UserDetailsHeader({
  user,
  onBack,
}: {
  user: AdminUserRow;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3">
        {/* ────────── avatar ────────── */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500/30 to-cyan-500/30 border border-teal-500/20 text-lg font-bold text-teal-300 shrink-0">
          {user.name?.charAt(0)?.toUpperCase() ?? "?"}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">{user.name ?? "—"}</h1>
            <Badge
              active={!!user.is_active}
              trueLabel="Active"
              falseLabel="Inactive"
            />
            {user.is_withdraw_block && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-amber-400 uppercase">
                Withdraw Blocked
              </span>
            )}
            {user.is_permanent_closed && (
              <span className="rounded-full border border-rose-600/40 bg-rose-600/20 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-400 uppercase">
                ⛔ Closed
              </span>
            )}
          </div>
          <p className="text-xs text-[rgb(var(--app-text-muted))] mt-0.5">
            {user.customerId} · {user.role} · {user.email}
          </p>
        </div>
      </div>

      {/* ────────── header actions ────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href={`/users/${user._id}/transactions`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300 hover:bg-teal-500/20 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 12h6M9 16h4" />
          </svg>
          All Transactions
        </Link>
        <button
          onClick={onBack}
          className="text-xs text-[rgb(var(--app-text-muted))] hover:text-[rgb(var(--app-text))] transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
