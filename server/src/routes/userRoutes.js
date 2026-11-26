import { Router } from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.patch('/profile', UserController.updateProfile);
router.post('/onboarding', UserController.completeOnboarding);
router.get('/export-data', UserController.exportData);
router.delete('/account', UserController.deleteAccount);

export default router;
