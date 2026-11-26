import { Goal } from '../models/Goal.js';
import { GamificationService } from '../services/gamificationService.js';

export class GoalController {
  static async getGoals(req, res, next) {
    try {
      const goals = await Goal.find({ userId: req.user.userId }).sort({ targetDate: 1 });
      return res.json({ success: true, data: goals });
    } catch (error) {
      next(error);
    }
  }

  static async getGoalById(req, res, next) {
    try {
      const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.userId });
      if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
      return res.json({ success: true, data: goal });
    } catch (error) {
      next(error);
    }
  }

  static async createGoal(req, res, next) {
    try {
      const { title, description, category, targetDate, targetValue, unit, milestones } = req.body;
      if (!title || !targetDate) {
        return res.status(400).json({ success: false, message: 'Title and target date are required' });
      }

      const formattedMilestones = Array.isArray(milestones)
        ? milestones.map((m) => ({
            title: m.title,
            targetValue: m.targetValue || 1,
            isCompleted: false,
            xpAwarded: 50,
            coinsAwarded: 25,
          }))
        : [];

      const goal = await Goal.create({
        userId: req.user.userId,
        title,
        description: description || '',
        category: category || 'career',
        targetDate: new Date(targetDate),
        targetValue: targetValue || 100,
        unit: unit || '%',
        milestones: formattedMilestones,
      });

      return res.status(201).json({
        success: true,
        message: 'Goal created successfully',
        data: goal,
      });
    } catch (error) {
      next(error);
    }
  }

  static async completeMilestone(req, res, next) {
    try {
      const { id, milestoneIndex } = req.params;
      const goal = await Goal.findOne({ _id: id, userId: req.user.userId });
      if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

      const idx = parseInt(milestoneIndex, 10);
      if (isNaN(idx) || idx < 0 || idx >= goal.milestones.length) {
        return res.status(400).json({ success: false, message: 'Invalid milestone index' });
      }

      const ms = goal.milestones[idx];
      if (ms.isCompleted) {
        return res.status(400).json({ success: false, message: 'Milestone already completed' });
      }

      ms.isCompleted = true;
      ms.completedAt = new Date();

      // Recalculate progress
      const completedCount = goal.milestones.filter((m) => m.isCompleted).length;
      goal.progressPercentage = Math.round((completedCount / goal.milestones.length) * 100);

      const rewardResult = await GamificationService.processReward({
        userId: req.user.userId,
        source: 'goal_milestone',
        activityId: `${goal._id}_ms_${idx}`,
        referenceEventId: `goal_ms_${goal._id}_${idx}`,
      });

      if (goal.progressPercentage === 100 && goal.status !== 'completed') {
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

      return res.json({
        success: true,
        message: 'Milestone achieved!',
        data: { goal, rewards: rewardResult },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateGoal(req, res, next) {
    try {
      const goal = await Goal.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });
      return res.json({ success: true, data: goal });
    } catch (error) {
      next(error);
    }
  }

  static async deleteGoal(req, res, next) {
    try {
      await Goal.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
      return res.json({ success: true, message: 'Goal removed successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default GoalController;
