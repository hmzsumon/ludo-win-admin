"use client";

import {
  useGetMaintenanceStatusQuery,
  useUpdateMaintenanceStatusMutation,
} from "@/redux/features/admin/adminApi";
import {
  AlertTriangle,
  Loader2,
  Power,
  RefreshCcw,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";

/* ──────────  Maintenance Page  ──────────
   Admin এখান থেকে user panel maintenance ON/OFF করবে।
────────────────────────────────────────── */
export default function MaintenancePage() {
  const { data, isLoading, isFetching, refetch } =
    useGetMaintenanceStatusQuery();
  const [updateMaintenance, { isLoading: isSaving }] =
    useUpdateMaintenanceStatusMutation();

  const maintenance = data?.maintenance;
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const isOn = Boolean(maintenance?.maintenanceMode);
  const loading = isLoading || isFetching;

  const handleToggle = async () => {
    try {
      const result = await updateMaintenance({
        maintenanceMode: !isOn,
        maintenanceTitle: maintenance?.maintenanceTitle || "Site Update",
        maintenanceMessage:
          maintenance?.maintenanceMessage ||
          "We are updating the site. Please come back shortly.",
        maintenanceGif:
          maintenance?.maintenanceGif || "/maintenance/update.gif",
      }).unwrap();

      setToast({
        type: "success",
        msg: result?.message || "Maintenance updated",
      });
    } catch (error: any) {
      setToast({
        type: "error",
        msg: error?.data?.message || "Maintenance update failed",
      });
    }
  };

  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      <div className="mx-auto max-w-5xl py-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold">Maintenance</h1>
            <p className="text-xs text-[rgb(var(--app-text-muted))]">
              User panel maintenance mode control
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[rgb(var(--app-border))] bg-white/[0.04] px-3 py-2 text-xs font-semibold text-[rgb(var(--app-text))] transition hover:bg-white/[0.08] disabled:opacity-60"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {toast ? (
          <div
            className={`mb-4 rounded-xl border px-4 py-3 text-sm font-semibold ${
              toast.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {toast.msg}
          </div>
        ) : null}

        <section className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                  isOn
                    ? "bg-orange-500/15 text-orange-300"
                    : "bg-emerald-500/15 text-emerald-300"
                }`}
              >
                {isOn ? (
                  <AlertTriangle className="h-6 w-6" />
                ) : (
                  <Wrench className="h-6 w-6" />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-[rgb(var(--app-text-muted))]">
                  Current Status
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {loading
                    ? "Loading..."
                    : isOn
                      ? "Maintenance ON"
                      : "Maintenance OFF"}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[rgb(var(--app-text-muted))]">
                  {isOn
                    ? "Maintenance ON থাকলে user panel এ update GIF সহ maintenance screen দেখাবে।"
                    : "Maintenance OFF থাকলে user panel আগের মতো স্বাভাবিকভাবে চলবে।"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggle}
              disabled={loading || isSaving}
              className={`inline-flex min-w-[190px] items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isOn
                  ? "bg-emerald-600 hover:bg-emerald-500"
                  : "bg-orange-600 hover:bg-orange-500"
              }`}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Power className="h-4 w-4" />
              )}
              {isOn ? "Turn OFF" : "Turn ON"}
            </button>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-5">
            <p className="text-sm font-bold">User Panel Preview Text</p>
            <div className="mt-4 space-y-3 text-sm text-[rgb(var(--app-text-muted))]">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Title
                </span>
                <p className="mt-1 font-semibold text-[rgb(var(--app-text))]">
                  {maintenance?.maintenanceTitle || "Site Update"}
                </p>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide">
                  Message
                </span>
                <p className="mt-1 leading-6">
                  {maintenance?.maintenanceMessage ||
                    "We are updating the site. Please come back shortly."}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-5">
            <p className="text-sm font-bold">Maintenance GIF</p>
            <div className="mt-4 overflow-hidden rounded-2xl bg-white p-4">
              {/* user panel public asset path */}
              <img
                src={maintenance?.maintenanceGif || "/maintenance/update.gif"}
                alt="Maintenance update"
                className="mx-auto h-56 w-auto object-contain"
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
