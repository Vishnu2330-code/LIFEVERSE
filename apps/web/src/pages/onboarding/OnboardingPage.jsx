import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Code, Dumbbell, BookOpen, Check, ArrowRight, Shield, Globe2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import apiClient from '../../services/api.js';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';
import Avatar3DPreview from '../../components/three/Avatar3DPreview.jsx';

export const OnboardingPage = () => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('futuristic_city');
  const [firstMissionTitle, setFirstMissionTitle] = useState('Drink 2L water & complete day 1 planning');
  const [loading, setLoading] = useState(false);
  const { updateUserProfile } = useAuthStore();
  const navigate = useNavigate();

  const interestOptions = [
    { id: 'coding', title: 'Coding & Technology', icon: Code },
    { id: 'fitness', title: 'Health & Fitness', icon: Dumbbell },
    { id: 'education', title: 'Lifelong Learning', icon: BookOpen },
    { id: 'productivity', title: 'High Productivity', icon: Sparkles },
  ];

  const goalOptions = [
    'Master Modern Full-Stack Web Development',
    'Run 5km 3 times per week',
    'Read 20 pages of a book every day',
    'Maintain a 30-day streak in meditation',
  ];

  const themeOptions = [
    { id: 'futuristic_city', name: 'Futuristic City', desc: 'Sleek neon spires & hoverways' },
    { id: 'fantasy_island', name: 'Fantasy Island', desc: 'Mystical floating runes & trees' },
    { id: 'space_colony', name: 'Space Colony', desc: 'Martian biodomes & arrays' },
  ];

  const toggleInterest = (id) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleGoal = (title) => {
    setSelectedGoals((prev) =>
      prev.includes(title) ? prev.filter((g) => g !== title) : [...prev, title]
    );
  };

  const handleNextStep = async () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Finalize onboarding in DB
      setLoading(true);
      try {
        await apiClient.post('/users/onboarding', {
          step: 7,
          interests: selectedInterests,
          initialGoals: selectedGoals,
          selectedTheme,
          isCompleted: true,
        });

        // Create the user's first real quest
        if (firstMissionTitle) {
          await apiClient.post('/quests', {
            title: firstMissionTitle,
            category: 'productivity',
            difficulty: 'easy',
          });
        }

        updateUserProfile({ onboardingCompleted: true });
        navigate('/dashboard');
      } catch (err) {
        console.error('Onboarding failed:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-10 bg-gradient-to-r from-purple-500 to-cyan-400'
                  : s < step
                  ? 'w-6 bg-purple-700'
                  : 'w-6 bg-slate-800'
              }`}
            />
          ))}
        </div>

        <GlassCard className="border-slate-800 p-8 shadow-2xl">
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Shield className="w-8 h-8 text-cyan-300 animate-pulse" />
              </div>
              <h2 className="text-3xl font-black text-white font-heading">Welcome to LIFEVERSE</h2>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                You are about to link your daily real-life activities to an evolving virtual world and RPG hero. Let's calibrate your adventure profile.
              </p>
            </div>
          )}

          {/* STEP 2: Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white font-heading">Select Your Focus Areas</h2>
                <p className="text-xs text-slate-400">Choose the domains you wish to gamify</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {interestOptions.map((opt) => {
                  const Icon = opt.icon;
                  const selected = selectedInterests.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => toggleInterest(opt.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                        selected
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                          : 'bg-[#101625] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${selected ? 'text-cyan-400' : 'text-slate-500'}`} />
                      <span className="text-sm font-semibold">{opt.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Goals */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white font-heading">Choose Your Starter Quests</h2>
                <p className="text-xs text-slate-400">Select pre-set goals to jumpstart your adventure</p>
              </div>
              <div className="space-y-3">
                {goalOptions.map((g, idx) => {
                  const selected = selectedGoals.includes(g);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleGoal(g)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-sm ${
                        selected
                          ? 'bg-cyan-500/10 border-cyan-500/60 text-white'
                          : 'bg-[#101625] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{g}</span>
                      {selected && <Check className="w-4 h-4 text-cyan-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: 3D Avatar Preview */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">Your Avatar Character</h2>
                <p className="text-xs text-slate-400">Your visual persona rendered in real-time 3D</p>
              </div>
              <Avatar3DPreview className="h-[260px]" />
              <p className="text-xs text-slate-400">
                You can customize hair, armor, and accessories in the Avatar Studio after onboarding.
              </p>
            </div>
          )}

          {/* STEP 5: Virtual World Theme */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-white font-heading">Select Your Island Theme</h2>
                <p className="text-xs text-slate-400">Your starting world biome</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themeOptions.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTheme(t.id)}
                    className={`p-4 rounded-xl border text-center cursor-pointer transition-all ${
                      selectedTheme === t.id
                        ? 'bg-gradient-to-b from-purple-500/20 to-cyan-500/10 border-cyan-400 text-white shadow-lg'
                        : 'bg-[#101625] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Globe2 className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                    <h3 className="text-sm font-bold">{t.name}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{t.desc}</p>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">First Daily Quest</label>
                <input
                  type="text"
                  value={firstMissionTitle}
                  onChange={(e) => setFirstMissionTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            {step > 1 ? (
              <Button variant="ghost" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : <div />}

            <Button
              variant="primary"
              onClick={handleNextStep}
              isLoading={loading}
              icon={ArrowRight}
            >
              {step === 5 ? 'Launch Dashboard' : 'Next Step'}
            </Button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default OnboardingPage;
