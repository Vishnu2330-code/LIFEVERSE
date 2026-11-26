import React, { useState, useEffect } from 'react';
import { Flame, Plus, Check, Calendar, AlertCircle } from 'lucide-react';
import apiClient from '../services/api.js';
import { useGamificationStore } from '../store/useGamificationStore.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [history, setHistory] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('health');
  const [loading, setLoading] = useState(false);
  const { triggerRewardCelebration, fetchProfile } = useGamificationStore();

  useEffect(() => {
    loadHabitsData();
  }, []);

  const loadHabitsData = async () => {
    try {
      setLoading(true);
      const [habitsRes, historyRes] = await Promise.all([
        apiClient.get('/habits'),
        apiClient.get('/habits/history'),
      ]);
      if (habitsRes.data) setHabits(habitsRes.data);
      if (historyRes.data) setHistory(historyRes.data);
    } catch (err) {
      console.error('Failed to load habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (id) => {
    try {
      const res = await apiClient.post(`/habits/${id}/check-in`);
      if (res.success && res.data?.rewards) {
        triggerRewardCelebration(res.data.rewards);
        loadHabitsData();
        fetchProfile();
      }
    } catch (err) {
      console.error('Check-in error:', err);
    }
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await apiClient.post('/habits', {
        title,
        category,
        frequency: 'daily',
      });
      setIsModalOpen(false);
      setTitle('');
      loadHabitsData();
    } catch (err) {
      console.error('Create habit error:', err);
    }
  };

  // Generate 28-day activity heatmap
  const checkInDatesSet = new Set(history.map((h) => h.checkInDateStr));
  const pastDays = Array.from({ length: 28 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const str = d.toISOString().split('T')[0];
    return {
      dateStr: str,
      hasCheckedIn: checkInDatesSet.has(str),
    };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Habit Tracker</h1>
          <p className="text-xs text-slate-400 mt-1">Cultivate unbreakable streaks with timezone-aware validation</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Habit
        </Button>
      </div>

      {/* 28-Day Consistency Heatmap */}
      <GlassCard className="p-6 border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> 28-Day Habit Consistency Heatmap
          </span>
          <span className="text-xs text-slate-400">Total Check-Ins: {history.length}</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5 pt-2">
          {pastDays.map((day, i) => (
            <div
              key={i}
              title={`${day.dateStr}: ${day.hasCheckedIn ? 'Checked in' : 'No check-in'}`}
              className={`h-8 rounded-lg transition-all ${
                day.hasCheckedIn
                  ? 'bg-gradient-to-t from-emerald-600 to-cyan-400 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800/60'
              }`}
            />
          ))}
        </div>
      </GlassCard>

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => (
          <GlassCard key={habit._id} hoverEffect className="p-5 flex items-center justify-between border-slate-800">
            <div className="space-y-1">
              <Badge variant="purple" size="xs">{habit.category}</Badge>
              <h3 className="text-base font-bold text-white">{habit.title}</h3>
              <p className="text-xs font-semibold text-orange-400 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {habit.currentStreak || 0} Day Streak (Best: {habit.bestStreak || 0})
              </p>
            </div>

            {habit.isCheckedInToday ? (
              <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Checked In
              </span>
            ) : (
              <Button size="md" variant="cyan" onClick={() => handleCheckIn(habit._id)}>
                Check In (+10 XP)
              </Button>
            )}
          </GlassCard>
        ))}
      </div>

      {/* Create Habit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card bg-[#101625] border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Create Positive Habit</h2>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Read 20 mins every morning"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                >
                  <option value="health">Health & Vitality</option>
                  <option value="productivity">Productivity</option>
                  <option value="learning">Learning</option>
                  <option value="fitness">Fitness</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Establish Habit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsPage;
