import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', InventoryController.getInventory);

export default router;
