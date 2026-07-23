/* ────────── imports ────────── */
"use client";
import type { AdminUserRow } from "@/redux/features/admin/adminUsersApi";
import Link from "next/link";
import { useState } from "react";
import { Badge, InfoRow } from "./UserDetailsShared";
import { fmtDate } from "./userDetailsUtils";

/* ────────── info sections ────────── */
export default function UserDetailsInfoSections({
  user,
}: {
  user: AdminUserRow;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* ────────── Personal Info ────────── */}
      <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--app-text-muted))]">
          Personal Information
        </h3>
        <InfoRow label="Full Name">{user.name ?? "—"}</InfoRow>
        <InfoRow label="Email">{user.email ?? "—"}</InfoRow>
        <InfoRow label="Phone">{user.phone ?? "—"}</InfoRow>
        <InfoRow label="Country">{user.country ?? "—"}</InfoRow>
        <InfoRow label="Customer ID">
          <span className="font-mono text-teal-300">{user.customerId}</span>
        </InfoRow>
        <InfoRow label="Role">
          <span className="capitalize">{user.role}</span>
        </InfoRow>
        <InfoRow label="Rank">{user.rank ?? "—"}</InfoRow>
        <InfoRow label="VIP Tier">{user.vipTier ?? "—"}</InfoRow>
        <InfoRow label="Created At">{fmtDate(user.createdAt)}</InfoRow>
        <InfoRow label="Active At">{fmtDate(user.activeAt)}</InfoRow>
        <InfoRow label="Sponsor">
          {user.sponsorName ? (
            <span className="flex items-center gap-1">
              {user.sponsorName}
              {user.sponsorId && (
                <Link
                  href={`/users/${user.sponsorId}`}
                  className="text-teal-400 hover:underline text-[10px]"
                >
                  [view]
                </Link>
              )}
            </span>
          ) : (
            "—"
          )}
        </InfoRow>
        <InfoRow label="Agent">{user.agentName ?? "—"}</InfoRow>
      </section>

      {/* ────────── Security & Status ────────── */}
      <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--app-text-muted))]">
          Security & Status
        </h3>

        {/* text_password with show/hide */}
        <div className="border-b border-[rgb(var(--app-border))]/60 py-2.5 flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-[rgb(var(--app-text-muted))] w-36 shrink-0">
            Password (text)
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-amber-300">
              {showPassword ? (user.text_password ?? "—") : "••••••••"}
            </span>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-[rgb(var(--app-text-muted))] hover:text-[rgb(var(--app-text))] transition-colors"
              title={showPassword ? "Hide" : "Show"}
            >
              {showPassword ? (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <InfoRow label="Email Verified">
          <Badge
            active={!!user.email_verified}
            trueLabel="Verified"
            falseLabel="Not Verified"
          />
        </InfoRow>
        <InfoRow label="KYC Verified">
          <Badge
            active={!!user.kyc_verified}
            trueLabel="Verified"
            falseLabel="Pending"
          />
        </InfoRow>
        <InfoRow label="KYC Request">
          <Badge
            active={!!user.kyc_request}
            trueLabel="Requested"
            falseLabel="No"
          />
        </InfoRow>
        <InfoRow label="KYC Step">{String(user.kyc_step ?? "—")}</InfoRow>
        <InfoRow label="2FA Enabled">
          <Badge
            active={!!user.two_factor_enabled}
            trueLabel="Enabled"
            falseLabel="Disabled"
          />
        </InfoRow>
        <InfoRow label="AI Trade Active">
          <Badge
            active={!!user.is_active_aiTrade}
            trueLabel="Active"
            falseLabel="Inactive"
          />
        </InfoRow>
        <InfoRow label="Blocked">
          <Badge
            active={!user.is_block}
            trueLabel="Clear"
            falseLabel="Blocked"
          />
        </InfoRow>

        {/* ────────── permanent close info ────────── */}
        {user.is_permanent_closed && (
          <div className="mt-3 rounded-xl border border-rose-600/30 bg-rose-600/10 p-3">
            <div className="text-xs font-semibold text-rose-400 mb-1">
              ⛔ Account Permanently Closed
            </div>
            <div className="text-[10px] text-rose-300/70">
              {fmtDate(user.permanent_closed_at)} —{" "}
              {user.permanent_close_reason ?? "No reason provided"}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
