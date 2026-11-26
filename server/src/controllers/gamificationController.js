import { GamificationProfile, XPTransaction, CoinTransaction, User } from '../models/index.js';
import { calculateLevelFromTotalXp, getXpRequiredForNextLevel } from '@lifeverse/shared';

export class GamificationController {
  /**
   * Get Gamification Status & Progress
   */
  static async getProfile(req, res, next) {
    try {
      const profile = await GamificationProfile.findOne({ userId: req.user.userId });
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Gamification profile not found' });
      }

      const calc = calculateLevelFromTotalXp(profile.totalXp);

      return res.json({
        success: true,
        data: {
          ...profile.toObject(),
          xpRequiredForNext: calc.xpRequiredForNext,
          progressPercentage: calc.progressPercentage,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Ledger Transaction History
   */
  static async getTransactions(req, res, next) {
    try {
      const { type = 'all', page = 1, limit = 20 } = req.query;
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const userId = req.user.userId;

      let xpTransactions = [];
      let coinTransactions = [];

      if (type === 'all' || type === 'xp') {
        xpTransactions = await XPTransaction.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10));
      }

      if (type === 'all' || type === 'coins') {
        coinTransactions = await CoinTransaction.find({ userId })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10));
      }

      return res.json({
        success: true,
        data: {
          xp: xpTransactions,
          coins: coinTransactions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Leaderboard (Top Players by Level & XP)
   */
  static async getLeaderboard(req, res, next) {
    try {
      const { page = 1, limit = 25 } = req.query;
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const profiles = await GamificationProfile.find({})
        .populate({
          path: 'userId',
          select: 'username profile isPublic',
          match: { 'profile.isPublic': { $ne: false } },
        })
        .sort({ level: -1, totalXp: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10));

      const filtered = profiles
        .filter((p) => p.userId != null)
        .map((p, idx) => ({
          rankPosition: skip + idx + 1,
          userId: p.userId._id,
          username: p.userId.username,
          avatarUrl: p.userId.profile?.avatarUrl,
          level: p.level,
          rank: p.rank,
          totalXp: p.totalXp,
          streakCount: p.streakCount,
        }));

      return res.json({
        success: true,
        data: filtered,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default GamificationController;
