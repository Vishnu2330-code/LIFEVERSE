import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import apiClient from '../../services/api.js';
import Button from '../../components/common/Button.jsx';
import GlassCard from '../../components/common/GlassCard.jsx';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <GlassCard className="border-slate-800/80 shadow-2xl p-8">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
          </Link>

          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white">Reset Link Dispatched</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                If an account exists for <span className="text-purple-300 font-semibold">{email}</span>, a secure password reset link has been dispatched to your inbox.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-xs text-slate-400 mb-6">
                Enter your registered email and we'll send you an encrypted token to recover your account.
              </p>

              {errorMsg && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
