import mongoose from 'mongoose';

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    itemId: {
      type: String,
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      required: true,
    },
    coinCost: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Purchase = mongoose.model('Purchase', purchaseSchema);
export default Purchase;
