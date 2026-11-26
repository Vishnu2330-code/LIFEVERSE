import mongoose from 'mongoose';

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    achievementKey: {
      type: String,
      required: true,
      index: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    xpAwarded: {
      type: Number,
      default: 0,
    },
    coinsAwarded: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// One unlock per user per achievement key
userAchievementSchema.index({ userId: 1, achievementKey: 1 }, { unique: true });

export const UserAchievement = mongoose.model('UserAchievement', userAchievementSchema);
export default UserAchievement;
