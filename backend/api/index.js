import { createApp } from '../src/app.js';

// Vercel reuses this initialized Express app for warm function invocations.
const { app } = await createApp();

export default app;
