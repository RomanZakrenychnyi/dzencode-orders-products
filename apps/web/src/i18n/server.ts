import { cookies } from "next/headers";
import { isLocale } from "./messages";

export async function getServerLocale() {
  const value = (await cookies()).get("inventory_locale")?.value;
  return isLocale(value) ? value : "ru";
}
