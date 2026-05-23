/* ────────── imports ────────── */
"use client";
import type { AdminUserRow } from "@/redux/features/admin/adminUsersApi";

/* ────────── danger zone ────────── */
export default function UserDangerZone({
  user,
  onOpenClose,
}: {
  user: AdminUserRow;
  onOpenClose: () => void;
}) {
  if (user.is_permanent_closed) return null;

  return (
    <section className="rounded-2xl border border-rose-600/30 bg-rose-600/5 p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-rose-400">
        ⚠️ Danger Zone
      </h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-[rgb(var(--app-text))]">
            Permanently Close Account
          </div>
          <div className="text-xs text-[rgb(var(--app-text-muted))] mt-0.5">
            সব ডিভাইস থেকে logout, email নোটিফিকেশন। এই অ্যাকশন অপরিবর্তনীয়।
          </div>
        </div>
        <button
          onClick={onOpenClose}
          className="ml-4 rounded-xl border border-rose-600/40 bg-rose-600/15 px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-600/25 transition-colors shrink-0"
        >
          Close Account
        </button>
      </div>
    </section>
  );
}
