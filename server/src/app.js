import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { ENV } from './config/env.js';
import apiRoutes from './routes/index.js';
import { standardLimiter } from './middleware/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = () => {
  const app = express();

  // Security HTTP headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allow Three.js canvas & dev scripts
    })
  );

  // CORS configuration
  const allowedOrigins = [
    ENV.WEB_ORIGIN,
    ENV.MOBILE_ORIGIN,
    'http://localhost:5173',
    'http://localhost:8081',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8081',
    'http://10.0.2.2:5000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
          callback(null, true);
        } else {
          callback(new Error('Blocked by CORS policy'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-platform', 'X-Requested-With'],
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Standard rate limiter for API endpoints
  app.use('/api', standardLimiter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      app: 'LIFEVERSE API',
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  });

  // Basic OpenAPI specification for Swagger UI
  const swaggerDocument = {
    openapi: '3.0.0',
    info: {
      title: 'LIFEVERSE API Documentation',
      version: '1.0.0',
      description: 'Comprehensive REST API documentation for LIFEVERSE gamified productivity platform.',
    },
    servers: [{ url: '/api/v1', description: 'API v1 Root' }],
    paths: {
      '/auth/register': { post: { summary: 'Register a new user account' } },
      '/auth/login': { post: { summary: 'Authenticate user with email & password' } },
      '/auth/admin-login': { post: { summary: 'Authenticate administrator' } },
      '/auth/refresh-token': { post: { summary: 'Rotate and exchange refresh token for new access token' } },
      '/quests': {
        get: { summary: 'List and filter user quests' },
        post: { summary: 'Create a new quest' },
      },
      '/quests/{id}/complete': { post: { summary: 'Complete quest and calculate authoritative XP & coin reward' } },
      '/habits': {
        get: { summary: 'Get user habits and streak statuses' },
        post: { summary: 'Create a habit' },
      },
      '/habits/{id}/check-in': { post: { summary: 'Daily habit check-in with timezone validation' } },
      '/goals': { get: { summary: 'Get user goals with milestones' } },
      '/gamification/profile': { get: { summary: 'Get player level, XP, coins, and rank progress' } },
      '/world': { get: { summary: 'Get virtual world layout and placed buildings' } },
      '/marketplace': { get: { summary: 'Get marketplace catalog' } },
      '/marketplace/purchase': { post: { summary: 'Purchase item with virtual coins' } },
    },
  };

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Mount API v1
  app.use('/api/v1', apiRoutes);

  // 404 & centralized error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
