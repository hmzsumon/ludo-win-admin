"use client";

import { useParams } from "next/navigation";

import {
  useGetAgentByIdQuery,
  useGetAgentLedgerQuery,
} from "@/redux/features/agent/agentApi";

import AgentAccountEdit from "@/components/agents/details/AgentAccountEdit";
import AgentConfigCard from "@/components/agents/details/AgentConfigCard";
import AgentCredentialsCard from "@/components/agents/details/AgentCredentialsCard";
import AgentHeaderCards from "@/components/agents/details/AgentHeaderCards";
import AgentLedgerTable from "@/components/agents/details/AgentLedgerTable";
import AgentMonitoringTabs from "@/components/agents/details/AgentMonitoringTabs";

export default function AgentDetailsPage() {
  const params = useParams();
  const id = String((params as any)?.id || "");

  const { data, isLoading, isFetching, refetch } = useGetAgentByIdQuery(id, {
    skip: !id,
  });

  const { data: ledgerData, isLoading: ledgerLoading } = useGetAgentLedgerQuery(
    { id, limit: 50 },
    { skip: !id },
  );

  const agent = data?.data?.agent;
  const statusDoc = data?.data?.statusDoc;
  const walletDoc = data?.data?.walletDoc;
  const commissionConfigReadOnly = data?.data?.commissionConfig;
  const depositMethodStats = data?.data?.depositMethodStats;

  const ledgerRows = (ledgerData?.data ?? []).map((x: any) => ({
    id: x?._id,
    _id: x?._id,
    type: x?.type,
    amount: x?.amount,
    rollingDelta: x?.rollingDelta,
    netDelta: x?.netDelta,
    meta: x?.meta,
    note: x?.note,
    externalRef: x?.externalRef,
    createdAt: x?.createdAt,
    updatedAt: x?.updatedAt,
  }));

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-6xl py-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold">Agent Details</h1>
          <p className="text-xs text-[rgb(var(--app-text-muted))]">
            Monitoring • config • limits
          </p>
        </div>

        {isLoading || isFetching ? (
          <div className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 py-4">
            Loading...
          </div>
        ) : (
          <>
            <AgentHeaderCards
              agent={agent}
              statusDoc={statusDoc}
              walletDoc={walletDoc}
            />
            <AgentCredentialsCard agent={agent} />
            <AgentAccountEdit agent={agent} onSaved={() => refetch()} />

            <AgentConfigCard
              agent={agent}
              statusDoc={statusDoc}
              commissionConfigReadOnly={commissionConfigReadOnly}
              depositMethodStats={depositMethodStats}
              agentId={id}
              onRefetch={() => refetch()}
            />

            <AgentMonitoringTabs
              agentId={id}
              onRefreshAgent={() => refetch()}
            />
            <AgentLedgerTable rows={ledgerRows} loading={ledgerLoading} />
          </>
        )}
      </div>
    </main>
  );
}
