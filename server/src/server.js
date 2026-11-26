import http from 'http';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';
import { setupSocketIO } from './sockets/socketHandler.js';

async function bootstrap() {
  try {
    // 1. Connect Database
    await connectDB();

    // 2. Initialize App and HTTP server
    const app = createApp();
    const server = http.createServer(app);

    // 3. Setup WebSocket Server
    setupSocketIO(server);

    // 4. Start HTTP Server
    server.listen(ENV.PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(`🚀 LIFEVERSE Server running on port ${ENV.PORT}`);
      console.log(`📖 API Docs available at http://localhost:${ENV.PORT}/api/docs`);
      console.log(`⚡ WebSocket Server ready for real-time events`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Fatal bootstrap error:', error);
    process.exit(1);
  }
}

// Start if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  bootstrap();
}

export default bootstrap;
