"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useGetMeQuery } from "@/store/inventoryApi";
import TopMenu from "@/components/top-menu/TopMenu";
import NavigationMenu from "@/components/navigation-menu/NavigationMenu";

export default function AuthShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const { data, isLoading, isError, refetch, isFetching } = useGetMeQuery(undefined, {
    skip: isLogin, refetchOnMountOrArgChange: true, pollingInterval: 60000,
  });
  if (isLogin) return children;
  if (isLoading) return <main className="p-5" role="status">Проверка входа…</main>;
  if (isError || !data) return (
    <main className="p-5"><p role="alert">Не удалось проверить вход. Попробуйте ещё раз.</p>
      <button className="btn btn-outline-secondary" disabled={isFetching} onClick={() => void refetch()}>Повторить</button>
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
