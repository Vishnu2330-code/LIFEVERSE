import { Router } from 'express';
import { AvatarController } from '../controllers/avatarController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', AvatarController.getAvatar);
router.patch('/equip', AvatarController.updateEquipped);
router.get('/items', AvatarController.getAvailableItems);

export default router;
