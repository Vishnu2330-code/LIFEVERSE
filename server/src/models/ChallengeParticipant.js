import mongoose from 'mongoose';

const challengeParticipantSchema = new mongoose.Schema(
  {
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One participation per user per challenge
challengeParticipantSchema.index({ challengeId: 1, userId: 1 }, { unique: true });

export const ChallengeParticipant = mongoose.model('ChallengeParticipant', challengeParticipantSchema);
export default ChallengeParticipant;
