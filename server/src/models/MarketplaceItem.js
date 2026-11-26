import mongoose from 'mongoose';

const marketplaceItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['avatar_outfit', 'avatar_accessory', 'building', 'world_theme', 'decoration', 'visual_effect'],
      required: true,
      index: true,
    },
    itemType: {
      type: String,
      enum: ['avatar_item', 'building', 'world_theme', 'booster'],
      required: true,
    },
    coinCost: {
      type: Number,
      required: true,
      min: 0,
    },
    levelRequired: {
      type: Number,
      default: 1,
    },
    previewUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const MarketplaceItem = mongoose.model('MarketplaceItem', marketplaceItemSchema);
export default MarketplaceItem;
