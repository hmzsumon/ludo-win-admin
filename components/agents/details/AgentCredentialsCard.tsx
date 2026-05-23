"use client";

import SectionCard from "@/components/ui/SectionCard";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AgentCredentialsCard({ agent }: { agent: any }) {
  const plainPassword = agent?.text_password || "";
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = async (value: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(label);
    } catch (e) {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      toast.success(label);
    }
  };

  return (
    <SectionCard
      title="Credentials"
      subtitle="Copy email / customerId / password quickly"
      right={
        <button
          onClick={() =>
            copyToClipboard(
              `Agent Login\nEmail: ${agent?.email || ""}\nCustomerId: ${
                agent?.customerId || ""
              }\nPassword: ${plainPassword || ""}\n`,
              "Copied all ✅",
            )
          }
          className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-3 py-2 text-xs hover:bg-[rgb(var(--app-surface-3))]/80"
        >
          Copy All
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 p-3">
          <div className="text-xs text-[rgb(var(--app-text-muted))]">Email</div>
          <div className="mt-1 break-all text-sm font-semibold">
            {agent?.email || "-"}
          </div>
          <button
            onClick={() =>
              copyToClipboard(String(agent?.email || ""), "Email copied ✅")
            }
            className="mt-2 rounded-md border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-2 py-1 text-xs hover:bg-[rgb(var(--app-surface-3))]/80"
          >
            Copy
          </button>
        </div>

        <div className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 p-3">
          <div className="text-xs text-[rgb(var(--app-text-muted))]">Customer ID</div>
          <div className="mt-1 break-all text-sm font-semibold">
            {agent?.customerId || "-"}
          </div>
          <button
            onClick={() =>
              copyToClipboard(
                String(agent?.customerId || ""),
                "CustomerId copied ✅",
              )
            }
            className="mt-2 rounded-md border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-2 py-1 text-xs hover:bg-[rgb(var(--app-surface-3))]/80"
          >
            Copy
          </button>
        </div>

        <div className="rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/60 p-3">
          <div className="text-xs text-[rgb(var(--app-text-muted))]">Password</div>
          <div className="mt-1 flex items-center gap-2">
            <div className="break-all text-sm font-semibold">
              {plainPassword
                ? showPassword
                  ? plainPassword
                  : "••••••••"
                : "-"}
            </div>
            <button
              onClick={() => setShowPassword((x) => !x)}
              className="rounded-md border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-2 py-1 text-xs hover:bg-[rgb(var(--app-surface-3))]/80"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            onClick={() =>
              copyToClipboard(String(plainPassword || ""), "Password copied ✅")
            }
            disabled={!plainPassword}
            className="mt-2 rounded-md border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-2 py-1 text-xs hover:bg-[rgb(var(--app-surface-3))]/80 disabled:opacity-50"
          >
            Copy
          </button>
        </div>
      </div>

      {!plainPassword && (
        <div className="mt-3 text-xs text-amber-300/90">
          Password not available. API must return <b>agent.text_password</b>.
        </div>
      )}
    </SectionCard>
  );
}
