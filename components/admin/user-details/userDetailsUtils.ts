/* ────────── helpers ────────── */
export const DIAMOND_SIGN = "💎";

export const fmtCurrency = (n?: number) =>
  Number(n ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const fmtDiamond = (n?: number) => `${DIAMOND_SIGN} ${fmtCurrency(n)}`;

export const fmtDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
