/* ── SectionTitle ───────────────────────────────────────────────────────────── */
import React from "react";

export interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
}) => (
  <div className={`mb-8 ${align === "left" ? "text-left" : "text-center"}`}>
    {eyebrow && (
      <p className="text-xs font-semibold uppercase tracking-widest text-[rgb(var(--app-text-muted))]">
        {eyebrow}
      </p>
    )}
    <h2 className="mt-2 text-2xl font-bold leading-tight text-[rgb(var(--app-text))] sm:text-3xl md:text-4xl">
      {title}
    </h2>
    {subtitle && (
      <p className="mx-auto mt-3 max-w-3xl text-sm text-[rgb(var(--app-text-soft))] sm:text-base">
        {subtitle}
      </p>
    )}
  </div>
);

export default SectionTitle;
