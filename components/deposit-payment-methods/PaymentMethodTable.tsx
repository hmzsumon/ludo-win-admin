import { DepositPaymentMethod } from "./types";

const formatAmount = (value?: number) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  });
};

export default function PaymentMethodTable({
  methods,
  isLoading,
  onEdit,
  onToggle,
  onDelete,
}: {
  methods: DepositPaymentMethod[];
  isLoading: boolean;
  onEdit: (method: DepositPaymentMethod) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-xl">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/10 text-xs uppercase text-slate-300">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Schedule</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {isLoading ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-300" colSpan={8}>
                  Loading...
                </td>
              </tr>
            ) : methods.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-300" colSpan={8}>
                  No payment methods found.
                </td>
              </tr>
            ) : (
              methods.map((method) => (
                <tr key={method._id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-medium">{method.title}</td>
                  <td className="px-4 py-3">
                    <div>{method.methodName}</div>
                    <div className="text-xs text-slate-400">{method.methodType}</div>
                  </td>
                  <td className="px-4 py-3">{method.accountNumber}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{method.owner?.name || "-"}</div>
                    <div className="text-xs text-slate-400">
                      {method.owner?.customerId || "No customer ID"} • {method.owner?.role || "agent"}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-300">
                    <div>Active: {formatDate(method.activeFrom)}</div>
                    <div>Inactive: {formatDate(method.activeUntil || method.nextInactiveAt)}</div>
                  </td>
                  <td className="px-4 py-3">{formatAmount(method.totalReceiveAmount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        method.isActive
                          ? "bg-emerald-400/20 text-emerald-300"
                          : "bg-rose-400/20 text-rose-300"
                      }`}
                    >
                      {method.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => onEdit(method)} className="rounded-lg border border-white/10 px-3 py-1 text-xs">
                        Edit
                      </button>
                      <button onClick={() => onToggle(method._id)} className="rounded-lg border border-amber-400/30 px-3 py-1 text-xs text-amber-300">
                        {method.isActive ? "Inactive" : "Active"}
                      </button>
                      <button onClick={() => onDelete(method._id)} className="rounded-lg border border-rose-400/30 px-3 py-1 text-xs text-rose-300">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
