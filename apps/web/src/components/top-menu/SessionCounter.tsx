"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function SessionCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [status, setStatus] = useState("Подключение…");

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000", {
      autoConnect: false,
    });

    const onCount = (value: number) => {
      setCount(value);
      setStatus("Соединение установлено");
    };
    const onUnavailable = () => {
      setCount(null);
      setStatus("Нет связи с сервером");
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
    <div className="top-menu__sessions" role="status" title={status}>
      <span className={`top-menu__session-dot${count === null ? " top-menu__session-dot--offline" : ""}`} aria-hidden="true" />
      <span>Активные вкладки: <strong>{count ?? "—"}</strong></span>
      {count === null && <span className="visually-hidden">. {status}</span>}
    </div>
  );
}
