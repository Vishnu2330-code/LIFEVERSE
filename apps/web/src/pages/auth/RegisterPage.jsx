import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';

export const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      await register({
        username,
        email,
        password,
        timezone: detectedTimezone,
      });
      navigate('/onboarding');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Username or email may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/25">
            <div className="w-full h-full bg-[#080B14] rounded-[14px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-heading">Forge Your Character</h2>
          <p className="text-sm text-slate-400">Join LIFEVERSE and turn everyday productivity into an RPG</p>
        </div>

        <GlassCard className="border-slate-800/80 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Hero Name / Username</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ShadowKnight99"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14]/80 border border-slate-700/70 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hero@lifeverse.io"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14]/80 border border-slate-700/70 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14]/80 border border-slate-700/70 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={loading} icon={ArrowRight}>
              Begin Journey
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-xs text-slate-400">
            Already have a hero?{' '}
            <Link to="/login" className="font-semibold text-cyan-400 hover:text-cyan-300">
              Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default RegisterPage;
