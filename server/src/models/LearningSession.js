import mongoose from 'mongoose';

const learningSessionSchema = new mongoose.Schema(
  {
    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningRoadmap',
      default: null,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    notes: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
    xpEarned: {
      type: Number,
      default: 25,
    },
    coinsEarned: {
      type: Number,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

export const LearningSession = mongoose.model('LearningSession', learningSessionSchema);
export default LearningSession;
