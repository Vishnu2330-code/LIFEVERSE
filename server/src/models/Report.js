import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ['user', 'post', 'comment'],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    actionTaken: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model('Report', reportSchema);
export default Report;
