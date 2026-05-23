"use client";

export default function PaginationMini({
  page,
  totalPages,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  const tp = totalPages || 1;
  return (
    <div className="mt-3 flex items-center justify-between text-xs text-[rgb(var(--app-text-muted))]">
      <div>
        Page <b>{page}</b> / <b>{tp}</b>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="rounded-md border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-2 py-1 disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={onNext}
          disabled={page >= tp}
          className="rounded-md border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 px-2 py-1 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
