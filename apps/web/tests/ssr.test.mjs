import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

// Изолированный API: проверяем SSR без изменения реальной базы и сессий.
test("SSR: HTML, авторизация, изоляция запросов и восстановление API", { timeout: 60000 }, async () => {
  let unavailable = false;
  const requests = [];
  const api = createServer((req, res) => {
    requests.push({ cookie: req.headers.cookie, path: req.url });
    res.setHeader("Content-Type", "application/json");
    if (!/orders_session=test-(one|two)/.test(req.headers.cookie ?? "")) {
      res.writeHead(401).end('{}'); return;
    }
    if (unavailable) { res.writeHead(503).end('{}'); return; }
    const second = req.headers.cookie.includes("test-two");
    const order = { id: 1, title: second ? "Private second order" : "Поставка мониторов для рабочего пространства", date: "2026-09-28T09:00:00Z", description: "" };
    const product = { id: 1, orderId: 1, title: "Монитор Dell P2425H", serialNumber: "SSR-TEST", isNew: true, photo: null, type: "Мониторы", specification: "", guarantee: { start: "2026-09-28", end: "2029-09-28" }, price: [{ currency: "UAH", amountMinor: 1050000, isDefault: true }], date: order.date };
    res.end(JSON.stringify(req.url === "/auth/me" ? { id: second ? 2 : 1, email: "demo@example.com", name: "Demo" } : req.url === "/orders" ? [order] : [product]));
  });
  api.listen(0, "127.0.0.1");
  await once(api, "listening");
  const web = spawn(process.execPath, [fileURLToPath(new URL("../../../node_modules/next/dist/bin/next", import.meta.url)), "start", "--hostname", "127.0.0.1", "--port", "0"], {
    cwd: fileURLToPath(new URL("../", import.meta.url)),
    env: { ...process.env, API_URL: `http://127.0.0.1:${api.address().port}` },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let logs = "";
  web.stdout.on("data", chunk => { logs += chunk; });
  web.stderr.on("data", chunk => { logs += chunk; });
  try {
    let origin;
    for (let i = 0; i < 100; i++) {
      origin = logs.match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
      if (origin && logs.includes("Ready")) break;
      if (web.exitCode !== null) throw new Error(logs);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    assert.ok(origin, logs);
    const get = (path, cookie) => fetch(`${origin}${path}`, { headers: cookie ? { Cookie: cookie } : {}, redirect: "manual" });
    const visible = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
    for (const cookie of [undefined, "orders_session=expired"]) {
      const response = await get("/orders", cookie);
      const html = await response.text();
      assert.ok(response.headers.get("location") === "/login" || html.includes('url=/login'));
      assert.ok(!visible(html).includes("Поставка мониторов"));
    }
    const cookie = "orders_session=test-one; inventory_locale=uk; unrelated=private";
    const orders = await (await get("/orders", cookie)).text();
    assert.match(visible(orders), /Постачання моніторів для робочого простору/);
    assert.ok(!orders.includes("test-one"), "Токен не сериализуется в HTML");
    const products = await (await get("/products", cookie)).text();
    assert.match(visible(products), /Монітор Dell P2425H/);
    assert.match(visible(products), /SSR-TEST/);
    const [first, second] = await Promise.all([
      get("/orders", cookie).then(r => r.text()),
      get("/orders", "orders_session=test-two").then(r => r.text()),
    ]);
    assert.ok(!visible(first).includes("Private second order"));
    assert.match(visible(second), /Private second order/);
    assert.ok(requests.every(r => !r.cookie?.includes("unrelated")));
    unavailable = true;
    assert.match(visible(await (await get("/orders", cookie)).text()), /Не вдалося завантажити дані/);
    unavailable = false;
    assert.match(visible(await (await get("/orders", cookie)).text()), /Постачання моніторів/);
  } finally {
    web.kill();
    if (web.exitCode === null) await once(web, "exit");
    api.closeAllConnections();
    await new Promise(resolve => api.close(resolve));
  }
});
