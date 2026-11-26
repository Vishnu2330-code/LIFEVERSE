/**
 * Server-authoritative Gamification Calculation Engine
 * Pure functions used across backend, web, and mobile.
 */

import { RANK_THRESHOLDS, RANKS, DEFAULT_REWARDS } from '../constants/index.js';

/**
 * Calculate the XP needed to advance from level `level` to `level + 1`.
 * Formula: XP required for the next level = 100 * current level.
 */
export function getXpRequiredForNextLevel(level) {
  const currentLvl = Math.max(1, Math.floor(level || 1));
  return currentLvl * 100;
}

/**
 * Calculate the total cumulative XP required to reach a specific level starting from Level 1.
 * Level 1 starts at 0 XP.
 * Level 2 requires 100 XP total.
 * Level 3 requires 100 + 200 = 300 XP total.
 * Level L requires \sum_{k=1}^{L-1} (100 * k) = 50 * L * (L - 1)
 */
export function getTotalXpForLevel(level) {
  const targetLevel = Math.max(1, Math.floor(level || 1));
  if (targetLevel === 1) return 0;
  return 50 * targetLevel * (targetLevel - 1);
}

/**
 * Calculate level and progress from total accumulated XP.
 * Starts at Level 1 with 0 XP.
 * Handles multiple level-ups safely and deterministically.
 */
export function calculateLevelFromTotalXp(totalXp) {
  const xp = Math.max(0, Math.floor(totalXp || 0));
  
  let currentLevel = 1;
  let remainingXp = xp;

  while (true) {
    const xpNeeded = getXpRequiredForNextLevel(currentLevel);
    if (remainingXp >= xpNeeded) {
      remainingXp -= xpNeeded;
      currentLevel += 1;
    } else {
      break;
    }
  }

  const xpRequiredForNext = getXpRequiredForNextLevel(currentLevel);
  const progressPercentage = Math.min(100, Math.round((remainingXp / xpRequiredForNext) * 100));

  return {
    level: currentLevel,
    currentLevelXp: remainingXp,
    xpRequiredForNext,
    progressPercentage,
    totalXp: xp,
    rank: getRankForLevel(currentLevel),
  };
}

/**
 * Determine Rank based on Level:
 * Level 1–5: Beginner
 * Level 6–15: Explorer
 * Level 16–30: Warrior
 * Level 31–50: Master
 * Level 51+: Legend
 */
export function getRankForLevel(level) {
  const lvl = Math.max(1, Math.floor(level || 1));
  for (const item of RANK_THRESHOLDS) {
    if (lvl >= item.minLevel && lvl <= item.maxLevel) {
      return item.rank;
    }
  }
  return RANKS.BEGINNER;
}

/**
 * Calculate reward values for a given activity type and difficulty.
 */
export function getRewardForActivity(activityType, difficulty = 'medium') {
  switch (activityType) {
    case 'quest':
      if (difficulty === 'easy') return DEFAULT_REWARDS.EASY_QUEST;
      if (difficulty === 'hard') return DEFAULT_REWARDS.HARD_QUEST;
      return DEFAULT_REWARDS.MEDIUM_QUEST;
    case 'habit_checkin':
      return DEFAULT_REWARDS.HABIT_CHECKIN;
    case 'goal_milestone':
      return DEFAULT_REWARDS.GOAL_MILESTONE;
    case 'goal_completion':
      return DEFAULT_REWARDS.GOAL_COMPLETION;
    case 'workout':
      return DEFAULT_REWARDS.WORKOUT_COMPLETION;
    case 'learning_session':
      return DEFAULT_REWARDS.LEARNING_SESSION;
    case 'challenge':
      return DEFAULT_REWARDS.COMMUNITY_CHALLENGE;
    default:
      return { xp: 10, coins: 5 };
  }
}

/**
 * Calculate streak and check-in validity based on user's local timezone.
 * Prevents duplicate check-ins for the same calendar date.
 */
export function evaluateHabitStreak({ lastCheckInDate, currentStreak = 0, timezone = 'UTC' }) {
  const now = new Date();
  
  // Format dates in user's timezone to YYYY-MM-DD
  const userFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone || 'UTC',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const todayStr = userFormatter.format(now);
  
  if (!lastCheckInDate) {
    return {
      isValidCheckIn: true,
      newStreak: 1,
      todayDateStr: todayStr,
      isStreakKept: true,
    };
  }

  const lastCheckInStr = userFormatter.format(new Date(lastCheckInDate));

  if (lastCheckInStr === todayStr) {
    // Already checked in today
    return {
      isValidCheckIn: false,
      newStreak: currentStreak,
      todayDateStr: todayStr,
      reason: 'Already checked in for today',
      isStreakKept: true,
    };
  }

  // Calculate day difference
  const todayDateObj = new Date(todayStr);
  const lastCheckInObj = new Date(lastCheckInStr);
  const diffDays = Math.round((todayDateObj - lastCheckInObj) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Consecutive day
    return {
      isValidCheckIn: true,
      newStreak: currentStreak + 1,
      todayDateStr: todayStr,
      isStreakKept: true,
    };
  } else if (diffDays > 1) {
    // Streak broken (graceful recovery - start at 1 instead of punishing)
    return {
      isValidCheckIn: true,
      newStreak: 1,
      todayDateStr: todayStr,
      isStreakKept: false,
    };
  }

  return {
    isValidCheckIn: true,
    newStreak: Math.max(1, currentStreak),
    todayDateStr: todayStr,
    isStreakKept: true,
  };
}
