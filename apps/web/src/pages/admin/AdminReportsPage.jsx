import React, { useState, useEffect } from 'react';
import { AlertTriangle, Check, Shield } from 'lucide-react';
import apiClient from '../../services/api.js';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';

export const AdminReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const res = await apiClient.get('/admin/reports');
      if (res.data) setReports(res.data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id, status) => {
    try {
      await apiClient.patch(`/admin/reports/${id}/resolve`, {
        status,
        actionTaken: status === 'resolved' ? 'Reviewed and dismissed/addressed' : 'Dismissed',
      });
      loadReports();
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div>
        <h1 className="text-3xl font-black text-white font-heading">Moderation Queue</h1>
        <p className="text-xs text-slate-400 mt-1">Review community reports and enforce platform guidelines</p>
      </div>

      <div className="space-y-3">
        {reports.length === 0 ? (
          <GlassCard className="text-center py-12 border-dashed border-slate-800">
            <p className="text-sm text-slate-400">Queue is clean! Zero pending reports.</p>
          </GlassCard>
        ) : (
          reports.map((r) => (
            <GlassCard key={r._id} className="p-4 flex items-center justify-between border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="red" size="xs">{r.targetType}</Badge>
                  <span className="text-xs text-slate-400">Reported by: {r.reporterId?.username || 'Hero'}</span>
                </div>
                <p className="text-sm font-bold text-white">Reason: {r.reason}</p>
                <p className="text-xs text-slate-500">Target ID: {r.targetId}</p>
              </div>

              <div className="flex items-center gap-3">
                <Button size="sm" variant="cyan" onClick={() => handleResolve(r._id, 'resolved')}>
                  Resolve
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleResolve(r._id, 'dismissed')}>
                  Dismiss
                </Button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminReportsPage;
