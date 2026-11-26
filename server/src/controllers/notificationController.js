import { Notification, DeviceToken } from '../models/index.js';

export class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      const { page = 1, limit = 30 } = req.query;
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const userId = req.user.userId;

      const [notifications, unreadCount] = await Promise.all([
        Notification.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10)),
        Notification.countDocuments({ userId, read: false }),
      ]);

      return res.json({
        success: true,
        data: notifications,
        unreadCount,
      });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      const notif = await Notification.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        { read: true },
        { new: true }
      );
      return res.json({ success: true, data: notif });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      await Notification.updateMany({ userId: req.user.userId, read: false }, { read: true });
      return res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }

  static async registerDeviceToken(req, res, next) {
    try {
      const { token, platform } = req.body;
      if (!token) return res.status(400).json({ success: false, message: 'Device token required' });

      await DeviceToken.findOneAndUpdate(
        { token },
        { userId: req.user.userId, platform: platform || 'android', isActive: true },
        { upsert: true }
      );

      return res.json({ success: true, message: 'Device token registered' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteNotification(req, res, next) {
    try {
      await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
      return res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  }
}

export default NotificationController;
