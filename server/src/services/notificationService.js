import { Notification } from '../models/Notification.js';
import { emitToUser } from '../sockets/socketHandler.js';

export class NotificationService {
  /**
   * Create an in-app notification and dispatch it in real-time via Socket.IO
   */
  static async sendNotification({ userId, title, message, type = 'system', data = {} }) {
    const notif = await Notification.create({
      userId,
      title,
      message,
      type,
      data,
    });

    emitToUser(userId, 'notification', notif);
    return notif;
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, userId },
      { read: true },
      { new: true }
    );
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId) {
    return Notification.updateMany({ userId, read: false }, { read: true });
  }
}

export default NotificationService;
