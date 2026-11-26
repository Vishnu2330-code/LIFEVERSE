import { Router } from 'express';
import { GamificationController } from '../controllers/gamificationController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/profile', GamificationController.getProfile);
router.get('/transactions', GamificationController.getTransactions);
router.get('/leaderboard', GamificationController.getLeaderboard);

export default router;
