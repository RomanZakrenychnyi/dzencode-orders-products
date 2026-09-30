"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/i18n/LocaleProvider";
import LanguageSwitcher from "./LanguageSwitcher";

export default function ServerRequestError() {
  const { ui } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return <main className="container p-5">
    <div className="d-flex justify-content-end mb-4"><LanguageSwitcher /></div>
    <div className="alert alert-danger" role="alert">
      <p>{ui.loadError}</p>
      <button className="btn btn-outline-danger" disabled={pending}
        onClick={() => startTransition(() => router.refresh())}>
        {pending ? ui.loading : ui.retry}
      </button>
    </div>
  </main>;
}
