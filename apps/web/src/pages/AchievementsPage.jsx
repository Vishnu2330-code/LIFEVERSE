import React, { useState, useEffect } from 'react';
import { Award, Trophy, Check, Lock, Sparkles, Flame } from 'lucide-react';
import apiClient from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Badge from '../components/common/Badge.jsx';

export const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      // Fetch user profile and unlocked achievements
      const [profileRes, achRes] = await Promise.all([
        apiClient.get('/gamification/profile'),
        apiClient.get('/auth/me'),
      ]);

      // Demo/Initial achievements showcase
      const defaultAchievements = [
        {
          key: 'first_quest',
          title: 'First Step',
          description: 'Complete your first real-life quest.',
          category: 'productivity',
          xpReward: 50,
          coinReward: 25,
          isUnlocked: (profileRes.data?.totalQuestsCompleted || 0) >= 1,
        },
        {
          key: 'quest_master_10',
          title: 'Task Conqueror',
          description: 'Complete 10 quests.',
          category: 'productivity',
          xpReward: 100,
          coinReward: 50,
          isUnlocked: (profileRes.data?.totalQuestsCompleted || 0) >= 10,
        },
        {
          key: 'habit_streak_7',
          title: 'Consistency King',
          description: 'Maintain a 7-day habit streak.',
          category: 'habits',
          xpReward: 150,
          coinReward: 75,
          isUnlocked: (profileRes.data?.streakCount || 0) >= 7,
        },
        {
          key: 'level_5_explorer',
          title: 'Rising Explorer',
          description: 'Reach Level 5 and advance to the Explorer rank.',
          category: 'productivity',
          xpReward: 200,
          coinReward: 100,
          isUnlocked: (profileRes.data?.level || 1) >= 5,
        },
        {
          key: 'fitness_starter',
          title: 'Iron Will',
          description: 'Log 5 workout sessions.',
          category: 'fitness',
          xpReward: 100,
          coinReward: 50,
          isUnlocked: (profileRes.data?.totalWorkoutsCompleted || 0) >= 5,
        },
      ];

      setAchievements(defaultAchievements);
    } catch (err) {
      console.error('Failed to load achievements:', err);
    }
  };

  const filtered = filterCategory === 'all'
    ? achievements
    : achievements.filter((a) => a.category === filterCategory);

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div>
        <h1 className="text-3xl font-black text-white font-heading">Achievements & Medals</h1>
        <p className="text-xs text-slate-400 mt-1">Unlock historic badges and earn one-time reward bonuses</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((ach) => (
          <GlassCard
            key={ach.key}
            className={`p-6 border flex flex-col justify-between ${
              ach.isUnlocked
                ? 'border-amber-400/40 bg-gradient-to-b from-amber-500/10 to-transparent'
                : 'border-slate-800 opacity-60'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={ach.isUnlocked ? 'gold' : 'slate'} size="xs">
                  {ach.category}
                </Badge>
                {ach.isUnlocked ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                  ach.isUnlocked
                    ? 'bg-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/30'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                <Award className="w-7 h-7" />
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{ach.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{ach.description}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold">
              <span className="text-emerald-400">+{ach.xpReward} XP</span>
              <span className="text-amber-400">+{ach.coinReward} Coins</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default AchievementsPage;
