import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

let ioInstance = null;

export function setupSocketIO(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: [ENV.WEB_ORIGIN, ENV.MOBILE_ORIGIN, 'http://localhost:5173', 'http://localhost:8081', '*'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
        socket.userId = decoded.userId;
        socket.user = decoded;
      } catch (err) {
        // Allow unauthenticated connection for public rooms if needed
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    if (socket.userId) {
      socket.join(`user_${socket.userId}`);
      console.log(`[Socket.IO] Authenticated user joined room: user_${socket.userId}`);
    }

    socket.join('community_feed');

    socket.on('disconnect', () => {
      // Clean disconnect
    });
  });

  ioInstance = io;
  return io;
}

export function emitToUser(userId, event, payload) {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId}`).emit(event, payload);
  }
}

export function broadcastCommunityEvent(event, payload) {
  if (ioInstance) {
    ioInstance.to('community_feed').emit(event, payload);
  }
}

export default { setupSocketIO, emitToUser, broadcastCommunityEvent };
