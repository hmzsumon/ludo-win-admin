"use client";

/* ────────── simple pills Tabs ────────── */
import { ReactNode } from "react";

export type TabKey = string;

export type Tab = { key: TabKey; label: string; badge?: ReactNode };

type TabsProps = {
  tabs: Tab[];
  active: TabKey;
  onChange: (key: TabKey) => void;
  className?: string;
};

export default function Tabs({
  tabs,
  active,
  onChange,
  className = "",
}: TabsProps) {
  return (
    <div className={`flex gap-2 overflow-x-auto ${className}`}>
      {tabs.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            onClick={() => onChange(t.key)}
            className={[
              "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition",
              isActive
                ? "bg-[#21D3B3]/20 text-[#21D3B3] border border-[#21D3B3]/30"
                : "bg-[rgb(var(--app-surface-2))]/70 text-[rgb(var(--app-text-soft))] hover:bg-[rgb(var(--app-surface-3))]/80 border border-[rgb(var(--app-border))]",
            ].join(" ")}
          >
            <span>{t.label}</span>
            {t.badge && (
              <span className="text-xs text-[rgb(var(--app-text-soft))]">{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
