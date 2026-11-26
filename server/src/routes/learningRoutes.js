import { Router } from 'express';
import { LearningController } from '../controllers/learningController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', LearningController.getRoadmaps);
router.post('/', LearningController.createRoadmap);
router.get('/:id', LearningController.getRoadmapById);
router.post('/:id/topics/:topicIndex/complete', LearningController.completeTopic);
router.post('/sessions', LearningController.logSession);

export default router;
