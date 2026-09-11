"use client";

import Link from "next/link";
import { Gift, Loader2 } from "lucide-react";
import { BonusType, useGetBonusManagementQuery, useUpdateBonusManagementMutation } from "@/redux/features/admin/bonusManagementApi";
import { useGetGiftBoxConfigQuery, useUpdateGiftBoxConfigMutation } from "@/redux/features/giftBox/giftBoxApi";
import BonusRuleCard from "./BonusRuleCard";

/* ────────── 🎁 Bonus Management screen ──────────
   Gift Box-এর existing config-ই ব্যবহার হবে; দুই পেজে আলাদা rule থাকবে না।
───────────────────────────────────────────────── */
const bonuses: { type: BonusType; title: string; description: string }[] = [
  { type: "welcome", title: "স্বাগত বোনাস", description: "অ্যাকাউন্ট যাচাইয়ের পর welcome bonus এবং admin grant।" },
  { type: "deposit", title: "ডিপোজিট বোনাস", description: "প্রথম তিনটি qualifying deposit-এর বোনাস। মূল ডিপোজিটের 1x টার্নওভার আলাদা থাকবে।" },
  { type: "daily", title: "দৈনিক ডিপোজিট বোনাস", description: "আজকের অনুমোদিত ডিপোজিটের ভিত্তিতে দৈনিক claim।" },
  { type: "sponsor", title: "স্পনসর ডিপোজিট বোনাস", description: "রেফার করা ব্যবহারকারীর ডিপোজিট থেকে স্পনসর বোনাস।" },
  { type: "referral", title: "রেফারেল বোনাস", description: "রেফার করা ব্যবহারকারীর নির্ধারিত শর্ত পূরণের বোনাস।" },
  { type: "vipCashback", title: "VIP ক্যাশব্যাক", description: "সাপ্তাহিক cashback তৈরি ও claim চালু/বন্ধ করুন।" },
];

export default function BonusManagement() {
  const config = useGetBonusManagementQuery(undefined, { refetchOnFocus: true });
  const gift = useGetGiftBoxConfigQuery(undefined, { refetchOnFocus: true });
  const [update] = useUpdateBonusManagementMutation();
  const [updateGift] = useUpdateGiftBoxConfigMutation();
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <div><h1 className="flex items-center gap-3 text-2xl font-bold"><Gift className="text-indigo-400" />বোনাস ম্যানেজমেন্ট</h1>
        <p className="mt-3 text-sm text-[rgb(var(--app-text-muted))]">প্রতিটি বোনাসের চালু/বন্ধ ও টার্নওভার আলাদাভাবে সেভ করুন। নতুন সেটিং পরবর্তী বোনাসে প্রযোজ্য; আগে দেওয়া বোনাসের টার্নওভার অপরিবর্তিত থাকবে।</p></div>
      {config.isLoading || gift.isLoading ? <div role="status" className="flex items-center gap-2 py-10"><Loader2 className="h-5 w-5 animate-spin" />সেটিং লোড হচ্ছে…</div> : null}
      {config.isError || gift.isError ? <div role="alert" className="rounded-xl bg-red-500/10 p-4 text-red-400">কিছু সেটিং লোড হয়নি। <button className="underline" onClick={() => { void config.refetch(); void gift.refetch(); }}>আবার চেষ্টা করুন</button></div> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {config.data && bonuses.map(({ type, title, description }) => <BonusRuleCard key={type} title={title} description={description} rule={config.data!.rules[type]} onSave={async (rule) => { await update({ type, rule }).unwrap(); await config.refetch().unwrap(); }} />)}
        {gift.data && <BonusRuleCard title="ডেইলি লগইন গিফট বক্স" description="প্রতিদিন লগইনের Gift Box reward।" rule={gift.data.config} onSave={async (rule) => { await updateGift(rule).unwrap(); await gift.refetch().unwrap(); }} />}
      </div>
      <Link href="/gift-box-config" className="inline-block text-sm text-indigo-400 underline">Gift Box পুরস্কার, probability ও budget সেটিং →</Link>
    </div>
  );
}
