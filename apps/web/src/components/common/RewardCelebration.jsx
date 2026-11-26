import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Award } from 'lucide-react';
import { useGamificationStore } from '../../store/useGamificationStore.js';

export const RewardCelebration = () => {
  const { recentReward, levelUpModal, achievementModal, closeLevelUpModal, closeAchievementModal } =
    useGamificationStore();

  useEffect(() => {
    if (levelUpModal || achievementModal) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#22D3EE', '#FBBF24', '#22C55E'],
      });
    }
  }, [levelUpModal, achievementModal]);

  return (
    <>
      {/* Mini Toast for Quest / Habit Completion */}
      {recentReward && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="glass-card bg-[#101625]/95 border-purple-500/40 rounded-2xl p-4 shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Reward Earned</p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-sm font-bold text-emerald-400">+{recentReward.xpAwarded} XP</span>
                <span className="text-sm font-bold text-amber-400">+{recentReward.coinsAwarded} Coins</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Modal */}
      {levelUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card bg-gradient-to-b from-[#171E30] to-[#080B14] border-2 border-purple-500/60 rounded-3xl max-w-md w-full p-8 text-center shadow-[0_0_50px_rgba(139,92,246,0.4)]">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-purple-500/50 mb-6">
              <Trophy className="w-10 h-10 animate-pulse" />
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-amber-300">
              LEVEL UP!
            </h2>
            <p className="text-5xl font-black text-white mt-2 mb-1">Level {levelUpModal.level}</p>
            <p className="text-lg font-semibold text-cyan-300">Rank: {levelUpModal.rank}</p>
            <p className="text-sm text-slate-400 mt-4">
              Your dedication paid off. You've unlocked new abilities and territory on your island.
            </p>
            <button
              onClick={closeLevelUpModal}
              className="mt-8 w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 transition-all"
            >
              Claim & Continue
            </button>
          </div>
        </div>
      )}

      {/* Achievement Unlocked Modal */}
      {achievementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-card bg-gradient-to-b from-[#171E30] to-[#080B14] border-2 border-amber-400/60 rounded-3xl max-w-md w-full p-8 text-center shadow-[0_0_50px_rgba(251,191,36,0.3)]">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/50 mb-6">
              <Award className="w-10 h-10 animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-amber-300">ACHIEVEMENT UNLOCKED</h2>
            <p className="text-2xl font-bold text-white mt-2">{achievementModal.title}</p>
            <p className="text-sm text-slate-300 mt-2">{achievementModal.description}</p>
            <div className="flex items-center justify-center gap-4 mt-4 py-2 px-4 bg-amber-500/10 border border-amber-500/20 rounded-xl w-fit mx-auto">
              <span className="text-sm font-bold text-emerald-400">+{achievementModal.xpReward} XP</span>
              <span className="text-sm font-bold text-amber-400">+{achievementModal.coinReward} Coins</span>
            </div>
            <button
              onClick={closeAchievementModal}
              className="mt-8 w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/30 transition-all"
            >
              Collect Honor
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default RewardCelebration;
