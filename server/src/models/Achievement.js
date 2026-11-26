import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['productivity', 'learning', 'fitness', 'habits', 'goals', 'community', 'world'],
      required: true,
      index: true,
    },
    icon: {
      type: String,
      default: 'trophy',
    },
    condition: {
      metric: { type: String, required: true }, // e.g. 'totalQuestsCompleted', 'streakCount'
      threshold: { type: Number, required: true },
    },
    xpReward: {
      type: Number,
      default: 50,
    },
    coinReward: {
      type: Number,
      default: 25,
    },
  },
  {
    timestamps: true,
  }
);

export const Achievement = mongoose.model('Achievement', achievementSchema);
export default Achievement;
