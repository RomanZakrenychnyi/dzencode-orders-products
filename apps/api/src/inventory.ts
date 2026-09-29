import type { RowDataPacket } from "mysql2";
import { pool } from "./database.js";

interface OrderRow extends RowDataPacket {
  id: number; title: string; description: string; created_at: string;
}
interface ProductRow extends RowDataPacket {
  id: number; order_id: number; title: string; serial_number: string;
  is_new: number; photo: string | null; type: string; specification: string;
  guarantee_start: string; guarantee_end: string; created_at: string;
  currency: "USD" | "UAH" | null; amount_minor: number | null; is_default: number | null;
}
interface Product {
  id: number; orderId: number; title: string; serialNumber: string;
  isNew: boolean; photo: string | null; type: string; specification: string;
  guarantee: { start: string; end: string }; date: string;
  price: { currency: "USD" | "UAH"; amountMinor: number; isDefault: boolean }[];
}

const utcDate = (value: string) => value.replace(" ", "T") + "Z";

export async function getOrders() {
  const [rows] = await pool.query<OrderRow[]>(
    "SELECT id, title, description, created_at FROM orders ORDER BY created_at DESC, id DESC",
  );
  return rows.map(row => ({
    id: row.id, title: row.title, description: row.description, date: utcDate(row.created_at),
  }));
}

export async function getProducts() {
  // Один запрос даёт согласованные товары и цены без отдельного запроса на каждый товар.
  const [rows] = await pool.query<ProductRow[]>(`
    SELECT p.id, p.order_id, p.title, p.serial_number, p.is_new, p.photo,
      t.name AS type, p.specification, p.guarantee_start, p.guarantee_end,
      p.created_at, pp.currency, pp.amount_minor, pp.is_default
    FROM products p
    JOIN product_types t ON t.id = p.type_id
    LEFT JOIN product_prices pp ON pp.product_id = p.id
    ORDER BY p.id, pp.is_default, pp.currency
  `);
  const products = new Map<number, Product>();
  for (const row of rows) {
    let product = products.get(row.id);
    if (!product) {
      product = {
        id: row.id, orderId: row.order_id, title: row.title, serialNumber: row.serial_number,
        isNew: Boolean(row.is_new), photo: row.photo, type: row.type, specification: row.specification,
        guarantee: { start: row.guarantee_start, end: row.guarantee_end },
        date: utcDate(row.created_at), price: [],
      };
      products.set(row.id, product);
    }
    if (row.currency !== null && row.amount_minor !== null) {
      product.price.push({ currency: row.currency, amountMinor: row.amount_minor, isDefault: Boolean(row.is_default) });
    }
  }
  return [...products.values()];
}
