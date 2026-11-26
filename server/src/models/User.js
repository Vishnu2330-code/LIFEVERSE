import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_ROLES } from '@lifeverse/shared';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'pending_verification'],
      default: 'active',
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingStep: {
      type: Number,
      default: 1,
    },
    interests: [{
      type: String,
    }],
    initialGoals: [{
      type: String,
    }],
    selectedTheme: {
      type: String,
      default: 'futuristic_city',
    },
    profile: {
      bio: { type: String, default: '' },
      avatarUrl: { type: String, default: '' },
      isPublic: { type: Boolean, default: true },
      shareActivity: { type: Boolean, default: true },
      allowFriendRequests: { type: Boolean, default: true },
    },
    notificationPreferences: {
      emailQuestReminders: { type: Boolean, default: true },
      emailHabitReminders: { type: Boolean, default: true },
      inAppLevelUp: { type: Boolean, default: true },
      inAppAchievements: { type: Boolean, default: true },
      inAppFriendRequests: { type: Boolean, default: true },
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Static password hashing helper
userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const User = mongoose.model('User', userSchema);
export default User;
