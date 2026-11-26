import { Habit, HabitCheckIn } from '../models/index.js';
import { GamificationService } from '../services/gamificationService.js';
import { evaluateHabitStreak } from '@lifeverse/shared';

export class HabitController {
  /**
   * List Habits for Current User
   */
  static async getHabits(req, res, next) {
    try {
      const userId = req.user.userId;
      const habits = await Habit.find({ userId, status: { $ne: 'archived' } })
        .sort({ currentStreak: -1, createdAt: -1 });

      // Determine today's check-in status for each habit based on user's timezone
      const userFormatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: req.user.timezone || 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const todayStr = userFormatter.format(new Date());

      const habitsWithStatus = habits.map((h) => ({
        ...h.toObject(),
        isCheckedInToday: h.lastCheckInDateStr === todayStr,
      }));

      return res.json({
        success: true,
        data: habitsWithStatus,
        todayDateStr: todayStr,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Single Habit
   */
  static async getHabitById(req, res, next) {
    try {
      const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.userId });
      if (!habit) return res.status(404).json({ success: false, message: 'Habit not found' });
      return res.json({ success: true, data: habit });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create Habit
   */
  static async createHabit(req, res, next) {
    try {
      const { title, description, category, frequency, targetDaysPerWeek, reminderTime } = req.body;
      if (!title) {
        return res.status(400).json({ success: false, message: 'Habit title is required' });
      }

      const habit = await Habit.create({
        userId: req.user.userId,
        title,
        description,
        category: category || 'health',
        frequency: frequency || 'daily',
        targetDaysPerWeek: targetDaysPerWeek || 7,
        reminderTime: reminderTime || null,
      });

      return res.status(201).json({
        success: true,
        message: 'Habit created successfully',
        data: habit,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Check-In to a Habit (Daily Streak Calculation + Reward)
   */
  static async checkInHabit(req, res, next) {
    try {
      const userId = req.user.userId;
      const habit = await Habit.findOne({ _id: req.params.id, userId });
      if (!habit) return res.status(404).json({ success: false, message: 'Habit not found' });

      // Evaluate streak using timezone pure function
      const streakEval = evaluateHabitStreak({
        lastCheckInDate: habit.lastCheckInDate,
        currentStreak: habit.currentStreak,
        timezone: req.user.timezone || 'UTC',
      });

      if (!streakEval.isValidCheckIn) {
        return res.status(400).json({
          success: false,
          message: streakEval.reason || 'Already checked in for today',
        });
      }

      // Check if check-in record already exists in database
      const existingCheckIn = await HabitCheckIn.findOne({
        habitId: habit._id,
        checkInDateStr: streakEval.todayDateStr,
      });

      if (existingCheckIn) {
        return res.status(400).json({
          success: false,
          message: 'Already checked in for today',
        });
      }

      // Update habit
      habit.currentStreak = streakEval.newStreak;
      habit.bestStreak = Math.max(habit.bestStreak, streakEval.newStreak);
      habit.totalCheckIns += 1;
      habit.lastCheckInDate = new Date();
      habit.lastCheckInDateStr = streakEval.todayDateStr;
      await habit.save();

      // Create CheckIn Record
      const checkInRecord = await HabitCheckIn.create({
        habitId: habit._id,
        userId,
        checkInDate: new Date(),
        checkInDateStr: streakEval.todayDateStr,
        xpAwarded: 10,
        coinsAwarded: 5,
      });

      // Process reward
      const rewardResult = await GamificationService.processReward({
        userId,
        source: 'habit_checkin',
        activityId: habit._id.toString(),
        referenceEventId: `habit_checkin_${habit._id}_${streakEval.todayDateStr}`,
      });

      return res.json({
        success: true,
        message: 'Check-in recorded! Streak updated.',
        data: {
          habit,
          checkIn: checkInRecord,
          streak: habit.currentStreak,
          rewards: rewardResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get 30-Day Check-in History / Heatmap
   */
  static async getCheckInHistory(req, res, next) {
    try {
      const userId = req.user.userId;
      const habitId = req.query.habitId;

      const query = { userId };
      if (habitId) query.habitId = habitId;

      const checkIns = await HabitCheckIn.find(query)
        .sort({ checkInDate: -1 })
        .limit(90);

      return res.json({
        success: true,
        data: checkIns,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Habit
   */
  static async updateHabit(req, res, next) {
    try {
      const habit = await Habit.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.userId },
        req.body,
        { new: true }
      );
      if (!habit) return res.status(404).json({ success: false, message: 'Habit not found' });
      return res.json({ success: true, message: 'Habit updated', data: habit });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete / Archive Habit
   */
  static async deleteHabit(req, res, next) {
    try {
      await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
      return res.json({ success: true, message: 'Habit removed successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default HabitController;
