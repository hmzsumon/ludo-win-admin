"use client";

import SectionCard from "@/components/ui/SectionCard";
import { useUpdateAgentAccountMutation } from "@/redux/features/agent/agentApi";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

/* ──────────────────────────────────────────────────────────────────────────
 * Account Edit (Admin)
 * - Update: name, email, password (optional)
 * ────────────────────────────────────────────────────────────────────────── */

export default function AgentAccountEdit({
  agent,
  onSaved,
}: {
  agent: any;
  onSaved?: () => void;
}) {
  const [updateAccount, { isLoading }] = useUpdateAgentAccountMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useMemo(() => {
    if (!agent?._id) return;
    setName(agent?.name || "");
    setEmail(agent?.email || "");
    setPassword("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent?._id]);

  const isEmailValid = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());

  const onSave = async () => {
    const n = String(name || "").trim();
    const e = String(email || "").trim();
    const p = String(password || "").trim();

    if (n.length < 2) return toast.error("Name minimum 2 characters");
    if (!isEmailValid(e)) return toast.error("Valid email required");
    if (p && p.length < 6) return toast.error("Password minimum 6 characters");

    try {
      await updateAccount({
        agentId: agent?._id,
        name: n,
        email: e,
        ...(p ? { password: p } : {}),
      } as any).unwrap();

      toast.success("Account updated ✅");
      setPassword("");
      onSaved?.();
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        `Update failed (${err?.status || "?"})`;
      toast.error(msg);
    }
  };

  return (
    <SectionCard
      title="Account (Edit)"
      subtitle="Change name / email / password"
      right={
        <button
          onClick={onSave}
          disabled={isLoading}
          className="rounded-lg bg-teal-600/80 px-3 py-2 text-xs font-semibold hover:bg-teal-600 disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none"
          placeholder="Name"
        />

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none"
          placeholder="Email"
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-sm outline-none"
          placeholder="New Password (optional)"
        />
      </div>
      <div className="mt-2 text-xs text-[rgb(var(--app-text-muted))]">
        Password দিলে API তে <b>text_password</b> ও আপডেট হবে।
      </div>
    </SectionCard>
  );
}
