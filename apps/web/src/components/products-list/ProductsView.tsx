"use client";

import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import ProductsList from "./ProductsList";

export default function ProductsView() {
  const { products, orders } = useAppSelector((state) => state.inventory);
  const [selectedType, setSelectedType] = useState("");
  const types = Array.from(new Set(products.map((product) => product.type)))
    .sort((a, b) => a.localeCompare(b, "ru"));
  const visibleProducts = selectedType
    ? products.filter((product) => product.type === selectedType)
    : products;

  return (
    <main className="inventory-page container-fluid p-4 p-lg-5">
      <div className="d-flex align-items-center flex-wrap gap-4 mb-4">
        <h1 className="inventory-page__title h2 mb-0">Продукты / {visibleProducts.length}</h1>
        <div className="products-filter d-flex align-items-center gap-2">
          <label htmlFor="product-type" className="products-filter__label">Тип:</label>
          <select id="product-type" className="form-select form-select-sm" value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}>
            <option value="">Все типы</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
      <p className="visually-hidden" role="status">Найдено товаров: {visibleProducts.length}</p>
      <ProductsList products={visibleProducts} orders={orders} filtered={Boolean(selectedType)} />
    </main>
  );
}
