import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { SESSION_DURATION_SECONDS, sessionCookieClearOptions } from "../config/auth-session.js";

/**
 * @param {import('express').Request & { userId?: string, user?: { id: string, accountType?: unknown }, sessionExpiresAt?: string | null, authToken?: string }} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function requireAuth(req, res, next) {
  const authorization = req.get("authorization");
  const bearerToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  const cookieToken = req.cookies?.[env.cookieName];
  const tokens = [...new Set([bearerToken, cookieToken].filter(Boolean))];

  if (!tokens.length) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  for (const token of tokens) {
    try {
      const payload = jwt.verify(token, env.jwtSecret);

      const issuedAt = typeof payload === "object" && typeof payload.iat === "number" ? payload.iat : 0;
      const exceedsSessionLifetime = Math.floor(Date.now() / 1000) - issuedAt >= SESSION_DURATION_SECONDS;
      if (typeof payload !== "object" || typeof payload.userId !== "string" || !payload.userId || !issuedAt || exceedsSessionLifetime) continue;

      req.userId = payload.userId;
      req.authToken = token;
      req.sessionExpiresAt = typeof payload.exp === "number" ? new Date(payload.exp * 1000).toISOString() : null;
      req.user = {
        id: payload.userId,
        accountType: payload.accountType,
      };

      return next();
    } catch {
      // Try the cookie when a stale/invalid Bearer token was supplied.
    }
  }

  res.clearCookie(env.cookieName, sessionCookieClearOptions);
  return res.status(401).json({ error: "Authentication required" });
}
