import { Challenge, ChallengeParticipant } from '../models/index.js';
import { GamificationService } from '../services/gamificationService.js';

export class ChallengeController {
  static async getChallenges(req, res, next) {
    try {
      const challenges = await Challenge.find({ status: { $ne: 'archived' } }).sort({ endDate: 1 });
      const myParticipations = await ChallengeParticipant.find({ userId: req.user.userId });
      const joinedMap = new Map(myParticipations.map((p) => [p.challengeId.toString(), p]));

      const challengesWithStatus = challenges.map((c) => {
        const part = joinedMap.get(c._id.toString());
        return {
          ...c.toObject(),
          isJoined: !!part,
          myProgress: part ? part.progress : 0,
          isCompleted: part ? part.isCompleted : false,
        };
      });

      return res.json({ success: true, data: challengesWithStatus });
    } catch (error) {
      next(error);
    }
  }

  static async joinChallenge(req, res, next) {
    try {
      const { id } = req.params;
      const challenge = await Challenge.findById(id);
      if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found' });

      let participant = await ChallengeParticipant.findOne({ challengeId: id, userId: req.user.userId });
      if (participant) {
        return res.status(400).json({ success: false, message: 'Already joined this challenge' });
      }

      participant = await ChallengeParticipant.create({
        challengeId: id,
        userId: req.user.userId,
      });

      challenge.participantCount += 1;
      await challenge.save();

      return res.status(201).json({
        success: true,
        message: `Joined challenge "${challenge.title}"!`,
        data: participant,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProgress(req, res, next) {
    try {
      const { id } = req.params;
      const { progressDelta } = req.body;

      const participant = await ChallengeParticipant.findOne({ challengeId: id, userId: req.user.userId });
      if (!participant) return res.status(404).json({ success: false, message: 'Challenge participation record not found' });

      const challenge = await Challenge.findById(id);
      if (!challenge) return res.status(404).json({ success: false, message: 'Challenge not found' });

      participant.progress += (progressDelta || 1);

      let rewards = null;
      if (participant.progress >= challenge.criteria.targetValue && !participant.isCompleted) {
        participant.isCompleted = true;
        participant.completedAt = new Date();

        rewards = await GamificationService.processReward({
          userId: req.user.userId,
          source: 'challenge',
          activityId: challenge._id.toString(),
          referenceEventId: `challenge_${challenge._id}_${req.user.userId}`,
          customXp: challenge.xpReward,
          customCoins: challenge.coinReward,
        });
      }

      await participant.save();

      return res.json({
        success: true,
        message: participant.isCompleted ? 'Challenge completed!' : 'Progress updated',
        data: { participant, rewards },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ChallengeController;
