"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { useGetWithdrawFeesQuery, useUpdateWithdrawFeeMutation } from "@/redux/features/withdraw/withdrawApi";

function FeeRow({ rate }: { rate: any }) {
  const [minimum, setMinimum] = useState(String(rate.minAmount));
  const [maximum, setMaximum] = useState(rate.maxAmount === null ? "" : String(rate.maxAmount));
  const [value, setValue] = useState(String(rate.feePercent ?? 0));
  const [save, { isLoading }] = useUpdateWithdrawFeeMutation();
  const submit = async () => {
    const feePercent = Number(value);
    if (!minimum.trim() || Number(minimum) <= 0 || (maximum.trim() && Number(maximum) < Number(minimum)) || !value.trim() || !Number.isFinite(feePercent) || feePercent < 0 || feePercent > 100) {
      toast.error("Enter a fee between 0 and 100 percent"); return;
    }
    try { await save({ key: rate.key, minAmount: Number(minimum), maxAmount: maximum.trim() ? Number(maximum) : null, feePercent }).unwrap(); toast.success("Withdrawal fee saved"); }
    catch (error: any) { toast.error(error?.data?.message || "Unable to save fee"); }
  };
  return <div className="flex flex-wrap items-center gap-4 rounded-xl border border-[rgb(var(--app-border))] p-5">
    <strong className="w-full">{rate.label}</strong>
    <label>Minimum (diamonds)<input type="number" min="0.01" step="0.01" value={minimum} onChange={e => setMinimum(e.target.value)} className="m-2 w-32 rounded border bg-transparent p-2" /></label>
    <label>Maximum (diamonds)<input type="number" min="0.01" step="0.01" value={maximum} onChange={e => setMaximum(e.target.value)} placeholder="Unlimited" className="m-2 w-32 rounded border bg-transparent p-2" /></label>
    <label className="flex items-center gap-2">Fee (%)<input aria-label={`${rate.key} withdrawal fee percent`} type="number" min="0" max="100" step="0.01" value={value} onChange={e => setValue(e.target.value)} className="w-28 rounded-lg border border-[rgb(var(--app-border))] bg-transparent p-2" /></label>
    <span className="text-sm text-[rgb(var(--app-text-muted))]">Current: {rate.feePercent ?? 0}%</span>
    <button disabled={isLoading} onClick={submit} className="ml-auto rounded-lg bg-emerald-500 px-5 py-2 text-black disabled:opacity-50">{isLoading ? "Saving…" : "Save"}</button>
  </div>;
}
export default function WithdrawalFees() {
  const { data, isLoading, isError } = useGetWithdrawFeesQuery();
  return <main className="mx-auto max-w-4xl space-y-4 p-6 text-[rgb(var(--app-text))]">
    <h1 className="text-2xl font-semibold">Withdrawal Settings</h1>
    <p className="text-sm text-[rgb(var(--app-text-muted))]">Default fee is 0%. Minimum and maximum are in diamonds; leave maximum empty for unlimited. Changes apply to new withdrawal requests. Existing requests keep their original fee.</p>
    {isLoading && <p>Loading…</p>}{isError && <p>Unable to load withdrawal fees.</p>}
    {data?.policies?.map((rate: any) => <FeeRow key={rate.key} rate={rate} />)}
    {data && !data.policies?.length && <p>No withdrawal settings available.</p>}
  </main>;
}
