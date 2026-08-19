import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const allowedOrigins = new Set([
  'http://localhost:3000',
  env.corsOrigin,
]);

/** @type {import('cors').CorsOptions} */
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin is not allowed by CORS'));
  },
};

export async function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors(corsOptions));
  app.get(['/favicon.ico', '/favicon.png'], (_req, res) => res.status(204).end());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cookieParser());
  app.use('/api', routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app };
}

const { app } = await createApp();

// Vercel imports this Express application directly as its serverless handler.
// Local startup and port binding remain isolated in src/server.js.
export default app;
