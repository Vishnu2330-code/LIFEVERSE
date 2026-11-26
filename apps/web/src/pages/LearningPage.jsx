import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import apiClient from '../services/api.js';
import { useGamificationStore } from '../store/useGamificationStore.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const LearningPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [topicsInput, setTopicsInput] = useState('RESTful API Design, JWT Session Rotation, MongoDB Aggregation, WebSockets');
  const { triggerRewardCelebration, fetchProfile } = useGamificationStore();

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      const res = await apiClient.get('/learning');
      if (res.data) setRoadmaps(res.data);
    } catch (err) {
      console.error('Failed to load roadmaps:', err);
    }
  };

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const topics = topicsInput.split(',').map((s) => s.trim()).filter(Boolean);
      await apiClient.post('/learning', {
        title,
        category: 'technology',
        topics,
      });

      setIsModalOpen(false);
      setTitle('');
      loadRoadmaps();
    } catch (err) {
      console.error('Create roadmap error:', err);
    }
  };

  const handleCompleteTopic = async (roadmapId, topicIndex) => {
    try {
      const res = await apiClient.post(`/learning/${roadmapId}/topics/${topicIndex}/complete`);
      if (res.success && res.data?.rewards) {
        triggerRewardCelebration(res.data.rewards);
        loadRoadmaps();
        fetchProfile();
      }
    } catch (err) {
      console.error('Topic complete error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Skill Roadmaps</h1>
          <p className="text-xs text-slate-400 mt-1">Master structured knowledge trees and boost your mental stats</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Roadmap
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roadmaps.map((r) => (
          <GlassCard key={r._id} className="p-6 space-y-4 border-slate-800">
            <div className="flex items-center justify-between">
              <Badge variant="cyan" size="xs">{r.category}</Badge>
              <span className="text-xs font-semibold text-slate-400">
                {r.completedTopics || 0} / {r.totalTopics || 0} Topics
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{r.title}</h3>

            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
              <div
                className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${r.progressPercentage || 0}%` }}
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              {r.topics?.map((topic, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    topic.isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through'
                      : 'bg-[#101625] border-slate-800 text-slate-300'
                  }`}
                >
                  <span>{topic.title}</span>
                  {topic.isCompleted ? (
                    <span className="font-bold text-[11px] text-emerald-400">Mastered</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCompleteTopic(r._id, idx)}
                    >
                      Complete (+25 XP)
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Create Roadmap Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card bg-[#101625] border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Create Learning Roadmap</h2>
            <form onSubmit={handleCreateRoadmap} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Roadmap Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full-Stack MERN Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Topics (Comma-separated)</label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={(e) => setTopicsInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Launch Roadmap</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPage;
