import { LearningRoadmap, LearningSession } from '../models/index.js';
import { GamificationService } from '../services/gamificationService.js';

export class LearningController {
  static async getRoadmaps(req, res, next) {
    try {
      const roadmaps = await LearningRoadmap.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
      return res.json({ success: true, data: roadmaps });
    } catch (error) {
      next(error);
    }
  }

  static async getRoadmapById(req, res, next) {
    try {
      const roadmap = await LearningRoadmap.findOne({ _id: req.params.id, userId: req.user.userId });
      if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });
      return res.json({ success: true, data: roadmap });
    } catch (error) {
      next(error);
    }
  }

  static async createRoadmap(req, res, next) {
    try {
      const { title, category, description, topics } = req.body;
      if (!title) return res.status(400).json({ success: false, message: 'Title is required' });

      const parsedTopics = Array.isArray(topics)
        ? topics.map((t) => ({ title: typeof t === 'string' ? t : t.title, isCompleted: false }))
        : [];

      const roadmap = await LearningRoadmap.create({
        userId: req.user.userId,
        title,
        category: category || 'technology',
        description: description || '',
        topics: parsedTopics,
        totalTopics: parsedTopics.length,
        completedTopics: 0,
        progressPercentage: 0,
      });

      return res.status(201).json({ success: true, data: roadmap });
    } catch (error) {
      next(error);
    }
  }

  static async completeTopic(req, res, next) {
    try {
      const { id, topicIndex } = req.params;
      const roadmap = await LearningRoadmap.findOne({ _id: id, userId: req.user.userId });
      if (!roadmap) return res.status(404).json({ success: false, message: 'Roadmap not found' });

      const idx = parseInt(topicIndex, 10);
      if (isNaN(idx) || idx < 0 || idx >= roadmap.topics.length) {
        return res.status(400).json({ success: false, message: 'Invalid topic index' });
      }

      const topic = roadmap.topics[idx];
      if (topic.isCompleted) {
        return res.status(400).json({ success: false, message: 'Topic already marked completed' });
      }

      topic.isCompleted = true;
      topic.completedAt = new Date();

      roadmap.completedTopics = roadmap.topics.filter((t) => t.isCompleted).length;
      roadmap.progressPercentage = Math.round((roadmap.completedTopics / roadmap.totalTopics) * 100);

      const rewardResult = await GamificationService.processReward({
        userId: req.user.userId,
        source: 'learning_session',
        activityId: `${roadmap._id}_topic_${idx}`,
        referenceEventId: `learning_topic_${roadmap._id}_${idx}`,
      });

      await roadmap.save();

      return res.json({
        success: true,
        message: 'Topic completed!',
        data: { roadmap, rewards: rewardResult },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logSession(req, res, next) {
    try {
      const { roadmapId, topic, durationMinutes, notes } = req.body;
      if (!topic || !durationMinutes) {
        return res.status(400).json({ success: false, message: 'Topic and duration are required' });
      }

      const session = await LearningSession.create({
        roadmapId: roadmapId || null,
        userId: req.user.userId,
        topic,
        durationMinutes: parseInt(durationMinutes, 10),
        notes: notes || '',
      });

      const rewardResult = await GamificationService.processReward({
        userId: req.user.userId,
        source: 'learning_session',
        activityId: session._id.toString(),
        referenceEventId: `learn_session_${session._id}`,
      });

      return res.status(201).json({
        success: true,
        message: 'Learning session logged!',
        data: { session, rewards: rewardResult },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default LearningController;
