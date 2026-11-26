import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    category: {
      type: String,
      enum: ['achievement', 'milestone', 'quest_completed', 'workout', 'discussion'],
      default: 'discussion',
      index: true,
    },
    badgeInfo: {
      title: { type: String, default: null },
      icon: { type: String, default: null },
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
export default CommunityPost;
