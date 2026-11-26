import mongoose from 'mongoose';

const deviceTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      enum: ['android', 'ios', 'web'],
      default: 'android',
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

export const DeviceToken = mongoose.model('DeviceToken', deviceTokenSchema);
export default DeviceToken;
