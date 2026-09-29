import express from "express";

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "100kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok", service: "orders-products-api" });
});

app.use((_request, response) => {
  response.status(404).json({ error: "Маршрут не найден" });
});
