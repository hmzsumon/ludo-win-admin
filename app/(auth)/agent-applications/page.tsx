"use client";

/* ────────── imports ────────── */
import Card from "@/components/new-ui/Card";
import Tabs, { Tab } from "@/components/new-ui/Tabs";
import {
  IAgentApplication,
  useAdminApproveAgentApplicationMutation,
  useAdminGetAgentApplicationsQuery,
  useAdminRejectAgentApplicationMutation,
} from "@/redux/features/agentApplication/agentApplicationApi";
import { useState } from "react";

type StatusKey = "pending" | "approved" | "rejected";

/* ────────── page ────────── */
export default function AgentApplicationsPage() {
  const [status, setStatus] = useState<StatusKey>("pending");
  const { data, isLoading, refetch } = useAdminGetAgentApplicationsQuery({
    status,
  });

  const rows = data?.data || [];

  const tabs: Tab[] = [
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        {/* ────────── header ────────── */}
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#21D3B3]">
              Agent Recruitment
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Agent Applications
            </h1>
            <p className="mt-1 text-sm text-[rgb(var(--app-text-muted))]">
              Review "Become an Agent" applications submitted by users.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-4 py-2 text-sm text-[rgb(var(--app-text-soft))] hover:bg-[rgb(var(--app-surface-3))]/80"
          >
            Refresh
          </button>
        </div>

        {/* ────────── filter tabs ────────── */}
        <Card>
          <Tabs
            tabs={tabs}
            active={status}
            onChange={(k) => setStatus(k as StatusKey)}
          />
        </Card>

        {/* ────────── list ────────── */}
        <div className="mt-5 space-y-3">
          {isLoading ? (
            <Card>
              <p className="text-sm text-[rgb(var(--app-text-muted))]">
                Loading applications...
              </p>
            </Card>
          ) : rows.length === 0 ? (
            <Card>
              <p className="text-sm text-[rgb(var(--app-text-muted))]">
                No {status} applications.
              </p>
            </Card>
          ) : (
            rows.map((app) => (
              <ApplicationRow key={app._id} app={app} onDone={refetch} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════
   SUB COMPONENT
   ════════════════════════════════════════════════════════════════ */

function ApplicationRow({
  app,
  onDone,
}: {
  app: IAgentApplication;
  onDone: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [approve, { isLoading: approving }] =
    useAdminApproveAgentApplicationMutation();
  const [reject, { isLoading: rejecting }] =
    useAdminRejectAgentApplicationMutation();

  const busy = approving || rejecting;

  const handleApprove = async () => {
    try {
      await approve({ id: app._id, adminNote }).unwrap();
      onDone();
    } catch {
      alert("Approve failed");
    }
  };

  const handleReject = async () => {
    if (!adminNote.trim()) {
      alert("Please add a reason before rejecting");
      return;
    }
    try {
      await reject({ id: app._id, adminNote }).unwrap();
      onDone();
    } catch {
      alert("Reject failed");
    }
  };

  const statusColor =
    app.status === "approved"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      : app.status === "rejected"
        ? "text-red-400 bg-red-500/10 border-red-500/30"
        : "text-amber-400 bg-amber-500/10 border-amber-500/30";

  return (
    <Card className="!px-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold">{app.fullName}</span>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor}`}
            >
              {app.status}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-[rgb(var(--app-text-muted))]">
            {app.agentType} · {app.phone} · {app.customerId}
          </p>
        </div>
        <span className="shrink-0 text-xs text-[rgb(var(--app-text-muted))]">
          {new Date(app.createdAt).toLocaleDateString()}
        </span>
      </button>

      {open && (
        <div className="mt-4 space-y-2 border-t border-[rgb(var(--app-border))] pt-3 text-sm">
          <Row label="Agent Type" value={app.agentType} />
          <Row label="Phone" value={app.phone} />
          <Row label="WhatsApp" value={app.whatsapp || "—"} />
          <Row label="Telegram" value={app.telegram || "—"} />
          <Row label="Address" value={app.address || "—"} />
          <Row label="Applicant Note" value={app.note || "—"} />
          {app.adminNote && <Row label="Admin Note" value={app.adminNote} />}

          {app.status === "pending" && (
            <div className="mt-3 space-y-2">
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Note to applicant (required for reject, optional for approve)"
                rows={2}
                className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={busy}
                  className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                >
                  {approving ? "Approving..." : "Approve"}
                </button>
                <button
                  onClick={handleReject}
                  disabled={busy}
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                >
                  {rejecting ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="shrink-0 text-[rgb(var(--app-text-muted))]">
        {label}
      </span>
      <span className="text-right text-[rgb(var(--app-text-soft))]">
        {value}
      </span>
    </div>
  );
}
