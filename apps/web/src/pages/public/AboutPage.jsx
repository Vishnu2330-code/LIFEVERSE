import React from 'react';
import { Shield, Sparkles, Heart, Smartphone } from 'lucide-react';
import GlassCard from '../../components/common/GlassCard.jsx';
import Badge from '../../components/common/Badge.jsx';

export const AboutPage = () => {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-4">
        <Badge variant="purple">Our Philosophy</Badge>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-heading">
          Turn Your Real Life Into an Adventure
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          LIFEVERSE was born out of a single observation: the human brain is wired to love progression, clear objectives, and tangible rewards, yet traditional productivity tools feel like lifeless spreadsheets.
        </p>
      </div>

      <GlassCard className="p-8 space-y-6 border-slate-800">
        <h2 className="text-2xl font-bold text-white font-heading">Our Core Pillars</h2>
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            <strong className="text-purple-300">1. Server-Authoritative Integrity:</strong> Virtual achievements only matter when they are real. We ensure all XP calculations, level advancements, and coin transactions are verified on the server.
          </p>
          <p>
            <strong className="text-cyan-300">2. Respect For Well-being:</strong> Habits are built through compassion, not punishment. Our streak system supports rest days and timezone adaptability.
          </p>
          <p>
            <strong className="text-amber-300">3. Zero Gambling, Pure Achievement:</strong> There are no paid loot boxes or gambling mechanics in LIFEVERSE. Every coin is earned through personal growth.
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default AboutPage;
