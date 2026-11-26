import React, { useState, useEffect } from 'react';
import { Target, Plus, CheckCircle2, Calendar, Award } from 'lucide-react';
import apiClient from '../services/api.js';
import { useGamificationStore } from '../store/useGamificationStore.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('career');
  const [targetDate, setTargetDate] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('Phase 1 Architecture, Phase 2 Beta Launch, Phase 3 Scale');
  const { triggerRewardCelebration, fetchProfile } = useGamificationStore();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const res = await apiClient.get('/goals');
      if (res.data) setGoals(res.data);
    } catch (err) {
      console.error('Failed to load goals:', err);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    try {
      const milestones = milestonesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((t) => ({ title: t, targetValue: 1 }));

      await apiClient.post('/goals', {
        title,
        category,
        targetDate: new Date(targetDate),
        milestones,
      });

      setIsModalOpen(false);
      setTitle('');
      setTargetDate('');
      loadGoals();
    } catch (err) {
      console.error('Create goal error:', err);
    }
  };

  const handleCompleteMilestone = async (goalId, milestoneIndex) => {
    try {
      const res = await apiClient.post(`/goals/${goalId}/milestones/${milestoneIndex}/complete`);
      if (res.success && res.data?.rewards) {
        triggerRewardCelebration(res.data.rewards);
        loadGoals();
        fetchProfile();
      }
    } catch (err) {
      console.error('Milestone complete error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Goal Milestones</h1>
          <p className="text-xs text-slate-400 mt-1">Transform high-level aspirations into structured milestone victories</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <GlassCard key={goal._id} className="p-6 space-y-4 border-slate-800">
            <div className="flex items-center justify-between">
              <Badge variant="purple" size="xs">{goal.category}</Badge>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Target: {new Date(goal.targetDate).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white">{goal.title}</h3>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Milestone Progress</span>
                <span className="text-cyan-400 font-bold">{goal.progressPercentage || 0}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700/60">
                <div
                  className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${goal.progressPercentage || 0}%` }}
                />
              </div>
            </div>

            {/* Milestones Checklist */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Milestones</p>
              {goal.milestones?.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                    m.isCompleted
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 line-through'
                      : 'bg-[#101625] border-slate-800 text-slate-200'
                  }`}
                >
                  <span>{m.title}</span>
                  {m.isCompleted ? (
                    <span className="font-bold text-[11px] text-emerald-400">Unlocked</span>
                  ) : (
                    <Button
                      size="sm"
                      variant="cyan"
                      onClick={() => handleCompleteMilestone(goal._id, idx)}
                    >
                      Achieve (+50 XP)
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Create Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card bg-[#101625] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Establish Long-Term Goal</h2>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Full-Stack MERN Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                  >
                    <option value="career">Career</option>
                    <option value="fitness">Fitness</option>
                    <option value="education">Education</option>
                    <option value="creativity">Creativity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Milestones (Comma-separated)</label>
                <input
                  type="text"
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
                  placeholder="Phase 1, Phase 2, Phase 3"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Create Goal</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
