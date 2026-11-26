import { Router } from 'express';
import { QuestController } from '../controllers/questController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.get('/', QuestController.getQuests);
router.post('/', QuestController.createQuest);
router.get('/:id', QuestController.getQuestById);
router.patch('/:id', QuestController.updateQuest);
router.post('/:id/complete', QuestController.completeQuest);
router.delete('/:id', QuestController.deleteQuest);

export default router;
