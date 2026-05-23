"use client";

/* ────────── imports ────────── */
import { useGetAgentsQuery } from "@/redux/features/agent/agentApi";
import { useSendAgentNoticeMutation } from "@/redux/features/notice/agentNoticeApi";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  CheckCircle2,
  Megaphone,
  Search,
  Send,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";

/* ────────── helpers ────────── */
const getMongoId = (value: any): string => {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (value?.$oid) return String(value.$oid);

  if (typeof value?.toString === "function") return String(value.toString());

  return "";
};

/* ────────── actual agent/user id বের করছি ──────────
   Agent API অনেক সময় AgentStatus doc দেয়।
   তাই notice পাঠানোর জন্য _id না নিয়ে agentId/user id নিতে হবে।
──────────────────────────────────────────── */
const getAgentUserId = (row: any): string => {
  return (
    getMongoId(row?.agentId) ||
    getMongoId(row?.userId) ||
    getMongoId(row?.agent?._id) ||
    getMongoId(row?.user?._id) ||
    getMongoId(row?._id) ||
    getMongoId(row?.id)
  );
};

const getRowId = (row: any): string => getAgentUserId(row);

/* ────────── MUI v8 selection normalize ──────────
   DataGrid v8 rowSelectionModel.ids অনেক সময় Set<unknown> infer করে।
   তাই এখানে force করে string[] বানাচ্ছি।
──────────────────────────────────────────── */
const normalizeSelection = (model: any): string[] => {
  if (Array.isArray(model)) {
    return model.map((id: any) => String(id)).filter(Boolean);
  }

  if (model?.ids instanceof Set) {
    return Array.from(model.ids as Set<any>)
      .map((id: any) => String(id))
      .filter(Boolean);
  }

  if (Array.isArray(model?.ids)) {
    return model.ids.map((id: any) => String(id)).filter(Boolean);
  }

  return [];
};

