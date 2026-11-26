import { Router } from 'express';
import { MarketplaceController } from '../controllers/marketplaceController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', MarketplaceController.getCatalog);
router.post('/purchase', MarketplaceController.purchaseItem);

export default router;
