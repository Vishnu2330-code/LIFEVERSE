import { Router } from 'express';
import { HabitController } from '../controllers/habitController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.get('/', HabitController.getHabits);
router.post('/', HabitController.createHabit);
router.get('/history', HabitController.getCheckInHistory);
router.get('/:id', HabitController.getHabitById);
router.post('/:id/check-in', HabitController.checkInHabit);
router.patch('/:id', HabitController.updateHabit);
router.delete('/:id', HabitController.deleteHabit);

export default router;
