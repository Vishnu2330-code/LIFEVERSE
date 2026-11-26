import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Flame,
  Coins,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
  Globe2,
  Users,
  Target,
  Plus,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import { useGamificationStore } from '../store/useGamificationStore.js';
import apiClient from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';
import Avatar3DPreview from '../components/three/Avatar3DPreview.jsx';

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { profile, fetchProfile, triggerRewardCelebration } = useGamificationStore();

  const [quests, setQuests] = useState([]);
  const [habits, setHabits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [questsRes, habitsRes, goalsRes, statsRes] = await Promise.all([
        apiClient.get('/quests?status=pending&limit=5'),
        apiClient.get('/habits'),
        apiClient.get('/goals'),
        apiClient.get('/analytics/dashboard'),
      ]);

      if (questsRes.data) setQuests(questsRes.data);
      if (habitsRes.data) setHabits(habitsRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteQuest = async (questId) => {
    try {
      const res = await apiClient.post(`/quests/${questId}/complete`);
      if (res.success && res.data?.rewards) {
        triggerRewardCelebration(res.data.rewards);
        // Refresh quests & profile
        loadDashboardData();
        fetchProfile();
      }
    } catch (err) {
      console.error('Failed to complete quest:', err);
    }
  };

  const handleHabitCheckIn = async (habitId) => {
    try {
      const res = await apiClient.post(`/habits/${habitId}/check-in`);
      if (res.success && res.data?.rewards) {
        triggerRewardCelebration(res.data.rewards);
        loadDashboardData();
        fetchProfile();
      }
    } catch (err) {
      console.error('Failed to check in habit:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
      {/* Hero Player Progress Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Player Profile & Level */}
        <GlassCard className="lg:col-span-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-r from-[#171E30] via-[#101625] to-[#171E30] border-purple-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/30">
                <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center font-black text-2xl text-cyan-300">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-white font-heading">{user?.username}</h1>
                  <Badge variant="purple" size="sm">
                    {profile?.rank || 'Beginner'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adventurer since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-sm">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{profile?.coins ?? 50} Coins</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-sm">
                <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
                <span>{profile?.streakCount ?? 0} Day Streak</span>
              </div>
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-cyan-400">Level {profile?.level || 1}</span>
              <span className="text-slate-400">
                {profile?.currentLevelXp || 0} / {profile?.xpRequiredForNext || 100} XP ({profile?.progressPercentage || 0}%)
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-3.5 p-0.5 border border-slate-700/60 shadow-inner overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 h-full rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(139,92,246,0.6)]"
                style={{ width: `${profile?.progressPercentage || 0}%` }}
              />
            </div>
          </div>
        </GlassCard>

        {/* Right: Quick 3D Avatar Mini Preview */}
        <GlassCard className="lg:col-span-4 flex flex-col items-center justify-between p-4 relative group border-slate-800">
          <div className="w-full flex items-center justify-between text-xs font-bold text-slate-300 px-2">
            <span className="flex items-center gap-1.5 text-purple-300">
              <Sparkles className="w-3.5 h-3.5" /> Character
            </span>
            <Link to="/avatar" className="text-cyan-400 hover:text-cyan-300">
              Customize &rarr;
            </Link>
          </div>
          <Avatar3DPreview className="h-[180px] w-full" />
        </GlassCard>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Quests Completed Today</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.todayCompletedQuests || 0}</p>
        </GlassCard>
        <GlassCard className="p-4 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Active Quests</p>
          <p className="text-2xl font-black text-purple-400 mt-1">{stats?.pendingQuestsCount || 0}</p>
        </GlassCard>
        <GlassCard className="p-4 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Active Habits</p>
          <p className="text-2xl font-black text-cyan-400 mt-1">{stats?.activeHabitsCount || 0}</p>
        </GlassCard>
        <GlassCard className="p-4 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">World Island Structures</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{stats?.worldBuildingsCount || 1}</p>
        </GlassCard>
      </div>

      {/* Main Content Grid: Quests & Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Active Daily Quests */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" /> Active Quests
            </h2>
            <Link to="/quests">
              <Button size="sm" variant="ghost" icon={Plus}>
                New Quest
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {quests.length === 0 ? (
              <GlassCard className="text-center py-10 border-dashed border-slate-800">
                <p className="text-sm text-slate-400 mb-4">No active quests right now. Start an adventure!</p>
                <Link to="/quests">
                  <Button size="sm" variant="primary">
                    Create Your First Quest
                  </Button>
                </Link>
              </GlassCard>
            ) : (
              quests.map((q) => (
                <GlassCard key={q._id} hoverEffect className="p-4 flex items-center justify-between gap-4 border-slate-800/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={q.difficulty === 'hard' ? 'red' : 'green'} size="xs">
                        {q.difficulty}
                      </Badge>
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{q.category}</span>
                    </div>
                    <p className="font-bold text-sm text-white">{q.title}</p>
                    {q.estimatedDuration && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {q.estimatedDuration} mins
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="cyan"
                    onClick={() => handleCompleteQuest(q._id)}
                    icon={CheckCircle2}
                  >
                    Complete
                  </Button>
                </GlassCard>
              ))
            )}
          </div>
        </div>

        {/* Right 5 cols: Daily Habits Check-In */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" /> Daily Habits
            </h2>
            <Link to="/habits" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {habits.length === 0 ? (
              <GlassCard className="text-center py-8 border-dashed border-slate-800">
                <p className="text-xs text-slate-400 mb-3">No habits tracked yet.</p>
                <Link to="/habits">
                  <Button size="sm" variant="secondary">
                    Create Habit
                  </Button>
                </Link>
              </GlassCard>
            ) : (
              habits.slice(0, 4).map((h) => (
                <GlassCard key={h._id} className="p-3.5 flex items-center justify-between border-slate-800">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-white">{h.title}</p>
                    <p className="text-xs text-orange-400 font-semibold flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {h.currentStreak || 0} day streak
                    </p>
                  </div>
                  {h.isCheckedInToday ? (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      Done Today
                    </span>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => handleHabitCheckIn(h._id)}>
                      Check In
                    </Button>
                  )}
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Virtual World & Goals Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <GlassCard className="flex items-center justify-between p-6 border-purple-500/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Globe2 className="w-4 h-4" /> Virtual World
            </div>
            <h3 className="text-xl font-extrabold text-white">Your Floating Island</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Place new learning libraries, arena domes, and spires as you achieve your real-life targets.
            </p>
            <div className="pt-2">
              <Link to="/world">
                <Button size="sm" variant="cyan" icon={ArrowRight}>
                  Enter World Builder
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex items-center justify-between p-6 border-cyan-500/20">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
              <Target className="w-4 h-4" /> Personal Goals
            </div>
            <h3 className="text-xl font-extrabold text-white">Milestones & Vision</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Link daily quests directly to high-impact career, health, and skill roadmaps.
            </p>
            <div className="pt-2">
              <Link to="/goals">
                <Button size="sm" variant="primary" icon={ArrowRight}>
                  Manage Goals
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DashboardPage;
