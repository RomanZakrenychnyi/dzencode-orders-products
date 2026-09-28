"use client";

import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { orderDeleted } from "@/store/inventorySlice";
import OrdersList from "./OrdersList";

export default function OrdersView() {
  const { orders, products } = useAppSelector((state) => state.inventory);
  const dispatch = useAppDispatch();
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <main className="inventory-page container-fluid p-4 p-lg-5">
      <h1 ref={headingRef} tabIndex={-1} className="inventory-page__title h2 mb-4">Приходы / {orders.length}</h1>
      <OrdersList orders={orders} products={products} onDelete={(id) => {
        dispatch(orderDeleted(id));
        headingRef.current?.focus();
      }} />
    </main>
  );
}
