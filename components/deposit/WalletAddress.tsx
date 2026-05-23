"use client";

import React from "react";

/* ── props ─────────────────────────────────────────────────── */
type Props = {
  network: string;
  address: string;
  onCopy: () => void;
  copied: boolean;
  CopyIcon: React.ComponentType<{ className?: string }>;
  accentClass?: string;
};

/* ── component ─────────────────────────────────────────────── */
export default function WalletAddress({
  network,
  address,
  onCopy,
  copied,
  CopyIcon,
  accentClass,
}: Props) {
  return (
    <div>
      <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-[rgb(var(--app-text-muted))]">
        Your {network} deposit address
      </label>

      <div className="flex items-center justify-between rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-3">
        <p className="truncate font-mono text-sm text-neutral-200">{address}</p>
        <button
          onClick={onCopy}
          className={`ml-2 rounded-full p-1.5 transition ${
            accentClass || "text-emerald-400 hover:text-emerald-300"
          }`}
          title="Copy to clipboard"
          aria-label="Copy wallet address"
        >
          <CopyIcon className={copied ? "text-emerald-400" : ""} />
        </button>
      </div>

      <p className="mt-2 text-xs text-[rgb(var(--app-text-muted))]">
        Only send{" "}
        <span className="font-semibold text-neutral-200">{network} USDT</span>{" "}
        to this address. Sending other assets may result in permanent loss.
      </p>
    </div>
  );
}
