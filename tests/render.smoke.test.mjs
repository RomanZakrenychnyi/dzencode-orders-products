import assert from "node:assert/strict";
import { test } from "node:test";
import { io } from "socket.io-client";

const origin = "http://localhost:10000";
test("Общий контейнер: вход, API, SSR, статика, WebSocket и выход", { timeout: 30000 }, async () => {
  assert.equal((await fetch(`${origin}/api/health/db`)).status, 200);
  assert.equal((await fetch(`${origin}/api/orders`)).status, 401);
  const login = await fetch(`${origin}/api/auth/login`, {
    method: "POST", headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "demo@example.com", password: "DemoPass123!" }),
  });
  assert.equal(login.status, 200);
  const setCookie = login.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=Lax/i);
  const cookie = setCookie.split(";")[0];
  const headers = { Cookie: cookie };
  const orders = await (await fetch(`${origin}/api/orders`, { headers })).json();
  assert.ok(orders.length > 0);
  const products = await (await fetch(`${origin}/api/products`, { headers })).json();
  assert.ok(products.length > 0);
  for (const [path, title] of [["orders", orders[0].title], ["products", products[0].title]]) {
    const page = await fetch(`${origin}/${path}`, { headers: { Cookie: `${cookie}; inventory_locale=ru` } });
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.ok(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "").includes(title), "SSR содержит данные");
    const asset = html.match(/src="([^" ]*\/_next\/static\/[^" ]+\.js)"/)[1];
    assert.equal((await fetch(new URL(asset, origin))).status, 200);
  }
  assert.equal((await fetch(`${origin}/api/auth/logout`, {
    method: "POST", headers: { ...headers, Origin: "https://untrusted.example" },
  })).status, 403);
  const sockets = [];
  function connect() {
    const socket = io(origin, { transports: ["websocket"], reconnection: false, autoConnect: false });
    sockets.push(socket);
    return new Promise((resolve, reject) => {
      socket.once("sessions:count", resolve);
      socket.once("connect_error", reject);
      socket.connect();
    });
  }
  try {
    const first = await connect();
    assert.equal(await connect(), first + 1);
    // Событие подключения второй вкладки может ещё находиться в очереди.
    const reduced = new Promise(resolve => {
      const onCount = count => {
        if (count !== first) return;
        sockets[0].off("sessions:count", onCount);
        resolve(count);
      };
      sockets[0].on("sessions:count", onCount);
    });
    sockets[1].disconnect();
    assert.equal(await reduced, first);
  } finally { sockets.forEach(socket => socket.disconnect()); }
  assert.equal((await fetch(`${origin}/api/auth/logout`, { method: "POST", headers: { ...headers, Origin: origin } })).status, 204);
  assert.equal((await fetch(`${origin}/api/orders`, { headers })).status, 401);
});
