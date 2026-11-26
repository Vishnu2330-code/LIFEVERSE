import { User, GamificationProfile, Quest, Habit, Goal, Workout } from '../models/index.js';

export class UserController {
  /**
   * Update Profile
   */
  static async updateProfile(req, res, next) {
    try {
      const { bio, avatarUrl, timezone, isPublic, shareActivity, allowFriendRequests } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (bio !== undefined) user.profile.bio = bio;
      if (avatarUrl !== undefined) user.profile.avatarUrl = avatarUrl;
      if (timezone !== undefined) user.timezone = timezone;
      if (isPublic !== undefined) user.profile.isPublic = isPublic;
      if (shareActivity !== undefined) user.profile.shareActivity = shareActivity;
      if (allowFriendRequests !== undefined) user.profile.allowFriendRequests = allowFriendRequests;

      await user.save();

      return res.json({
        success: true,
        message: 'Profile updated',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete / Update Onboarding
   */
  static async completeOnboarding(req, res, next) {
    try {
      const { step, interests, initialGoals, selectedTheme, isCompleted } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (step !== undefined) user.onboardingStep = step;
      if (interests) user.interests = interests;
      if (initialGoals) user.initialGoals = initialGoals;
      if (selectedTheme) user.selectedTheme = selectedTheme;
      if (isCompleted !== undefined) user.onboardingCompleted = isCompleted;

      await user.save();

      return res.json({
        success: true,
        message: 'Onboarding updated',
        data: {
          onboardingStep: user.onboardingStep,
          onboardingCompleted: user.onboardingCompleted,
          interests: user.interests,
          initialGoals: user.initialGoals,
          selectedTheme: user.selectedTheme,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export user personal data (GDPR compliant JSON)
   */
  static async exportData(req, res, next) {
    try {
      const userId = req.user.userId;

      const [user, profile, quests, habits, goals, workouts] = await Promise.all([
        User.findById(userId).select('-passwordHash'),
        GamificationProfile.findOne({ userId }),
        Quest.find({ userId }),
        Habit.find({ userId }),
        Goal.find({ userId }),
        Workout.find({ userId }),
      ]);

      return res.json({
        success: true,
        data: {
          user,
          gamification: profile,
          quests,
          habits,
          goals,
          workouts,
          exportedAt: new Date(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Account
   */
  static async deleteAccount(req, res, next) {
    try {
      const userId = req.user.userId;
      await User.findByIdAndDelete(userId);
      await Promise.all([
        GamificationProfile.deleteMany({ userId }),
        Quest.deleteMany({ userId }),
        Habit.deleteMany({ userId }),
        Goal.deleteMany({ userId }),
      ]);

      res.clearCookie('refreshToken');
      return res.json({
        success: true,
        message: 'Account deleted permanently',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
