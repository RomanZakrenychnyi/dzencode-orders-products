import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Приходы | Orders & Products",
};

export default function OrdersPage() {
  return (
    <main className="inventory-page container-fluid p-4 p-lg-5">
      <h1 className="inventory-page__title h2 mb-4">Приходы</h1>
      <div className="inventory-page__placeholder p-4">
        <p className="mb-0">Здесь будет список приходов.</p>
      </div>
    </main>
  );
}
