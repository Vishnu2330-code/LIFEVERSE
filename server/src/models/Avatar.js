import mongoose from 'mongoose';

const avatarSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    gender: {
      type: String,
      enum: ['neutral', 'male', 'female'],
      default: 'neutral',
    },
    skinTone: {
      type: String,
      default: '#d1a384',
    },
    equippedItems: {
      body: { type: String, default: 'default_body' },
      hair: { type: String, default: 'hair_style_1' },
      hairColor: { type: String, default: '#4a2c11' },
      face: { type: String, default: 'face_expressive' },
      outfit: { type: String, default: 'outfit_novice_adventurer' },
      accessories: { type: String, default: 'none' },
      shoes: { type: String, default: 'shoes_leather_boots' },
      armor: { type: String, default: 'none' },
      background: { type: String, default: 'bg_cyber_grid' },
      effects: { type: String, default: 'effect_subtle_glow' },
    },
  },
  {
    timestamps: true,
  }
);

export const Avatar = mongoose.model('Avatar', avatarSchema);
export default Avatar;
