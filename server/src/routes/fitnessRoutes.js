import { Router } from 'express';
import { FitnessController } from '../controllers/fitnessController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', FitnessController.getWorkouts);
router.post('/', FitnessController.logWorkout);
router.get('/stats', FitnessController.getStats);

export default router;
