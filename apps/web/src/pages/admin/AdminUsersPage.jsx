import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, Ban, CheckCircle } from 'lucide-react';
import apiClient from '../../services/api.js';
import GlassCard from '../../components/common/GlassCard.jsx';
import Button from '../../components/common/Button.jsx';
import Badge from '../../components/common/Badge.jsx';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const res = await apiClient.get(`/admin/users${params}`);
      if (res.data) setUsers(res.data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      await apiClient.patch(`/admin/users/${userId}/status`, { status: nextStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
      );
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">User Governance</h1>
          <p className="text-xs text-slate-400 mt-1">Manage user status, account verifications, and permissions</p>
        </div>
      </div>

      <GlassCard className="p-4 border-slate-800">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by username or email..."
          className="w-full px-4 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
        />
      </GlassCard>

      <GlassCard className="p-6 border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-bold text-slate-400">
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Registered</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-bold text-white">{u.username}</td>
                  <td className="py-3 px-4 text-xs text-slate-300">{u.email}</td>
                  <td className="py-3 px-4">
                    <Badge variant={u.role === 'admin' ? 'purple' : 'slate'} size="xs">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-bold ${
                        u.status === 'suspended' ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <Button
                        size="sm"
                        variant={u.status === 'suspended' ? 'cyan' : 'danger'}
                        onClick={() => handleToggleStatus(u._id, u.status)}
                      >
                        {u.status === 'suspended' ? 'Restore' : 'Suspend'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminUsersPage;
