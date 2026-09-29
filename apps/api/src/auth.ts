import { randomUUID } from "node:crypto";
import { Router, type RequestHandler, type CookieOptions } from "express";
import { SignJWT, jwtVerify } from "jose";
import { rateLimit } from "express-rate-limit";
import { z } from "zod";
import type { RowDataPacket } from "mysql2";
import { pool } from "./database.js";
import { hashPassword, verifyPassword } from "./password.js";

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) throw new Error("JWT_SECRET должен содержать не менее 32 символов");
const key = new TextEncoder().encode(secret);
const issuer = "orders-products-api";
const audience = "orders-products-web";
const cookieName = "orders_session";
const cookieOptions: CookieOptions = {
  httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/",
};
interface UserRow extends RowDataPacket { id: number; email: string; name: string; password_hash: string }
const dummyHash = hashPassword(randomUUID());

export const requireAuth: RequestHandler = async (request, response, next) => {
  const token = request.cookies?.[cookieName];
  if (typeof token !== "string") { response.status(401).json({ error: "Необходим вход" }); return; }
  let claims;
  try {
    claims = (await jwtVerify(token, key, { algorithms: ["HS256"], issuer, audience })).payload;
    if (!claims.sub || !claims.jti || !claims.exp) throw new Error("Invalid claims");
  } catch {
    response.clearCookie(cookieName, cookieOptions);
    response.status(401).json({ error: "Сессия истекла. Войдите снова" });
    return;
  }
  const [users] = await pool.execute<UserRow[]>(
    `SELECT u.id, u.email, u.name FROM auth_sessions s JOIN users u ON u.id=s.user_id
     WHERE s.id=? AND u.id=? AND s.expires_at > UTC_TIMESTAMP()`, [claims.jti, claims.sub],
  );
  if (!users[0]) { response.clearCookie(cookieName, cookieOptions); response.status(401).json({ error: "Необходим вход" }); return; }
  response.locals.user = users[0];
  response.locals.sessionId = claims.jti;
  next();
};

// Cookie-аутентификация: изменяющие запросы принимаются только от нашего интерфейса.
export const checkOrigin: RequestHandler = (request, response, next) => {
  if (!["GET", "HEAD", "OPTIONS"].includes(request.method)
    && request.get("origin") !== (process.env.CLIENT_ORIGIN ?? "http://localhost:3000")) {
    response.status(403).json({ error: "Недопустимый источник запроса" }); return;
  }
  next();
};

export const authRouter = Router();
authRouter.use((_request, response, next) => { response.set("Cache-Control", "no-store"); next(); });
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: "draft-8", legacyHeaders: false,
  message: { error: "Слишком много попыток. Попробуйте через 15 минут" } });

authRouter.post("/login", loginLimiter, async (request, response) => {
  const result = z.object({ email: z.email().max(254).transform(value => value.toLowerCase()), password: z.string().min(8).max(128) }).safeParse(request.body);
  if (!result.success) { response.status(400).json({ error: "Проверьте email и пароль (8–128 символов)" }); return; }
  const [users] = await pool.execute<UserRow[]>("SELECT id,email,name,password_hash FROM users WHERE email=?", [result.data.email]);
  const user = users[0];
  const valid = await verifyPassword(result.data.password, user?.password_hash ?? await dummyHash);
  if (!user || !valid) { response.status(401).json({ error: "Неверный email или пароль" }); return; }
  const sessionId = randomUUID();
  const expiresAt = Math.floor(Date.now() / 1000) + 8 * 60 * 60;
  const token = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(String(user.id))
    .setJti(sessionId).setIssuer(issuer).setAudience(audience).setIssuedAt().setExpirationTime(expiresAt).sign(key);
  await pool.execute("DELETE FROM auth_sessions WHERE expires_at <= UTC_TIMESTAMP()");
  await pool.execute("INSERT INTO auth_sessions(id,user_id,expires_at) VALUES(?,?,?)",
    [sessionId, user.id, new Date(expiresAt * 1000).toISOString().slice(0,19).replace("T", " ")]);
  response.cookie(cookieName, token, { ...cookieOptions, maxAge: 8 * 60 * 60 * 1000 });
  response.json({ id: user.id, email: user.email, name: user.name });
});

authRouter.get("/me", requireAuth, (_request, response) => response.json(response.locals.user));
authRouter.post("/logout", requireAuth, async (_request, response) => {
  await pool.execute("DELETE FROM auth_sessions WHERE id=?", [response.locals.sessionId]);
  response.clearCookie(cookieName, cookieOptions);
  response.status(204).end();
});
