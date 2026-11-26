import mongoose from 'mongoose';

const learningRoadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'technology',
    },
    description: {
      type: String,
      default: '',
    },
    topics: [
      {
        title: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
        completedAt: { type: Date, default: null },
      },
    ],
    totalTopics: {
      type: Number,
      default: 0,
    },
    completedTopics: {
      type: Number,
      default: 0,
    },
    progressPercentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const LearningRoadmap = mongoose.model('LearningRoadmap', learningRoadmapSchema);
export default LearningRoadmap;
