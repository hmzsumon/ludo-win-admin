"use client";

/* ────────── Imports ────────── */
import { useSocket } from "@/context/SocketContext";
import {
  useGetNotificationsQuery,
  useUpdateNotificationMutation,
} from "@/redux/features/notifications/notificationApi";
import { X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

/* ────────── Types ────────── */
type AdminNotification = {
  _id: string;
  title?: string;
  message?: string;
  category?: string;
  url?: string;
  is_read?: boolean;
  createdAt?: string;
};

/* ────────── Formatter ────────── */
const formatDate = (value?: string) => {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};

export default function NotificationDrawer({
  open,
  onClose,
  topOffset = 64,
}: {
  open: boolean;
  onClose: () => void;
  topOffset?: number;
}) {
  const { socket } = useSocket();
  const { data, refetch, isLoading } = useGetNotificationsQuery();
  const [markRead] = useUpdateNotificationMutation();

  const notifications: AdminNotification[] =
    data?.notifications || data?.data || [];
  const unreadIds = notifications
    .filter((notification) => !notification.is_read)
    .map((notification) => notification._id);

  /* ────────── Socket Admin Notification Listener ────────── */
  useEffect(() => {
    if (!socket) return;

    const handleAdminNotification = () => {
      refetch();
    };

    socket.on("admin-notification", handleAdminNotification);

    return () => {
      socket.off("admin-notification", handleAdminNotification);
    };
  }, [socket, refetch]);

  /* ────────── Mark Visible Notifications Read ────────── */
  useEffect(() => {
    if (!open || unreadIds.length === 0) return;
    markRead(unreadIds);
  }, [open, unreadIds.length]);

  return (
    <>
      {/* ────────── Overlay ────────── */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ top: topOffset }}
      />

      {/* ────────── Panel ────────── */}
      <aside
        className={`fixed right-0 z-[61] h-[calc(100dvh-4rem)] w-full max-w-[380px] translate-x-0 border-l border-neutral-900 bg-neutral-950 transition-transform md:max-w-[420px] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ top: topOffset }}
        aria-hidden={!open}
      >
        <div className="flex h-12 items-center justify-between border-b border-neutral-900 px-4">
          <div className="text-sm font-semibold text-white">Notifications</div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* ────────── Notification List ────────── */}
        <div className="max-h-[calc(100dvh-7rem)] overflow-y-auto p-4">
          {isLoading ? (
            <div className="text-sm text-neutral-300">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-sm text-neutral-300">
              You currently have no new notifications.
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => {
                const content = (
                  <div
                    className={`rounded-xl border p-3 transition hover:bg-neutral-900 ${
                      notification.is_read
                        ? "border-neutral-900 bg-neutral-950"
                        : "border-emerald-500/30 bg-emerald-500/10"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {notification.title || "Notification"}
                        </h4>
                        <p className="mt-1 text-xs text-neutral-300">
                          {notification.message || "-"}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>{notification.category || "general"}</span>
                      <span>{formatDate(notification.createdAt)}</span>
                    </div>
                  </div>
                );

                return notification.url ? (
                  <Link
                    key={notification._id}
                    href={notification.url}
                    onClick={onClose}
                  >
                    {content}
                  </Link>
                ) : (
                  <div key={notification._id}>{content}</div>
                );
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
