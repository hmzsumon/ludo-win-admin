"use client";

import { Moon, SunMedium } from "lucide-react";
import { useAppTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useAppTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] px-3 text-sm text-[rgb(var(--app-text))] shadow-sm transition hover:bg-[rgb(var(--app-surface-2))]"
    >
      {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
      <span className="hidden sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
