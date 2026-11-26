import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { USER_ROLES } from '@lifeverse/shared';

const router = Router();

// Secure all admin endpoints with authentication and strict ADMIN role verification
router.use(authenticate);
router.use(requireRole(USER_ROLES.ADMIN));

router.get('/dashboard', AdminController.getDashboardMetrics);
router.get('/analytics', AdminController.getDashboardMetrics);
router.get('/users', AdminController.listUsers);
router.patch('/users/:id/status', AdminController.updateUserStatus);
router.post('/challenges', AdminController.createChallenge);
router.post('/achievements', AdminController.createAchievement);
router.post('/marketplace', AdminController.createMarketplaceItem);
router.post('/assets/building', AdminController.createBuildingAsset);
router.get('/reports', AdminController.listReports);
router.patch('/reports/:id/resolve', AdminController.resolveReport);
router.get('/audit-logs', AdminController.listAuditLogs);
router.get('/settings', AdminController.getSystemSettings);
router.post('/settings', AdminController.updateSystemSetting);

export default router;
