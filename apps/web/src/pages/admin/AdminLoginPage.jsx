import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-600/20 border border-purple-500/50 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white font-heading">Command Terminal</h2>
          <p className="text-xs text-slate-400">Restricted administrative access for LIFEVERSE governance</p>
        </div>

        <GlassCard className="border-purple-500/30 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@lifeverse.io"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Passkey</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" className="w-full mt-2" isLoading={loading} icon={ArrowRight}>
              Authenticate Administrator
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminLoginPage;
