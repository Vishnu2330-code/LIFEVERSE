import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Flame, Clock, Zap, CheckCircle2 } from 'lucide-react';
import apiClient from '../services/api.js';
import { useGamificationStore } from '../store/useGamificationStore.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const FitnessPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [workoutType, setWorkoutType] = useState('strength');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [caloriesBurned, setCaloriesBurned] = useState(300);

  const { triggerRewardCelebration, fetchProfile } = useGamificationStore();

  useEffect(() => {
    loadFitnessData();
  }, []);

  const loadFitnessData = async () => {
    try {
      const [workoutsRes, statsRes] = await Promise.all([
        apiClient.get('/fitness'),
        apiClient.get('/fitness/stats'),
      ]);
      if (workoutsRes.data) setWorkouts(workoutsRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to load fitness data:', err);
    }
  };

  const handleLogWorkout = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await apiClient.post('/fitness', {
        title,
        workoutType,
        durationMinutes: parseInt(durationMinutes, 10),
        caloriesBurned: parseInt(caloriesBurned, 10),
      });

      if (res.success && res.data?.rewards) {
        triggerRewardCelebration(res.data.rewards);
        loadFitnessData();
        fetchProfile();
      }
      setIsModalOpen(false);
      setTitle('');
    } catch (err) {
      console.error('Log workout error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Fitness & Vitality</h1>
          <p className="text-xs text-slate-400 mt-1">Log your physical training to generate character power & coins</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          Log Workout
        </Button>
      </div>

      {/* Fitness Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="p-5 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Total Workouts</p>
          <p className="text-2xl font-black text-white mt-1">{stats?.totalWorkouts || 0}</p>
        </GlassCard>
        <GlassCard className="p-5 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Total Minutes Trained</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{stats?.totalMinutes || 0} mins</p>
        </GlassCard>
        <GlassCard className="p-5 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Calories Burned</p>
          <p className="text-2xl font-black text-orange-400 mt-1">{stats?.totalCalories || 0} kcal</p>
        </GlassCard>
      </div>

      {/* Workouts History List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white">Recent Workouts</h2>
        {workouts.map((w) => (
          <GlassCard key={w._id} className="p-4 flex items-center justify-between border-slate-800">
            <div className="space-y-1">
              <Badge variant="green" size="xs">{w.workoutType}</Badge>
              <h3 className="font-bold text-white text-base">{w.title}</h3>
              <p className="text-xs text-slate-400 flex items-center gap-3">
                <span>Duration: {w.durationMinutes}m</span>
                <span>•</span>
                <span>Calories: {w.caloriesBurned} kcal</span>
                <span>•</span>
                <span>{new Date(w.completedAt).toLocaleDateString()}</span>
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              +{w.xpEarned || 30} XP • +{w.coinsEarned || 15} Coins
            </span>
          </GlassCard>
        ))}
      </div>

      {/* Log Workout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card bg-[#101625] border border-slate-700/80 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Log Completed Workout</h2>
            <form onSubmit={handleLogWorkout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Chest & Triceps Strength Training"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                  >
                    <option value="strength">Strength</option>
                    <option value="cardio">Cardio / Running</option>
                    <option value="hiit">HIIT</option>
                    <option value="yoga">Yoga / Stretch</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Calories Burned</label>
                <input
                  type="number"
                  value={caloriesBurned}
                  onChange={(e) => setCaloriesBurned(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Record (+30 XP)</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FitnessPage;
