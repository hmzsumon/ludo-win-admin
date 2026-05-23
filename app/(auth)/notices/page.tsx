"use client";

/* ────────── imports ────────── */
import { useGetAllUsersQuery } from "@/redux/features/admin/adminUsersApi";
import { useSendUserNoticeMutation } from "@/redux/features/notice/userNoticeApi";
import { CheckCircle2, Megaphone, Search, Send, Users } from "lucide-react";
import { useMemo, useState } from "react";

/* ────────── page ────────── */
export default function AdminUserNoticesPage() {
  /* ────────── form state ────────── */
  const [mode, setMode] = useState<"all" | "selected">("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [successText, setSuccessText] = useState("");
  const [errorText, setErrorText] = useState("");

  /* ────────── users list for selected notice ────────── */
  const { data, isFetching } = useGetAllUsersQuery({
    page: 1,
    limit: 200,
    search: search || undefined,
    role: "user",
    is_bot: "false",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const users = data?.users ?? [];
  const selectedCount = selectedIds.length;

  const selectedMap = useMemo(() => {
    return selectedIds.reduce<Record<string, boolean>>((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});
  }, [selectedIds]);

  const [sendNotice, { isLoading }] = useSendUserNoticeMutation();

  /* ────────── select/unselect one user ────────── */
  const toggleUser = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  /* ────────── send notice ────────── */
  const handleSubmit = async () => {
    setSuccessText("");
    setErrorText("");

    if (!title.trim()) {
      setErrorText("Title দিতে হবে");
      return;
    }

    if (!message.trim()) {
      setErrorText("Message দিতে হবে");
      return;
    }

    if (mode === "selected" && selectedIds.length === 0) {
      setErrorText("কমপক্ষে একজন user select করতে হবে");
      return;
    }

    try {
      const res = await sendNotice({
        mode,
        title: title.trim(),
        message: message.trim(),
        url: url.trim() || undefined,
        userIds: mode === "selected" ? selectedIds : undefined,
      }).unwrap();

      setSuccessText(`${res?.data?.sentCount || 0} জন user কে notice পাঠানো হয়েছে`);
      setTitle("");
      setMessage("");
      setUrl("");
      setSelectedIds([]);
    } catch (err: any) {
      setErrorText(err?.data?.message || "Notice পাঠানো যায়নি");
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">User Notices</h1>
            <p className="text-xs text-[rgb(var(--app-text-muted))]">
              Admin message • all users • selected users
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-1.5 text-xs text-[rgb(var(--app-text-muted))]">
            <Megaphone className="h-4 w-4" />
            Notice sender
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_420px]">
          {/* ────────── compose card ────────── */}
          <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-sm font-semibold">Create Notice</h2>
              <p className="text-xs text-[rgb(var(--app-text-muted))]">
                Message টি user panel এ notification/notice হিসেবে দেখাবে।
              </p>
            </div>

            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("all")}
                className={`rounded-2xl border p-4 text-left transition ${
                  mode === "all"
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-[rgb(var(--app-border))] bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <Users className="h-4 w-4" /> All Users
                </div>
                <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                  সব normal user একসাথে notice পাবে।
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMode("selected")}
                className={`rounded-2xl border p-4 text-left transition ${
                  mode === "selected"
                    ? "border-cyan-400/50 bg-cyan-400/10"
                    : "border-[rgb(var(--app-border))] bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-bold">
                  <CheckCircle2 className="h-4 w-4" /> Selected Users
                </div>
                <p className="mt-1 text-xs text-[rgb(var(--app-text-muted))]">
                  এক বা একাধিক user select করে notice পাঠান।
                </p>
              </button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                  Title
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notice title"
                  className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-3 text-sm outline-none transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-400/60"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                  Message
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="User notice message লিখুন"
                  rows={7}
                  className="w-full resize-none rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-3 text-sm outline-none transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-400/60"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                  URL optional
                </span>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/deposit অথবা empty রাখুন"
                  className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.03] px-3 py-3 text-sm outline-none transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-400/60"
                />
              </label>
            </div>

            {errorText ? (
              <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200">
                {errorText}
              </div>
            ) : null}

            {successText ? (
              <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-200">
                {successText}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-[rgb(var(--app-text-muted))]">
                Target: {mode === "all" ? "All users" : `${selectedCount} selected users`}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {isLoading ? "Sending..." : "Send Notice"}
              </button>
            </div>
          </section>

          {/* ────────── user selector ────────── */}
          <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Select Users</h2>
                <p className="text-xs text-[rgb(var(--app-text-muted))]">
                  Selected mode এ এই list থেকে user বাছাই করুন।
                </p>
              </div>
              <span className="rounded-full border border-[rgb(var(--app-border))] bg-white/[0.03] px-2.5 py-1 text-xs text-[rgb(var(--app-text-muted))]">
                {selectedCount} selected
              </span>
            </div>

            <div className="relative mb-3">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--app-text-muted))]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search user / email / customer id"
                className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.03] py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-cyan-400/60"
              />
            </div>

            <div className="mb-3 flex items-center justify-between text-xs text-[rgb(var(--app-text-muted))]">
              <span>{isFetching ? "Loading users..." : `${users.length} users loaded`}</span>
              {selectedIds.length ? (
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="font-semibold text-cyan-300 hover:text-cyan-200"
                >
                  Clear
                </button>
              ) : null}
            </div>

            <div className="max-h-[530px] space-y-2 overflow-y-auto pr-1">
              {users.map((user: any) => {
                const id = String(user._id);
                const active = Boolean(selectedMap[id]);

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => toggleUser(id)}
                    disabled={mode !== "selected"}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
                      active
                        ? "border-cyan-400/50 bg-cyan-400/10"
                        : "border-[rgb(var(--app-border))] bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        active
                          ? "border-cyan-300 bg-cyan-500 text-white"
                          : "border-[rgb(var(--app-border))]"
                      }`}
                    >
                      {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold">
                        {user.name || "Unnamed User"} • {user.customerId || "-"}
                      </span>
                      <span className="block truncate text-xs text-[rgb(var(--app-text-muted))]">
                        {user.email || user.phone || "-"}
                      </span>
                    </span>
                  </button>
                );
              })}

              {!isFetching && users.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[rgb(var(--app-border))] p-6 text-center text-sm text-[rgb(var(--app-text-muted))]">
                  No users found.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
