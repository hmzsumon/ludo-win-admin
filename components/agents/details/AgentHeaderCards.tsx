"use client";

const numberValue = (value: any) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const formatAmount = (value: any) => {
  return numberValue(value).toLocaleString("en-US");
};

const getStatusValue = (statusDoc: any, keys: string[]) => {
  for (const key of keys) {
    const value = statusDoc?.[key];
    if (value !== undefined && value !== null) return value;
  }

  return 0;
};

const StatLine = ({ label, value }: { label: string; value: any }) => {
  return (
    <div className="flex items-center justify-between gap-3 text-xs leading-6">
      <span className="text-[rgb(var(--app-text-muted))]">{label}</span>
      <b className="whitespace-nowrap text-[rgb(var(--app-text))]">
        {formatAmount(value)}
      </b>
    </div>
  );
};

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-4">
      <div className="mb-2 text-xs font-semibold text-[rgb(var(--app-text-muted))]">
        {title}
      </div>
      {children}
    </div>
  );
};

export default function AgentHeaderCards({
  agent,
  statusDoc,
  walletDoc,
}: {
  agent: any;
  statusDoc: any;
  walletDoc: any;
}) {
  /* ──────────────────────────────────────────────────────────────────────
   * Agent status summary
   * - API পুরনো/নতুন দুই টাইপ key পাঠাতে পারে।
   * - তাই today / toDay দুইটাই fallback রাখা হলো।
   * ────────────────────────────────────────────────────────────────────── */
  const todayDeposits = getStatusValue(statusDoc, [
    "todayDeposits",
    "toDayDeposits",
  ]);
  const todayWithdrawals = getStatusValue(statusDoc, [
    "todayWithdrawals",
    "toDayWithdrawals",
  ]);
  const todayCommissions = getStatusValue(statusDoc, [
    "todayCommissions",
    "toDayCommissions",
  ]);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <SectionCard title="Agent">
        <div className="text-sm font-semibold text-[rgb(var(--app-text))]">
          {agent?.name} • {agent?.customerId}
        </div>
        <div className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
          {agent?.email} • {agent?.phone}
        </div>
        <div className="mt-3 space-y-1">
          <StatLine
            label="Status"
            value={statusDoc?.status || agent?.status || "-"}
          />
          <StatLine label="Agent Type" value={statusDoc?.agentType || "-"} />
          <StatLine label="Credit Limit" value={statusDoc?.creditLimit} />
          <StatLine label="Rolling Balance" value={statusDoc?.rollingBalance} />
        </div>
      </SectionCard>

      <SectionCard title="Deposits">
        <StatLine label="Today" value={todayDeposits} />
        <StatLine label="Total" value={statusDoc?.totalDeposits} />
        <StatLine label="Today Count" value={statusDoc?.todayDepositCount} />
        <StatLine label="Total Count" value={statusDoc?.totalDepositCount} />
        <StatLine label="This Month" value={statusDoc?.thisMonthDeposits} />
        <StatLine label="Last Month" value={statusDoc?.lastMonthDeposits} />
        <StatLine
          label="This Month Count"
          value={statusDoc?.thisMonthDepositCount}
        />
        <StatLine
          label="Last Month Count"
          value={statusDoc?.lastMonthDepositCount}
        />
      </SectionCard>

      <SectionCard title="Withdrawals">
        <StatLine label="Today" value={todayWithdrawals} />
        <StatLine label="Total" value={statusDoc?.totalWithdrawals} />
        <StatLine label="Today Count" value={statusDoc?.todayWithdrawCount} />
        <StatLine label="Total Count" value={statusDoc?.totalWithdrawCount} />
        <StatLine label="This Month" value={statusDoc?.thisMonthWithdrawals} />
        <StatLine label="Last Month" value={statusDoc?.lastMonthWithdrawals} />
        <StatLine
          label="This Month Count"
          value={statusDoc?.thisMonthWithdrawCount}
        />
        <StatLine
          label="Last Month Count"
          value={statusDoc?.lastMonthWithdrawCount}
        />
      </SectionCard>

      <SectionCard title="Commissions">
        <StatLine label="Today" value={todayCommissions} />
        <StatLine label="Total" value={statusDoc?.totalCommissions} />
        <StatLine label="This Month" value={statusDoc?.thisMonthCommissions} />
        <StatLine label="Last Month" value={statusDoc?.lastMonthCommissions} />
        <StatLine
          label="Take Commissions"
          value={statusDoc?.totalTakeCommissions}
        />
        <StatLine
          label="Deposit Total"
          value={statusDoc?.totalDepositCommission}
        />
        <StatLine
          label="Deposit Today"
          value={statusDoc?.todayDepositCommission}
        />
        <StatLine
          label="Deposit This Month"
          value={statusDoc?.thisMonthDepositCommission}
        />
        <StatLine
          label="Deposit Last Month"
          value={statusDoc?.lastMonthDepositCommission}
        />
        <StatLine
          label="Withdraw Total"
          value={statusDoc?.totalWithdrawCommission}
        />
        <StatLine
          label="Withdraw Today"
          value={statusDoc?.todayWithdrawCommission}
        />
        <StatLine
          label="Withdraw This Month"
          value={statusDoc?.thisMonthWithdrawCommission}
        />
        <StatLine
          label="Withdraw Last Month"
          value={statusDoc?.lastMonthWithdrawCommission}
        />
      </SectionCard>

      <SectionCard title="Wallet / Topup">
        <StatLine label="Available" value={walletDoc?.available} />
        <StatLine label="Total Earned" value={walletDoc?.totalEarned} />
        <StatLine label="Total Paid" value={walletDoc?.totalPaid} />
        <StatLine label="Total Topup" value={statusDoc?.totalTopUp} />
        <StatLine label="Today Topup" value={statusDoc?.todayTopUp} />
        <StatLine
          label="Total Topup Count"
          value={statusDoc?.totalTopUpCount}
        />
        <StatLine
          label="Today Topup Count"
          value={statusDoc?.todayTopUpCount}
        />
        <StatLine label="This Month Topup" value={statusDoc?.thisMonthTopUp} />
        <StatLine label="Last Month Topup" value={statusDoc?.lastMonthTopUp} />
        <StatLine
          label="This Month Count"
          value={statusDoc?.thisMonthTopUpCount}
        />
        <StatLine
          label="Last Month Count"
          value={statusDoc?.lastMonthTopUpCount}
        />
      </SectionCard>
    </div>
  );
}
