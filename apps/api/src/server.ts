import { createServer } from "node:http";
import { app } from "./app.js";
import { attachRealtime } from "./realtime.js";
import { pool } from "./database.js";

const port = Number(process.env.PORT ?? 4000);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT должен быть целым числом от 1 до 65535");
}

const server = createServer(app);
const io = attachRealtime(server);

server.listen(port, () => {
  console.log(`API запущен: http://localhost:${port}`);
});

server.on("error", (error) => {
  console.error("Не удалось запустить API:", error.message);
  process.exitCode = 1;
});

function shutdown() {
  io.close(async (error) => {
    if (error) {
      console.error("Ошибка остановки API:", error.message);
      process.exitCode = 1;
    }
    try {
      await pool.end();
    } catch {
      console.error("Не удалось закрыть соединения MySQL");
      process.exitCode = 1;
    }
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
