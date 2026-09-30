"use client";

import { useId } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { isLocale } from "@/i18n/messages";

export default function LanguageSwitcher() {
  const id = useId();
  const { locale, setLocale, messages } = useLocale();
  return <div>
    <label className="visually-hidden" htmlFor={id}>{messages.language}</label>
    <select id={id} className="form-select form-select-sm" value={locale} onChange={event => {
      if (isLocale(event.target.value)) setLocale(event.target.value);
    }}>
      <option value="ru" lang="ru">Русский</option>
      <option value="uk" lang="uk">Українська</option>
    </select>
  </div>;
}
