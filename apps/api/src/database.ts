import { createPool } from "mysql2/promise";

const port = Number(process.env.DB_PORT ?? 3307);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("DB_PORT должен быть целым числом от 1 до 65535");
}
if (!process.env.DB_PASSWORD) {
  throw new Error("Задайте DB_PASSWORD в apps/api/.env");
}

export const pool = createPool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port,
  user: process.env.DB_USER ?? "orders_app",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? "orders_products",
  charset: "utf8mb4",
  timezone: "Z",
  dateStrings: true,
  connectionLimit: 5,
  queueLimit: 50,
  connectTimeout: 5000,
});
