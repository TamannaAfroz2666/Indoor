import { env } from "./env.js";

export const SESSION_DURATION_SECONDS = 2 * 60 * 60;

export const sessionCookieOptions = Object.freeze({
  httpOnly: true,
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  secure: env.nodeEnv === "production",
  maxAge: SESSION_DURATION_SECONDS * 1000,
  path: "/",
});

export const sessionCookieClearOptions = Object.freeze({
  httpOnly: sessionCookieOptions.httpOnly,
  sameSite: sessionCookieOptions.sameSite,
  secure: sessionCookieOptions.secure,
  path: sessionCookieOptions.path,
});
