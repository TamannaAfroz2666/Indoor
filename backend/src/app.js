import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { env } from './config/env.js';
import { typeDefs, resolvers } from './graphql/schema.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

const allowedOrigins = new Set([
  'http://localhost:3000',
  env.corsOrigin,
]);

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
  const apollo = new ApolloServer({ typeDefs, resolvers });
  await apollo.start();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(cookieParser());
  app.use('/api', routes);
  app.use('/graphql', expressMiddleware(apollo));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return { app, apollo };
}
