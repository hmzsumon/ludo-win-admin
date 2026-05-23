/* ──────────  GameBotOverviewSection.tsx  ──────────
   Match stats ও Bot stats একসাথে।
   Bot এর P&L রঙ দিয়ে বোঝানো হয়েছে।
──────────────────────────────────────────────────── */

"use client";

import { cn } from "@/lib/utils";
import {
  Bot,
  Gamepad2,
  Gem,
  TrendingDown,
  TrendingUp,
  Trophy,
} from "lucide-react";
import OverviewSection from "./OverviewSection";
import OverviewStatCard, { fmt } from "./OverviewStatCard";

/* ──────────  Types  ────────── */
interface GameBotOverviewSectionProps {
  /* Match */
  totalMatches: number;
  todayMatches: number;
  totalFeeCollected: number;
  todayFeeCollected: number;
  /* Bot */
  totalGamesPlayed: number;
  todayGamesPlayed: number;
  totalGamesWon: number;
  todayGamesWon: number;
  totalGamesLost: number;
  todayGamesLost: number;
  totalWonAmount: number;
  todayWonAmount: number;
  totalLostAmount: number;
  todayLostAmount: number;
  totalBotNetPnL: number;
  todayBotNetPnL: number;
}

/* ──────────  PnL Badge  ────────── */
function PnLCard({
  totalPnL,
  todayPnL,
}: {
  totalPnL: number;
  todayPnL: number;
}) {
  const totalPos = totalPnL >= 0;
  const todayPos = todayPnL >= 0;

  return (
    <div className="col-span-2 rounded-xl bg-white/[0.02] border border-white/5 py-3.5 px-2 flex items-start justify-between">
      {/* ──────────  Label  ────────── */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-400/10">
          {totalPos ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
          )}
        </div>
        <p className="text-[11px] font-medium text-[rgb(var(--app-text-muted))]">Bot Net P&L</p>
      </div>

      {/* ──────────  Values  ────────── */}
      <div className="flex items-end justify-between">
        <div>
          <p
            className={cn(
              "text-base font-bold leading-none",
              totalPos ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {totalPos ? "+" : ""}
            {fmt(totalPnL)} 💎
          </p>
        </div>
      </div>
    </div>
  );
}

/* ──────────  Main Component  ────────── */
export default function GameBotOverviewSection({
  totalMatches,
  todayMatches,
  totalFeeCollected,
  todayFeeCollected,
  totalGamesPlayed,
  todayGamesPlayed,
  totalGamesWon,
  todayGamesWon,
  totalGamesLost,
  todayGamesLost,
  totalWonAmount,
  todayWonAmount,
  totalLostAmount,
  todayLostAmount,
  totalBotNetPnL,
  todayBotNetPnL,
}: GameBotOverviewSectionProps) {
  return (
    <div className="space-y-4">
      {/* ──────────  Game / Match Section  ────────── */}
      <OverviewSection
        title="Match Stats"
        icon={<Gamepad2 className="h-4 w-4" />}
        iconBg="bg-indigo-400/10"
        iconColor="text-indigo-400"
        accentColor="border-indigo-500/10"
      >
        {/* ──────────  Total Matches  ────────── */}
        <OverviewStatCard
          label="Total Matches"
          totalValue={totalMatches}
          todayValue={todayMatches}
          icon={<Gamepad2 className="h-3.5 w-3.5" />}
          iconBg="bg-indigo-400/10"
          iconColor="text-indigo-400"
          totalLabel="All Time"
          todayLabel="Today"
        />

        {/* ──────────  Fee Collected  ────────── */}
        <OverviewStatCard
          label="5% Fee Collected"
          totalValue={totalFeeCollected}
          todayValue={todayFeeCollected}
          icon={<Gem className="h-3.5 w-3.5" />}
          iconBg="bg-emerald-400/10"
          iconColor="text-emerald-400"
          totalLabel="All Time"
          todayLabel="Today"
          isDiamond
          colorMode="positive"
        />
      </OverviewSection>

      {/* ──────────  Bot Section  ────────── */}
      <OverviewSection
        title="Bot Stats"
        icon={<Bot className="h-4 w-4" />}
        iconBg="bg-cyan-400/10"
        iconColor="text-cyan-400"
        accentColor="border-cyan-500/10"
      >
        {/* ──────────  Games Played  ────────── */}
        <OverviewStatCard
          label="Games Played"
          totalValue={totalGamesPlayed}
          todayValue={todayGamesPlayed}
          icon={<Gamepad2 className="h-3.5 w-3.5" />}
          iconBg="bg-cyan-400/10"
          iconColor="text-cyan-400"
          totalLabel="Total"
          todayLabel="Today"
        />

        {/* ──────────  Games Won  ────────── */}
        <OverviewStatCard
          label="Bot Wins"
          totalValue={totalGamesWon}
          todayValue={todayGamesWon}
          icon={<Trophy className="h-3.5 w-3.5" />}
          iconBg="bg-emerald-400/10"
          iconColor="text-emerald-400"
          totalLabel="Total Won"
          todayLabel="Today"
        />

        {/* ──────────  Games Lost  ────────── */}
        <OverviewStatCard
          label="Bot Losses"
          totalValue={totalGamesLost}
          todayValue={todayGamesLost}
          icon={<TrendingDown className="h-3.5 w-3.5" />}
          iconBg="bg-rose-400/10"
          iconColor="text-rose-400"
          totalLabel="Total Lost"
          todayLabel="Today"
        />

        {/* ──────────  Won Amount (Company Income)  ────────── */}
        <OverviewStatCard
          label="Bot Won (Income)"
          totalValue={totalWonAmount}
          todayValue={todayWonAmount}
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          iconBg="bg-emerald-400/10"
          iconColor="text-emerald-400"
          totalLabel="Total"
          todayLabel="Today"
          isDiamond
          colorMode="positive"
        />

        {/* ──────────  Lost Amount (Company Expense)  ────────── */}
        <OverviewStatCard
          label="Bot Lost (Expense)"
          totalValue={totalLostAmount}
          todayValue={todayLostAmount}
          icon={<TrendingDown className="h-3.5 w-3.5" />}
          iconBg="bg-rose-400/10"
          iconColor="text-rose-400"
          totalLabel="Total"
          todayLabel="Today"
          isDiamond
          colorMode="negative"
        />
      </OverviewSection>

      <OverviewSection
        title="Bot P&L Stats"
        icon={<Bot className="h-4 w-4" />}
        iconBg="bg-cyan-400/10"
        iconColor="text-cyan-400"
        accentColor="border-cyan-500/10"
      >
        {/* ──────────  Net P&L (full width)  ────────── */}
        <PnLCard totalPnL={totalBotNetPnL} todayPnL={todayBotNetPnL} />
      </OverviewSection>
    </div>
  );
}
