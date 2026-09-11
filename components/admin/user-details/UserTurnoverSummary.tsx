import type { UserDetailsResponse } from "@/redux/features/admin/adminUsersApi";

/* ────────── 💎 User turnover summary ──────────
   Lifetime game turnover এবং wagering requirement আলাদা করে দেখাও।
──────────────────────────────────────────────── */
export default function UserTurnoverSummary({ turnover }: { turnover?: UserDetailsResponse["turnover"] }) {
  if (!turnover) return null;
  const cards = [
    { label: "মোট গেম টার্নওভার", value: turnover.played },
    { label: "আজকের গেম টার্নওভার", value: turnover.today },
    { label: "মোট প্রয়োজনীয় টার্নওভার", value: turnover.required },
    { label: "শর্তের পূরণ হয়েছে", value: turnover.completed },
    { label: "টার্নওভার বাকি", value: turnover.remaining },
  ];
  return (
    <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5">
      <h2 className="text-lg font-bold">টার্নওভার / Turnover</h2>
      <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">মোট গেম টার্নওভার হলো খেলার হিসাবে জমা হওয়া stake। প্রয়োজনীয় ও বাকি টার্নওভার হলো deposit/bonus-এর শর্ত।</p>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map(({ label, value }) => (
          <div key={label} className="rounded-xl bg-[rgb(var(--app-surface-2))] p-4">
            <p className="text-xs text-[rgb(var(--app-text-muted))]">{label}</p>
            <p className="mt-2 text-lg font-bold tabular-nums">{value === null ? "হিসাব অসম্পূর্ণ" : `💎 ${value.toLocaleString("en-US", { maximumFractionDigits: 3 })}`}</p>
          </div>
        ))}
      </div>
      <p className={`mt-3 text-xs ${turnover.remaining > 0 ? "text-amber-500" : "text-emerald-500"}`}>
        {turnover.remaining > 0 ? "টার্নওভার শর্ত এখনো বাকি আছে।" : "বর্তমানে কোনো টার্নওভার বাকি নেই।"} Withdraw block-এর admin setting আলাদা।
      </p>
    </section>
  );
}
