import mongoose from 'mongoose';
import { RANKS } from '@lifeverse/shared';

const gamificationProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    totalXp: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
      index: true,
    },
    currentLevelXp: {
      type: Number,
      default: 0,
      min: 0,
    },
    rank: {
      type: String,
      enum: Object.values(RANKS),
      default: RANKS.BEGINNER,
    },
    coins: {
      type: Number,
      default: 50, // Starter coins
      min: 0,
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    totalQuestsCompleted: {
      type: Number,
      default: 0,
    },
    totalHabitsCompleted: {
      type: Number,
      default: 0,
    },
    totalGoalsCompleted: {
      type: Number,
      default: 0,
    },
    totalWorkoutsCompleted: {
      type: Number,
      default: 0,
    },
    totalLearningHours: {
      type: Number,
      default: 0,
    },
    dailyRewardsClaimedCount: {
      type: Number,
      default: 0,
    },
    lastActivityDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const GamificationProfile = mongoose.model('GamificationProfile', gamificationProfileSchema);
export default GamificationProfile;
