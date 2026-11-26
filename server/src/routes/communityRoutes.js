import { Router } from 'express';
import { CommunityController } from '../controllers/communityController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();
router.use(authenticate);
router.get('/posts', CommunityController.getPosts);
router.post('/posts', CommunityController.createPost);
router.post('/posts/:id/like', CommunityController.likePost);
router.get('/posts/:id/comments', CommunityController.getComments);
router.post('/posts/:id/comments', CommunityController.addComment);
router.post('/report', CommunityController.reportContent);

export default router;
