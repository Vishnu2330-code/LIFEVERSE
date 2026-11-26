import mongoose from 'mongoose';

const coinTransactionSchema = new mongoose.Schema(
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
    },
    type: {
      type: String,
      enum: ['earned', 'spent'],
      required: true,
    },
    source: {
      type: String,
      required: true, // 'quest_reward', 'habit_reward', 'goal_reward', 'marketplace_purchase', 'admin_grant'
    },
    referenceEventId: {
      type: String,
      required: true,
      unique: true, // Idempotency check
      index: true,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const CoinTransaction = mongoose.model('CoinTransaction', coinTransactionSchema);
export default CoinTransaction;
