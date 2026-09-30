"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { isLocale, messages, type Locale } from "./messages";

import { interfaceMessages } from "./interfaceMessages";

const storageKey = "inventory.locale";
const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(null);

export default function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  // Начальный язык одинаков на сервере и при гидратации.
  const [locale, updateLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (isLocale(saved)) updateLocale(saved);
    } catch { /* При недоступном хранилище язык работает в текущей вкладке. */ }
    const sync = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) updateLocale(isLocale(event.newValue) ? event.newValue : "ru");
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.cookie = `inventory_locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", interfaceMessages[locale].description);
  }, [locale]);

  const setLocale = (next: Locale) => {
    updateLocale(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Не блокируем переключение языка. */ }
  };
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return { ...context, messages: messages[context.locale], ui: interfaceMessages[context.locale] };
}
