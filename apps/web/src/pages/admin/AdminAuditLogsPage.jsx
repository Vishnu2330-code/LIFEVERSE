import React, { useState, useEffect } from 'react';
import { Shield, Clock } from 'lucide-react';
import apiClient from '../../services/api.js';
import GlassCard from '../../components/common/GlassCard.jsx';
import Badge from '../../components/common/Badge.jsx';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await apiClient.get('/admin/audit-logs');
      if (res.data) setLogs(res.data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div>
        <h1 className="text-3xl font-black text-white font-heading">Administrative Audit Logs</h1>
        <p className="text-xs text-slate-400 mt-1">Immutable record of governance interventions and security actions</p>
      </div>

      <GlassCard className="p-6 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4">
                    <Badge variant="purple" size="xs">{log.action}</Badge>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{log.adminId?.username || 'Admin'}</td>
                  <td className="py-3 px-4 text-xs text-cyan-300 font-mono">{log.targetResource}</td>
                  <td className="py-3 px-4 text-xs text-slate-400 font-mono">{log.ipAddress || '127.0.0.1'}</td>
                  <td className="py-3 px-4 text-xs text-slate-400">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminAuditLogsPage;
