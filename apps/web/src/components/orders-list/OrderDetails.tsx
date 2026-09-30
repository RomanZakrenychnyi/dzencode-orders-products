"use client";

import { useLocale } from "@/i18n/LocaleProvider";

import { useEffect, useRef } from "react";
import type { Order, Product } from "@/types/inventory";

interface OrderDetailsProps {
  order: Order;
  products: Product[];
  onClose: () => void;
}

export default function OrderDetails({ order, products, onClose }: OrderDetailsProps) {
  const { ui } = useLocale();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section
      id="order-details"
      className="order-details"
      aria-labelledby="order-details-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <button type="button" className="order-details__close" onClick={onClose} aria-label={ui.closeDetails}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
      <div className="p-4">
        <h2 ref={headingRef} tabIndex={-1} id="order-details-title" className="order-details__title h4 mb-0">
          {order.title}
        </h2>
      </div>
      {products.length === 0 ? (
        <p className="order-details__empty px-4 pb-4 mb-0">{ui.emptyDetails}</p>
      ) : (
        <ul className="list-unstyled mb-0" aria-label={ui.selectedProducts}>
          {products.map((product) => (
            <li key={product.id} className="order-details__product d-flex align-items-center gap-3 px-4 py-3">
              <span className="order-details__product-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect x="4" y="5" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
                  <path d="M4 12h24M11 20h10" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <div className="order-details__product-info flex-grow-1">
                <h3 className="order-details__product-title mb-1">{product.title}</h3>
                <p className="order-details__serial mb-0">SN-{product.serialNumber}</p>
              </div>
              <span className="order-details__condition">{product.isNew ? ui.new : ui.used}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
