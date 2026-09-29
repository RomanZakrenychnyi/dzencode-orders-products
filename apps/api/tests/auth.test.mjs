import test from "node:test";
import assert from "node:assert/strict";
import { SignJWT, decodeJwt } from "jose";
import { app } from "../dist/app.js";
import { pool } from "../dist/database.js";

// Integration test: requires local MySQL and a user created with setup:auth.
test("JWT login, protected routes, validation, expiry, CSRF and revocation", async () => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise(resolve => server.once("listening", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const origin = process.env.CLIENT_ORIGIN ?? "http://localhost:3000";
  let sessionId;
  const login = (body, extra = {}) => fetch(`${base}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: origin, ...extra }, body: JSON.stringify(body),
  });
  try {
    assert.equal((await fetch(`${base}/orders`)).status, 401);
    assert.equal((await fetch(`${base}/products`)).status, 401);
    assert.equal((await fetch(`${base}/orders/1`, { method: "DELETE", headers: { Origin: origin } })).status, 401);
    assert.equal((await login({ email: "bad", password: "x" })).status, 400);
    assert.equal((await login({ email: process.env.DEMO_EMAIL, password: "wrong-password" })).status, 401);
    const body = { email: process.env.DEMO_EMAIL, password: process.env.DEMO_PASSWORD };
    assert.equal((await login(body, { Origin: "https://untrusted.example" })).status, 403);
    const response = await login(body);
    assert.equal(response.status, 200);
    const user = await response.json();
    assert.equal(user.email, body.email);
    assert.equal(user.password_hash, undefined);
    const setCookie = response.headers.get("set-cookie");
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=Lax/i);
    const cookie = setCookie.split(";")[0];
    const token = cookie.slice(cookie.indexOf("=") + 1);
    const claims = decodeJwt(token);
    sessionId = claims.jti;
    const headers = { Cookie: cookie, Origin: origin };
    assert.equal((await fetch(`${base}/auth/me`, { headers })).status, 200);
    assert.equal((await fetch(`${base}/orders`, { headers })).status, 200);
    assert.equal((await fetch(`${base}/products`, { headers })).status, 200);
    assert.equal((await fetch(`${base}/orders/invalid`, { method: "DELETE", headers })).status, 400);
    assert.equal((await fetch(`${base}/orders/1`, { method: "DELETE", headers: { Cookie: cookie, Origin: "https://untrusted.example" } })).status, 403);
    const tampered = token.slice(0, token.lastIndexOf(".") + 1) + "x".repeat(43);
    assert.equal((await fetch(`${base}/orders`, { headers: { Cookie: `orders_session=${tampered}` } })).status, 401);
    const expired = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(claims.sub).setJti(sessionId)
      .setIssuer("orders-products-api").setAudience("orders-products-web").setExpirationTime(1)
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    assert.equal((await fetch(`${base}/orders`, { headers: { Cookie: `orders_session=${expired}` } })).status, 401);
    assert.equal((await fetch(`${base}/auth/logout`, { method: "POST", headers })).status, 204);
    assert.equal((await fetch(`${base}/orders`, { headers })).status, 401);
  } finally {
    if (sessionId) await pool.execute("DELETE FROM auth_sessions WHERE id=?", [sessionId]);
    server.close(); server.closeAllConnections(); await pool.end();
  }
});
