/* ────────── imports ────────── */
"use client";
import type { AdminUserRow } from "@/redux/features/admin/adminUsersApi";
import { Modal } from "./UserDetailsShared";
import { fmtDiamond } from "./userDetailsUtils";

/* ────────── balance modal ────────── */
export function BalanceModal({
  open,
  user,
  balanceAmount,
  balanceType,
  balanceNote,
  balanceLoading,
  onClose,
  onAmountChange,
  onTypeChange,
  onNoteChange,
  onConfirm,
}: {
  open: boolean;
  user: AdminUserRow;
  balanceAmount: string;
  balanceType: "add" | "deduct";
  balanceNote: string;
  balanceLoading: boolean;
  onClose: () => void;
  onAmountChange: (value: string) => void;
  onTypeChange: (value: "add" | "deduct") => void;
  onNoteChange: (value: string) => void;
  onConfirm: () => void;
}) {
  const amount = parseFloat(balanceAmount);
  const newBalance =
    balanceType === "add"
      ? (user.m_balance ?? 0) + amount
      : (user.m_balance ?? 0) - amount;

  return (
    <Modal open={open} onClose={onClose} title="Update Balance">
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => onTypeChange("add")}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              balanceType === "add"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-[rgb(var(--app-surface-2))]/60 border border-[rgb(var(--app-border))] text-[rgb(var(--app-text-muted))]"
            }`}
          >
            ➕ Add
          </button>
          <button
            onClick={() => onTypeChange("deduct")}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-colors ${
              balanceType === "deduct"
                ? "bg-rose-500/20 border border-rose-500/40 text-rose-300"
                : "bg-[rgb(var(--app-surface-2))]/60 border border-[rgb(var(--app-border))] text-[rgb(var(--app-text-muted))]"
            }`}
          >
            ➖ Deduct
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-xs text-[rgb(var(--app-text-muted))]">
            Current Balance:{" "}
            <span className="text-teal-300 font-semibold">
              {fmtDiamond(user.m_balance)}
            </span>
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={balanceAmount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Amount"
            className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 px-3 py-2.5 text-sm text-[rgb(var(--app-text))] placeholder:text-[rgb(var(--app-text-muted))] focus:border-teal-500/60 focus:outline-none"
          />
        </div>

        <div>
          <input
            type="text"
            value={balanceNote}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Note (optional)"
            className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 px-3 py-2.5 text-sm text-[rgb(var(--app-text))] placeholder:text-[rgb(var(--app-text-muted))] focus:border-teal-500/60 focus:outline-none"
          />
        </div>

        {balanceAmount && amount > 0 && (
          <div className="rounded-xl bg-[rgb(var(--app-surface-2))]/60 px-3 py-2 text-xs text-[rgb(var(--app-text-muted))]">
            New balance:{" "}
            <span className="text-teal-300 font-semibold">
              {fmtDiamond(newBalance)}
            </span>
          </div>
        )}

        <button
          onClick={onConfirm}
          disabled={balanceLoading}
          className="w-full rounded-xl bg-teal-500/20 border border-teal-500/40 py-2.5 text-sm font-semibold text-teal-300 hover:bg-teal-500/30 transition-colors disabled:opacity-50"
        >
          {balanceLoading ? "Processing..." : "Confirm Update"}
        </button>
      </div>
    </Modal>
  );
}

/* ────────── email modal ────────── */
export function EmailModal({
  open,
  user,
  newEmail,
  emailLoading,
  onClose,
  onEmailChange,
  onConfirm,
}: {
  open: boolean;
  user: AdminUserRow;
  newEmail: string;
  emailLoading: boolean;
  onClose: () => void;
  onEmailChange: (value: string) => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Change Email">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs text-[rgb(var(--app-text-muted))]">
            Current:{" "}
            <span className="text-[rgb(var(--app-text))]">{user.email}</span>
          </label>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="New email address"
            className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 px-3 py-2.5 text-sm text-[rgb(var(--app-text))] placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-500/60 focus:outline-none"
          />
        </div>
        <p className="text-xs text-[rgb(var(--app-text-muted))]">
          Email পরিবর্তন হলে email_verified reset হবে।
        </p>
        <button
          onClick={onConfirm}
          disabled={emailLoading}
          className="w-full rounded-xl bg-cyan-500/20 border border-cyan-500/40 py-2.5 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
        >
          {emailLoading ? "Updating..." : "Update Email"}
        </button>
      </div>
    </Modal>
  );
}

/* ────────── permanent close modal ────────── */
export function PermanentCloseModal({
  open,
  closeReason,
  closeLoading,
  onClose,
  onReasonChange,
  onConfirm,
}: {
  open: boolean;
  closeReason: string;
  closeLoading: boolean;
  onClose: () => void;
  onReasonChange: (value: string) => void;
  onConfirm: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="⛔ Permanently Close Account">
      <div className="space-y-4">
        <div className="rounded-xl border border-rose-600/30 bg-rose-600/10 p-3 text-xs text-rose-300">
          এই অ্যাকশন অপরিবর্তনীয়। User সব ডিভাইস থেকে logout হয়ে যাবে এবং
          email পাবে।
        </div>
        <div>
          <textarea
            value={closeReason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Reason for closing (optional)"
            rows={3}
            className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 px-3 py-2.5 text-sm text-[rgb(var(--app-text))] placeholder:text-[rgb(var(--app-text-muted))] focus:border-rose-500/60 focus:outline-none resize-none"
          />
        </div>
        <button
          onClick={onConfirm}
          disabled={closeLoading}
          className="w-full rounded-xl bg-rose-600/20 border border-rose-600/40 py-2.5 text-sm font-semibold text-rose-400 hover:bg-rose-600/30 transition-colors disabled:opacity-50"
        >
          {closeLoading ? "Closing..." : "Permanently Close Account"}
        </button>
      </div>
    </Modal>
  );
}
