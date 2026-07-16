"use client";

import {
  useGetLudoBotConfigQuery,
  useUpdateLudoBotConfigMutation,
} from "@/redux/features/lodo-bot/ludoBotApi";
/* ── app/(auth)/ludo-bot-config/page.tsx ───────────────────────────────── */

import { Bot, CheckCircle2, Clock, Loader2, Scale, Zap } from "lucide-react";
import { useEffect, useState } from "react";

/* ─── small helper components ─────────────────────────────────────────── */

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

/* ─── mode card ───────────────────────────────────────────────────────── */

function ModeCard({
  mode,
  label,
  description,
  icon: Icon,
  selected,
  disabled,
  onSelect,
}: {
  mode: "easy" | "assist" | "smart";
  label: string;
  description: string;
  icon: React.ElementType;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`group relative flex w-full flex-col gap-3 rounded-xl border-2 p-5 text-left transition-all duration-200 focus:outline-none ${
        selected
          ? "border-indigo-500 bg-indigo-500/10"
          : "border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 hover:border-white/25 hover:bg-white/8"
      } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
    >
      {/* selected indicator */}
      {selected && (
        <CheckCircle2 className="absolute right-4 top-4 h-4 w-4 text-indigo-400" />
      )}

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-lg ${
          selected
            ? "bg-indigo-500/20 text-indigo-400"
            : "bg-[rgb(var(--app-surface-3))]/80 text-[rgb(var(--app-text-muted))]"
        }`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <p
          className={`font-semibold ${selected ? "text-indigo-300" : "text-[rgb(var(--app-text-soft))]"}`}
        >
          {label}
        </p>
        <p className="mt-0.5 text-xs leading-relaxed text-[rgb(var(--app-text-muted))]">
          {description}
        </p>
      </div>

      {selected && (
        <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
          Currently Active
        </span>
      )}
    </button>
  );
}

/* ─── main page ───────────────────────────────────────────────────────── */

export default function LudoBotConfigPage() {
  const { data, isLoading, isError } = useGetLudoBotConfigQuery();
  const [updateConfig, { isLoading: isSaving }] =
    useUpdateLudoBotConfigMutation();

  /* local state — synced from server */
  const [enabled, setEnabled] = useState(true);
  const [activeMode, setActiveMode] = useState<"easy" | "assist" | "smart">(
    "easy",
  );
  const [matchTimeoutSeconds, setMatchTimeoutSeconds] = useState(30);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  /* sync server → local on load */
  useEffect(() => {
    if (data?.config) {
      setEnabled(data.config.enabled);
      setActiveMode(data.config.activeMode);
      setMatchTimeoutSeconds(data.config.matchTimeoutSeconds);
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
    activeMode?: "easy" | "assist" | "smart";
    matchTimeoutSeconds?: number;
  }) {
    try {
      await updateConfig(patch).unwrap();
      setToast({ type: "success", msg: "কনফিগ সফলভাবে সেভ হয়েছে!" });
    } catch {
      setToast({ type: "error", msg: "সেভ ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" });
    }
  }

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

  /* ── render ── */
  return (
    <main className="min-h-screen bg-transparent px-4 py-8 text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* ── header ── */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
            <Bot className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Ludo Bot Config
            </h1>
            <p className="text-sm text-[rgb(var(--app-text-muted))]">
              Bot এর mode এবং behaviour কন্ট্রোল করুন
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

        {/* ── bot enabled toggle ── */}
        <SectionCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Bot System</p>
              <p className="mt-0.5 text-sm text-[rgb(var(--app-text-muted))]">
                সম্পূর্ণ bot system চালু বা বন্ধ করুন
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

        {/* ── mode selection ── */}
        <SectionCard>
          <p className="mb-1 font-semibold">Bot Mode</p>
          <p className="mb-4 text-sm text-[rgb(var(--app-text-muted))]">
            যেকোনো একটি mode সবসময় active থাকবে
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ModeCard
              mode="easy"
              label="Easy Mode"
              description="Bot সহজভাবে খেলে, player জেতার সুযোগ বেশি পায়।"
              icon={Zap}
              selected={activeMode === "easy"}
              disabled={isSaving}
              onSelect={() => {
                if (activeMode === "easy") return; // ইতোমধ্যে active
                setActiveMode("easy");
                save({ activeMode: "easy" });
              }}
            />
            <ModeCard
              mode="assist"
              label="Assist Mode"
              description="Bot player কে সহায়তা করে, game আরও balanced হয়।"
              icon={Bot}
              selected={activeMode === "assist"}
              disabled={isSaving}
              onSelect={() => {
                if (activeMode === "assist") return;
                setActiveMode("assist");
                save({ activeMode: "assist" });
              }}
            />
            <ModeCard
              mode="smart"
              label="Smart Balance"
              description="Bot smart move করবে, তবে dice ও progress natural balance বজায় রাখবে।"
              icon={Scale}
              selected={activeMode === "smart"}
              disabled={isSaving}
              onSelect={() => {
                if (activeMode === "smart") return;
                setActiveMode("smart");
                save({ activeMode: "smart" });
              }}
            />
          </div>
        </SectionCard>

        {/* ── match timeout ── */}
        <SectionCard>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[rgb(var(--app-text-muted))]" />
                <p className="font-semibold">Match Timeout</p>
              </div>
              <p className="mt-0.5 text-sm text-[rgb(var(--app-text-muted))]">
                Bot match শুরু করার আগে কত সেকেন্ড অপেক্ষা করবে (৫–৩০০ সেকেন্ড)
              </p>

              <div className="mt-4 flex items-center gap-3">
                <input
                  type="range"
                  min={5}
                  max={300}
                  step={5}
                  value={matchTimeoutSeconds}
                  disabled={isSaving}
                  onChange={(e) =>
                    setMatchTimeoutSeconds(Number(e.target.value))
                  }
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/15 accent-indigo-500 disabled:opacity-50"
                />
                <span className="w-16 shrink-0 rounded-lg bg-[rgb(var(--app-surface-3))]/80 px-3 py-1.5 text-center text-sm font-mono font-semibold text-[rgb(var(--app-text))]">
                  {matchTimeoutSeconds}s
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => save({ matchTimeoutSeconds })}
            disabled={
              isSaving ||
              matchTimeoutSeconds === data?.config?.matchTimeoutSeconds
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold transition-opacity hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Timeout সেভ করুন"
            )}
          </button>
        </SectionCard>

        {/* ── current config summary ── */}
        <SectionCard className="!bg-white/3">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--app-text-muted))]">
            Current DB Config
          </p>
          <div className="space-y-2 font-mono text-xs text-[rgb(var(--app-text-muted))]">
            <div className="flex justify-between">
              <span>enabled</span>
              <span className={enabled ? "text-emerald-400" : "text-red-400"}>
                {String(data?.config?.enabled ?? "—")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>activeMode</span>
              <span className="text-indigo-300">
                {data?.config?.activeMode ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>matchTimeoutSeconds</span>
              <span>{data?.config?.matchTimeoutSeconds ?? "—"}</span>
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
