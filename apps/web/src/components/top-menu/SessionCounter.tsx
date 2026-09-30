"use client";

import { useLocale } from "@/i18n/LocaleProvider";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function SessionCounter() {
  const { ui } = useLocale();
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState<"connecting" | "connected" | "offline">("connecting");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000", {
      autoConnect: false,
    });

    const onCount = (value: number) => {
      setCount(value);
      setStatus("connected");
    };
    const onUnavailable = () => {
      setCount(null);
      setStatus("offline");
    };

    socket.on("sessions:count", onCount);
    socket.on("disconnect", onUnavailable);
    socket.on("connect_error", onUnavailable);
    socket.connect();

    return () => {
      socket.off("sessions:count", onCount);
      socket.off("disconnect", onUnavailable);
      socket.off("connect_error", onUnavailable);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="top-menu__sessions" role="status" title={ui[status]}>
      <span className={`top-menu__session-dot${count === null ? " top-menu__session-dot--offline" : ""}`} aria-hidden="true" />
      <span>{ui.tabs} <strong>{count ?? "—"}</strong></span>
      {count === null && <span className="visually-hidden">. {ui[status]}</span>}
    </div>
  );
}
