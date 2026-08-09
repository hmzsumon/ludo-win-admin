"use client";

import {
  AppInstallationRow,
  useGetAppAnalyticsSummaryQuery,
  useGetAppInstallationsQuery,
} from "@/redux/features/app-analytics/appAnalyticsApi";
import {
  Activity,
  CalendarCheck2,
  Download,
  Info,
  PackageCheck,
  RefreshCw,
  Search,
  Smartphone,
  UserCheck,
  Users,
  Wifi,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type StatusFilter = "" | "online" | "active7d" | "active30d" | "inactive";
type SourceFilter = "" | "android-twa" | "legacy-standalone" | "pwa";

const dateValue = (date: Date) => {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
};

const dateDaysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return dateValue(date);
};

const number = (value?: number) =>
  new Intl.NumberFormat("en-US").format(value || 0);

const dateTime = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-BD", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

function MetricCard({
  label,
  value,
  note,
  icon,
  color,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[rgb(var(--app-text-muted))]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-[rgb(var(--app-text))]">
            {value}
          </p>
          <p className="mt-1 text-[11px] text-[rgb(var(--app-text-muted))]">
            {note}
          </p>
        </div>
        <div className={`shrink-0 rounded-xl p-2.5 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function RankingList({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number; note?: string }>;
}) {
  const maximum = Math.max(1, ...rows.map((row) => row.value));

  return (
    <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
      <h2 className="text-sm font-bold">{title}</h2>
      <div className="mt-5 space-y-4">
        {rows.length ? (
          rows.map((row, index) => (
            <div key={`${row.label}-${index}`}>
              <div className="mb-1.5 flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[rgb(var(--app-text-soft))]">
                    {row.label}
                  </p>
                  {row.note ? (
                    <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                      {row.note}
                    </p>
                  ) : null}
                </div>
                <span className="font-bold">{number(row.value)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[rgb(var(--app-surface-2))]">
                <div
                  className="h-full rounded-full bg-cyan-400"
                  style={{ width: `${(row.value / maximum) * 100}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-[rgb(var(--app-text-muted))]">No data yet</p>
        )}
      </div>
    </div>
  );
}

const statusBadge = (row: AppInstallationRow) => {
  if (row.activityStatus === "online") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
      </span>
    );
  }
  if (row.activityStatus === "active") {
    return (
      <span className="rounded-full bg-blue-500/10 px-2 py-1 text-[11px] font-semibold text-blue-400">
        Active
      </span>
    );
  }
  return (
    <span className="rounded-full bg-slate-500/10 px-2 py-1 text-[11px] font-semibold text-[rgb(var(--app-text-muted))]">
      Inactive
    </span>
  );
};

const sourceLabel = (source: AppInstallationRow["source"]) => {
  if (source === "android-twa") return "APK v3+";
  if (source === "legacy-standalone") return "Legacy APK/PWA";
  return "PWA";
};

