import React from 'react';
import { Zap, Shield, Sparkles, Flame, Target, Dumbbell, Globe2, Trophy } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard.jsx';
import Badge from '../../components/common/Badge.jsx';

export const FeaturesPage = () => {
  const features = [
    { title: 'Server-Authoritative Gamification', desc: 'No client-side cheat exploits. Level formulas, coin balance deductions, and streak evaluations execute securely on Node.js & MongoDB.', icon: Shield },
    { title: 'Interactive 3D Avatar Studio', desc: 'Fully realized 3D character preview powered by Three.js and React Three Fiber, customizable with armor, cyber hair, and visual wings.', icon: Sparkles },
    { title: '3D Island Metaverse', desc: 'Construct your floating island tile by tile with collision validation, building upgrades, and isometric mobile sync.', icon: Globe2 },
    { title: 'Timezone-Aware Habit Streaks', desc: 'Maintain daily consistency evaluated against your local calendar date, with gentle recovery logic rather than punishing resets.', icon: Flame },
    { title: 'Milestone Goal Architect', desc: 'Link daily micro-quests directly to overarching career and personal visions to ensure consistent progress.', icon: Target },
    { title: 'Vitality & Workout Tracker', desc: 'Log weight training, cardio, and yoga sessions to earn physical vitality XP and virtual coins.', icon: Dumbbell },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4">
        <Badge variant="cyan">Platform Architecture</Badge>
        <h1 className="text-4xl sm:text-6xl font-black text-white font-heading">
          Engineered for Real-Life Victory
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base">
          LIFEVERSE merges cinematic game mechanics with proven behavioral psychology.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <GlassCard key={i} hoverEffect className="p-6 space-y-4 border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesPage;
