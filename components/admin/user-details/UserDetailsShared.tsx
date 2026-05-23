/* ────────── imports ────────── */
"use client";
import type { ReactNode } from "react";

/* ────────── mini badge ────────── */
export function Badge({
  active,
  trueLabel,
  falseLabel,
}: {
  active: boolean;
  trueLabel: string;
  falseLabel: string;
}) {
  return (
    <span
      className={
        active
          ? "rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-400 uppercase"
          : "rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-rose-400 uppercase"
      }
    >
      {active ? trueLabel : falseLabel}
    </span>
  );
}

/* ────────── stat card ────────── */
export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-4 flex flex-col gap-1">
      <div className="text-[10px] uppercase tracking-widest text-[rgb(var(--app-text-muted))]">
        {label}
      </div>
      <div
        className={`text-lg font-bold ${accent ?? "text-[rgb(var(--app-text))]"}`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-[10px] text-[rgb(var(--app-text-muted))]">
          {sub}
        </div>
      )}
    </div>
  );
}

/* ────────── info row ────────── */
export function InfoRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[rgb(var(--app-border))]/60 py-2.5 last:border-b-0">
      <span className="text-[10px] uppercase tracking-widest text-[rgb(var(--app-text-muted))] shrink-0 w-36">
        {label}
      </span>
      <span className="text-xs text-[rgb(var(--app-text))] text-right font-medium break-all">
        {children}
      </span>
    </div>
  );
}

/* ────────── modal wrapper ────────── */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center py-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--app-border))] px-5 py-4">
          <h3 className="font-semibold text-[rgb(var(--app-text))]">{title}</h3>
          <button
            onClick={onClose}
            className="text-[rgb(var(--app-text-muted))] hover:text-[rgb(var(--app-text))] text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
