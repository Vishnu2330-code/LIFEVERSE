import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle2,
  Trophy,
  Flame,
  Globe2,
  Smartphone,
  ChevronDown,
  Layers,
  Compass,
  Swords,
  Crown,
} from 'lucide-react';
import PortalCanvas from '../components/three/PortalCanvas.jsx';
import Button from '../components/common/Button.jsx';
import GlassCard from '../components/common/GlassCard.jsx';
import Badge from '../components/common/Badge.jsx';

gsap.registerPlugin(ScrollTrigger);

export const LandingPage = () => {
  const containerRef = useRef();
  const heroRef = useRef();
  const missionRef = useRef();
  const ranksRef = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.from('.hero-anim', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      });

      // Mission cards reveal
      gsap.from('.mission-card', {
        scrollTrigger: {
          trigger: missionRef.current,
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
      });

      // Rank cards stagger
      gsap.from('.rank-card', {
        scrollTrigger: {
          trigger: ranksRef.current,
          start: 'top 80%',
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.5)',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const ranks = [
    { name: 'Beginner', levels: 'Lv 1–5', color: '#94A3B8', icon: Compass, perk: 'Starter Gear & Home Isle' },
    { name: 'Explorer', levels: 'Lv 6–15', color: '#38BDF8', icon: Shield, perk: 'Blueprint Unlocks & Market Access' },
    { name: 'Warrior', levels: 'Lv 16–30', color: '#8B5CF6', icon: Swords, perk: 'Community Raids & Custom Shaders' },
    { name: 'Master', levels: 'Lv 31–50', color: '#EC4899', icon: Trophy, perk: 'Island Spire Construction' },
    { name: 'Legend', levels: 'Lv 51+', color: '#FBBF24', icon: Crown, perk: 'Celestial Halo & Global Hall of Fame' },
  ];

  const missionTypes = [
    { title: 'Code AI Backend Service', category: 'Learning', difficulty: 'Hard', xp: '+50 XP', coins: '+20 Coins', icon: Zap },
    { title: '45-Min High-Intensity Workout', category: 'Fitness', difficulty: 'Hard', xp: '+50 XP', coins: '+20 Coins', icon: Flame },
    { title: 'Drink 2.5L Water Habit', category: 'Health', difficulty: 'Easy', xp: '+10 XP', coins: '+5 Coins', icon: CheckCircle2 },
    { title: 'Deliver Q4 Product Roadmap', category: 'Productivity', difficulty: 'Medium', xp: '+25 XP', coins: '+10 Coins', icon: Layers },
  ];

  const features = [
    { title: 'Quest & Kanban System', desc: 'Break down life goals into daily quests, Kanban boards, and checklists with instant XP gratification.', icon: Layers },
    { title: 'Timezone-Aware Habits', desc: 'Build streaks that adapt to your personal calendar without punishing you for healthy rest days.', icon: Flame },
    { title: '3D Island Builder', desc: 'Every real-world achievement places libraries, fitness domes, and spires in your personal metaverse.', icon: Globe2 },
    { title: 'Server-Authoritative Economy', desc: 'Virtual coins and cryptographic level validation prevent exploits and safeguard progression.', icon: Shield },
    { title: 'Community & Challenges', desc: 'Join global 7-day productivity sprints, compare on leaderboards, and share milestones with friends.', icon: Trophy },
    { title: 'Web & Android Sync', desc: 'Seamless real-time state synchronization powered by WebSockets and native offline resilience.', icon: Smartphone },
  ];

  return (
    <div ref={containerRef} className="relative bg-[#080B14] overflow-hidden text-slate-100">
      {/* Background ambient lighting glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-[1200px] right-0 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] pointer-events-none rounded-full" />

      {/* SECTION 1 — Hero */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="hero-anim inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
              <span>Next-Gen Gamified Productivity</span>
            </div>

            <h1 className="hero-anim text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] font-heading">
              Your Life.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-300 to-indigo-300">
                Your Game.
              </span>{' '}
              Your Universe.
            </h1>

            <p className="hero-anim text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
              Transform everyday tasks, habits, fitness routines, and learning milestones into an immersive RPG adventure. Level up your character, build your 3D world, and compete globally.
            </p>

            <div className="hero-anim flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Link to="/register">
                <Button size="xl" variant="primary" icon={ArrowRight} className="w-full sm:w-auto shadow-purple-500/30">
                  Start Your Adventure
                </Button>
              </Link>
              <Link to="/explore">
                <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                  Explore LIFEVERSE
                </Button>
              </Link>
            </div>

            <div className="hero-anim pt-8 flex items-center justify-center lg:justify-start gap-8 border-t border-slate-800/80">
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-slate-400">Server-Authoritative</p>
              </div>
              <div>
                <p className="text-2xl font-black text-cyan-400">Web & Android</p>
                <p className="text-xs text-slate-400">Unified Cloud Sync</p>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-400">Zero Lootboxes</p>
                <p className="text-xs text-slate-400">Earned Rewards Only</p>
              </div>
            </div>
          </div>

          {/* 3D Portal Canvas */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <PortalCanvas className="w-full h-[450px] lg:h-[550px]" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-500 animate-bounce">
          <span className="text-[11px] font-medium tracking-widest uppercase">Scroll to Enter</span>
          <ChevronDown className="w-4 h-4" />
        </div>
      </section>

      {/* SECTION 2 — Enter the Universe */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/60 bg-gradient-to-b from-[#080B14] via-[#101625] to-[#080B14]">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <Badge variant="cyan">Enter the Universe</Badge>
          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white">
            Real Actions. Virtual Power.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Step through the portal where your daily commitments yield tangible progression. Every rep in the gym, every code review completed, and every habit streak adds power to your avatar.
          </p>
        </div>
      </section>

      {/* SECTION 3 — Complete Real-Life Missions */}
      <section ref={missionRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="purple">Interactive Quest Engine</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Complete Real-Life Quests</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Tasks aren't boring to-do items. They're legendary contracts that bestow XP and coins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionTypes.map((m, idx) => {
              const Icon = m.icon;
              return (
                <GlassCard key={idx} hoverEffect className="mission-card relative group border-slate-800/80">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={m.difficulty === 'Hard' ? 'red' : 'green'}>{m.difficulty}</Badge>
                    <span className="text-xs text-slate-400 font-semibold">{m.category}</span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-2 group-hover:text-purple-300 transition-colors">
                    {m.title}
                  </h3>
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800 text-xs font-bold">
                    <span className="text-emerald-400">{m.xp}</span>
                    <span className="text-amber-400">{m.coins}</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4 — Character Evolution */}
      <section ref={ranksRef} className="py-24 px-4 sm:px-6 lg:px-8 bg-[#101625]/60 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="gold">Rank Progression</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-heading">The 5 Tiers of Ascension</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Your dedication determines your title. Start as a Beginner and ascend to Legend.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {ranks.map((r, idx) => {
              const Icon = r.icon;
              return (
                <div
                  key={idx}
                  className="rank-card glass-card rounded-2xl p-6 text-center space-y-4 relative border-slate-800 hover:border-slate-700 transition-all"
                  style={{ borderColor: `${r.color}33` }}
                >
                  <div
                    className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: `${r.color}15`, color: r.color }}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-white" style={{ color: r.color }}>
                      {r.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">{r.levels}</p>
                  </div>
                  <p className="text-xs text-slate-300 pt-2 border-t border-slate-800/80">{r.perk}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Build Your World */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="cyan">3D Virtual World</Badge>
            <h2 className="text-3xl sm:text-5xl font-black text-white font-heading leading-tight">
              A Personal World Constructed by Your Habits.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Every completed goal manifests as a living structure on your private floating island. Construct libraries when you study, arenas when you work out, and monuments to your milestones.
            </p>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Grid-based building placement with collision physics</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Upgradeable structures that increase in visual stature</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Multiple aesthetic biomes: Futuristic City, Cyberpunk, Space Colony</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/explore">
                <Button variant="cyan" size="lg">
                  Preview 3D Worlds
                </Button>
              </Link>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.15)] flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
              <Globe2 className="w-10 h-10 animate-spin-slow" />
            </div>
            <h3 className="text-2xl font-bold text-white">Full 3D Terrain Engine</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Rendering via Three.js with OrbitControls, directional lighting, and instant isometric sync with the Android mobile application.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 6 — Explore Application Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#101625]/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="purple">Full Feature Suite</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered For Everyday Life</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <GlassCard key={i} hoverEffect className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7 & 8 — Web & Mobile Experience */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <Badge variant="green">Cross-Platform Sync</Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-heading">
            Desktop Power. Mobile Velocity.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Start a learning quest on your computer, check in to a hydration habit on your Android phone while on the run, and view your synchronized 3D world on either screen.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#171E30] border border-slate-700/60 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-sm font-semibold">Web: React 18 + Vite + Three.js</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#171E30] border border-slate-700/60 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
              <span className="text-sm font-semibold">Android: React Native + Expo</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#171E30] border border-slate-700/60 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
              <span className="text-sm font-semibold">Shared Backend: Node + Mongo</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — Final Call to Action */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-[#101625] to-[#080B14] border-t border-slate-800 text-center relative">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl sm:text-6xl font-black text-white font-heading">
            Your next adventure starts today.
          </h2>
          <p className="text-slate-400 text-lg">
            Join thousands turning real-life tasks into character growth and virtual territory.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="xl" variant="primary" icon={ArrowRight} className="w-full sm:w-auto">
                Create Free Account
              </Button>
            </Link>
            <Link to="/login">
              <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                Player Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