export default function AppAnalyticsPage() {
  const [from, setFrom] = useState(() => dateDaysAgo(29));
  const [to, setTo] = useState(() => dateValue(new Date()));
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [source, setSource] = useState<SourceFilter>("");
  const [version, setVersion] = useState("");
  const [page, setPage] = useState(1);

  const summaryQuery = useGetAppAnalyticsSummaryQuery({ from, to });
  const installationFilters = useMemo(
    () => ({
      page,
      limit: 20,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
      ...(version ? { version } : {}),
    }),
    [page, search, status, source, version],
  );
  const installationsQuery = useGetAppInstallationsQuery(installationFilters);

  const summary = summaryQuery.data?.data;
  const installations = installationsQuery.data?.data || [];
  const pagination = installationsQuery.data?.meta;
  const loading = summaryQuery.isFetching || installationsQuery.isFetching;

  const setPreset = (days: number) => {
    setFrom(dateDaysAgo(days - 1));
    setTo(dateValue(new Date()));
  };

  const refresh = () => {
    void summaryQuery.refetch();
    void installationsQuery.refetch();
  };

  const versionRows = (summary?.versions || []).map((row) => ({
    label: `Version ${row._id.appVersion || "unknown"}`,
    value: row.installations,
    note: `${number(row.active30Days)} active in 30 days · code ${row._id.versionCode || 0}`,
  }));
  const deviceRows = (summary?.devices || []).map((row) => ({
    label:
      [row._id.manufacturer, row._id.model].filter(Boolean).join(" ") ||
      "Legacy / unavailable",
    value: row.installations,
    note: `Last seen ${dateTime(row.lastSeenAt)}`,
  }));
  const sourceRows = (summary?.sources || []).map((row) => ({
    label:
      row._id === "android-twa"
        ? "APK v3+"
        : row._id === "legacy-standalone"
          ? "Legacy APK / standalone"
          : "PWA",
    value: row.installations,
  }));

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-cyan-500/10 p-2 text-cyan-400">
              <Smartphone className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">App Analytics</h1>
          </div>
          <p className="mt-2 text-sm text-[rgb(var(--app-text-muted))]">
            APK downloads, first-open installations, live devices and app versions.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] px-4 py-2 text-xs font-semibold text-[rgb(var(--app-text-soft))] hover:bg-[rgb(var(--app-surface-2))] disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase text-[rgb(var(--app-text-muted))]">
              From
            </label>
            <input
              type="date"
              value={from}
              max={to}
              onChange={(event) => setFrom(event.target.value)}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase text-[rgb(var(--app-text-muted))]">
              To
            </label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(event) => setTo(event.target.value)}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs outline-none"
            />
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setPreset(days)}
                className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs font-semibold hover:border-cyan-500/50 hover:text-cyan-400"
              >
                {days} days
              </button>
            ))}
          </div>
        </div>
      </div>

      {summaryQuery.isError || installationsQuery.isError ? (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          App analytics could not be loaded. Deploy the updated API before using this page.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Download Requests"
          value={number(summary?.downloads.totalRequests)}
          note={`${number(summary?.downloads.today)} today`}
          icon={<Download className="h-5 w-5" />}
          color="bg-violet-500/10 text-violet-400"
        />
        <MetricCard
          label="Unique Downloaders"
          value={number(summary?.downloads.uniqueDownloaders)}
          note="Browser-based unique IDs"
          icon={<Users className="h-5 w-5" />}
          color="bg-blue-500/10 text-blue-400"
        />
        <MetricCard
          label="Opened Installations"
          value={number(summary?.installations.total)}
          note={`${number(summary?.installations.today)} first opened today`}
          icon={<PackageCheck className="h-5 w-5" />}
          color="bg-cyan-500/10 text-cyan-400"
        />
        <MetricCard
          label="Online Now"
          value={number(summary?.activity.onlineNow)}
          note={`Heartbeat within ${summary?.activity.onlineWindowSeconds || 120} seconds`}
          icon={<Wifi className="h-5 w-5" />}
          color="bg-emerald-500/10 text-emerald-400"
        />
        <MetricCard
          label="Active Today"
          value={number(summary?.activity.today)}
          note="Unique installations seen today"
          icon={<Activity className="h-5 w-5" />}
          color="bg-amber-500/10 text-amber-400"
        />
        <MetricCard
          label="Active 7 Days"
          value={number(summary?.activity.last7Days)}
          note={`${number(summary?.activity.last30Days)} active in 30 days`}
          icon={<CalendarCheck2 className="h-5 w-5" />}
          color="bg-fuchsia-500/10 text-fuchsia-400"
        />
        <MetricCard
          label="Linked Users"
          value={number(summary?.installations.linkedToUsers)}
          note="Installations used by signed-in users"
          icon={<UserCheck className="h-5 w-5" />}
          color="bg-indigo-500/10 text-indigo-400"
        />
        <MetricCard
          label="Install / Download"
          value={`${summary?.installations.conversionRate || 0}%`}
          note="Estimated; legacy installs can affect this rate"
          icon={<Smartphone className="h-5 w-5" />}
          color="bg-rose-500/10 text-rose-400"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
        <h2 className="text-sm font-bold">Download and first-open trend</h2>
        <div className="mt-5 h-80">
          {summary?.trend.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.trend}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" strokeDasharray="4 4" />
                <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="downloads" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="installs" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[rgb(var(--app-text-muted))]">
              No app analytics data in this date range
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RankingList title="App versions" rows={versionRows} />
        <RankingList title="Device models" rows={deviceRows} />
        <RankingList title="Installation sources" rows={sourceRows} />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))]">
        <div className="flex flex-col justify-between gap-3 border-b border-[rgb(var(--app-border))] p-5 xl:flex-row xl:items-end">
          <div>
            <h2 className="text-sm font-bold">Installation devices</h2>
            <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
              Privacy-safe app instance IDs; no IMEI or MAC address is stored.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--app-text-muted))]" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Device, user, ID..."
                className="w-56 rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] py-2 pl-9 pr-3 text-xs outline-none"
              />
            </div>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as StatusFilter);
                setPage(1);
              }}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs outline-none"
            >
              <option value="">All activity</option>
              <option value="online">Online now</option>
              <option value="active7d">Active 7 days</option>
              <option value="active30d">Active 30 days</option>
              <option value="inactive">Inactive 30+ days</option>
            </select>
            <select
              value={source}
              onChange={(event) => {
                setSource(event.target.value as SourceFilter);
                setPage(1);
              }}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs outline-none"
            >
              <option value="">All sources</option>
              <option value="android-twa">APK v3+</option>
              <option value="legacy-standalone">Legacy APK/PWA</option>
              <option value="pwa">PWA</option>
            </select>
            <select
              value={version}
              onChange={(event) => {
                setVersion(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs outline-none"
            >
              <option value="">All versions</option>
              {(summary?.versions || []).map((row) => (
                <option key={`${row._id.appVersion}-${row._id.versionCode}`} value={row._id.appVersion}>
                  Version {row._id.appVersion}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1280px] text-left text-xs">
            <thead className="bg-[rgb(var(--app-surface-2))] text-[rgb(var(--app-text-muted))]">
              <tr>
                <th className="px-5 py-3 font-semibold">Installation</th>
                <th className="px-4 py-3 font-semibold">Device</th>
                <th className="px-4 py-3 font-semibold">App</th>
                <th className="px-4 py-3 font-semibold">First open</th>
                <th className="px-4 py-3 font-semibold">Last seen</th>
                <th className="px-4 py-3 font-semibold">Activity</th>
                <th className="px-4 py-3 font-semibold">Linked user</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--app-border))]">
              {installations.map((row) => (
                <tr key={row._id}>
                  <td className="px-5 py-3">
                    <p className="font-mono font-semibold text-cyan-400">{row.displayId}</p>
                    <p className="mt-0.5 text-[10px] text-[rgb(var(--app-text-muted))]">
                      {sourceLabel(row.source)}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">
                      {[row.deviceManufacturer, row.deviceModel].filter(Boolean).join(" ") || "Unavailable"}
                    </p>
                    <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                      {row.androidVersion ? `Android ${row.androidVersion}` : row.operatingSystem || "Unknown OS"}
                      {row.city || row.countryCode
                        ? ` · ${[row.city, row.countryCode].filter(Boolean).join(", ")}`
                        : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold">v{row.appVersion || "unknown"}</p>
                    <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                      Code {row.versionCode || 0}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{dateTime(row.firstOpenedAt)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{dateTime(row.lastSeenAt)}</td>
                  <td className="px-4 py-3">
                    {number(row.openCount)} opens
                    <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                      {number(row.heartbeatCount)} heartbeats
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {row.lastUser ? (
                      <>
                        <p className="font-semibold">{row.lastUser.name}</p>
                        <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                          ID {row.lastUser.customerId} · {row.lastUser.phone}
                        </p>
                      </>
                    ) : (
                      <span className="text-[rgb(var(--app-text-muted))]">Guest / not linked</span>
                    )}
                  </td>
                  <td className="px-4 py-3">{statusBadge(row)}</td>
                </tr>
              ))}
              {!installations.length ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-[rgb(var(--app-text-muted))]">
                    No installations found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[rgb(var(--app-border))] p-4 text-xs">
          <span className="text-[rgb(var(--app-text-muted))]">
            {number(pagination?.total)} installations
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-[rgb(var(--app-border))] px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <span>Page {page} of {Math.max(1, pagination?.totalPages || 1)}</span>
            <button
              onClick={() => setPage((current) => current + 1)}
              disabled={page >= (pagination?.totalPages || 1)}
              className="rounded-lg border border-[rgb(var(--app-border))] px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-xs text-cyan-300">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Download Requests means the APK download was started. Opened Installations means the installed app was actually launched at least once. Exact uninstall status is not available for direct APK distribution.
      </div>
    </main>
  );
}
