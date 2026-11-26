import mongoose from 'mongoose';
import { AVATAR_ITEM_CATEGORIES } from '@lifeverse/shared';

const avatarItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(AVATAR_ITEM_CATEGORIES),
      required: true,
      index: true,
    },
    coinCost: {
      type: Number,
      default: 0,
    },
    levelRequired: {
      type: Number,
      default: 1,
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common',
    },
    assetRef: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const AvatarItem = mongoose.model('AvatarItem', avatarItemSchema);
export default AvatarItem;
