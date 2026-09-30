"use client";

import { useLocale } from "@/i18n/LocaleProvider";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useGetMeQuery } from "@/store/inventoryApi";
import TopMenu from "@/components/top-menu/TopMenu";
import NavigationMenu from "@/components/navigation-menu/NavigationMenu";

export default function AuthShell({ children }: { children: ReactNode }) {
  const { ui } = useLocale();
  const pathname = usePathname();
  const isPublic = !["/", "/orders", "/products"].includes(pathname);
  const { data, isLoading, isError, refetch, isFetching } = useGetMeQuery(undefined, {
    skip: isPublic, refetchOnMountOrArgChange: true, pollingInterval: 60000,
  });
  if (isPublic) return children;
  if (isLoading) return <main className="p-5" role="status">{ui.checking}</main>;
  if (isError || !data) return (
    <main className="p-5"><p role="alert">{ui.checkError}</p>
      <button className="btn btn-outline-secondary" disabled={isFetching} onClick={() => void refetch()}>{ui.retry}</button>
    </main>
  );
  return <>
    <TopMenu />
    <div className="app-layout__body d-flex flex-column flex-md-row flex-grow-1">
      <NavigationMenu />
      <div className="app-layout__content flex-grow-1">{children}</div>
    </div>
  </>;
}