/* ────────── page ────────── */
export default function AdminAgentNoticesPage() {
  /* ────────── form state ────────── */
  const [mode, setMode] = useState<"all" | "selected">("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successText, setSuccessText] = useState("");
  const [errorText, setErrorText] = useState("");

  /* ────────── agent list for selected notice ──────────
     এখানে user list না, সরাসরি agent query use করছি।
     /agents API থেকে real agent/statusDoc data আসে।
  ──────────────────────────────────────────── */
  const { data, isLoading: agentsLoading, isFetching } = useGetAgentsQuery();

  const agentRows = useMemo<any[]>(() => {
    const list = data?.data ?? [];

    return (list || []).filter((agent: any) => Boolean(getAgentUserId(agent)));
  }, [data]);

  /* ────────── agent search filter ──────────
     API level search নাই, তাই loaded agent list থেকে client-side filter।
  ──────────────────────────────────────────── */
  const agents = useMemo<any[]>(() => {
    const q = search.trim().toLowerCase();

    if (!q) return agentRows;

    return agentRows.filter((agent: any) =>
      `${agent?.name || ""} ${agent?.agentTitle || ""} ${agent?.email || ""} ${
        agent?.phone || ""
      } ${agent?.customerId || ""}`
        .toLowerCase()
        .includes(q),
    );
  }, [agentRows, search]);

  /* ────────── all agent ids for notice target ──────────
     All mode হলেও backend এ exact agent ids পাঠাচ্ছি।
     এতে role/user collection mismatch হলেও notice যাবে।
  ──────────────────────────────────────────── */
  const allAgentIds = useMemo<string[]>(() => {
    const ids = agentRows
      .map((agent: any) => getAgentUserId(agent))
      .filter((id: string) => Boolean(id));

    return Array.from(new Set<string>(ids));
  }, [agentRows]);

  const selectedCount = selectedIds.length;
  const totalAgentCount = allAgentIds.length;
  const targetIds: string[] = mode === "all" ? allAgentIds : selectedIds;
  const targetCount = targetIds.length;

  /* ────────── MUI v8 row selection model ────────── */
  const rowSelectionModel = useMemo(
    () => ({ type: "include" as const, ids: new Set<string>(selectedIds) }),
    [selectedIds],
  );

  const [sendNotice, { isLoading: sendingNotice }] =
    useSendAgentNoticeMutation();

  /* ────────── table columns ────────── */
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "name",
        headerName: "Agent",
        minWidth: 190,
        flex: 1,
        renderCell: (params) => (
          <div className="min-w-0">
            <div className="truncate text-xs font-bold text-[rgb(var(--app-text))]">
              {params.row?.name || "Unnamed Agent"}
            </div>
            <div className="truncate text-[11px] text-[rgb(var(--app-text-muted))]">
              {params.row?.agentTitle || params.row?.email || "-"}
            </div>
          </div>
        ),
      },
      {
        field: "customerId",
        headerName: "Customer ID",
        minWidth: 110,
        flex: 0.5,
        renderCell: (params) => (
          <span className="text-xs font-bold text-[rgb(var(--app-text))]">
            {params.row?.customerId || "-"}
          </span>
        ),
      },
      {
        field: "email",
        headerName: "Email / Phone",
        minWidth: 230,
        flex: 1,
        renderCell: (params) => (
          <div className="min-w-0">
            <div className="truncate text-xs font-semibold text-[rgb(var(--app-text))]">
              {params.row?.email || "-"}
            </div>
            <div className="truncate text-[11px] text-[rgb(var(--app-text-muted))]">
              {params.row?.phone || "-"}
            </div>
          </div>
        ),
      },
      {
        field: "is_active",
        headerName: "Status",
        minWidth: 105,
        flex: 0.45,
        renderCell: (params) => {
          const active =
            String(
              params.row?.statusDoc?.status || params.row?.status || "",
            ).toLowerCase() === "active";

          return (
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                active
                  ? "bg-emerald-500/10 text-emerald-300"
                  : "bg-red-500/10 text-red-300"
              }`}
            >
              {active ? "Active" : "Inactive"}
            </span>
          );
        },
      },
    ],
    [],
  );

  /* ────────── send notice ────────── */
  const handleSubmit = async () => {
    setSuccessText("");
    setErrorText("");

    if (!title.trim()) {
      setErrorText("Title দিতে হবে");
      return;
    }

    if (!message.trim()) {
      setErrorText("Message দিতে হবে");
      return;
    }

    if (targetIds.length === 0) {
      setErrorText(
        mode === "all"
          ? "কোন agent পাওয়া যায়নি"
          : "কমপক্ষে একজন agent select করতে হবে",
      );
      return;
    }

    try {
      const res = await sendNotice({
        /* ────────── important ──────────
           Backend all mode যদি user role দিয়ে agent খুঁজে 0 পায়,
           তাই exact agent ids দিয়ে selected mode এ পাঠাচ্ছি।
        ─────────────────────────────── */
        mode: "selected",
        title: title.trim(),
        message: message.trim(),
        url: url.trim() || undefined,
        agentIds: targetIds,
      }).unwrap();

      const sentCount = res?.data?.sentCount ?? (res as any)?.sentCount ?? 0;

      if (Number(sentCount) <= 0) {
        setErrorText(
          "Notice request গেছে, কিন্তু কোনো agent receive করেনি। Backend এ agentIds দিয়ে recipient create হচ্ছে কিনা check করুন।",
        );
        return;
      }

      setSuccessText(`${sentCount} জন agent কে notice পাঠানো হয়েছে`);
      setTitle("");
      setMessage("");
      setUrl("");
      setSelectedIds([]);
    } catch (err: any) {
      setErrorText(err?.data?.message || "Notice পাঠানো যায়নি");
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Agent Notices</h1>
            <p className="text-xs text-[rgb(var(--app-text-muted))]">
              Admin message • all agents • selected agents
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-1.5 text-xs text-[rgb(var(--app-text-muted))]">
            <Megaphone className="h-4 w-4" />
            Agent notice sender
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[440px_1fr]">
          {/* ────────── compose card ────────── */}
          <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-semibold">Create Agent Notice</h2>
              <p className="text-xs text-[rgb(var(--app-text-muted))]">
                Message টি agent panel এ notification/notice হিসেবে দেখাবে।
              </p>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <button
                type="button"
                onClick={() => setMode("all")}
                className={`rounded-2xl border p-4 text-left transition ${
                  mode === "all"
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-[rgb(var(--app-border))] bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <UsersRound className="h-4 w-4" /> All Agents
                </div>
                <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                  সব agent একসাথে notice পাবে।
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("selected")}
                className={`rounded-2xl border p-4 text-left transition ${
                  mode === "selected"
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-[rgb(var(--app-border))] bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Selected Agents
                </div>
                <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                  এক বা একাধিক agent select করে notice পাঠান।
                </p>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                  Title
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notice title"
                  className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-3 text-sm outline-none transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-400/60"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                  Message
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Agent notice message লিখুন"
                  rows={7}
                  className="w-full resize-none rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-3 text-sm outline-none transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-400/60"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                  URL optional
                </span>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/dashboard অথবা empty রাখুন"
                  className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-3 text-sm outline-none transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-400/60"
                />
              </label>
            </div>

            {errorText ? (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
                {errorText}
              </div>
            ) : null}

            {successText ? (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                {successText}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-[rgb(var(--app-text-muted))]">
                Target:{" "}
                {mode === "all"
                  ? `${targetCount} agents`
                  : `${targetCount} selected agents`}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={sendingNotice}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {sendingNotice ? "Sending..." : "Send Notice"}
              </button>
            </div>
          </section>

          {/* ────────── agent selector with MUI DataGrid ────────── */}
          <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold">Select Agents</h2>
                <p className="text-xs text-[rgb(var(--app-text-muted))]">
                  Selected mode এ এই DataGrid থেকে agent বাছাই করুন।
                </p>
              </div>
              <span className="w-fit rounded-full border border-[rgb(var(--app-border))] bg-white/[0.03] px-2.5 py-1 text-xs text-[rgb(var(--app-text-muted))]">
                {selectedCount} selected
              </span>
            </div>

            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--app-text-muted))]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search agent / email / customer id"
                className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.03] py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-400/60"
              />
            </div>

            <div className="mb-3 flex items-center justify-between text-xs text-[rgb(var(--app-text-muted))]">
              <span>
                {agentsLoading || isFetching
                  ? "Loading agents..."
                  : `${totalAgentCount} agents loaded`}
              </span>

              {selectedIds.length ? (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="h-[560px] overflow-hidden rounded-2xl border border-[rgb(var(--app-border))] bg-white/[0.03]">
              <DataGrid
                rows={agents}
                columns={columns}
                loading={agentsLoading || isFetching}
                getRowId={getRowId}
                checkboxSelection
                disableRowSelectionOnClick
                rowSelectionModel={rowSelectionModel}
                onRowSelectionModelChange={(model) => {
                  if (mode !== "selected") return;
                  setSelectedIds(normalizeSelection(model));
                }}
                isRowSelectable={() => mode === "selected"}
                pageSizeOptions={[10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                      page: 0,
                    },
                  },
                }}
                sx={{
                  border: "none",
                  color: "rgb(var(--app-text))",
                  fontSize: "12px",

                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "rgba(255,255,255,0.04)",
                    color: "rgb(var(--app-text-muted))",
                    borderBottom: "1px solid rgb(var(--app-border))",
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 800,
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  },

                  "& .MuiDataGrid-cell": {
                    borderTop: "1px solid rgb(var(--app-border))",
                    borderBottom: "none",
                    outline: "none !important",
                    display: "flex",
                    alignItems: "center",
                  },

                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "rgba(255,255,255,0.04)",
                  },

                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid rgb(var(--app-border))",
                    color: "rgb(var(--app-text-muted))",
                  },

                  "& .MuiTablePagination-root, & .MuiSvgIcon-root": {
                    color: "rgb(var(--app-text-muted))",
                  },

                  "& .MuiCheckbox-root": {
                    color: "rgb(var(--app-text-muted))",
                  },

                  "& .MuiDataGrid-overlay": {
                    backgroundColor: "transparent",
                  },
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
