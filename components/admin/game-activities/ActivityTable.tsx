import type { GameActivity } from "@/redux/features/admin/gameActivitiesApi";
import { ACTIVITY_LABELS } from "./ActivityFilters";

export const activityMoney = (amount: number) => amount.toLocaleString("en-US", { maximumFractionDigits: 3 });

/* ────────── 🎮 একই table-এ সব game adapter-এর data ────────── */
export default function ActivityTable({ rows, games }: { rows: GameActivity[]; games: { id: string; label: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))]">
      <table className="w-full min-w-[1050px] text-left text-sm">
        <thead className="bg-[rgb(var(--app-surface-2))] text-xs">
          <tr>{["সময়", "গেম", "Room / Round", "অবস্থা", "বাজি 💎", "Payout 💎", "Refund 💎", "নিট ফল 💎", "বিস্তারিত"].map((label) => <th key={label} className="p-3">{label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-[rgb(var(--app-text-muted))]">এই ফিল্টারে কোনো গেম অ্যাক্টিভিটি নেই।</td></tr>}
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-[rgb(var(--app-border))] align-top">
              <td className="whitespace-nowrap p-3 text-xs">{row.occurredAt ? new Date(row.occurredAt).toLocaleString() : "—"}</td>
              <td className="p-3 font-semibold">{games.find((game) => game.id === row.game)?.label ?? row.game}</td>
              <td className="max-w-[180px] break-all p-3 font-mono text-xs">{row.reference || "—"}</td>
              <td className="p-3"><span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs ${row.status === "won" ? "bg-emerald-500/15 text-emerald-500" : row.status === "lost" ? "bg-rose-500/15 text-rose-500" : "bg-blue-500/15 text-blue-500"}`}>{ACTIVITY_LABELS[row.status] ?? row.status}</span></td>
              <td className="p-3 tabular-nums">{activityMoney(row.bet)}</td>
              <td className="p-3 tabular-nums">{activityMoney(row.payout)}</td>
              <td className="p-3 tabular-nums">{activityMoney(row.refund)}</td>
              <td className="p-3 tabular-nums">{row.net === null ? "—" : activityMoney(row.net)}</td>
              <td className="max-w-[230px] p-3 text-xs text-[rgb(var(--app-text-muted))]">
                {row.opponent && <p>Opponent: {row.opponent}</p>}
                {row.slot && <p>Slot {row.slot}{row.multiplier != null ? ` · ${row.multiplier}x` : ""}</p>}
                <p>{row.detail || "—"}</p>
                {row.systemIssue && <p className="mt-1 text-amber-500">{row.systemIssueDetails || "System issue"}</p>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
