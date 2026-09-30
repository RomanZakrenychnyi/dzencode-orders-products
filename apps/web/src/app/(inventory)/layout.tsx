import type { ReactNode } from "react";
import { loadInventory } from "@/server/inventory";
import StoreProvider from "@/store/StoreProvider";
import AuthShell from "@/components/auth/AuthShell";
import ServerRequestError from "@/components/ServerRequestError";

export default async function InventoryLayout({ children }: { children: ReactNode }) {
  const initialData = await loadInventory();
  if (!initialData) return <ServerRequestError />;
  return <StoreProvider initialData={initialData}>
    <AuthShell>{children}</AuthShell>
  </StoreProvider>;
}
