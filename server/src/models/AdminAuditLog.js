import mongoose from 'mongoose';

const adminAuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true, // e.g. 'user_suspend', 'item_created', 'reward_adjust'
      index: true,
    },
    targetResource: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const AdminAuditLog = mongoose.model('AdminAuditLog', adminAuditLogSchema);
export default AdminAuditLog;
