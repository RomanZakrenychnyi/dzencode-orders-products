"use client";

import { useLocale } from "@/i18n/LocaleProvider";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useInventory } from "@/store/useInventory";
import InventoryRequestState from "@/components/InventoryRequestState";
import { inventoryApi, useDeleteOrderMutation } from "@/store/inventoryApi";
import OrdersList from "./OrdersList";
import OrdersChart from "@/components/orders-chart/OrdersChart";

export default function OrdersView() {
  const { ui } = useLocale();
  useEffect(() => { document.title = `${ui.orders} | Orders & Products`; }, [ui.orders]);
  const { orders, products, isLoading, isError, isFetching, retry } = useInventory();
  const dispatch = useAppDispatch();
  const [deleteOrder] = useDeleteOrderMutation();
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <main className="inventory-page container-fluid p-4 p-lg-5">
      <h1 ref={headingRef} tabIndex={-1} className="inventory-page__title h2 mb-4">{ui.orders} / {isLoading || isError ? "—" : orders.length}</h1>
      {isLoading || isError ? <InventoryRequestState isError={isError} isFetching={isFetching} retry={retry} /> : <OrdersList orders={orders} products={products} onDelete={async (id) => {
        await deleteOrder(id).unwrap();
        dispatch(inventoryApi.util.updateQueryData("getOrders", undefined, data => data.filter(order => order.id !== id)));
        dispatch(inventoryApi.util.updateQueryData("getProducts", undefined, data => data.filter(product => product.orderId !== id)));
      }} onDeleted={() => headingRef.current?.focus()} />}
      {!isLoading && !isError && <OrdersChart orders={orders} products={products} />}
    </main>
  );
}
