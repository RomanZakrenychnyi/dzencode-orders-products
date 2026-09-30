"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useLocale } from "@/i18n/LocaleProvider";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function NotFound() {
  const { ui } = useLocale();
  useEffect(() => { document.title = `404 — ${ui.notFound} | Orders & Products`; }, [ui.notFound]);
  return <main className="container py-5 text-center">
    <div className="d-flex justify-content-end mb-4"><LanguageSwitcher /></div>
    <p className="display-1">404</p>
    <h1>{ui.notFound}</h1>
    <p>{ui.notFoundDescription}</p>
    <Link href="/" className="btn btn-outline-secondary">{ui.goHome}</Link>
  </main>;
}
