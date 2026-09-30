"use client";

import { useId, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";
import { formatMoney, getOrderSummary } from "@/lib/orders";
import type { Currency, Order, Product } from "@/types/inventory";
import "./orders-chart.scss";

export default function OrdersChart({ orders, products }: { orders: Order[]; products: Product[] }) {
  const { ui, locale } = useLocale();
  const [currency, setCurrency] = useState<Currency>("UAH");
  const titleId = useId();
  const currencyId = useId();
  const rows = orders.map(order => ({
    ...order, amount: getOrderSummary(order.id, products).totals[currency],
  }));
  const maximum = Math.max(0, ...rows.map(row => row.amount));

  return <section className="orders-chart mt-4 p-3 p-md-4" aria-labelledby={titleId}>
    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-2">
      <h2 id={titleId} className="h5 mb-0">{ui.chartTitle}</h2>
      <div className="d-flex align-items-center gap-2">
        <label htmlFor={currencyId}>{ui.chartCurrency}</label>
        <select id={currencyId} className="form-select form-select-sm w-auto" value={currency}
          onChange={event => {
            if (event.target.value === "UAH" || event.target.value === "USD") setCurrency(event.target.value);
          }}>
          <option value="UAH">UAH</option>
          <option value="USD">USD</option>
        </select>
      </div>
    </div>
    <p className="small text-secondary mb-4">{ui.chartDescription}</p>
    {rows.length === 0 ? <p className="mb-0">{ui.emptyOrders}</p> : <>
      <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
        {rows.map(row => <li key={row.id} className="orders-chart__row">
          <span className="orders-chart__label">{row.title}</span>
          <svg className="orders-chart__bar" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true">
            <rect width="100" height="12" rx="1" fill="#edf1f3" />
            <rect width={maximum > 0 ? row.amount / maximum * 100 : 0} height="12" rx="1" fill="#72a832" />
          </svg>
          <span className="orders-chart__value">{formatMoney(row.amount, locale)} {currency}</span>
        </li>)}
      </ul>
      {maximum === 0 && <p className="small text-secondary mt-3 mb-0">{ui.chartZero}</p>}
    </>}
  </section>;
}
