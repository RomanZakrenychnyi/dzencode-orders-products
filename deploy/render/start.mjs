import { spawn } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";

const port = Number(process.env.PORT ?? 10000);
if (!Number.isInteger(port) || port < 1024 || port > 65535 || [3000, 4000].includes(port)) {
  throw new Error("PORT: выберите порт 1024–65535, кроме внутренних 3000 и 4000");
}
const origin = process.env.CLIENT_ORIGIN ?? process.env.RENDER_EXTERNAL_URL;
if (!origin || new URL(origin).origin !== origin) {
  throw new Error("Задайте CLIENT_ORIGIN или RENDER_EXTERNAL_URL без завершающего слеша");
}
const env = { ...process.env, CLIENT_ORIGIN: origin, RENDER_COMBINED: "true" };
const children = new Set();
let stopping = false;

function stop(code) {
  if (stopping) return;
  stopping = true;
  process.exitCode = code;
  for (const child of children) child.kill("SIGTERM");
  const timer = setTimeout(() => {
    for (const child of children) child.kill("SIGKILL");
  }, 8000);
  timer.unref();
}
process.on("SIGTERM", () => stop(0));
process.on("SIGINT", () => stop(0));

function launch(command, args, overrides = {}, service = true) {
  const child = spawn(command, args, { env: { ...env, ...overrides }, stdio: "inherit" });
  children.add(child);
  child.on("error", () => { console.error(`Не удалось запустить ${command}`); stop(1); });
  child.on("exit", (code) => {
    children.delete(child);
    if (!stopping && (service || code !== 0)) stop(1);
  });
  return child;
}

// Только идемпотентная настройка авторизации: товары при рестарте не восстанавливаются.
const setup = launch(process.execPath, ["apps/api/dist/setup-auth.js"], {}, false);
const ready = await new Promise(resolve => {
  setup.once("error", () => resolve(false));
  setup.once("exit", code => resolve(code === 0));
});
if (ready && !stopping) {
  const template = await readFile(new URL("./nginx.conf", import.meta.url), "utf8");
  await writeFile("/tmp/orders-nginx.conf", template.replace("__PORT__", String(port)));
  launch(process.execPath, ["apps/api/dist/server.js"], { PORT: "4000", API_HOST: "127.0.0.1" });
  launch(process.execPath, ["apps/web/server.js"], {
    PORT: "3000", HOSTNAME: "127.0.0.1", API_URL: "http://127.0.0.1:4000",
  });
  launch("nginx", ["-c", "/tmp/orders-nginx.conf", "-g", "daemon off;"]);
}
