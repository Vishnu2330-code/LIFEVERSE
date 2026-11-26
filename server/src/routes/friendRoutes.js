import { Router } from 'express';
import { FriendController } from '../controllers/friendController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/', FriendController.getFriends);
router.get('/search', FriendController.searchUsers);
router.post('/requests', FriendController.sendRequest);
router.patch('/requests/:id', FriendController.respondRequest);
router.delete('/:friendId', FriendController.removeFriend);

export default router;
