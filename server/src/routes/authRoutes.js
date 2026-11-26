import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.post('/admin-login', authLimiter, AuthController.adminLogin);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logout);
router.post('/logout-all', authenticate, AuthController.logoutAll);
router.get('/me', authenticate, AuthController.getMe);
router.post('/forgot-password', authLimiter, AuthController.forgotPassword);
router.post('/reset-password', authLimiter, AuthController.resetPassword);
router.post('/verify-email', AuthController.verifyEmail);

export default router;
