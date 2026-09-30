"use client";

import { useLocale } from "@/i18n/LocaleProvider";

import { useRef, useState } from "react";
import type { Order, Product } from "@/types/inventory";
import OrderDetails from "./OrderDetails";
import LazyDeleteOrderDialog from "./LazyDeleteOrderDialog";
import { formatMoney, formatOrderDate, getOrderSummary, productCountLabel } from "@/lib/orders";

interface OrdersListProps {
  orders: Order[];
  products: Product[];
  onDelete: (id: number) => Promise<void>;
  onDeleted: () => void;
}

export default function OrdersList({ orders, products, onDelete, onDeleted }: OrdersListProps) {
  const { ui, locale } = useLocale();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const deleteLock = useRef(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const pendingOrder = orders.find((order) => order.id === pendingDeleteId);
  const deleteTriggerRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  function closeDetails() {
    triggerRef.current?.focus();
    setSelectedOrderId(null);
  }

  if (orders.length === 0) {
    return <p className="orders-list__empty p-4">{ui.emptyOrders}</p>;
  }

  return (
    <>
    <div className={`orders-workspace${selectedOrder ? " orders-workspace--expanded" : ""}`}>
    <ul className="orders-list list-unstyled d-flex flex-column gap-2 mb-0" aria-label={ui.orderList}>
      {orders.map((order) => {
        const { productCount, totals } = getOrderSummary(order.id, products);
        const date = formatOrderDate(order.date, locale);

        return (
          <li key={order.id} className={`orders-list__item position-relative${selectedOrderId === order.id ? " orders-list__item--selected" : ""}`}>
            <article className="row align-items-center g-3 px-3 py-3 m-0" aria-labelledby={`order-${order.id}`}>
              <div className={selectedOrder ? "col-12" : "col-12 col-xl-5"}>
                <h2 id={`order-${order.id}`} className="orders-list__title mb-0">
                  <button
                    type="button"
                    className="orders-list__select"
                    aria-expanded={selectedOrderId === order.id}
                    aria-controls={selectedOrderId === order.id ? "order-details" : undefined}
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setSelectedOrderId(order.id);
                    }}
                  >
                    {order.title}
                  </button>
                </h2>
              </div>
              <div className={`${selectedOrder ? "col-6" : "col-6 col-md-4 col-xl-2"} d-flex align-items-center gap-3`}>
                <span className="orders-list__icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 4h3v3H3zm5 0h13v3H8zM3 10h3v3H3zm5 0h13v3H8zM3 16h3v3H3zm5 0h13v3H8z" />
                  </svg>
                </span>
                <div>
                  <span className="orders-list__count d-block">{productCount}</span>
                  <span className="orders-list__muted">{productCountLabel(productCount, locale)}</span>
                </div>
              </div>
              <div className={selectedOrder ? "col-6 text-end" : "col-6 col-md-4 col-xl-2 text-md-center"}>
                <time dateTime={order.date} className="orders-list__date">
                  <span className="orders-list__muted orders-list__date-short d-block">{date.short}</span>
                  <span>{date.long}</span>
                </time>
              </div>
              {!selectedOrder && <div className="col-12 col-md-4 col-xl-3 text-md-end">
                <div className="orders-list__muted orders-list__price-secondary">{formatMoney(totals.USD, locale)} USD</div>
                <div className="orders-list__price">{formatMoney(totals.UAH, locale)} UAH</div>
              </div>}
            </article>
            <button type="button" className="orders-list__delete" aria-label={`${ui.deleteOrder} «${order.title}»`}
              onClick={(event) => { deleteTriggerRef.current = event.currentTarget; setDeleteError(false); setPendingDeleteId(order.id); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7M14 10v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </li>
        );
      })}
    </ul>
    <div className="orders-workspace__details" inert={!selectedOrder} aria-hidden={!selectedOrder}>
    <div className="orders-workspace__details-inner">
    {selectedOrder && (
      <OrderDetails
        key={selectedOrder.id}
        order={selectedOrder}
        products={products.filter((product) => product.orderId === selectedOrder.id)}
        onClose={closeDetails}
      />
    )}
    </div>
    </div>
    </div>
    {pendingOrder && <LazyDeleteOrderDialog
      order={pendingOrder}
      productCount={products.filter((product) => product.orderId === pendingOrder.id).length}
      isDeleting={isDeleting}
      error={deleteError ? ui.deleteError : null}
      onCancel={() => { setPendingDeleteId(null); deleteTriggerRef.current?.focus(); }}
      onConfirm={async () => {
        if (deleteLock.current) return;
        deleteLock.current = true;
        setIsDeleting(true);
        setDeleteError(false);
        try {
          await onDelete(pendingOrder.id);
          if (selectedOrderId === pendingOrder.id) setSelectedOrderId(null);
          setPendingDeleteId(null);
          requestAnimationFrame(onDeleted);
        } catch {
          setDeleteError(true);
        } finally {
          deleteLock.current = false;
          setIsDeleting(false);
        }
      }}
    />}
    </>
  );
}
