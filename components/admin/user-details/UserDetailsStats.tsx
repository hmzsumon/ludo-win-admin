/* ────────── imports ────────── */
"use client";
import type {
  AdminUserRow,
  AdminUserWallet,
} from "@/redux/features/admin/adminUsersApi";
import { StatCard } from "./UserDetailsShared";
import { fmtDiamond } from "./userDetailsUtils";

/* ────────── key stats ────────── */
export default function UserDetailsStats({
  user,
  wallet,
}: {
  user: AdminUserRow;
  wallet: AdminUserWallet | null | undefined;
}) {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard
        label="Main Balance"
        value={fmtDiamond(user.m_balance)}
        sub={`Last: ${fmtDiamond(user.last_m_balance)}`}
        accent="text-teal-300"
      />
      <StatCard
        label="Total Deposit"
        value={fmtDiamond(wallet?.totalDeposit)}
        accent="text-emerald-400"
      />
      <StatCard
        label="Total Withdraw"
        value={fmtDiamond(wallet?.totalWithdraw)}
        accent="text-rose-400"
      />
      <StatCard
        label="Total Earning"
        value={fmtDiamond(wallet?.totalEarning)}
        accent="text-amber-400"
      />
      <StatCard label="Diamond Balance" value={fmtDiamond(user.diamond_balance)} />
      <StatCard label="Bonus Diamonds" value={`🎁 ${fmtDiamond(user.bonus_diamonds)}`} />
      <StatCard label="Today Earning" value={fmtDiamond(wallet?.todayEarning)} />
      <StatCard label="This Month" value={fmtDiamond(wallet?.thisMonthEarning)} />
    </section>
  );
}
