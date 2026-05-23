/* ── Tabs Control ───────────────────────────────────────────────────────────── */
"use client";
import React from "react";

export const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`relative h-10 px-4 text-sm font-medium ${
      active ? "text-[rgb(var(--app-text))]" : "text-[rgb(var(--app-text-muted))]"
    }`}
  >
    {children}
    <span
      className={`absolute left-0 top-full block h-[2px] w-full rounded bg-gradient-to-r from-emerald-400 to-cyan-500 transition ${
        active ? "opacity-100" : "opacity-0"
      }`}
    />
  </button>
);
