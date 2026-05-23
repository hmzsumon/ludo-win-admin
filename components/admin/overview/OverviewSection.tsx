/* ──────────  OverviewSection.tsx  ──────────
   প্রতিটি section এর wrapper।
   Header-এ icon, title, description থাকে।
   Children হিসেবে stat cards নেয়।
──────────────────────────────────────────── */

"use client";

/* ──────────  Types  ────────── */
interface OverviewSectionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconBg?: string;
  iconColor?: string;
  accentColor?: string;
  children: React.ReactNode;
}

/* ──────────  Main Component  ────────── */
export default function OverviewSection({
  title,
  description,
  icon,
  iconBg = "bg-[rgb(var(--app-surface-2))]/70",
  iconColor = "text-[rgb(var(--app-text-muted))]",
  accentColor = "border-white/5",
  children,
}: OverviewSectionProps) {
  return (
    <div className={`rounded-2xl bg-[rgb(var(--app-surface))] border py-4 px-2 ${accentColor}`}>
      {/* ──────────  Section Header  ────────── */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">{title}</h3>
        </div>
      </div>

      {/* ──────────  Cards Grid  ────────── */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">{children}</div>
    </div>
  );
}
