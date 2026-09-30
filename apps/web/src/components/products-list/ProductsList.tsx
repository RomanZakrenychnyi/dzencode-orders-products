"use client";

import { productTypeLabel } from "@/i18n/productTypes";
import { useLocale } from "@/i18n/LocaleProvider";

import type { Order, Product } from "@/types/inventory";
import { formatMoney, formatOrderDate } from "@/lib/orders";

interface ProductsListProps {
  products: Product[];
  orders: Order[];
  filtered: boolean;
}

function GuaranteeDate({ value }: { value: string }) {
  const { locale } = useLocale();
  const [year, month, day] = value.split("-");
  return (
    <time dateTime={value}>
      <span className="d-block">{day} / {month} / {year}</span>
      <span className="products-list__secondary d-block">{formatOrderDate(value, locale).long}</span>
    </time>
  );
}

export default function ProductsList({ products, orders, filtered }: ProductsListProps) {
  const { ui, locale } = useLocale();
  const ordersById = new Map(orders.map((order) => [order.id, order]));

  if (products.length === 0) {
    return <p className="products-list__empty p-4">{filtered ? ui.noMatches : ui.emptyProducts}</p>;
  }

  return (
    <div className="products-list table-responsive" role="region" aria-label={ui.productList} tabIndex={0}>
      <table className="products-list__table table align-middle mb-0">
        <caption className="visually-hidden">{ui.caption}</caption>
        <thead>
          <tr>
            <th scope="col">{ui.product}</th>
            <th scope="col">{ui.type}</th>
            <th scope="col">{ui.guaranteeStart}</th>
            <th scope="col">{ui.guaranteeEnd}</th>
            <th scope="col">{ui.condition}</th>
            <th scope="col">{ui.price}</th>
            <th scope="col">{ui.order}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <th scope="row">
                <div className="d-flex align-items-center gap-3">
                  <span className="products-list__icon" aria-hidden="true">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <rect x="4" y="5" width="24" height="22" rx="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M4 12h24M11 20h10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </span>
                  <div>
                    <span className="products-list__name d-block">{product.title}</span>
                    <span className="products-list__secondary d-block">SN-{product.serialNumber}</span>
                  </div>
                </div>
              </th>
              <td>{productTypeLabel(product.type, locale)}</td>
              <td className="text-nowrap"><GuaranteeDate value={product.guarantee.start} /></td>
              <td className="text-nowrap"><GuaranteeDate value={product.guarantee.end} /></td>
              <td className="text-nowrap">{product.isNew ? ui.new : ui.used}</td>
              <td className="text-nowrap">
                {product.price.length === 0 ? ui.noPrice : product.price.map((price) => (
                  <div key={price.currency} className={price.isDefault ? "products-list__price" : "products-list__secondary"}>
                    {formatMoney(price.amountMinor, locale)} {price.currency}
                  </div>
                ))}
              </td>
              <td className="products-list__order">{ordersById.get(product.orderId)?.title ?? ui.missingOrder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
