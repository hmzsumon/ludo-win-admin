export type WithdrawPayment = {
  amount?: number; netAmount?: number; charge?: number;
  payout_currency?: string; payout_amount?: number; net_payout_amount?: number;
  diamonds_requested?: number;
  method?: { name?: string; accountNumber?: string };
  netWork?: string; netWorkAddress?: string;
};
export const withdrawCurrency = (w: WithdrawPayment) =>
  ["binance", "crypto"].includes(w.method?.name?.toLowerCase() || "")
    ? "USDT" : (w.payout_currency || "BDT").toUpperCase();
export const withdrawAmount = (w: WithdrawPayment) =>
  Number(w.diamonds_requested ? w.payout_amount ?? w.amount : w.payout_amount || w.amount || 0);
export const withdrawNet = (w: WithdrawPayment) =>
  Number(w.diamonds_requested ? w.net_payout_amount ?? w.netAmount : w.net_payout_amount || w.netAmount || 0);
export const formatWithdrawMoney = (value: number, currency: string) =>
  `${currency === "BDT" ? "৳" : "$"}${Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const withdrawMethod = (w: WithdrawPayment) => {
  const name = w.method?.name?.toLowerCase() || "";
  return ({ bkash: "bKash", nagad: "Nagad", rocket: "Rocket", binance: "Binance Pay", crypto: "USDT (TRC-20)", cash: "Cash", bank_transfer: "Bank transfer" } as Record<string, string>)[name] || w.method?.name || w.netWork || "Not recorded";
};
