import { Workout } from '../models/Workout.js';
import { GamificationService } from '../services/gamificationService.js';

export class FitnessController {
  static async getWorkouts(req, res, next) {
    try {
      const workouts = await Workout.find({ userId: req.user.userId })
        .sort({ completedAt: -1 })
        .limit(50);
      return res.json({ success: true, data: workouts });
    } catch (error) {
      next(error);
    }
  }

  static async logWorkout(req, res, next) {
    try {
      const { title, workoutType, durationMinutes, exercises, caloriesBurned } = req.body;
      if (!title || !durationMinutes) {
        return res.status(400).json({ success: false, message: 'Title and duration are required' });
      }

      const workout = await Workout.create({
        userId: req.user.userId,
        title,
        workoutType: workoutType || 'strength',
        durationMinutes: parseInt(durationMinutes, 10),
        exercises: Array.isArray(exercises) ? exercises : [],
        caloriesBurned: caloriesBurned || 0,
      });

      const rewardResult = await GamificationService.processReward({
        userId: req.user.userId,
        source: 'workout',
        activityId: workout._id.toString(),
        referenceEventId: `workout_${workout._id}`,
      });

      return res.status(201).json({
        success: true,
        message: 'Workout logged successfully!',
        data: {
          workout,
          rewards: rewardResult,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(req, res, next) {
    try {
      const userId = req.user.userId;
      const stats = await Workout.aggregate([
        { $match: { userId: Workout.base.Types.ObjectId.createFromHexString(userId) } },
        {
          $group: {
            _id: null,
            totalWorkouts: { $sum: 1 },
            totalMinutes: { $sum: '$durationMinutes' },
            totalCalories: { $sum: '$caloriesBurned' },
          },
        },
      ]);

      return res.json({
        success: true,
        data: stats[0] || { totalWorkouts: 0, totalMinutes: 0, totalCalories: 0 },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default FitnessController;
