import { ValidationError } from 'express-validation';
import { AuthError } from '../services/auth.service.js';

/** @param {unknown} error @param {import('express').Request} _req @param {import('express').Response} res @param {import('express').NextFunction} _next */
export function errorHandler(error, _req, res, _next) {
  if (error instanceof AuthError) {
    res.status(error.status).json({ error: error.message });
    return;
  }
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      error: 'Validation failed',
      details: error.details,
    });
    return;
  }

  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error(error);
  res.status(500).json({
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { message }),
  });
}

/** @param {import('express').Request} _req @param {import('express').Response} res */
export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}
