import mongoose from 'mongoose';

const xpTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    source: {
      type: String,
      required: true,
      enum: ['quest', 'habit_checkin', 'goal_milestone', 'goal_completion', 'workout', 'learning_session', 'challenge', 'admin_grant'],
    },
    activityId: {
      type: String,
      default: null,
    },
    referenceEventId: {
      type: String,
      required: true,
      unique: true, // Idempotency key: prevents duplicate XP awards
      index: true,
    },
    levelBefore: {
      type: Number,
      required: true,
    },
    levelAfter: {
      type: Number,
      required: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const XPTransaction = mongoose.model('XPTransaction', xpTransactionSchema);
export default XPTransaction;
