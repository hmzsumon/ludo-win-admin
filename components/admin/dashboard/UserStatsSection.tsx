/* ──────────  UserStatsSection.tsx  ──────────
   User report — total, new, active, online.
───────────────────────────────────────────── */

"use client";

import { UserCheck, UserPlus, Users, Wifi } from "lucide-react";

/* ──────────  Types  ────────── */
interface UserStatsSectionProps {
  totalUsers: number;
  todayNewUsers: number;
  activeTotal: number;
  activeToday: number;
  loggedIn: number;
  loading?: boolean;
}

/* ──────────  Number Formatter  ────────── */
const fmt = (n: number) => n.toLocaleString("en-BD");

/* ──────────  Mini Stat  ────────── */
function MiniStat({
  icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/5 p-3">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
      >
        <span className={iconColor}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-[rgb(var(--app-text))]/35 truncate">{label}</p>
        <p className="text-base font-bold text-[rgb(var(--app-text))]">{value}</p>
        {sub && <p className="text-[10px] text-[rgb(var(--app-text))]/25">{sub}</p>}
      </div>
    </div>
  );
}

/* ──────────  Skeleton  ────────── */
function UserSkeleton() {
  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 p-5 animate-pulse h-52" />
  );
}

/* ──────────  Main Component  ────────── */
export default function UserStatsSection({
  totalUsers,
  todayNewUsers,
  activeTotal,
  activeToday,
  loggedIn,
  loading = false,
}: UserStatsSectionProps) {
  if (loading) return <UserSkeleton />;

  return (
    <div className="rounded-2xl bg-[rgb(var(--app-surface))] border border-white/5 py-5 px-2">
      {/* ──────────  Section Header  ────────── */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400/10">
          <Users className="h-4 w-4 text-sky-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">User Report</h3>
          <p className="text-[10px] text-[rgb(var(--app-text-muted))]">Members and activity</p>
        </div>
      </div>

      {/* ──────────  Stats Grid  ────────── */}
      <div className="grid grid-cols-1 gap-3">
        <MiniStat
          icon={<Users className="h-4 w-4" />}
          iconColor="text-sky-400"
          iconBg="bg-sky-400/10"
          label="Total Users"
          value={fmt(totalUsers)}
        />
        <MiniStat
          icon={<UserPlus className="h-4 w-4" />}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
          label="New Today"
          value={fmt(todayNewUsers)}
          sub="Registered"
        />
        <MiniStat
          icon={<UserCheck className="h-4 w-4" />}
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
          label="Active Users"
          value={fmt(activeTotal)}
          sub={`Today: ${fmt(activeToday)}`}
        />
        <MiniStat
          icon={<Wifi className="h-4 w-4" />}
          iconColor="text-violet-400"
          iconBg="bg-violet-400/10"
          label="Online Now"
          value={fmt(loggedIn)}
          sub="Live sessions"
        />
      </div>
    </div>
  );
}
