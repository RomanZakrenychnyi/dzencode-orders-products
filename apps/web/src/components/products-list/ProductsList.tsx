import type { Order, Product } from "@/types/inventory";
import { formatMoney, formatOrderDate } from "@/lib/orders";

interface ProductsListProps {
  products: Product[];
  orders: Order[];
  filtered: boolean;
}

function GuaranteeDate({ value }: { value: string }) {
  const [year, month, day] = value.split("-");
  return (
    <time dateTime={value}>
      <span className="d-block">{day} / {month} / {year}</span>
      <span className="products-list__secondary d-block">{formatOrderDate(value).long}</span>
    </time>
  );
}

export default function ProductsList({ products, orders, filtered }: ProductsListProps) {
  const ordersById = new Map(orders.map((order) => [order.id, order]));

  if (products.length === 0) {
    return <p className="products-list__empty p-4">{filtered ? "Товары выбранного типа не найдены." : "Товаров пока нет."}</p>;
  }

  return (
    <div className="products-list table-responsive" role="region" aria-label="Список продуктов" tabIndex={0}>
      <table className="products-list__table table align-middle mb-0">
        <caption className="visually-hidden">Товары, гарантия, цены и связанные приходы</caption>
        <thead>
          <tr>
            <th scope="col">Продукт</th>
            <th scope="col">Тип</th>
            <th scope="col">Гарантия с</th>
            <th scope="col">Гарантия по</th>
            <th scope="col">Состояние</th>
            <th scope="col">Цена</th>
            <th scope="col">Приход</th>
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
              <td>{product.type}</td>
              <td className="text-nowrap"><GuaranteeDate value={product.guarantee.start} /></td>
              <td className="text-nowrap"><GuaranteeDate value={product.guarantee.end} /></td>
              <td className="text-nowrap">{product.isNew ? "Новый" : "Б/У"}</td>
              <td className="text-nowrap">
                {product.price.length === 0 ? "Цена не указана" : product.price.map((price) => (
                  <div key={price.currency} className={price.isDefault ? "products-list__price" : "products-list__secondary"}>
                    {formatMoney(price.amountMinor)} {price.currency}
                  </div>
                ))}
              </td>
              <td className="products-list__order">{ordersById.get(product.orderId)?.title ?? "Приход не найден"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
