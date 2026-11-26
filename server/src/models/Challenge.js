import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['productivity', 'fitness', 'learning', 'habits', 'community'],
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'community'],
      default: 'weekly',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    criteria: {
      metric: { type: String, required: true }, // e.g., 'quests_completed', 'minutes_exercised', 'streak_days'
      targetValue: { type: Number, required: true },
    },
    xpReward: {
      type: Number,
      default: 150,
    },
    coinReward: {
      type: Number,
      default: 75,
    },
    participantCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'active',
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Challenge = mongoose.model('Challenge', challengeSchema);
export default Challenge;
