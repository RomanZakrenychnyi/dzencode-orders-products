"use client";

import { useLocale } from "@/i18n/LocaleProvider";

import { useState } from "react";
import { useLogoutMutation } from "@/store/inventoryApi";

export default function LogoutButton() {
  const { ui } = useLocale();
  const [logout, { isLoading }] = useLogoutMutation();
  const [error, setError] = useState(false);
  return <div>
    <button type="button" className="btn btn-outline-secondary btn-sm" disabled={isLoading} onClick={async () => {
      setError(false);
      try { await logout().unwrap(); window.location.replace("/login"); }
      catch { setError(true); }
    }}>{isLoading ? ui.loggingOut : ui.logout}</button>
    {error && <p className="small text-danger mb-0" role="alert">{ui.logoutError}</p>}
  </div>;
}
