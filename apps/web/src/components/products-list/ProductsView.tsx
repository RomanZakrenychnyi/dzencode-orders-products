"use client";

import { useState } from "react";
import { useInventory } from "@/store/useInventory";
import InventoryRequestState from "@/components/InventoryRequestState";
import ProductsList from "./ProductsList";

export default function ProductsView() {
  const { products, orders, isLoading, isError, isFetching, retry } = useInventory();
  const [selectedType, setSelectedType] = useState("");
  const types = Array.from(new Set(products.map((product) => product.type)))
    .sort((a, b) => a.localeCompare(b, "ru"));
  const activeType = types.includes(selectedType) ? selectedType : "";
  const visibleProducts = activeType
    ? products.filter((product) => product.type === activeType)
    : products;

  return (
    <main className="inventory-page container-fluid p-4 p-lg-5">
      <div className="d-flex align-items-center flex-wrap gap-4 mb-4">
        <h1 className="inventory-page__title h2 mb-0">Продукты / {isLoading || isError ? "—" : visibleProducts.length}</h1>
        <div className="products-filter d-flex align-items-center gap-2">
          <label htmlFor="product-type" className="products-filter__label">Тип:</label>
          <select id="product-type" className="form-select form-select-sm" value={activeType} disabled={isLoading || isError}
            onChange={(event) => setSelectedType(event.target.value)}>
            <option value="">Все типы</option>
            {types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>
      </div>
      {isLoading || isError ? <InventoryRequestState isError={isError} isFetching={isFetching} retry={retry} /> : <>
        <p className="visually-hidden" role="status">Найдено товаров: {visibleProducts.length}</p>
        <ProductsList products={visibleProducts} orders={orders} filtered={Boolean(activeType)} />
      </>}
    </main>
  );
}
