import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

let app;
let userToken = '';

beforeAll(async () => {
  await connectDB();
  app = createApp();

  const regRes = await request(app)
    .post('/api/v1/auth/register')
    .send({
      username: `habit_hero_${Date.now()}`,
      email: `habit_hero_${Date.now()}@lifeverse.io`,
      password: 'Password123!',
    });

  userToken = regRes.body.data.accessToken;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Habits and Goals System Tests', () => {
  let habitId = '';
  let goalId = '';

  it('creates a daily habit', async () => {
    const res = await request(app)
      .post('/api/v1/habits')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Morning Meditation 10 mins',
        category: 'health',
        frequency: 'daily',
        targetDaysPerWeek: 7,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    habitId = res.body.data._id;
  });

  it('checks in to the habit and starts 1-day streak', async () => {
    const res = await request(app)
      .post(`/api/v1/habits/${habitId}/check-in`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.streak).toBe(1);
    expect(res.body.data.rewards.xpAwarded).toBe(10);
  });

  it('rejects a second check-in on the same calendar day', async () => {
    const res = await request(app)
      .post(`/api/v1/habits/${habitId}/check-in`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('creates a personal goal with milestones', async () => {
    const res = await request(app)
      .post('/api/v1/goals')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Launch Full-Stack Web App',
        category: 'career',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        milestones: [
          { title: 'Complete Database Design', targetValue: 1 },
          { title: 'Build Frontend UI', targetValue: 1 },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.data.milestones.length).toBe(2);
    goalId = res.body.data._id;
  });

  it('completes milestone and increases goal progress percentage', async () => {
    const res = await request(app)
      .post(`/api/v1/goals/${goalId}/milestones/0/complete`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.goal.progressPercentage).toBe(50);
    expect(res.body.data.rewards.xpAwarded).toBe(50);
  });
});
