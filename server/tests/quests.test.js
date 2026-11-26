import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';

let app;
let userToken = '';
let userId = '';

beforeAll(async () => {
  await connectDB();
  app = createApp();

  const regRes = await request(app)
    .post('/api/v1/auth/register')
    .send({
      username: `quest_hero_${Date.now()}`,
      email: `quest_hero_${Date.now()}@lifeverse.io`,
      password: 'Password123!',
    });

  userToken = regRes.body.data.accessToken;
  userId = regRes.body.data.user.id;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Quest Lifecycle & Completion Tests', () => {
  let createdQuestId = '';

  it('creates a new quest with checklist', async () => {
    const res = await request(app)
      .post('/api/v1/quests')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Master Three.js Canvas Shaders',
        description: 'Complete 3D island terrain shaders',
        category: 'learning',
        difficulty: 'hard',
        priority: 'high',
        estimatedDuration: 45,
        tags: ['webgl', 'threejs', '3d'],
        checklist: [
          { text: 'Setup directional light', isCompleted: false },
          { text: 'Add noise map', isCompleted: false },
        ],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Master Three.js Canvas Shaders');
    expect(res.body.data.status).toBe('pending');

    createdQuestId = res.body.data._id;
  });

  it('lists user quests with filtering', async () => {
    const res = await request(app)
      .get('/api/v1/quests?category=learning')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('completes the quest and receives XP & coin rewards', async () => {
    const res = await request(app)
      .post(`/api/v1/quests/${createdQuestId}/complete`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.quest.status).toBe('completed');
    expect(res.body.data.rewards.xpAwarded).toBe(50); // Hard quest default XP
    expect(res.body.data.rewards.coinsAwarded).toBe(20); // Hard quest default coins
  });

  it('prevents repeated completion from awarding duplicate rewards', async () => {
    const res = await request(app)
      .post(`/api/v1/quests/${createdQuestId}/complete`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('already completed');
  });
});
