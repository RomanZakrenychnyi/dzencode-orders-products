import { readFile } from "node:fs/promises";
import { z } from "zod";
import { pool } from "./database.js";
import { hashPassword } from "./password.js";

try {
  const email = z.email().parse(process.env.DEMO_EMAIL ?? "demo@example.com").toLowerCase();
  const password = z.string().min(8).max(128).parse(process.env.DEMO_PASSWORD);
  const sql = await readFile(new URL("../../../database/migrations/002_auth.sql", import.meta.url), "utf8");
  for (const statement of sql.split(";").filter(part => part.trim())) await pool.query(statement);
  // Повторный запуск не меняет пароль существующего аккаунта.
  await pool.execute(
    "INSERT INTO users(email,name,password_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id=id",
    [email, "Демо-пользователь", await hashPassword(password)],
  );
  console.log("Таблицы авторизации и демо-пользователь готовы");
} finally {
  await pool.end();
}
