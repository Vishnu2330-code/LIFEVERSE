import { Friendship, User, GamificationProfile } from '../models/index.js';
import { NotificationService } from '../services/notificationService.js';

export class FriendController {
  static async getFriends(req, res, next) {
    try {
      const userId = req.user.userId;
      const friendships = await Friendship.find({
        $or: [{ requesterId: userId }, { recipientId: userId }],
        status: 'accepted',
      });

      const friendUserIds = friendships.map((f) =>
        f.requesterId.toString() === userId ? f.recipientId : f.requesterId
      );

      const [friends, profiles] = await Promise.all([
        User.find({ _id: { $in: friendUserIds } }).select('username profile lastLoginAt isEmailVerified'),
        GamificationProfile.find({ userId: { $in: friendUserIds } }),
      ]);

      const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

      const friendsWithStats = friends.map((f) => ({
        id: f._id,
        username: f.username,
        bio: f.profile?.bio,
        avatarUrl: f.profile?.avatarUrl,
        gamification: profileMap.get(f._id.toString()) || null,
      }));

      return res.json({ success: true, data: friendsWithStats });
    } catch (error) {
      next(error);
    }
  }

  static async searchUsers(req, res, next) {
    try {
      const { q } = req.query;
      if (!q || q.length < 2) {
        return res.json({ success: true, data: [] });
      }

      const users = await User.find({
        _id: { $ne: req.user.userId },
        username: { $regex: q, $options: 'i' },
        status: 'active',
        'profile.isPublic': { $ne: false },
      }).select('username profile').limit(20);

      return res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async sendRequest(req, res, next) {
    try {
      const { recipientId } = req.body;
      const requesterId = req.user.userId;

      if (recipientId === requesterId) {
        return res.status(400).json({ success: false, message: 'Cannot add yourself as friend' });
      }

      const recipient = await User.findById(recipientId);
      if (!recipient) return res.status(404).json({ success: false, message: 'User not found' });

      let existing = await Friendship.findOne({
        $or: [
          { requesterId, recipientId },
          { requesterId: recipientId, recipientId: requesterId },
        ],
      });

      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Friendship relation already exists with status: ${existing.status}`,
        });
      }

      const friendship = await Friendship.create({
        requesterId,
        recipientId,
        status: 'pending',
      });

      // Dispatch in-app notification
      await NotificationService.sendNotification({
        userId: recipientId,
        title: 'New Friend Request',
        message: `${req.user.username} sent you a friend request.`,
        type: 'friend_request',
        data: { requesterId, username: req.user.username },
      });

      return res.status(201).json({
        success: true,
        message: 'Friend request sent',
        data: friendship,
      });
    } catch (error) {
      next(error);
    }
  }

  static async respondRequest(req, res, next) {
    try {
      const { id } = req.params; // friendship id
      const { action } = req.body; // 'accept' or 'reject'

      const friendship = await Friendship.findOne({ _id: id, recipientId: req.user.userId });
      if (!friendship) return res.status(404).json({ success: false, message: 'Friend request not found' });

      if (action === 'accept') {
        friendship.status = 'accepted';
        await friendship.save();
        return res.json({ success: true, message: 'Friend request accepted!', data: friendship });
      } else {
        friendship.status = 'rejected';
        await friendship.save();
        return res.json({ success: true, message: 'Friend request rejected' });
      }
    } catch (error) {
      next(error);
    }
  }

  static async removeFriend(req, res, next) {
    try {
      const { friendId } = req.params;
      const userId = req.user.userId;

      await Friendship.findOneAndDelete({
        $or: [
          { requesterId: userId, recipientId: friendId },
          { requesterId: friendId, recipientId: userId },
        ],
      });

      return res.json({ success: true, message: 'Friend removed' });
    } catch (error) {
      next(error);
    }
  }
}

export default FriendController;
