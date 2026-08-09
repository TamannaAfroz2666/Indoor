import 'dotenv/config';
import Joi from 'joi';

const schema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  PORT: Joi.number().port().default(4000),
  DATABASE_URL: Joi.string().uri().required(),
  CORS_ORIGIN: Joi.string().default('http://localhost:3000'),
  JWT_SECRET: Joi.string().min(32).required(),
  COOKIE_NAME: Joi.string().default('indoor_session'),
}).unknown(true);

const { value, error } = schema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Environment validation failed: ${error.message}`);
}

export const env = Object.freeze({
  nodeEnv: /** @type {'development' | 'test' | 'production'} */ (value.NODE_ENV),
  port: /** @type {number} */ (value.PORT),
  databaseUrl: /** @type {string} */ (value.DATABASE_URL),
  corsOrigin: /** @type {string} */ (value.CORS_ORIGIN),
  jwtSecret: /** @type {string} */ (value.JWT_SECRET),
  cookieName: /** @type {string} */ (value.COOKIE_NAME),
});
