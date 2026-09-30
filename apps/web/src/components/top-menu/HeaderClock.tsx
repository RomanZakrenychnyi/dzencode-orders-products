"use client";

import { useLocale } from "@/i18n/LocaleProvider";
import { useEffect, useState } from "react";

export default function HeaderClock() {
  const { locale } = useLocale();
  const dayFormatter = new Intl.DateTimeFormat(locale, { weekday: "long" });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });


  // Одинаковая заглушка на сервере и при первом рендере в браузере.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    updateClock();
    const intervalId = window.setInterval(updateClock, 1000);
    document.addEventListener("visibilitychange", updateClock);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", updateClock);
    };
  }, []);

  const day = now ? dayFormatter.format(now) : "—";
  const time = now ? timeFormatter.format(now) : "--:--";

  return (
    <div className="top-menu__datetime ms-auto">
      <div className="top-menu__day">{day.charAt(0).toUpperCase() + day.slice(1)}</div>
      <div className="d-flex align-items-center gap-3">
        <time dateTime={now?.toISOString()}>
          {now ? dateFormatter.format(now) : "—"}
        </time>
        <span className="d-inline-flex align-items-center gap-2">
          <svg className="top-menu__clock" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M10 5v5H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <time dateTime={now ? time : undefined}>{time}</time>
        </span>
      </div>
    </div>
  );
}
