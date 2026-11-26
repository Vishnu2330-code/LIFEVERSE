import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { GamificationProfile } from '../src/models/index.js';

let app;
let userToken = '';
let userId = '';

beforeAll(async () => {
  await connectDB();
  app = createApp();

  const regRes = await request(app)
    .post('/api/v1/auth/register')
    .send({
      username: `world_hero_${Date.now()}`,
      email: `world_hero_${Date.now()}@lifeverse.io`,
      password: 'Password123!',
    });

  userToken = regRes.body.data.accessToken;
  userId = regRes.body.data.user.id;
});

afterAll(async () => {
  await disconnectDB();
});

describe('Virtual World & Marketplace Tests', () => {
  it('places a building in available slot on the island', async () => {
    const res = await request(app)
      .post('/api/v1/world/buildings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        buildingType: 'fitness_arena',
        name: 'Training Grounds',
        gridX: 2,
        gridY: 3,
        rotation: 0,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.buildings.some((b) => b.gridX === 2 && b.gridY === 3)).toBe(true);
  });

  it('rejects placing a building on an occupied grid coordinate with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/v1/world/buildings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        buildingType: 'productivity_tower',
        name: 'Focus Spire',
        gridX: 2,
        gridY: 3,
      });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects marketplace purchase when user has insufficient coins', async () => {
    // Grant level 15 so level requirement is met, but coins remain at 50 (item costs 350)
    await GamificationProfile.updateOne(
      { userId },
      { $set: { level: 15 } }
    );

    const res = await request(app)
      .post('/api/v1/marketplace/purchase')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'effect_quantum_wings' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain('Insufficient');
  });

  it('allows purchase when user has sufficient coins and updates inventory', async () => {
    // Grant sufficient coins
    await GamificationProfile.updateOne(
      { userId },
      { $inc: { coins: 500 } }
    );

    const res = await request(app)
      .post('/api/v1/marketplace/purchase')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ itemId: 'effect_quantum_wings' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.receipt.coinCost).toBe(350);

    // Verify item is now in inventory
    const invRes = await request(app)
      .get('/api/v1/inventory')
      .set('Authorization', `Bearer ${userToken}`);

    expect(invRes.status).toBe(200);
    expect(invRes.body.data.some((i) => i.itemId === 'effect_quantum_wings')).toBe(true);
  });
});
