import mongoose from 'mongoose';
import {
  Quest,
  Habit,
  HabitCheckIn,
  Goal,
  Workout,
  GamificationProfile,
  XPTransaction,
  VirtualWorld,
} from '../models/index.js';

export class AnalyticsController {
  /**
   * Main Dashboard Overview Statistics
   */
  static async getDashboardStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [profile, todayQuests, pendingQuests, activeHabits, activeGoals, world] = await Promise.all([
        GamificationProfile.findOne({ userId }),
        Quest.countDocuments({ userId, status: 'completed', completionTimestamp: { $gte: todayStart } }),
        Quest.countDocuments({ userId, status: { $ne: 'completed' } }),
        Habit.countDocuments({ userId, status: 'active' }),
        Goal.countDocuments({ userId, status: 'in_progress' }),
        VirtualWorld.findOne({ userId }),
      ]);

      return res.json({
        success: true,
        data: {
          profile: profile || {},
          todayCompletedQuests: todayQuests,
          pendingQuestsCount: pendingQuests,
          activeHabitsCount: activeHabits,
          activeGoalsCount: activeGoals,
          worldBuildingsCount: world?.buildings?.length || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Advanced Productivity Analytics (Charts & Heatmaps)
   */
  static async getProductivityAnalytics(req, res, next) {
    try {
      const userId = req.user.userId;
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // 1. Quests completed by category
      const questsByCategory = await Quest.aggregate([
        { $match: { userId: userObjectId, status: 'completed' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ]);

      // 2. XP Growth over past 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const xpGrowth = await XPTransaction.aggregate([
        { $match: { userId: userObjectId, createdAt: { $gte: thirtyDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            dailyXp: { $sum: '$amount' },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      // 3. Habit consistency heat map (last 60 days)
      const sixtyDaysAgo = new Date();
      sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

      const habitHeatmap = await HabitCheckIn.aggregate([
        { $match: { userId: userObjectId, checkInDate: { $gte: sixtyDaysAgo } } },
        {
          $group: {
            _id: '$checkInDateStr',
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return res.json({
        success: true,
        data: {
          questsByCategory: questsByCategory.map((c) => ({ category: c._id, count: c.count })),
          xpGrowth: xpGrowth.map((g) => ({ date: g._id, xp: g.dailyXp })),
          habitHeatmap: habitHeatmap.map((h) => ({ date: h._id, checkIns: h.count })),
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AnalyticsController;
