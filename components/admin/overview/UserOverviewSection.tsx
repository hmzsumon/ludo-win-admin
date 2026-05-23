/* ──────────  UserOverviewSection.tsx  ──────────
   User সংক্রান্ত সব stat এক জায়গায়।
   Total, আজকের নতুন, active, online — সব দেখাবে।
──────────────────────────────────────────────── */

"use client";

import { UserCheck, UserPlus, Users, Wifi } from "lucide-react";
import OverviewSection from "./OverviewSection";
import OverviewStatCard from "./OverviewStatCard";

/* ──────────  Types  ────────── */
interface UserOverviewSectionProps {
  total: number;
  todayNew: number;
  activeTotal: number;
  activeToday: number;
  loggedIn: number;
}

/* ──────────  Main Component  ────────── */
export default function UserOverviewSection({
  total,
  todayNew,
  activeTotal,
  activeToday,
  loggedIn,
}: UserOverviewSectionProps) {
  return (
    <OverviewSection
      title="User Stats"
      description="মোট সদস্য এবং তাদের কার্যকলাপ"
      icon={<Users className="h-4 w-4" />}
      iconBg="bg-sky-400/10"
      iconColor="text-sky-400"
      accentColor="border-sky-500/10"
    >
      {/* ──────────  Total Users  ────────── */}
      <OverviewStatCard
        label="Total Users"
        totalValue={total}
        icon={<Users className="h-3.5 w-3.5" />}
        iconBg="bg-sky-400/10"
        iconColor="text-sky-400"
        totalLabel="All Time"
      />

      {/* ──────────  New Today  ────────── */}
      <OverviewStatCard
        label="New Users"
        totalValue={total}
        todayValue={todayNew}
        icon={<UserPlus className="h-3.5 w-3.5" />}
        iconBg="bg-emerald-400/10"
        iconColor="text-emerald-400"
        totalLabel="Total"
        todayLabel="Today New"
      />

      {/* ──────────  Active Users  ────────── */}
      <OverviewStatCard
        label="Active Users"
        totalValue={activeTotal}
        todayValue={activeToday}
        icon={<UserCheck className="h-3.5 w-3.5" />}
        iconBg="bg-amber-400/10"
        iconColor="text-amber-400"
        totalLabel="Total Active"
        todayLabel="Today Active"
      />

      {/* ──────────  Online Now  ────────── */}
      <OverviewStatCard
        label="Online Now"
        totalValue={loggedIn}
        icon={<Wifi className="h-3.5 w-3.5" />}
        iconBg="bg-violet-400/10"
        iconColor="text-violet-400"
        totalLabel="Live Sessions"
      />
    </OverviewSection>
  );
}
