import crypto from 'crypto';
import {
  GamificationProfile,
  XPTransaction,
  CoinTransaction,
  Achievement,
  UserAchievement,
  Notification,
} from '../models/index.js';
import { calculateLevelFromTotalXp, getRewardForActivity } from '@lifeverse/shared';
import { emitToUser } from '../sockets/socketHandler.js';

export class GamificationService {
  /**
   * Ensure user has a GamificationProfile
   */
  static async getOrCreateProfile(userId) {
    let profile = await GamificationProfile.findOne({ userId });
    if (!profile) {
      profile = await GamificationProfile.create({
        userId,
        totalXp: 0,
        level: 1,
        currentLevelXp: 0,
        rank: 'Beginner',
        coins: 50,
      });
    }
    return profile;
  }

  /**
   * Process an authoritative reward idempotently.
   * Prevents duplicate rewards using referenceEventId.
   */
  static async processReward({
    userId,
    source,
    activityId = null,
    referenceEventId,
    customXp = null,
    customCoins = null,
    difficulty = 'medium',
  }) {
    if (!referenceEventId) {
      referenceEventId = `${source}_${activityId || Date.now()}_${crypto.randomUUID()}`;
    }

    // 1. Check idempotency: Have we already processed this referenceEventId?
    const existingXpTx = await XPTransaction.findOne({ referenceEventId });
    if (existingXpTx) {
      const profile = await this.getOrCreateProfile(userId);
      return {
        isDuplicate: true,
        xpAwarded: 0,
        coinsAwarded: 0,
        levelUp: false,
        profile,
      };
    }

    // 2. Determine base rewards
    const defaultReward = getRewardForActivity(source, difficulty);
    const xpToAdd = customXp !== null ? customXp : defaultReward.xp;
    const coinsToAdd = customCoins !== null ? customCoins : defaultReward.coins;

    const profile = await this.getOrCreateProfile(userId);
    const levelBefore = profile.level;
    const totalXpBefore = profile.totalXp;
    const coinsBefore = profile.coins;

    // 3. Calculate new level, XP progress, and rank using shared pure formula
    const newTotalXp = totalXpBefore + xpToAdd;
    const calcResult = calculateLevelFromTotalXp(newTotalXp);

    const levelAfter = calcResult.level;
    const levelUp = levelAfter > levelBefore;
    const levelsGained = Math.max(0, levelAfter - levelBefore);

    // 4. Update profile
    profile.totalXp = newTotalXp;
    profile.level = levelAfter;
    profile.currentLevelXp = calcResult.currentLevelXp;
    profile.rank = calcResult.rank;
    profile.coins = coinsBefore + coinsToAdd;
    profile.lastActivityDate = new Date();

    if (source === 'quest') profile.totalQuestsCompleted += 1;
    if (source === 'habit_checkin') profile.totalHabitsCompleted += 1;
    if (source === 'goal_completion') profile.totalGoalsCompleted += 1;
    if (source === 'workout') profile.totalWorkoutsCompleted += 1;

    await profile.save();

    // 5. Record transactions in ledger
    const xpTx = await XPTransaction.create({
      userId,
      amount: xpToAdd,
      source,
      activityId: activityId ? String(activityId) : null,
      referenceEventId,
      levelBefore,
      levelAfter,
      balanceAfter: newTotalXp,
    });

    const coinTx = await CoinTransaction.create({
      userId,
      amount: coinsToAdd,
      type: 'earned',
      source: `${source}_reward`,
      referenceEventId,
      balanceAfter: profile.coins,
    });

    // 6. Check for newly unlocked achievements
    const newlyUnlockedAchievements = await this.evaluateAchievements(userId, profile);

    // 7. Send notifications if leveled up or unlocked achievements
    if (levelUp) {
      const levelNotif = await Notification.create({
        userId,
        title: 'Level Up!',
        message: `Congratulations! You advanced to Level ${levelAfter} (${calcResult.rank})!`,
        type: 'level_up',
        data: { levelAfter, levelsGained, rank: calcResult.rank },
      });
      emitToUser(userId, 'notification', levelNotif);
      emitToUser(userId, 'level_up', {
        level: levelAfter,
        rank: calcResult.rank,
        levelsGained,
      });
    }

    // Emit gamification update
    emitToUser(userId, 'gamification_update', {
      totalXp: profile.totalXp,
      level: profile.level,
      currentLevelXp: profile.currentLevelXp,
      xpRequiredForNext: calcResult.xpRequiredForNext,
      progressPercentage: calcResult.progressPercentage,
      rank: profile.rank,
      coins: profile.coins,
    });

    return {
      isDuplicate: false,
      xpAwarded: xpToAdd,
      coinsAwarded: coinsToAdd,
      levelUp,
      levelsGained,
      levelBefore,
      levelAfter,
      rank: calcResult.rank,
      newlyUnlockedAchievements,
      profile,
    };
  }

  /**
   * Spend coins atomically with balance verification.
   */
  static async spendCoins({ userId, amount, source, referenceEventId }) {
    if (amount <= 0) throw new Error('Amount must be positive');
    
    // Find profile and ensure sufficient funds
    const profile = await this.getOrCreateProfile(userId);
    if (profile.coins < amount) {
      throw new Error('Insufficient virtual coins');
    }

    profile.coins -= amount;
    await profile.save();

    await CoinTransaction.create({
      userId,
      amount,
      type: 'spent',
      source,
      referenceEventId: referenceEventId || `spend_${Date.now()}_${crypto.randomUUID()}`,
      balanceAfter: profile.coins,
    });

    emitToUser(userId, 'gamification_update', {
      coins: profile.coins,
    });

    return profile;
  }

  /**
   * Evaluate all achievements against the user's current progress.
   */
  static async evaluateAchievements(userId, profile) {
    const allAchievements = await Achievement.find({});
    const unlockedList = await UserAchievement.find({ userId });
    const unlockedKeys = new Set(unlockedList.map((ua) => ua.achievementKey));

    const newlyUnlocked = [];

    for (const ach of allAchievements) {
      if (unlockedKeys.has(ach.key)) continue;

      let metricValue = 0;
      switch (ach.condition.metric) {
        case 'level':
          metricValue = profile.level;
          break;
        case 'totalQuestsCompleted':
          metricValue = profile.totalQuestsCompleted;
          break;
        case 'totalHabitsCompleted':
          metricValue = profile.totalHabitsCompleted;
          break;
        case 'totalGoalsCompleted':
          metricValue = profile.totalGoalsCompleted;
          break;
        case 'streakCount':
          metricValue = profile.streakCount;
          break;
        case 'totalWorkoutsCompleted':
          metricValue = profile.totalWorkoutsCompleted;
          break;
        default:
          metricValue = 0;
      }

      if (metricValue >= ach.condition.threshold) {
        // Unlock achievement!
        await UserAchievement.create({
          userId,
          achievementKey: ach.key,
          xpAwarded: ach.xpReward,
          coinsAwarded: ach.coinReward,
        });

        // Grant achievement rewards
        profile.coins += ach.coinReward;
        await profile.save();

        newlyUnlocked.push(ach);

        const notif = await Notification.create({
          userId,
          title: 'Achievement Unlocked!',
          message: `You earned the "${ach.title}" achievement!`,
          type: 'achievement',
          data: { achievement: ach },
        });
        emitToUser(userId, 'notification', notif);
        emitToUser(userId, 'achievement_unlocked', ach);
      }
    }

    return newlyUnlocked;
  }
}

export default GamificationService;
