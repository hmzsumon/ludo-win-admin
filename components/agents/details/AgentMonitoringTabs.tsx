"use client";

import PaginationMini from "@/components/ui/PaginationMini";
import SectionCard from "@/components/ui/SectionCard";
import TabsMini from "@/components/ui/TabsMini";
import {
  useGetAgentCommissionConfigQuery,
  useGetAgentDepositsQuery,
  useGetAgentPlayersQuery,
  useGetAgentWithdrawsQuery,
  useUpdateAgentCommissionConfigMutation,
} from "@/redux/features/agent/agentApi";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

type TabKey = "players" | "deposits" | "withdraws" | "commission";

export default function AgentMonitoringTabs({
  agentId,
  onRefreshAgent,
}: {
  agentId: string;
  onRefreshAgent?: () => void;
}) {
  const [tab, setTab] = useState<TabKey>("players");

  // players
  const [playerSearch, setPlayerSearch] = useState("");
  const [playerPage, setPlayerPage] = useState(1);

  const {
    data: playersData,
    isLoading: playersLoading,
    refetch: refetchPlayers,
  } = useGetAgentPlayersQuery(
    { id: agentId, search: playerSearch, page: playerPage, limit: 20 },
    { skip: !agentId || tab !== "players" },
  );

  // deposits
  const [depositStatus, setDepositStatus] = useState("pending");
  const [depositPage, setDepositPage] = useState(1);

  const {
    data: depositsData,
    isLoading: depositsLoading,
    refetch: refetchDeposits,
  } = useGetAgentDepositsQuery(
    { id: agentId, status: depositStatus, page: depositPage, limit: 20 },
    { skip: !agentId || tab !== "deposits" },
  );

  // withdraws
  const [withdrawStatus, setWithdrawStatus] = useState("pending");
  const [withdrawPage, setWithdrawPage] = useState(1);

  const {
    data: withdrawsData,
    isLoading: withdrawsLoading,
    refetch: refetchWithdraws,
  } = useGetAgentWithdrawsQuery(
    { id: agentId, status: withdrawStatus, page: withdrawPage, limit: 20 },
    { skip: !agentId || tab !== "withdraws" },
  );

  // commission config
  const {
    data: commissionCfgData,
    isLoading: cfgLoading,
    refetch: refetchCfg,
  } = useGetAgentCommissionConfigQuery(
    { agentId },
    { skip: !agentId || tab !== "commission" },
  );

  const [updateCfg, { isLoading: savingCfg }] =
    useUpdateAgentCommissionConfigMutation();

  const cfg = commissionCfgData?.data;
  const [cfgDeposit, setCfgDeposit] = useState<number>(10);
  const [cfgWithdraw, setCfgWithdraw] = useState<number>(5);
  const [cfgActive, setCfgActive] = useState<boolean>(true);
  const [cfgNote, setCfgNote] = useState<string>("");

  useMemo(() => {
    if (!cfg) return;
    if (typeof cfg.depositPercent === "number")
      setCfgDeposit(cfg.depositPercent);
    if (typeof cfg.withdrawPercent === "number")
      setCfgWithdraw(cfg.withdrawPercent);
    if (typeof cfg.isActive === "boolean") setCfgActive(cfg.isActive);
    if (typeof cfg.note === "string") setCfgNote(cfg.note);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg?._id]);

  const refreshNow = async () => {
    try {
      if (tab === "players") await refetchPlayers();
      if (tab === "deposits") await refetchDeposits();
      if (tab === "withdraws") await refetchWithdraws();
      if (tab === "commission") await refetchCfg();
      toast.success("Refreshed ✅");
    } catch {
      toast.error("Refresh failed");
    }
  };

  const onSaveCommissionConfig = async () => {
    const d = Math.max(0, Math.min(100, Number(cfgDeposit || 0)));
    const w = Math.max(0, Math.min(100, Number(cfgWithdraw || 0)));

    try {
      await updateCfg({
        agentId,
        depositPercent: d,
        withdrawPercent: w,
        isActive: !!cfgActive,
        note: cfgNote || "",
      } as any).unwrap();

      toast.success("Commission config saved ✅");
      refetchCfg();
      onRefreshAgent?.();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || "Save failed");
    }
  };

  return (
    <SectionCard
      title="Monitoring"
      subtitle="Players • Deposits • Withdraws • Commission Config"
      right={
        <button
          onClick={refreshNow}
          className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-xs hover:bg-[rgb(var(--app-surface-3))]/80"
        >
          Refresh
        </button>
      }
    >
      <TabsMini
        value={tab}
        onChange={(k) => setTab(k)}
        items={[
          { key: "players", label: "Players" },
          { key: "deposits", label: "Deposits" },
          { key: "withdraws", label: "Withdraws" },
          { key: "commission", label: "Commission Config" },
        ]}
      />

      {/* Players */}
      {tab === "players" && (
        <>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <input
              value={playerSearch}
              onChange={(e) => {
                setPlayerSearch(e.target.value);
                setPlayerPage(1);
              }}
              placeholder="Search players (name/email/phone/customerId)"
              className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none"
            />
          </div>

          {playersLoading ? (
            <div className="text-sm text-[rgb(var(--app-text-muted))]">Loading players...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[rgb(var(--app-text-muted))]">
                  <tr>
                    <th className="py-2">CustomerId</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Phone</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Balance</th>
                    <th className="py-2">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {(playersData?.data ?? []).map((p: any) => (
                    <tr key={p?._id} className="border-t border-[rgb(var(--app-border))]">
                      <td className="py-2">{p?.customerId}</td>
                      <td className="py-2">{p?.name}</td>
                      <td className="py-2">{p?.phone}</td>
                      <td className="py-2 text-[rgb(var(--app-text-soft))]">{p?.email}</td>
                      <td className="py-2">
                        {Number(p?.cashBalance ?? 0) +
                          Number(p?.bonusBalance ?? 0)}
                      </td>
                      <td className="py-2 text-[rgb(var(--app-text-muted))]">
                        {p?.createdAt
                          ? new Date(p.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {!(playersData?.data ?? []).length && (
                    <tr>
                      <td colSpan={6} className="py-3 text-[rgb(var(--app-text-muted))]">
                        No players found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <PaginationMini
                page={playersData?.pagination?.page ?? playerPage}
                totalPages={playersData?.pagination?.totalPages ?? 1}
                onPrev={() => setPlayerPage((p) => Math.max(1, p - 1))}
                onNext={() => setPlayerPage((p) => p + 1)}
              />
            </div>
          )}
        </>
      )}

      {/* Deposits */}
      {tab === "deposits" && (
        <>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={depositStatus}
              onChange={(e) => {
                setDepositStatus(e.target.value);
                setDepositPage(1);
              }}
              className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm"
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="confirmed">confirmed</option>
              <option value="rejected">rejected</option>
              <option value="failed">failed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          {depositsLoading ? (
            <div className="text-sm text-[rgb(var(--app-text-muted))]">Loading deposits...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[rgb(var(--app-text-muted))]">
                  <tr>
                    <th className="py-2">Order</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">TxId</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(depositsData?.data ?? []).map((d: any) => (
                    <tr key={d?._id} className="border-t border-[rgb(var(--app-border))]">
                      <td className="py-2">{d?.orderId}</td>
                      <td className="py-2">
                        {d?.customerId} • {d?.phone}
                      </td>
                      <td className="py-2">{d?.amount}</td>
                      <td className="py-2 text-[rgb(var(--app-text-soft))]">{d?.txId}</td>
                      <td className="py-2">{d?.status}</td>
                      <td className="py-2 text-[rgb(var(--app-text-muted))]">
                        {d?.createdAt
                          ? new Date(d.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {!(depositsData?.data ?? []).length && (
                    <tr>
                      <td colSpan={6} className="py-3 text-[rgb(var(--app-text-muted))]">
                        No deposits found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <PaginationMini
                page={depositsData?.pagination?.page ?? depositPage}
                totalPages={depositsData?.pagination?.totalPages ?? 1}
                onPrev={() => setDepositPage((p) => Math.max(1, p - 1))}
                onNext={() => setDepositPage((p) => p + 1)}
              />
            </div>
          )}
        </>
      )}

      {/* Withdraws */}
      {tab === "withdraws" && (
        <>
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={withdrawStatus}
              onChange={(e) => {
                setWithdrawStatus(e.target.value);
                setWithdrawPage(1);
              }}
              className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm"
            >
              <option value="pending">pending</option>
              <option value="approved">approved</option>
              <option value="confirmed">confirmed</option>
              <option value="rejected">rejected</option>
              <option value="failed">failed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>

          {withdrawsLoading ? (
            <div className="text-sm text-[rgb(var(--app-text-muted))]">Loading withdraws...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[rgb(var(--app-text-muted))]">
                  <tr>
                    <th className="py-2">SL</th>
                    <th className="py-2">Customer</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Net</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {(withdrawsData?.data ?? []).map((w: any) => (
                    <tr key={w?._id} className="border-t border-[rgb(var(--app-border))]">
                      <td className="py-2">{w?.sl_no}</td>
                      <td className="py-2">
                        {w?.customerId} • {w?.phone}
                      </td>
                      <td className="py-2">{w?.amount}</td>
                      <td className="py-2">{w?.netAmount}</td>
                      <td className="py-2">{w?.status}</td>
                      <td className="py-2 text-[rgb(var(--app-text-muted))]">
                        {w?.createdAt
                          ? new Date(w.createdAt).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))}
                  {!(withdrawsData?.data ?? []).length && (
                    <tr>
                      <td colSpan={6} className="py-3 text-[rgb(var(--app-text-muted))]">
                        No withdraws found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <PaginationMini
                page={withdrawsData?.pagination?.page ?? withdrawPage}
                totalPages={withdrawsData?.pagination?.totalPages ?? 1}
                onPrev={() => setWithdrawPage((p) => Math.max(1, p - 1))}
                onNext={() => setWithdrawPage((p) => p + 1)}
              />
            </div>
          )}
        </>
      )}

      {/* Commission */}
      {tab === "commission" && (
        <>
          {cfgLoading ? (
            <div className="text-sm text-[rgb(var(--app-text-muted))]">
              Loading commission config...
            </div>
          ) : (
            <div className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 p-4">
              <div className="mb-2 text-sm font-semibold">
                Edit Agent Commission
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                <input
                  type="number"
                  value={cfgDeposit}
                  onChange={(e) => setCfgDeposit(Number(e.target.value || 0))}
                  className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm"
                  placeholder="Deposit %"
                />
                <input
                  type="number"
                  value={cfgWithdraw}
                  onChange={(e) => setCfgWithdraw(Number(e.target.value || 0))}
                  className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm"
                  placeholder="Withdraw %"
                />
                <label className="flex items-center gap-2 rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 px-3 py-2 text-sm">
                  <input
                    type="checkbox"
                    checked={cfgActive}
                    onChange={(e) => setCfgActive(e.target.checked)}
                  />
                  isActive
                </label>
                <button
                  onClick={onSaveCommissionConfig}
                  disabled={savingCfg}
                  className="rounded-lg bg-teal-600/80 px-3 py-2 text-sm font-semibold hover:bg-teal-600 disabled:opacity-50"
                >
                  {savingCfg ? "Saving..." : "Save Config"}
                </button>
              </div>

              <input
                value={cfgNote}
                onChange={(e) => setCfgNote(e.target.value)}
                placeholder="note (optional)"
                className="mt-2 w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none"
              />

              <div className="mt-2 text-xs text-[rgb(var(--app-text-muted))]">Range: 0-100</div>
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}
