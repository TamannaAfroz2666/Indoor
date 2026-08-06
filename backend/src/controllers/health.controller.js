import { getHealth } from '../services/health.service.js';

/** @param {import('express').Request} _req @param {import('express').Response} res @param {import('express').NextFunction} next */
export async function healthController(_req, res, next) {
  try {
    res.status(200).json(await getHealth());
  } catch (error) {
    next(error);
  }
}
