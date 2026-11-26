import {
  User,
  Quest,
  Challenge,
  Achievement,
  MarketplaceItem,
  Building,
  Report,
  AdminAuditLog,
  GamificationProfile,
  SystemSetting,
} from '../models/index.js';

export class AdminController {
  /**
   * Platform-wide Admin Metrics
   */
  static async getDashboardMetrics(req, res, next) {
    try {
      const [
        totalUsers,
        activeUsers,
        totalQuestsCompleted,
        activeChallenges,
        totalAchievements,
        pendingReports,
        profiles,
      ] = await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ status: 'active' }),
        Quest.countDocuments({ status: 'completed' }),
        Challenge.countDocuments({ status: 'active' }),
        Achievement.countDocuments({}),
        Report.countDocuments({ status: 'pending' }),
        GamificationProfile.aggregate([
          {
            $group: {
              _id: null,
              totalXp: { $sum: '$totalXp' },
              totalCoins: { $sum: '$coins' },
            },
          },
        ]),
      ]);

      return res.json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          totalQuestsCompleted,
          activeChallenges,
          totalAchievements,
          pendingReports,
          totalXpDistributed: profiles[0]?.totalXp || 0,
          totalCoinsCirculating: profiles[0]?.totalCoins || 0,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * User Management: List Users
   */
  static async listUsers(req, res, next) {
    try {
      const { search, role, status, page = 1, limit = 20 } = req.query;
      const query = {};

      if (role && role !== 'all') query.role = role;
      if (status && status !== 'all') query.status = status;
      if (search) {
        query.$or = [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const [users, totalCount] = await Promise.all([
        User.find(query)
          .select('-passwordHash')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10)),
        User.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: users,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit, 10)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * User Management: Suspend / Restore Account
   */
  static async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body; // 'active' or 'suspended'

      const user = await User.findById(id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.status = status;
      await user.save();

      // Log in audit log
      await AdminAuditLog.create({
        adminId: req.user.userId,
        action: `user_${status}`,
        targetResource: `User:${user._id}`,
        details: { username: user.username, email: user.email, newStatus: status },
        ipAddress: req.ip,
      });

      return res.json({
        success: true,
        message: `User status changed to ${status}`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Challenges Management
   */
  static async createChallenge(req, res, next) {
    try {
      const challenge = await Challenge.create({
        ...req.body,
        createdBy: req.user.userId,
      });

      await AdminAuditLog.create({
        adminId: req.user.userId,
        action: 'challenge_created',
        targetResource: `Challenge:${challenge._id}`,
        details: { title: challenge.title },
        ipAddress: req.ip,
      });

      return res.status(201).json({ success: true, data: challenge });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Achievement Management
   */
  static async createAchievement(req, res, next) {
    try {
      const achievement = await Achievement.create(req.body);
      return res.status(201).json({ success: true, data: achievement });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Marketplace Item Management
   */
  static async createMarketplaceItem(req, res, next) {
    try {
      const item = await MarketplaceItem.create(req.body);
      return res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  }

  /**
   * World Asset Management
   */
  static async createBuildingAsset(req, res, next) {
    try {
      const building = await Building.create(req.body);
      return res.status(201).json({ success: true, data: building });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Community Reports Management
   */
  static async listReports(req, res, next) {
    try {
      const reports = await Report.find({})
        .populate('reporterId', 'username email')
        .sort({ createdAt: -1 });
      return res.json({ success: true, data: reports });
    } catch (error) {
      next(error);
    }
  }

  static async resolveReport(req, res, next) {
    try {
      const { id } = req.params;
      const { status, actionTaken } = req.body;

      const report = await Report.findByIdAndUpdate(
        id,
        {
          status,
          actionTaken,
          reviewedBy: req.user.userId,
        },
        { new: true }
      );

      return res.json({ success: true, data: report });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Administrative Audit Logs
   */
  static async listAuditLogs(req, res, next) {
    try {
      const { page = 1, limit = 50 } = req.query;
      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const [logs, totalCount] = await Promise.all([
        AdminAuditLog.find({})
          .populate('adminId', 'username email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10)),
        AdminAuditLog.countDocuments({}),
      ]);

      return res.json({
        success: true,
        data: logs,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit, 10)),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * System Settings
   */
  static async getSystemSettings(req, res, next) {
    try {
      const settings = await SystemSetting.find({});
      return res.json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  }

  static async updateSystemSetting(req, res, next) {
    try {
      const { key, value, description } = req.body;
      const setting = await SystemSetting.findOneAndUpdate(
        { key },
        { value, description, updatedBy: req.user.userId },
        { upsert: true, new: true }
      );
      return res.json({ success: true, data: setting });
    } catch (error) {
      next(error);
    }
  }
}

export default AdminController;
