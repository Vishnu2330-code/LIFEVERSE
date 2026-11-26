import React, { useState, useEffect } from 'react';
import { Trophy, Users, Clock, ArrowRight, Zap } from 'lucide-react';
import apiClient from '../../services/api.js';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';

export const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    // Initial public challenge fixture or fetch
    setChallenges([
      {
        id: '1',
        title: 'Global 7-Day Productivity Sprint',
        category: 'productivity',
        description: 'Complete at least 5 quests over the next 7 days with the global LIFEVERSE community.',
        xpReward: 200,
        coinReward: 100,
        participants: 1420,
        status: 'active',
      },
      {
        id: '2',
        title: 'Morning Momentum 14-Day Streak',
        category: 'habits',
        description: 'Check in to a morning routine habit before 9 AM for 14 consecutive days.',
        xpReward: 350,
        coinReward: 175,
        participants: 890,
        status: 'active',
      },
      {
        id: '3',
        title: 'Century Workout Challenge',
        category: 'fitness',
        description: 'Log 100 total minutes of fitness activities across strength, cardio, and mobility.',
        xpReward: 300,
        coinReward: 150,
        participants: 640,
        status: 'active',
      },
    ]);
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <Badge variant="gold">Community Raids</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          Community Challenges
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Join forces with thousands of high achievers around the globe to earn bonus XP and rare blueprints.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenges.map((c) => (
          <GlassCard key={c.id} hoverEffect className="p-6 flex flex-col justify-between border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="purple" size="xs">{c.category}</Badge>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {c.participants} Heroes
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{c.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400">
                +{c.xpReward} XP • +{c.coinReward} Coins
              </span>
              <Button size="sm" variant="cyan" icon={Zap}>
                Join Challenge
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default ChallengesPage;
