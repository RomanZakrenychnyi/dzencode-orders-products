import { getServerLocale } from "@/i18n/server";
import { interfaceMessages } from "@/i18n/interfaceMessages";
import type { Metadata } from "next";
import OrdersView from "@/components/orders-list/OrdersView";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return { title: `${interfaceMessages[locale].orders} | Orders & Products` };
}

export default function OrdersPage() {
  return <OrdersView />;
}
