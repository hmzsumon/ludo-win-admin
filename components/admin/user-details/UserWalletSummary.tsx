/* ────────── imports ────────── */
"use client";
import type { AdminUserWallet } from "@/redux/features/admin/adminUsersApi";
import { InfoRow } from "./UserDetailsShared";
import { fmtDiamond } from "./userDetailsUtils";

/* ────────── wallet summary ────────── */
export default function UserWalletSummary({
  wallet,
}: {
  wallet: AdminUserWallet | null | undefined;
}) {
  return (
    <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[rgb(var(--app-text-muted))]">
        Wallet Summary
      </h3>
      {wallet ? (
        <div className="grid grid-cols-1 gap-x-10 gap-y-0 md:grid-cols-2">
          <div>
            <InfoRow label="Total Receive">{fmtDiamond(wallet.totalReceive)}</InfoRow>
            <InfoRow label="Total Send">{fmtDiamond(wallet.totalSend)}</InfoRow>
            <InfoRow label="Total Deposit">{fmtDiamond(wallet.totalDeposit)}</InfoRow>
            <InfoRow label="Total Withdraw">{fmtDiamond(wallet.totalWithdraw)}</InfoRow>
            <InfoRow label="Referral Bonus">{fmtDiamond(wallet.totalReferralBonus)}</InfoRow>
            <InfoRow label="Sponsor Bonus">{fmtDiamond(wallet.totalSponsorBonus)}</InfoRow>
          </div>
          <div>
            <InfoRow label="Total Commission">{fmtDiamond(wallet.totalCommission)}</InfoRow>
            <InfoRow label="AI Trade Comm.">{fmtDiamond(wallet.totalAiTradeCommission)}</InfoRow>
            <InfoRow label="Live Trade Comm.">{fmtDiamond(wallet.totalLiveTradeCommission)}</InfoRow>
            <InfoRow label="This Month Earn">{fmtDiamond(wallet.thisMonthEarning)}</InfoRow>
            <InfoRow label="Today Earning">{fmtDiamond(wallet.todayEarning)}</InfoRow>
            <InfoRow label="Total Earning">{fmtDiamond(wallet.totalEarning)}</InfoRow>
          </div>
        </div>
      ) : (
        <div className="text-sm text-[rgb(var(--app-text-muted))]">
          No wallet data found.
        </div>
      )}
    </section>
  );
}
