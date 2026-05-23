/* ────────── imports ────────── */
"use client";
import type { AdminUserRow } from "@/redux/features/admin/adminUsersApi";

/* ────────── action cards ────────── */
export default function UserDetailsActions({
  user,
  activeLoading,
  withdrawLoading,
  onOpenBalance,
  onOpenEmail,
  onToggleActive,
  onToggleWithdraw,
}: {
  user: AdminUserRow;
  activeLoading: boolean;
  withdrawLoading: boolean;
  onOpenBalance: () => void;
  onOpenEmail: () => void;
  onToggleActive: () => void;
  onToggleWithdraw: () => void;
}) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {/* ────────── Balance Update ────────── */}
      <button
        onClick={onOpenBalance}
        disabled={!!user.is_permanent_closed}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-teal-500/25 bg-teal-500/8 p-4 hover:bg-teal-500/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
          💎
        </div>
        <span className="text-xs font-semibold text-teal-300">
          Update Balance
        </span>
      </button>

      {/* ────────── Email Change ────────── */}
      <button
        onClick={onOpenEmail}
        disabled={!!user.is_permanent_closed}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-cyan-500/25 bg-cyan-500/8 p-4 hover:bg-cyan-500/15 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-cyan-300">
          Change Email
        </span>
      </button>

      {/* ────────── Active Toggle ────────── */}
      <button
        onClick={onToggleActive}
        disabled={activeLoading || !!user.is_permanent_closed}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          user.is_active
            ? "border-rose-500/25 bg-rose-500/8 hover:bg-rose-500/15"
            : "border-emerald-500/25 bg-emerald-500/8 hover:bg-emerald-500/15"
        }`}
      >
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            user.is_active
              ? "bg-rose-500/20 text-rose-400"
              : "bg-emerald-500/20 text-emerald-400"
          }`}
        >
          {activeLoading ? (
            <svg
              className="animate-spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : user.is_active ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M10 15l-3-3m0 0l3-3m-3 3h8" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M10 8l6 4-6 4V8z" />
            </svg>
          )}
        </div>
        <span
          className={`text-xs font-semibold ${user.is_active ? "text-rose-300" : "text-emerald-300"}`}
        >
          {user.is_active ? "Deactivate" : "Activate"}
        </span>
      </button>

      {/* ────────── Withdraw Block Toggle ────────── */}
      <button
        onClick={onToggleWithdraw}
        disabled={withdrawLoading || !!user.is_permanent_closed}
        className={`flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          user.is_withdraw_block
            ? "border-emerald-500/25 bg-emerald-500/8 hover:bg-emerald-500/15"
            : "border-amber-500/25 bg-amber-500/8 hover:bg-amber-500/15"
        }`}
      >
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${
            user.is_withdraw_block
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-amber-500/20 text-amber-400"
          }`}
        >
          {withdrawLoading ? (
            <svg
              className="animate-spin"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
          )}
        </div>
        <span
          className={`text-xs font-semibold ${user.is_withdraw_block ? "text-emerald-300" : "text-amber-300"}`}
        >
          {user.is_withdraw_block ? "Unblock Withdraw" : "Block Withdraw"}
        </span>
      </button>
    </section>
  );
}
