import { Router } from 'express';
import { WorldController } from '../controllers/worldController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', WorldController.getWorld);
router.patch('/theme', WorldController.updateTheme);
router.post('/buildings', WorldController.placeBuilding);
router.patch('/buildings/:buildingId/upgrade', WorldController.upgradeBuilding);
router.delete('/buildings/:buildingId', WorldController.removeBuilding);

export default router;
