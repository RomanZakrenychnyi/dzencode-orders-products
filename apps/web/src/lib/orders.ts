import type { Currency, Order, Product } from "../types/inventory";

export function getOrderSummary(orderId: Order["id"], products: Product[]) {
  const orderProducts = products.filter((product) => product.orderId === orderId);
  const totals: Record<Currency, number> = { USD: 0, UAH: 0 };

  for (const product of orderProducts) {
    for (const price of product.price) {
      totals[price.currency] += price.amountMinor;
    }
  }

  return { productCount: orderProducts.length, totals };
}

export function formatMoney(amountMinor: number) {
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function formatOrderDate(value: string) {
  const date = new Date(value);
  const options = { timeZone: "Europe/Kyiv" };
  const short = new Intl.DateTimeFormat("ru-RU", {
    ...options, day: "2-digit", month: "2-digit",
  }).format(date).replaceAll(".", " / ");
  const parts = new Intl.DateTimeFormat("ru-RU", {
    ...options, day: "2-digit", month: "short", year: "numeric",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";

  return { short, long: `${part("day")} / ${part("month").replace(/\.$/, "")} / ${part("year")}` };
}

export function productCountLabel(count: number) {
  const forms = { one: "продукт", few: "продукта", many: "продуктов", other: "продукта", zero: "продуктов", two: "продукта" };
  return forms[new Intl.PluralRules("ru-RU").select(count)];
}
