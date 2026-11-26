import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', NotificationController.getNotifications);
router.patch('/read-all', NotificationController.markAllAsRead);
router.patch('/:id/read', NotificationController.markAsRead);
router.post('/device-token', NotificationController.registerDeviceToken);
router.delete('/:id', NotificationController.deleteNotification);

export default router;
