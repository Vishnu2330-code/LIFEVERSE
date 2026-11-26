import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [
      {
        itemId: { type: String, required: true },
        itemType: { type: String, enum: ['avatar_item', 'building', 'world_theme', 'booster'], required: true },
        acquiredAt: { type: Date, default: Date.now },
        source: { type: String, default: 'marketplace' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
