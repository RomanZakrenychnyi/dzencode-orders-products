import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Продукты | Orders & Products",
};

export default function ProductsPage() {
  return (
    <main className="inventory-page container-fluid p-4 p-lg-5">
      <h1 className="inventory-page__title h2 mb-4">Продукты</h1>
      <div className="inventory-page__placeholder p-4">
        <p className="mb-0">Здесь будет список товаров и фильтр по типу.</p>
      </div>
    </main>
  );
}
