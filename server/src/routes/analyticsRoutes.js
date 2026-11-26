import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/dashboard', AnalyticsController.getDashboardStats);
router.get('/productivity', AnalyticsController.getProductivityAnalytics);

export default router;
