"use client";

export default function TableShell({
  loading,
  emptyText = "No data",
  cols,
  children,
}: {
  loading: boolean;
  emptyText?: string;
  cols: number;
  children: React.ReactNode;
}) {
  if (loading) return <div className="text-sm text-[rgb(var(--app-text-muted))]">Loading...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">{children}</table>
      {/* Empty row handling টেবিলের ভিতরে component দিয়ে না করে parent এ করা যাবে */}
    </div>
  );
}
