import { Router } from 'express';
import { ChallengeController } from '../controllers/challengeController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', ChallengeController.getChallenges);
router.post('/:id/join', ChallengeController.joinChallenge);
router.patch('/:id/progress', ChallengeController.updateProgress);

export default router;
