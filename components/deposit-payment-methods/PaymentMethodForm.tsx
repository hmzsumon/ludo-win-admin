import { FormEvent } from "react";
import { Agent, FormState } from "./types";

export const initialPaymentMethodForm: FormState = {
  accountNumber: "",
  methodName: "Bkash",
  methodType: "payment",
  title: "",
  ownerId: "",
  isActive: false,
  isDefault: false,
};

export default function PaymentMethodForm({
  form,
  setForm,
  agents,
  isAgentsLoading,
  isBusy,
  onSubmit,
  onCancel,
}: {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  agents: Agent[];
  isAgentsLoading: boolean;
  isBusy: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl">
      <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-6">
        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-slate-300">Title</label>
          <input
            value={form.title}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, title: event.target.value }))
            }
            required
            placeholder="BKASH VIP - 01"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-300">Method</label>
          <select
            value={form.methodName}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                methodName: event.target.value as FormState["methodName"],
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
          >
            <option>Bkash</option>
            <option>Nagad</option>
            <option>Rocket</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-slate-300">Type</label>
          <select
            value={form.methodType}
            onChange={(event) =>
              setForm((prev) => ({
                ...prev,
                methodType: event.target.value as FormState["methodType"],
              }))
            }
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
          >
            <option value="payment">payment</option>
            <option value="personal">personal</option>
            <option value="agent">agent</option>
            <option value="merchant">merchant</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-xs text-slate-300">Account Number</label>
          <input
            value={form.accountNumber}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, accountNumber: event.target.value }))
            }
            required
            placeholder="01XXXXXXXXX"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Same number cannot be added twice under the same method.
          </p>
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-xs text-slate-300">Owner Agent</label>
          <select
            value={form.ownerId}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, ownerId: event.target.value }))
            }
            required
            disabled={isAgentsLoading}
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-emerald-400 disabled:opacity-60"
          >
            <option value="">
              {isAgentsLoading ? "Loading agents..." : "Select owner agent"}
            </option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name || "Unnamed Agent"} — {agent.customerId || "No ID"}
                {agent.statusDoc?.agentType ? ` (${agent.statusDoc.agentType})` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-3 md:col-span-3">
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isActive: event.target.checked }))
              }
            />
            Active now
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, isDefault: event.target.checked }))
              }
            />
            Default
          </label>
        </div>

        <div className="flex items-end gap-2 md:col-span-6">
          <button
            type="submit"
            disabled={isBusy || isAgentsLoading}
            className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {form.id ? "Update Number" : "Add Number"}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/10 px-5 py-2 text-sm"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
