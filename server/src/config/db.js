import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export async function connectDB(customUri) {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = customUri || ENV.MONGODB_URI;

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    // If default port 27018 failed, attempt fallback to 27017 or vice-versa in local dev
    if (uri.includes('27018') && !customUri) {
      const fallbackUri = uri.replace('27018', '27017');
      console.log(`[MongoDB] Attempting fallback to ${fallbackUri}...`);
      try {
        const fallbackConn = await mongoose.connect(fallbackUri, {
          autoIndex: true,
          serverSelectionTimeoutMS: 3000,
        });
        isConnected = true;
        console.log(`[MongoDB] Connected successfully to fallback ${fallbackConn.connection.host}:${fallbackConn.connection.port}`);
        return fallbackConn;
      } catch (fbErr) {
        console.error(`[MongoDB] Fallback also failed: ${fbErr.message}`);
      }
    }
    throw error;
  }
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

export default { connectDB, disconnectDB };
