import type { Metadata } from "next";
import OrdersList from "@/components/orders-list/OrdersList";
import { orders, products } from "@/data/inventory";

export const metadata: Metadata = {
  title: "Приходы | Orders & Products",
};

export default function OrdersPage() {
  return (
    <main className="inventory-page container-fluid p-4 p-lg-5">
      <h1 className="inventory-page__title h2 mb-4">Приходы / {orders.length}</h1>
      <OrdersList orders={orders} products={products} />
    </main>
  );
}
