import express from "express";
import type { ErrorRequestHandler } from "express";
import { pool } from "./database.js";
import { getOrders, getProducts } from "./inventory.js";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "orders-products-api" });
});

app.get("/health/db", async (_request, response) => {
  try {
    await pool.query("SELECT 1");
    response.json({ status: "ok", database: "connected" });
  } catch {
    response.status(503).json({ status: "error", database: "unavailable" });
  }
});

app.get("/orders", async (_request, response) => {
  response.json(await getOrders());
});

app.get("/products", async (_request, response) => {
  response.json(await getProducts());
});

app.use((_request, response) => {
  response.status(404).json({ error: "Маршрут не найден" });
});

const handleError: ErrorRequestHandler = (error, _request, response, _next) => {
  const code = (error as { code?: string }).code;
  const unavailable = ["ECONNREFUSED", "ETIMEDOUT", "ENOTFOUND", "ECONNRESET", "PROTOCOL_CONNECTION_LOST"].includes(code ?? "");
  console.error("Ошибка API:", code ?? "INTERNAL_ERROR");
  response.status(unavailable ? 503 : 500).json({
    error: unavailable ? "База данных временно недоступна" : "Внутренняя ошибка сервера",
  });
};
app.use(handleError);
