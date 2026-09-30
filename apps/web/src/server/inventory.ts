import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { InventorySnapshot } from "@/types/inventorySnapshot";

export async function loadInventory(): Promise<InventorySnapshot | null> {
  const token = (await cookies()).get("orders_session")?.value;
  if (!token) redirect("/login");

  const baseUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const paths = ["/auth/me", "/orders", "/products"];
  // Передаём только cookie сессии. Ответы разных пользователей не кешируются.
  const results = await Promise.allSettled(paths.map(path => fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
    headers: { Cookie: `orders_session=${encodeURIComponent(token)}` },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(10000),
  })));

  if (results.some(result => result.status === "fulfilled" && result.value.status === 401)) {
    redirect("/login");
  }
  if (results.some(result => result.status === "rejected" || !result.value.ok)) return null;

  try {
    const [user, orders, products] = await Promise.all(results.map(result => {
      if (result.status !== "fulfilled") throw new Error("API unavailable");
      return result.value.json();
    }));
    return { user, orders, products };
  } catch {
    return null;
  }
}
