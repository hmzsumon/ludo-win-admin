"use client";

/* ────────── imports ────────── */
import socketUrl from "@/config/socketUrl";
import { SocketUser } from "@/types";
import { getAccessToken } from "@/utils/authToken";
import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";

interface iSocketContextType {
  socket: Socket | null;
  isSocketConnected: boolean;
  onlineUsers: SocketUser[];
}

export const SocketContext = createContext<iSocketContextType | null>(null);

export const SocketContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useSelector((state: any) => state.auth);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<SocketUser[]>([]);

  useEffect(() => {
    if (!user || !user._id) return;

    /* ────────── resolve token for socket auth ────────── */
    const accessToken = getAccessToken();

    /* ────────── socket debug ────────── */
    console.log("/* ────────── admin socket debug ────────── */");
    console.log("🌐 socket url:", socketUrl);
    console.log("🔐 socket token:", accessToken ? "FOUND" : "MISSING");
    console.log("👤 socket user:", String(user._id));
    console.log("🧩 socket role:", user?.role || "NO_ROLE");

    /* ────────── create socket with auth token ────────── */
    const newSocket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
      auth: {
        token: accessToken,
      },
    });

    /* ────────── socket connected ────────── */
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);

      /* ────────── join personal room ────────── */
      newSocket.emit("join-room", String(user._id));

      /* ────────── join admin room ────────── */
      if (user?.role === "admin") {
        newSocket.emit("join-admin-room");
      }

      setSocket(newSocket);
      setIsSocketConnected(true);
    });

    /* ────────── socket connect error ────────── */
    newSocket.on("connect_error", (err: any) => {
      console.error("🔴 admin socket connect_error:", err?.message, err);
    });

    /* ────────── socket disconnected ────────── */
    newSocket.on("disconnect", (reason) => {
      console.log("🔴 Socket disconnected:", reason);
      setIsSocketConnected(false);
    });

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsSocketConnected(false);
    };
  }, [user?._id, user?.role]);

  useEffect(() => {
    if (!socket) return;

    /* ────────── online users listener ────────── */
    const handleGetUsers = (users: SocketUser[]) => {
      setOnlineUsers(users);
    };

    socket.on("getUsers", handleGetUsers);

    return () => {
      socket.off("getUsers", handleGetUsers);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, isSocketConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};
