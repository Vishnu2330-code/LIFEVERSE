import mongoose from 'mongoose';

const refreshSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    deviceInfo: {
      userAgent: { type: String, default: '' },
      ipAddress: { type: String, default: '' },
      platform: { type: String, enum: ['web', 'android', 'ios', 'other'], default: 'web' },
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index auto-cleans expired sessions
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    replacesTokenHash: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const RefreshSession = mongoose.model('RefreshSession', refreshSessionSchema);
export default RefreshSession;
