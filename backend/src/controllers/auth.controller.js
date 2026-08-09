import { env } from '../config/env.js';
import * as authService from '../services/auth.service.js';

const cookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: /** @type {'lax'|'none'} */ (env.nodeEnv === 'production' ? 'none' : 'lax'),
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: '/',
};

/** @param {import('express').Response} res @param {{user: object, token: string}} result */
function respondWithSession(res, result) {
  res.cookie(env.cookieName, result.token, cookieOptions).status(200).json({ user: result.user });
}

/** @type {import('express').RequestHandler} */
export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.cookie(env.cookieName, result.token, cookieOptions).status(201).json({ user: result.user });
  } catch (error) { next(error); }
}

/** @type {import('express').RequestHandler} */
export async function login(req, res, next) {
  try { respondWithSession(res, await authService.login(req.body.email, req.body.password)); } catch (error) { next(error); }
}

/** @type {import('express').RequestHandler} */
export function logout(_req, res) {
  res.clearCookie(env.cookieName, { ...cookieOptions, maxAge: undefined }).status(200).json({ message: 'Logged out' });
}
