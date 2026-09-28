"use client";

import { useEffect, useRef, useState } from "react";
import type { Order, Product } from "@/types/inventory";
import OrderDetails from "./OrderDetails";
import { formatMoney, formatOrderDate, getOrderSummary, productCountLabel } from "@/lib/orders";

interface OrdersListProps {
  orders: Order[];
  products: Product[];
}

export default function OrdersList({ orders, products }: OrdersListProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const selectedOrder = orders.find((order) => order.id === selectedOrderId);

  function closeDetails() {
    triggerRef.current?.focus();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelectedOrderId(null);
      return;
    }
    setIsClosing(true);
  }

  useEffect(() => {
    if (!isClosing) return;
    // Даём CSS-переходу завершиться перед удалением содержимого панели.
    const timeout = window.setTimeout(() => {
      setSelectedOrderId(null);
      setIsClosing(false);
    }, 320);
    return () => window.clearTimeout(timeout);
  }, [isClosing]);

  if (orders.length === 0) {
    return <p className="orders-list__empty p-4">Приходов пока нет.</p>;
  }

  return (
    <div className={`orders-workspace${selectedOrder && !isClosing ? " orders-workspace--expanded" : ""}`}>
    <ul className="orders-list list-unstyled d-flex flex-column gap-2 mb-0" aria-label="Список приходов">
      {orders.map((order) => {
        const { productCount, totals } = getOrderSummary(order.id, products);
        const date = formatOrderDate(order.date);

        return (
          <li key={order.id} className={`orders-list__item${selectedOrderId === order.id ? " orders-list__item--selected" : ""}`}>
            <article className="row align-items-center g-3 px-3 py-3 m-0" aria-labelledby={`order-${order.id}`}>
              <div className={selectedOrder ? "col-12" : "col-12 col-xl-5"}>
                <h2 id={`order-${order.id}`} className="orders-list__title mb-0">
                  <button
                    type="button"
                    className="orders-list__select"
                    aria-expanded={selectedOrderId === order.id && !isClosing}
                    aria-controls={selectedOrderId === order.id ? "order-details" : undefined}
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setIsClosing(false);
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
                  <span className="orders-list__muted">{productCountLabel(productCount)}</span>
                </div>
              </div>
              <div className={selectedOrder ? "col-6 text-end" : "col-6 col-md-4 col-xl-2 text-md-center"}>
                <time dateTime={order.date} className="orders-list__date">
                  <span className="orders-list__muted orders-list__date-short d-block">{date.short}</span>
                  <span>{date.long}</span>
                </time>
              </div>
              {!selectedOrder && <div className="col-12 col-md-4 col-xl-3 text-md-end">
                <div className="orders-list__muted orders-list__price-secondary">{formatMoney(totals.USD)} USD</div>
                <div className="orders-list__price">{formatMoney(totals.UAH)} UAH</div>
              </div>}
            </article>
          </li>
        );
      })}
    </ul>
    <div className="orders-workspace__details" inert={!selectedOrder || isClosing} aria-hidden={!selectedOrder || isClosing}>
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
  );
}
