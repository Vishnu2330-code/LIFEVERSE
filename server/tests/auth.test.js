import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { User, RefreshSession } from '../src/models/index.js';

let app;

beforeAll(async () => {
  await connectDB();
  app = createApp();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Authentication & RBAC Tests', () => {
  const testUser = {
    username: `testhero_${Date.now()}`,
    email: `testhero_${Date.now()}@lifeverse.io`,
    password: 'Password123!',
    timezone: 'UTC',
  };

  let accessToken = '';
  let refreshToken = '';

  it('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();

    accessToken = res.body.data.accessToken;
    refreshToken = res.body.data.refreshToken;
  });

  it('rejects duplicate email registration with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('logs in successfully with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    accessToken = res.body.data.accessToken;
  });

  it('rejects invalid password with 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword999!' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('fetches authenticated current profile via /auth/me', async () => {
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.username).toBe(testUser.username);
    expect(res.body.data.gamification).toBeDefined();
    expect(res.body.data.gamification.level).toBe(1);
    expect(res.body.data.gamification.rank).toBe('Beginner');
  });

  it('rotates refresh token and returns a new access token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/refresh-token')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.refreshToken).not.toBe(refreshToken);

    refreshToken = res.body.data.refreshToken;
  });

  it('blocks regular user from accessing admin dashboard with 403 Forbidden', async () => {
    const res = await request(app)
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });
});
