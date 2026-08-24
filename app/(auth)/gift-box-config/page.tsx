"use client";

import {
  IGiftBoxTier,
  useGetGiftBoxConfigQuery,
  useGetGiftBoxStatsQuery,
  useUpdateGiftBoxConfigMutation,
} from "@/redux/features/giftBox/giftBoxApi";
/* ── app/(auth)/gift-box-config/page.tsx ───────────────────────────────── */

import {
  AlertTriangle,
  CheckCircle2,
  Gift,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ─── small helper components (mirrors ludo-bot-config/page.tsx) ───────── */

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold ${
        active
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-red-400"}`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

const emptyTier = (): IGiftBoxTier => ({
  amount: 0,
  probabilityPercent: 0,
  isJackpot: false,
  isActive: true,
});

/* ─── main page ───────────────────────────────────────────────────────── */

export default function GiftBoxConfigPage() {
  const { data, isLoading, isError } = useGetGiftBoxConfigQuery();
  const { data: statsData } = useGetGiftBoxStatsQuery(undefined, {
    pollingInterval: 30000,
  });
  const [updateConfig, { isLoading: isSaving }] =
    useUpdateGiftBoxConfigMutation();

  /* local state — synced from server */
  const [enabled, setEnabled] = useState(true);
  const [tiers, setTiers] = useState<IGiftBoxTier[]>([]);
  const [dailyBudgetLimit, setDailyBudgetLimit] = useState(0);
  const [jackpotDailyLimit, setJackpotDailyLimit] = useState(0);
  const [turnoverMultiplier, setTurnoverMultiplier] = useState(1);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  /* sync server → local on load */
  useEffect(() => {
    if (data?.config) {
      setEnabled(data.config.enabled);
      setTiers(data.config.tiers || []);
      setDailyBudgetLimit(Number(data.config.dailyBudgetLimit || 0));
      setJackpotDailyLimit(Number(data.config.jackpotDailyLimit || 0));
      setTurnoverMultiplier(Number(data.config.turnoverMultiplier || 1));
    }
  }, [data]);

  /* auto-dismiss toast */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  /* save handler */
  async function save(patch: {
    enabled?: boolean;
    tiers?: IGiftBoxTier[];
    dailyBudgetLimit?: number;
    jackpotDailyLimit?: number;
    turnoverMultiplier?: number;
  }) {
    try {
      await updateConfig(patch).unwrap();
      setToast({ type: "success", msg: "কনফিগ সফলভাবে সেভ হয়েছে!" });
    } catch {
      setToast({ type: "error", msg: "সেভ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" });
    }
  }

  const updateTierField = (
    index: number,
    field: keyof IGiftBoxTier,
    value: number | boolean,
  ) => {
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  };

  const probabilitySum = tiers.reduce(
    (sum, t) => sum + Number(t.probabilityPercent || 0),
    0,
  );
  const sumIsOff = Math.abs(probabilitySum - 100) > 0.001;

  /* ── loading skeleton ── */
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-400">কনফিগ লোড করা যায়নি।</p>
      </div>
    );
  }

  const stats = statsData?.stats;

  return (
    <main className="min-h-screen bg-transparent px-4 py-8 text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* ── header ── */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
            <Gift className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Gift Box Config
            </h1>
            <p className="text-sm text-[rgb(var(--app-text-muted))]">
              Daily login gift box এর reward tier, budget ও jackpot limit
              কন্ট্রোল করুন
            </p>
          </div>
        </div>

        {/* ── toast ── */}
        {toast && (
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${
              toast.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {toast.msg}
          </div>
        )}

        {/* ── enable toggle ── */}
        <SectionCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Gift Box System</p>
              <p className="mt-0.5 text-sm text-[rgb(var(--app-text-muted))]">
                সম্পূর্ণ daily gift box feature চালু বা বন্ধ করুন
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge active={enabled} />
              <button
                disabled={isSaving}
                onClick={() => {
                  const next = !enabled;
                  setEnabled(next);
                  save({ enabled: next });
                }}
                className={`relative h-7 w-14 rounded-full transition-colors duration-200 focus:outline-none ${
                  enabled ? "bg-indigo-600" : "bg-white/15"
                } ${isSaving ? "opacity-50" : ""}`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ${
                    enabled ? "left-8" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ── tier table ── */}
        <SectionCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Reward Tiers</p>
              <p className="mt-0.5 text-sm text-[rgb(var(--app-text-muted))]">
                প্রতিটা tier এর amount (💎) ও probability (%) নির্ধারণ করুন
              </p>
            </div>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setTiers((prev) => [...prev, emptyTier()])}
              className="flex items-center gap-1.5 rounded-lg border border-[rgb(var(--app-border))] px-3 py-1.5 text-sm font-medium text-[rgb(var(--app-text-soft))] hover:border-white/25 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add Tier
            </button>
          </div>

          <div className="mt-4 space-y-2">
            {tiers.map((tier, index) => (
              <div
                key={index}
                className="flex flex-wrap items-center gap-2 rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 p-3"
              >
                <div className="flex flex-1 min-w-[110px] items-center gap-1.5">
                  <span className="text-xs text-[rgb(var(--app-text-muted))]">
                    💎
                  </span>
                  <input
                    type="number"
                    min={1}
                    value={tier.amount}
                    disabled={isSaving}
                    onChange={(e) =>
                      updateTierField(index, "amount", Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-3))]/80 px-2 py-1.5 font-mono text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-1 min-w-[110px] items-center gap-1.5">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.001}
                    value={tier.probabilityPercent}
                    disabled={isSaving}
                    onChange={(e) =>
                      updateTierField(
                        index,
                        "probabilityPercent",
                        Number(e.target.value),
                      )
                    }
                    className="w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-3))]/80 px-2 py-1.5 font-mono text-sm outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-[rgb(var(--app-text-muted))]">
                    %
                  </span>
                </div>

                <label className="flex items-center gap-1.5 text-xs text-[rgb(var(--app-text-muted))]">
                  <input
                    type="checkbox"
                    checked={tier.isJackpot}
                    disabled={isSaving}
                    onChange={(e) =>
                      updateTierField(index, "isJackpot", e.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-500"
                  />
                  Jackpot
                </label>

                <label className="flex items-center gap-1.5 text-xs text-[rgb(var(--app-text-muted))]">
                  <input
                    type="checkbox"
                    checked={tier.isActive}
                    disabled={isSaving}
                    onChange={(e) =>
                      updateTierField(index, "isActive", e.target.checked)
                    }
                    className="h-4 w-4 accent-indigo-500"
                  />
                  Active
                </label>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() =>
                    setTiers((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div
            className={`mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
              sumIsOff
                ? "bg-amber-500/10 text-amber-400"
                : "bg-emerald-500/10 text-emerald-400"
            }`}
          >
            {sumIsOff && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
            Σ probability = {probabilitySum.toFixed(3)}%
            {sumIsOff ? " (100% থেকে ভিন্ন — draw এখনো ঠিকভাবে normalize হবে)" : ""}
          </div>

          <button
            type="button"
            disabled={isSaving || tiers.length === 0}
            onClick={() => save({ tiers })}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold transition-opacity hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Tiers সেভ করুন"
            )}
          </button>
        </SectionCard>

        {/* ── budget / jackpot / turnover ── */}
        <SectionCard>
          <p className="font-semibold">Budget &amp; Jackpot Limits</p>
          <p className="mt-0.5 text-sm text-[rgb(var(--app-text-muted))]">
            সীমা শেষ হয়ে গেলেও feature বন্ধ হয় না — ছোট (safe) tier এ নেমে যায়
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                Daily Budget Limit (💎, 0 = unlimited)
              </label>
              <input
                type="number"
                min={0}
                value={dailyBudgetLimit}
                disabled={isSaving}
                onChange={(e) => setDailyBudgetLimit(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-3))]/80 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                Jackpot Daily Limit (0 = unlimited)
              </label>
              <input
                type="number"
                min={0}
                value={jackpotDailyLimit}
                disabled={isSaving}
                onChange={(e) => setJackpotDailyLimit(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-3))]/80 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                Turnover Multiplier
              </label>
              <input
                type="number"
                min={0}
                step={0.1}
                value={turnoverMultiplier}
                disabled={isSaving}
                onChange={(e) => setTurnoverMultiplier(Number(e.target.value))}
                className="mt-1 w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-3))]/80 px-3 py-2 font-mono text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={
              isSaving ||
              (dailyBudgetLimit === Number(data?.config?.dailyBudgetLimit || 0) &&
                jackpotDailyLimit ===
                  Number(data?.config?.jackpotDailyLimit || 0) &&
                turnoverMultiplier ===
                  Number(data?.config?.turnoverMultiplier || 1))
            }
            onClick={() =>
              save({ dailyBudgetLimit, jackpotDailyLimit, turnoverMultiplier })
            }
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold transition-opacity hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Limits সেভ করুন"
            )}
          </button>
        </SectionCard>

        {/* ── today's stats ── */}
        <SectionCard className="!bg-white/3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--app-text-muted))]">
            Today&apos;s Stats
          </p>
          <div className="space-y-2 font-mono text-xs text-[rgb(var(--app-text-muted))]">
            <div className="flex justify-between">
              <span>todaySpend</span>
              <span className="text-indigo-300">
                💎{stats?.todaySpend ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>dailyBudgetLimit</span>
              <span>
                {stats?.dailyBudgetLimit ? `💎${stats.dailyBudgetLimit}` : "unlimited"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>remainingBudget</span>
              <span>
                {stats?.remainingBudget != null
                  ? `💎${stats.remainingBudget}`
                  : "unlimited"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>todayJackpotCount / jackpotDailyLimit</span>
              <span>
                {stats?.todayJackpotCount ?? 0} /{" "}
                {stats?.jackpotDailyLimit || "unlimited"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>claimsToday</span>
              <span>{stats?.claimsToday ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>updatedAt</span>
              <span>
                {data?.config?.updatedAt
                  ? new Date(data.config.updatedAt).toLocaleString("bn-BD")
                  : "—"}
              </span>
            </div>
          </div>
        </SectionCard>
      </div>
    </main>
  );
}
