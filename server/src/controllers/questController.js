import { Quest, Goal } from '../models/index.js';
import { GamificationService } from '../services/gamificationService.js';
import { QUEST_STATUSES } from '@lifeverse/shared';

export class QuestController {
  /**
   * Get Quests (List, Kanban, Calendar filters)
   */
  static async getQuests(req, res, next) {
    try {
      const userId = req.user.userId;
      const { status, category, difficulty, priority, search, page = 1, limit = 50, view } = req.query;

      const query = { userId };

      if (status && status !== 'all') {
        query.status = status;
      }
      if (category && category !== 'all') {
        query.category = category;
      }
      if (difficulty && difficulty !== 'all') {
        query.difficulty = difficulty;
      }
      if (priority && priority !== 'all') {
        query.priority = priority;
      }
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ];
      }

      // Special view filters
      if (view === 'today') {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        query.dueDate = { $gte: startOfDay, $lte: endOfDay };
      }

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
      const [quests, totalCount] = await Promise.all([
        Quest.find(query)
          .sort({ dueDate: 1, priority: -1, createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit, 10)),
        Quest.countDocuments(query),
      ]);

      return res.json({
        success: true,
        data: quests,
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
   * Get Single Quest
   */
  static async getQuestById(req, res, next) {
    try {
      const quest = await Quest.findOne({ _id: req.params.id, userId: req.user.userId });
      if (!quest) {
        return res.status(404).json({ success: false, message: 'Quest not found' });
      }
      return res.json({ success: true, data: quest });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create Quest
   */
  static async createQuest(req, res, next) {
    try {
      const {
        title,
        description,
        category,
        difficulty,
        priority,
        dueDate,
        estimatedDuration,
        tags,
        recurrence,
        checklist,
        linkedGoalId,
      } = req.body;

      if (!title) {
        return res.status(400).json({ success: false, message: 'Quest title is required' });
      }

      const quest = await Quest.create({
        userId: req.user.userId,
        title,
        description,
        category: category || 'productivity',
        difficulty: difficulty || 'medium',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        estimatedDuration: estimatedDuration || 30,
        tags: Array.isArray(tags) ? tags : [],
        recurrence: recurrence || 'none',
        checklist: Array.isArray(checklist) ? checklist : [],
        linkedGoalId: linkedGoalId || null,
      });

      return res.status(201).json({
        success: true,
        message: 'Quest created successfully',
        data: quest,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Quest
   */
  static async updateQuest(req, res, next) {
    try {
      const quest = await Quest.findOne({ _id: req.params.id, userId: req.user.userId });
      if (!quest) {
        return res.status(404).json({ success: false, message: 'Quest not found' });
      }

      // If updating checklist
      if (req.body.checklist) quest.checklist = req.body.checklist;
      if (req.body.title) quest.title = req.body.title;
      if (req.body.description !== undefined) quest.description = req.body.description;
      if (req.body.category) quest.category = req.body.category;
      if (req.body.difficulty) quest.difficulty = req.body.difficulty;
      if (req.body.priority) quest.priority = req.body.priority;
      if (req.body.status && req.body.status !== QUEST_STATUSES.COMPLETED) {
        quest.status = req.body.status;
      }
      if (req.body.dueDate !== undefined) quest.dueDate = req.body.dueDate ? new Date(req.body.dueDate) : null;
      if (req.body.tags) quest.tags = req.body.tags;

      await quest.save();

      return res.json({
        success: true,
        message: 'Quest updated successfully',
        data: quest,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete Quest & Trigger Idempotent Rewards
   */
  static async completeQuest(req, res, next) {
    try {
      const quest = await Quest.findOne({ _id: req.params.id, userId: req.user.userId });
      if (!quest) {
        return res.status(404).json({ success: false, message: 'Quest not found' });
      }

      if (quest.status === QUEST_STATUSES.COMPLETED) {
        return res.status(400).json({
          success: false,
          message: 'Quest is already completed. Duplicate rewards prevented.',
        });
      }

      quest.status = QUEST_STATUSES.COMPLETED;
      quest.completionTimestamp = new Date();

      // Trigger gamification service with deterministic referenceEventId
      const rewardResult = await GamificationService.processReward({
        userId: req.user.userId,
        source: 'quest',
        activityId: quest._id.toString(),
        referenceEventId: `quest_complete_${quest._id}`,
        difficulty: quest.difficulty,
      });

      quest.xpEarned = rewardResult.xpAwarded;
      quest.coinsEarned = rewardResult.coinsAwarded;
      await quest.save();

      // If linked to a goal, update goal progress
      if (quest.linkedGoalId) {
        const goal = await Goal.findOne({ _id: quest.linkedGoalId, userId: req.user.userId });
        if (goal && goal.status === 'in_progress') {
          const completedLinked = await Quest.countDocuments({
            linkedGoalId: goal._id,
            status: QUEST_STATUSES.COMPLETED,
          });
          const totalLinked = await Quest.countDocuments({ linkedGoalId: goal._id });
          if (totalLinked > 0) {
            goal.progressPercentage = Math.min(100, Math.round((completedLinked / totalLinked) * 100));
            if (goal.progressPercentage === 100) {
              goal.status = 'completed';
              goal.completedAt = new Date();
              await GamificationService.processReward({
                userId: req.user.userId,
                source: 'goal_completion',
                activityId: goal._id.toString(),
                referenceEventId: `goal_complete_${goal._id}`,
              });
            }
            await goal.save();
          }
        }
      }

      return res.json({
        success: true,
        message: 'Quest completed!',
        data: {
          quest,
          rewards: rewardResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Quest
   */
  static async deleteQuest(req, res, next) {
    try {
      const result = await Quest.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
      if (!result) {
        return res.status(404).json({ success: false, message: 'Quest not found' });
      }
      return res.json({ success: true, message: 'Quest deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default QuestController;
