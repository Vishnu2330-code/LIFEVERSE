import mongoose from 'mongoose';
import { CATEGORIES } from '@lifeverse/shared';

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: Object.values(CATEGORIES),
      default: CATEGORIES.CAREER,
      index: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    targetValue: {
      type: Number,
      default: 100,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: '%',
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'paused'],
      default: 'in_progress',
      index: true,
    },
    milestones: [
      {
        title: { type: String, required: true },
        targetValue: { type: Number, required: true },
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
        xpAwarded: { type: Number, default: 50 },
        coinsAwarded: { type: Number, default: 25 },
      },
    ],
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model('Goal', goalSchema);
export default Goal;
