"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { BonusRule } from "@/redux/features/admin/bonusManagementApi";

/* ────────── 🎁 Reusable bonus control card ──────────
   ✅ Draft local থাকবে; Save সফল হলেই server value কার্যকর হবে।
   ✅ অন্য card save/refetch হলে unsaved input হারাবে না।
──────────────────────────────────────────────────── */
export default function BonusRuleCard({ title, description, rule, onSave }: {
  title: string;
  description: string;
  rule: BonusRule;
  onSave: (rule: BonusRule) => Promise<unknown>;
}) {
  const [draft, setDraft] = useState<{ enabled: boolean; multiplier: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const current = draft ?? { enabled: rule.enabled, multiplier: String(rule.turnoverMultiplier) };
  const multiplier = Number(current.multiplier);
  const valid = current.multiplier.trim() !== "" && Number.isFinite(multiplier) && multiplier >= 0 && multiplier <= 1000;
  const changed = current.enabled !== rule.enabled || multiplier !== rule.turnoverMultiplier;

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!valid || saving) return;
    setSaving(true);
    setMessage("");
    try {
      await onSave({ enabled: current.enabled, turnoverMultiplier: multiplier });
      setDraft(null);
      setFailed(false);
      setMessage("সেটিং সফলভাবে সেভ হয়েছে।");
    } catch (error: unknown) {
      setFailed(true);
      const apiError = error as { data?: { message?: string } };
      setMessage(apiError?.data?.message || "সেভ হয়নি। আবার চেষ্টা করুন।");
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5 sm:p-6">
      <fieldset disabled={saving} className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 text-sm text-[rgb(var(--app-text-muted))]">{description}</p></div>
          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${rule.enabled ? "bg-emerald-500/15 text-emerald-500" : "bg-red-500/15 text-red-400"}`}>{rule.enabled ? "চালু" : "বন্ধ"}</span>
        </div>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={current.enabled} onChange={(e) => { setDraft({ ...current, enabled: e.target.checked }); setMessage(""); }} className="h-5 w-5 accent-indigo-500" />
          বোনাস চালু রাখুন
        </label>
        <label className="block text-sm font-medium">
          টার্নওভার গুণক (x)
          <input type="number" min="0" max="1000" step="any" required value={current.multiplier}
            onChange={(e) => { setDraft({ ...current, multiplier: e.target.value }); setMessage(""); }}
            className="mt-2 w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))] px-4 py-3 outline-none focus:border-indigo-500" />
        </label>
        <p className="text-xs text-[rgb(var(--app-text-muted))]">
          {valid ? `১০০ 💎 বোনাসে ${(100 * multiplier).toLocaleString()} 💎 টার্নওভার লাগবে।` : "০ থেকে ১০০০ পর্যন্ত গুণক লিখুন।"} 0x = বোনাসের টার্নওভার নেই।
        </p>
        <button type="submit" disabled={!valid || !changed || saving} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} {saving ? "সেভ হচ্ছে…" : "সেভ করুন"}
        </button>
      </fieldset>
      {message && <p role="status" className={`mt-3 text-sm ${failed ? "text-red-400" : "text-emerald-500"}`}>{message}</p>}
    </form>
  );
}
