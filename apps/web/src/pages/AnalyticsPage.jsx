import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, Download, Calendar, Zap, Flame } from 'lucide-react';
import apiClient from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await apiClient.get('/analytics/productivity');
      if (res.data) setAnalyticsData(res.data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const exportJSON = async () => {
    try {
      const res = await apiClient.get('/users/export-data');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifeverse_export_${Date.now()}.json`;
      a.click();
    } catch (err) {
      console.error('Export JSON error:', err);
    }
  };

  const exportCSV = async () => {
    try {
      const res = await apiClient.get('/users/export-data');
      const quests = res.data?.quests || [];
      const headers = ['ID', 'Title', 'Category', 'Difficulty', 'Status', 'CreatedAt'];
      const rows = quests.map((q) => [
        q._id,
        `"${q.title}"`,
        q.category,
        q.difficulty,
        q.status,
        q.createdAt,
      ]);
      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifeverse_quests_${Date.now()}.csv`;
      a.click();
    } catch (err) {
      console.error('Export CSV error:', err);
    }
  };

  const categoryColors = ['#8B5CF6', '#22D3EE', '#FBBF24', '#22C55E', '#EF4444', '#EC4899'];

  const categoryData = analyticsData?.questsByCategory?.length > 0
    ? analyticsData.questsByCategory
    : [
        { category: 'productivity', count: 12 },
        { category: 'learning', count: 8 },
        { category: 'fitness', count: 6 },
        { category: 'career', count: 4 },
      ];

  const xpGrowthData = analyticsData?.xpGrowth?.length > 0
    ? analyticsData.xpGrowth
    : [
        { date: 'Day 1', xp: 50 },
        { date: 'Day 5', xp: 180 },
        { date: 'Day 10', xp: 350 },
        { date: 'Day 15', xp: 600 },
        { date: 'Day 20', xp: 950 },
        { date: 'Day 25', xp: 1400 },
        { date: 'Day 30', xp: 2100 },
      ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Header & Export Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Productivity Analytics</h1>
          <p className="text-xs text-slate-400 mt-1">Interactive reports visualizing XP progression, tasks, and consistency</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="secondary" icon={Download} onClick={exportCSV}>
            Export CSV
          </Button>
          <Button size="sm" variant="primary" icon={Download} onClick={exportJSON}>
            Export Full JSON
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: 30-Day XP Growth Line Chart */}
        <GlassCard className="p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" /> XP Growth Trajectory
            </h3>
            <Badge variant="purple" size="xs">30-Day Rolling</Badge>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={xpGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101625',
                    borderColor: '#8B5CF6',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="xp"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#22D3EE', r: 4 }}
                  activeDot={{ r: 6, fill: '#FBBF24' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 2: Task Completion by Category Bar Chart */}
        <GlassCard className="p-6 border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Quests by Category
            </h3>
            <Badge variant="cyan" size="xs">Life Balance</Badge>
          </div>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="category" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#101625',
                    borderColor: '#22D3EE',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#38BDF8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AnalyticsPage;
