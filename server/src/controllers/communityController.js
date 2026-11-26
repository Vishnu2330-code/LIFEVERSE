import { CommunityPost, Comment, Report } from '../models/index.js';
import { broadcastCommunityEvent } from '../sockets/socketHandler.js';

export class CommunityController {
  static async getPosts(req, res, next) {
    try {
      const { category, page = 1, limit = 20 } = req.query;
      const query = {};
      if (category && category !== 'all') query.category = category;

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const posts = await CommunityPost.find(query)
        .populate('userId', 'username profile')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10));

      const enriched = posts.map((p) => ({
        ...p.toObject(),
        hasLiked: p.likes?.some((id) => id.toString() === req.user.userId),
      }));

      return res.json({ success: true, data: enriched });
    } catch (error) {
      next(error);
    }
  }

  static async createPost(req, res, next) {
    try {
      const { content, category, badgeInfo } = req.body;
      if (!content) return res.status(400).json({ success: false, message: 'Content is required' });

      const post = await CommunityPost.create({
        userId: req.user.userId,
        content,
        category: category || 'discussion',
        badgeInfo: badgeInfo || {},
      });

      const populated = await post.populate('userId', 'username profile');

      broadcastCommunityEvent('new_post', populated);

      return res.status(201).json({
        success: true,
        message: 'Post published!',
        data: populated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async likePost(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;

      const post = await CommunityPost.findById(id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

      const index = post.likes.indexOf(userId);
      if (index === -1) {
        post.likes.push(userId);
        post.likesCount += 1;
      } else {
        post.likes.splice(index, 1);
        post.likesCount = Math.max(0, post.likesCount - 1);
      }

      await post.save();

      return res.json({
        success: true,
        data: {
          likesCount: post.likesCount,
          hasLiked: post.likes.includes(userId),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getComments(req, res, next) {
    try {
      const comments = await Comment.find({ postId: req.params.id })
        .populate('userId', 'username profile')
        .sort({ createdAt: 1 });
      return res.json({ success: true, data: comments });
    } catch (error) {
      next(error);
    }
  }

  static async addComment(req, res, next) {
    try {
      const { content } = req.body;
      if (!content) return res.status(400).json({ success: false, message: 'Comment content is required' });

      const post = await CommunityPost.findById(req.params.id);
      if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

      const comment = await Comment.create({
        postId: post._id,
        userId: req.user.userId,
        content,
      });

      post.commentsCount += 1;
      await post.save();

      const populated = await comment.populate('userId', 'username profile');

      return res.status(201).json({
        success: true,
        data: populated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async reportContent(req, res, next) {
    try {
      const { targetType, targetId, reason } = req.body;
      if (!targetType || !targetId || !reason) {
        return res.status(400).json({ success: false, message: 'All report fields are required' });
      }

      const report = await Report.create({
        reporterId: req.user.userId,
        targetType,
        targetId,
        reason,
      });

      return res.status(201).json({
        success: true,
        message: 'Report submitted. Our moderation team will review it.',
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommunityController;
