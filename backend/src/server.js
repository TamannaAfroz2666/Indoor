import { createServer } from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { env } from './config/env.js';

const server = createServer(app);


const io = new Server(server, {
  cors: {
    origin: env.corsOrigin,
    methods: ['GET', 'POST'],
  },
});

server.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});
