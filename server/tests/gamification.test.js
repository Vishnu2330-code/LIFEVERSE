import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { GamificationService } from '../src/services/gamificationService.js';
import { calculateLevelFromTotalXp, getRankForLevel } from '@lifeverse/shared';

let app;

beforeAll(async () => {
  await connectDB();
  app = createApp();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Gamification Engine & Progression Tests', () => {
  it('correctly calculates levels, XP requirements, and ranks', () => {
    // Level 1: 0 XP
    const lvl1 = calculateLevelFromTotalXp(0);
    expect(lvl1.level).toBe(1);
    expect(lvl1.currentLevelXp).toBe(0);
    expect(lvl1.xpRequiredForNext).toBe(100);
    expect(lvl1.rank).toBe('Beginner');

    // Level 2: 100 XP
    const lvl2 = calculateLevelFromTotalXp(100);
    expect(lvl2.level).toBe(2);
    expect(lvl2.currentLevelXp).toBe(0);
    expect(lvl2.xpRequiredForNext).toBe(200);
    expect(lvl2.rank).toBe('Beginner');

    // Level 6: 1500 XP -> Explorer
    const lvl6 = calculateLevelFromTotalXp(1500);
    expect(lvl6.level).toBe(6);
    expect(lvl6.rank).toBe('Explorer');

    // Level 16 -> Warrior
    expect(getRankForLevel(16)).toBe('Warrior');
    // Level 31 -> Master
    expect(getRankForLevel(31)).toBe('Master');
    // Level 51 -> Legend
    expect(getRankForLevel(51)).toBe('Legend');
  });

  it('processes rewards idempotently and prevents duplicate XP awards', async () => {
    // Create dummy user
    const regRes = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: `xp_tester_${Date.now()}`,
        email: `xp_tester_${Date.now()}@lifeverse.io`,
        password: 'Password123!',
      });

    const userId = regRes.body.data.user.id;
    const token = regRes.body.data.accessToken;
    const testEventId = `unique_test_event_${Date.now()}`;

    // First reward execution
    const firstReward = await GamificationService.processReward({
      userId,
      source: 'quest',
      activityId: 'quest_101',
      referenceEventId: testEventId,
      customXp: 120, // should trigger level up from 1 to 2!
      customCoins: 25,
    });

    expect(firstReward.isDuplicate).toBe(false);
    expect(firstReward.levelUp).toBe(true);
    expect(firstReward.levelAfter).toBe(2);
    expect(firstReward.xpAwarded).toBe(120);

    // Second execution with SAME referenceEventId (concurrency / replay simulation)
    const duplicateReward = await GamificationService.processReward({
      userId,
      source: 'quest',
      activityId: 'quest_101',
      referenceEventId: testEventId,
      customXp: 120,
      customCoins: 25,
    });

    expect(duplicateReward.isDuplicate).toBe(true);
    expect(duplicateReward.xpAwarded).toBe(0);
    expect(duplicateReward.coinsAwarded).toBe(0);
  });
});
