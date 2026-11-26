import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27018/lifeverse',
  
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'lifeverse_jwt_access_secret_production_ready_super_secure_key_2026',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'lifeverse_jwt_refresh_secret_production_ready_super_secure_key_2026',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  WEB_ORIGIN: process.env.WEB_ORIGIN || 'http://localhost:5173',
  MOBILE_ORIGIN: process.env.MOBILE_ORIGIN || 'http://localhost:8081',

  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@lifeverse.io',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminLifeverse2026!',
  ADMIN_USERNAME: process.env.ADMIN_USERNAME || 'LifeverseAdmin',

  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'LIFEVERSE <no-reply@lifeverse.io>',
};

export default ENV;
