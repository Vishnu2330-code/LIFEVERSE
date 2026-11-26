import mongoose from 'mongoose';
import { CATEGORIES } from '@lifeverse/shared';

const habitSchema = new mongoose.Schema(
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
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: Object.values(CATEGORIES),
      default: CATEGORIES.HEALTH,
      index: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly'],
      default: 'daily',
    },
    targetDaysPerWeek: {
      type: Number,
      default: 7,
      min: 1,
      max: 7,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    bestStreak: {
      type: Number,
      default: 0,
    },
    totalCheckIns: {
      type: Number,
      default: 0,
    },
    lastCheckInDate: {
      type: Date,
      default: null,
    },
    lastCheckInDateStr: {
      type: String, // e.g. "2026-11-24" in user's timezone
      default: null,
    },
    reminderTime: {
      type: String, // e.g. "08:00"
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'archived'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

habitSchema.index({ userId: 1, status: 1 });

export const Habit = mongoose.model('Habit', habitSchema);
export default Habit;
