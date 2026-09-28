import type { Metadata } from "next";
import OrdersView from "@/components/orders-list/OrdersView";

export const metadata: Metadata = {
  title: "Приходы | Orders & Products",
};

export default function OrdersPage() {
  return <OrdersView />;
}
