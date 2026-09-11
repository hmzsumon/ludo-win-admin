import type { ActivityFilters as Filters } from "@/redux/features/admin/gameActivitiesApi";

export const ACTIVITY_LABELS: Record<string, string> = {
  waiting: "অপেক্ষায়", playing: "চলমান / বাজি রাখা", won: "জয় / Cash out",
  lost: "পরাজয়", refunded: "রিফান্ড", cancelled: "বাতিল",
};

/* ────────── 🎮 Filter controls; game list API registry থেকে আসে ────────── */
export default function ActivityFilters({ value, games, statuses, onChange }: {
  value: Filters;
  games: { id: string; label: string }[];
  statuses: string[];
  onChange: (value: Filters) => void;
}) {
  const change = (key: keyof Filters, next: string) => onChange({ ...value, [key]: next, page: 1 });
  const inputClass = "mt-1 w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] px-3 py-2.5 text-sm";
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-xs font-medium">গেম
        <select className={inputClass} value={value.game} onChange={(e) => change("game", e.target.value)}>
          <option value="all">সব গেম</option>
          {games.map((game) => <option key={game.id} value={game.id}>{game.label}</option>)}
        </select>
      </label>
      <label className="text-xs font-medium">অবস্থা
        <select className={inputClass} value={value.status} onChange={(e) => change("status", e.target.value)}>
          <option value="all">সব অবস্থা</option>
          {statuses.map((status) => <option key={status} value={status}>{ACTIVITY_LABELS[status] ?? status}</option>)}
        </select>
      </label>
      <label className="text-xs font-medium">শুরুর তারিখ (UTC)
        <input className={inputClass} type="date" value={value.from} max={value.to || undefined} onChange={(e) => change("from", e.target.value)} />
      </label>
      <label className="text-xs font-medium">শেষ তারিখ (UTC)
        <input className={inputClass} type="date" value={value.to} min={value.from || undefined} onChange={(e) => change("to", e.target.value)} />
      </label>
    </div>
  );
}
