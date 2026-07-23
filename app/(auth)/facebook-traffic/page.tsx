"use client";

import {
  BreakdownRow,
  useGetFacebookTrafficSummaryQuery,
  useGetFacebookTrafficVisitorsQuery,
} from "@/redux/features/traffic/facebookTrafficApi";
import {
  BadgeCheck,
  BarChart3,
  ExternalLink,
  Eye,
  LogIn,
  MousePointerClick,
  RefreshCw,
  Search,
  UserPlus,
  Users,
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

type SourceFilter = "" | "facebook" | "instagram" | "meta";

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

const rate = (registered: number, sessions: number) =>
  sessions > 0 ? `${((registered / sessions) * 100).toFixed(1)}%` : "0%";

const statusBadge = (registeredAt?: string | null, verifiedAt?: string | null) => {
  if (verifiedAt) {
    return (
      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-400">
        Verified
      </span>
    );
  }

  if (registeredAt) {
    return (
      <span className="rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-semibold text-amber-400">
        Registered
      </span>
    );
  }

  return (
    <span className="rounded-full bg-slate-500/10 px-2 py-1 text-[11px] font-semibold text-[rgb(var(--app-text-muted))]">
      Visitor
    </span>
  );
};

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
        <div>
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
        <div className={`rounded-xl p-2.5 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

function BreakdownList({
  title,
  rows,
  field,
}: {
  title: string;
  rows: BreakdownRow[];
  field: string;
}) {
  const maximum = Math.max(1, ...rows.map((row) => row.sessions));

  return (
    <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
      <h2 className="text-sm font-bold text-[rgb(var(--app-text))]">{title}</h2>
      <div className="mt-5 space-y-4">
        {rows.length === 0 ? (
          <p className="text-sm text-[rgb(var(--app-text-muted))]">No data yet</p>
        ) : (
          rows.map((row, index) => {
            const label = row._id[field] || "Unknown";
            return (
              <div key={`${label}-${index}`}>
                <div className="mb-1.5 flex justify-between text-xs">
                  <span className="capitalize text-[rgb(var(--app-text-soft))]">
                    {label}
                  </span>
                  <span className="font-semibold text-[rgb(var(--app-text))]">
                    {number(row.sessions)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[rgb(var(--app-surface-2))]">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{ width: `${(row.sessions / maximum) * 100}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function FacebookTrafficPage() {
  const [from, setFrom] = useState(() => dateDaysAgo(29));
  const [to, setTo] = useState(() => dateValue(new Date()));
  const [source, setSource] = useState<SourceFilter>("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filters = useMemo(
    () => ({
      from,
      to,
      ...(source ? { source } : {}),
    }),
    [from, to, source],
  );

  const summaryQuery = useGetFacebookTrafficSummaryQuery(filters);
  const visitorsQuery = useGetFacebookTrafficVisitorsQuery({
    ...filters,
    page,
    limit: 20,
    ...(search.trim() ? { search: search.trim() } : {}),
  });

  const summary = summaryQuery.data?.data;
  const visitors = visitorsQuery.data?.data || [];
  const pagination = visitorsQuery.data?.meta;
  const totals = summary?.totals;
  const loading = summaryQuery.isFetching || visitorsQuery.isFetching;

  const setPreset = (days: number) => {
    setFrom(dateDaysAgo(days - 1));
    setTo(dateValue(new Date()));
    setPage(1);
  };

  const refresh = () => {
    void summaryQuery.refetch();
    void visitorsQuery.refetch();
  };

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-blue-500/10 p-2 text-blue-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Facebook Traffic
            </h1>
          </div>
          <p className="mt-2 text-sm text-[rgb(var(--app-text-muted))]">
            Landing views, CTA clicks, registrations and verified users from Meta ads.
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
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--app-text-muted))]">
              From
            </label>
            <input
              type="date"
              value={from}
              max={to}
              onChange={(event) => {
                setFrom(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--app-text-muted))]">
              To
            </label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(event) => {
                setTo(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-[rgb(var(--app-text-muted))]">
              Source
            </label>
            <select
              value={source}
              onChange={(event) => {
                setSource(event.target.value as SourceFilter);
                setPage(1);
              }}
              className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs outline-none"
            >
              <option value="">All Meta</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="meta">Meta</option>
            </select>
          </div>
          <div className="flex gap-2">
            {[7, 30, 90].map((days) => (
              <button
                key={days}
                onClick={() => setPreset(days)}
                className="rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-3 py-2 text-xs font-semibold hover:border-blue-500/50 hover:text-blue-400"
              >
                {days} days
              </button>
            ))}
          </div>
        </div>
      </div>

      {summaryQuery.isError || visitorsQuery.isError ? (
        <div className="mb-6 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-400">
          Traffic report could not be loaded. Confirm the updated API is deployed and this admin account is signed in.
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Landing Page Views"
          value={number(totals?.pageViews)}
          note={`${number(totals?.sessions)} sessions`}
          icon={<Eye className="h-5 w-5" />}
          color="bg-blue-500/10 text-blue-400"
        />
        <MetricCard
          label="Unique Visitors"
          value={number(totals?.uniqueVisitors)}
          note="Browser-based visitor IDs"
          icon={<Users className="h-5 w-5" />}
          color="bg-violet-500/10 text-violet-400"
        />
        <MetricCard
          label="CTA Clicks"
          value={number(totals?.clicks)}
          note="Free Play button clicks"
          icon={<MousePointerClick className="h-5 w-5" />}
          color="bg-cyan-500/10 text-cyan-400"
        />
        <MetricCard
          label="Main Site Arrivals"
          value={number(totals?.arrivals)}
          note="Confirmed destination loads"
          icon={<LogIn className="h-5 w-5" />}
          color="bg-indigo-500/10 text-indigo-400"
        />
        <MetricCard
          label="Registered Users"
          value={number(totals?.registered)}
          note={`${totals?.registrationRate || 0}% of sessions`}
          icon={<UserPlus className="h-5 w-5" />}
          color="bg-amber-500/10 text-amber-400"
        />
        <MetricCard
          label="Verified Users"
          value={number(totals?.verified)}
          note="Registration OTP completed"
          icon={<BadgeCheck className="h-5 w-5" />}
          color="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
        <h2 className="text-sm font-bold">Traffic and conversion trend</h2>
        <div className="mt-5 h-80">
          {summary?.timeSeries?.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={summary.timeSeries}>
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
                <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="clicks" stroke="#06b6d4" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="arrivals" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="registered" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[rgb(var(--app-text-muted))]">
              No traffic data in this date range
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <BreakdownList title="Traffic sources" rows={summary?.sources || []} field="source" />
        <BreakdownList title="Devices" rows={summary?.devices || []} field="deviceType" />
        <BreakdownList title="Browsers" rows={summary?.browsers || []} field="browser" />
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))]">
        <div className="flex items-center justify-between gap-3 border-b border-[rgb(var(--app-border))] p-5">
          <div>
            <h2 className="text-sm font-bold">Campaign performance</h2>
            <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
              Use utm_campaign and campaign_id in your Meta ad URL parameters.
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-xs">
            <thead className="bg-[rgb(var(--app-surface-2))] text-[rgb(var(--app-text-muted))]">
              <tr>
                <th className="px-5 py-3 font-semibold">Campaign</th>
                <th className="px-4 py-3 font-semibold">Sessions</th>
                <th className="px-4 py-3 font-semibold">Views</th>
                <th className="px-4 py-3 font-semibold">Clicks</th>
                <th className="px-4 py-3 font-semibold">Arrivals</th>
                <th className="px-4 py-3 font-semibold">Registered</th>
                <th className="px-4 py-3 font-semibold">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--app-border))]">
              {(summary?.campaigns || []).map((row, index) => (
                <tr key={`${row._id.campaignId}-${index}`}>
                  <td className="px-5 py-3">
                    <p className="font-semibold">{row._id.campaignName || "Unlabelled campaign"}</p>
                    <p className="mt-0.5 text-[10px] text-[rgb(var(--app-text-muted))]">
                      {row._id.campaignId || "No campaign ID"}
                    </p>
                  </td>
                  <td className="px-4 py-3">{number(row.sessions)}</td>
                  <td className="px-4 py-3">{number(row.pageViews)}</td>
                  <td className="px-4 py-3">{number(row.clicks)}</td>
                  <td className="px-4 py-3">{number(row.arrivals)}</td>
                  <td className="px-4 py-3">{number(row.registered)}</td>
                  <td className="px-4 py-3 font-semibold text-emerald-400">
                    {rate(row.registered, row.sessions)}
                  </td>
                </tr>
              ))}
              {!summary?.campaigns?.length ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[rgb(var(--app-text-muted))]">
                    No campaign data yet
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))]">
        <div className="flex flex-col justify-between gap-3 border-b border-[rgb(var(--app-border))] p-5 md:flex-row md:items-center">
          <div>
            <h2 className="text-sm font-bold">Recent Facebook visitors</h2>
            <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
              Registered user details appear only after a tracked registration.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--app-text-muted))]" />
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Campaign, ad, user, phone..."
              className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] py-2 pl-9 pr-3 text-xs outline-none md:w-72"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-left text-xs">
            <thead className="bg-[rgb(var(--app-surface-2))] text-[rgb(var(--app-text-muted))]">
              <tr>
                <th className="px-5 py-3 font-semibold">Last seen</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Campaign / Ad</th>
                <th className="px-4 py-3 font-semibold">Device</th>
                <th className="px-4 py-3 font-semibold">Activity</th>
                <th className="px-4 py-3 font-semibold">Registered user</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgb(var(--app-border))]">
              {visitors.map((visitor) => (
                <tr key={visitor._id}>
                  <td className="px-5 py-3 whitespace-nowrap">
                    {new Date(visitor.lastSeenAt).toLocaleString("en-BD")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="capitalize">{visitor.source}</span>
                    <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                      {visitor.medium || "—"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="max-w-56 truncate font-semibold">
                      {visitor.campaignName || "Unlabelled campaign"}
                    </p>
                    <p className="max-w-56 truncate text-[10px] text-[rgb(var(--app-text-muted))]">
                      {visitor.adName || visitor.adId || "No ad label"}
                    </p>
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {visitor.deviceType} · {visitor.browser}
                    <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                      {[visitor.city, visitor.countryCode].filter(Boolean).join(", ") || "Location unavailable"}
                    </p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {visitor.pageViews} views · {visitor.ctaClicks} clicks
                    <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                      {visitor.mainSiteArrivals} arrivals
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    {visitor.registeredUser ? (
                      <>
                        <p className="font-semibold">{visitor.registeredUser.name}</p>
                        <p className="text-[10px] text-[rgb(var(--app-text-muted))]">
                          ID {visitor.registeredUser.customerId} · {visitor.registeredUser.phone}
                        </p>
                      </>
                    ) : (
                      <span className="text-[rgb(var(--app-text-muted))]">Not registered</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {statusBadge(visitor.registeredAt, visitor.verifiedAt)}
                  </td>
                </tr>
              ))}
              {!visitors.length ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-[rgb(var(--app-text-muted))]">
                    No visitors found
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[rgb(var(--app-border))] p-4 text-xs">
          <span className="text-[rgb(var(--app-text-muted))]">
            {number(pagination?.total)} visitors
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-[rgb(var(--app-border))] px-3 py-1.5 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              Page {page} of {Math.max(1, pagination?.totalPages || 1)}
            </span>
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

      <div className="mt-5 flex items-start gap-2 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 text-xs text-blue-300">
        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
        Meta Pixel reports aggregated events. This dashboard shows your own first-party attribution data; Facebook profile name, email or phone is not available unless the person registers on your site.
      </div>
    </main>
  );
}
