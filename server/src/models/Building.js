import mongoose from 'mongoose';
import { BUILDING_TYPES } from '@lifeverse/shared';

const buildingSchema = new mongoose.Schema(
  {
    buildingType: {
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
      required: true,
    },
    levelRequired: {
      type: Number,
      default: 1,
    },
    coinCost: {
      type: Number,
      default: 100,
    },
    assetRef: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    baseBoost: {
      metric: { type: String, default: 'xp_boost' },
      percentage: { type: Number, default: 5 },
    },
  },
  {
    timestamps: true,
  }
);

export const Building = mongoose.model('Building', buildingSchema);
export default Building;
