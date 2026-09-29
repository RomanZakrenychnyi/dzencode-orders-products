import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRouter, requireAuth, checkOrigin } from "./auth.js";
import type { ErrorRequestHandler } from "express";
import { pool } from "./database.js";
import { getOrders, getProducts } from "./inventory.js";
import type { ResultSetHeader } from "mysql2";

export const app = express();

app.disable("x-powered-by");
app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(checkOrigin);
app.use("/auth", authRouter);
app.use(["/orders", "/products"], requireAuth, (_request, response, next) => {
  response.set("Cache-Control", "no-store"); next();
});

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

app.delete("/orders/:id", async (request, response) => {
  const id = Number(request.params.id);
  if (!/^[1-9]\d*$/.test(request.params.id) || !Number.isSafeInteger(id) || id > 4294967295) {
    response.status(400).json({ error: "Некорректный идентификатор прихода" });
    return;
  }
  // Один DELETE атомарно удаляет приход и связанные записи через внешние ключи.
  await pool.execute<ResultSetHeader>("DELETE FROM orders WHERE id = ?", [id]);
  // Повторный запрос тоже успешен: нужное состояние (приход отсутствует) достигнуто.
  response.status(204).end();
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
