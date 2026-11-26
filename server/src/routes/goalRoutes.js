import { Router } from 'express';
import { GoalController } from '../controllers/goalController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.get('/', GoalController.getGoals);
router.post('/', GoalController.createGoal);
router.get('/:id', GoalController.getGoalById);
router.patch('/:id', GoalController.updateGoal);
router.post('/:id/milestones/:milestoneIndex/complete', GoalController.completeMilestone);
router.delete('/:id', GoalController.deleteGoal);

export default router;
