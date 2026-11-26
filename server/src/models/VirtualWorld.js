import mongoose from 'mongoose';

const virtualWorldSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    theme: {
      type: String,
      default: 'futuristic_city',
    },
    gridWidth: {
      type: Number,
      default: 10,
    },
    gridHeight: {
      type: Number,
      default: 10,
    },
    unlockedSlots: {
      type: Number,
      default: 8,
    },
    buildings: [
      {
        buildingId: { type: String, required: true },
        buildingType: { type: String, required: true },
        name: { type: String, required: true },
        gridX: { type: Number, required: true },
        gridY: { type: Number, required: true },
        rotation: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        assetRef: { type: String, required: true },
        placedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const VirtualWorld = mongoose.model('VirtualWorld', virtualWorldSchema);
export default VirtualWorld;
