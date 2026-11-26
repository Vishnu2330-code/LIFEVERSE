import mongoose from 'mongoose';
import { QUEST_DIFFICULTIES, QUEST_STATUSES, QUEST_PRIORITIES, CATEGORIES } from '@lifeverse/shared';

const questSchema = new mongoose.Schema(
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
      default: CATEGORIES.PRODUCTIVITY,
      index: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(QUEST_DIFFICULTIES),
      default: QUEST_DIFFICULTIES.MEDIUM,
    },
    priority: {
      type: String,
      enum: Object.values(QUEST_PRIORITIES),
      default: QUEST_PRIORITIES.MEDIUM,
    },
    status: {
      type: String,
      enum: Object.values(QUEST_STATUSES),
      default: QUEST_STATUSES.PENDING,
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    estimatedDuration: {
      type: Number, // In minutes
      default: 30,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
    },
    checklist: [
      {
        text: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    completionTimestamp: {
      type: Date,
      default: null,
    },
    xpEarned: {
      type: Number,
      default: 0,
    },
    coinsEarned: {
      type: Number,
      default: 0,
    },
    linkedGoalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Goal',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast user dashboard filtering
questSchema.index({ userId: 1, status: 1, dueDate: 1 });

export const Quest = mongoose.model('Quest', questSchema);
export default Quest;
