import { checkDatabaseConnection } from '../models/health.model.js';

export async function getHealth() {
  const database = await checkDatabaseConnection();

  return {
    status: 'ok',
    database: database ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };
}
