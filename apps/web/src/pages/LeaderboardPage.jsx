import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Flame, Shield, ArrowUp } from 'lucide-react';
import apiClient from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Badge from '../components/common/Badge.jsx';

export const LeaderboardPage = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await apiClient.get('/gamification/leaderboard');
      if (res.data) setLeaders(res.data);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadgeStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-900 border-amber-300 shadow-amber-500/30';
      case 2:
        return 'bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 border-slate-300 shadow-slate-400/30';
      case 3:
        return 'bg-gradient-to-tr from-amber-700 to-orange-500 text-white border-amber-600 shadow-amber-700/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      <div className="text-center space-y-2">
        <Badge variant="gold">Global Hall of Fame</Badge>
        <h1 className="text-4xl font-black text-white font-heading">Leaderboards</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Rankings calculated authoritatively by player Level, total XP, and active habit consistency.
        </p>
      </div>

      <GlassCard className="p-6 border-slate-800 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Hero</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Total XP</th>
                <th className="py-3 px-4">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {leaders.map((player) => (
                <tr key={player.userId} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4">
                    <div
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center font-bold text-xs shadow-md ${getRankBadgeStyle(
                        player.rankPosition
                      )}`}
                    >
                      {player.rankPosition <= 3 ? <Crown className="w-3.5 h-3.5" /> : player.rankPosition}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-white">
                      {player.username?.charAt(0).toUpperCase()}
                    </div>
                    <span>{player.username}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="purple" size="xs">{player.rank || 'Beginner'}</Badge>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-cyan-400">Lv {player.level}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-300">{player.totalXp?.toLocaleString()} XP</td>
                  <td className="py-3.5 px-4 text-orange-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {player.streakCount || 0}d
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default LeaderboardPage;
