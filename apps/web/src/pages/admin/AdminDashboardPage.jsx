import React, { useState, useEffect } from 'react';
import { Users, CheckCircle2, Shield, AlertTriangle, Zap, Coins, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../services/api.js';
import GlassCard from '../../components/common/GlassCard.jsx';
import Badge from '../../components/common/Badge.jsx';

export const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const res = await apiClient.get('/admin/dashboard');
      if (res.data) setMetrics(res.data);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">System Command Center</h1>
          <p className="text-xs text-slate-400 mt-1">Platform metrics, user governance, and security audit telemetry</p>
        </div>
        <Badge variant="purple">Admin Authorization Active</Badge>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-5 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Total Registered Users</p>
          <p className="text-2xl font-black text-white mt-1">{metrics?.totalUsers || 0}</p>
        </GlassCard>
        <GlassCard className="p-5 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Active Quests Completed</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{metrics?.totalQuestsCompleted || 0}</p>
        </GlassCard>
        <GlassCard className="p-5 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Total XP Distributed</p>
          <p className="text-2xl font-black text-purple-400 mt-1">{metrics?.totalXpDistributed?.toLocaleString() || 0}</p>
        </GlassCard>
        <GlassCard className="p-5 border-slate-800">
          <p className="text-xs font-semibold text-slate-400">Coins Circulating</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{metrics?.totalCoinsCirculating?.toLocaleString() || 0}</p>
        </GlassCard>
      </div>

      {/* Admin Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Link to="/admin/users">
          <GlassCard hoverEffect className="p-6 space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">User Governance</h3>
            <p className="text-xs text-slate-400">Inspect accounts, manage privileges, and suspend malicious actors.</p>
          </GlassCard>
        </Link>

        <Link to="/admin/reports">
          <GlassCard hoverEffect className="p-6 space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Community Moderation</h3>
            <p className="text-xs text-slate-400">Review reported comments, posts, and user conduct violations.</p>
          </GlassCard>
        </Link>

        <Link to="/admin/audit-logs">
          <GlassCard hoverEffect className="p-6 space-y-3 border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Audit Trail</h3>
            <p className="text-xs text-slate-400">Cryptographically verifiable log of all privileged actions.</p>
          </GlassCard>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
