import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import apiClient from '../../services/api.js';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Password reset failed. Token may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <GlassCard className="border-slate-800/80 shadow-2xl p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Password Updated!</h2>
              <p className="text-xs text-slate-400">
                Your credentials have been securely updated. You can now log in with your new password.
              </p>
              <Link to="/login">
                <Button variant="primary" className="w-full mt-4">
                  Proceed to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Create New Password</h2>
              <p className="text-xs text-slate-400 mb-6">
                Choose a strong new password to protect your character and virtual world.
              </p>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">New Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14]/80 border border-slate-700/70 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14]/80 border border-slate-700/70 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                  Update Password
                </Button>
              </form>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
