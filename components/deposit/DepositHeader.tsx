"use client";

import React from "react";

/* ── props ─────────────────────────────────────────────────── */
type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  backLink?: React.ReactNode;
};

/* ── component ─────────────────────────────────────────────── */
export default function DepositHeader({
  title,
  subtitle,
  actions,
  backLink,
}: Props) {
  return (
    <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        {backLink ? <div className="mb-1">{backLink}</div> : null}
        <h1 className="text-xl font-semibold text-[rgb(var(--app-text))]">{title}</h1>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-[rgb(var(--app-text-muted))]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
