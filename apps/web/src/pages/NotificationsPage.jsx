import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, Trophy, Flame, Zap, Award } from 'lucide-react';
import apiClient from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications');
      if (res.data) setNotifications(res.data);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Delete notification error:', err);
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'level_up':
        return <Trophy className="w-5 h-5 text-purple-400" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-amber-400" />;
      case 'habit_reminder':
        return <Flame className="w-5 h-5 text-orange-400" />;
      default:
        return <Zap className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Notification Center</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time alerts for level advancements, achievements, and quest logs</p>
        </div>
        <Button size="sm" variant="secondary" icon={CheckCheck} onClick={handleMarkAllRead}>
          Mark All As Read
        </Button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <GlassCard className="text-center py-12 border-dashed border-slate-800">
            <p className="text-sm text-slate-400">All clear! No notifications at this time.</p>
          </GlassCard>
        ) : (
          notifications.map((notif) => (
            <GlassCard
              key={notif._id}
              className={`p-4 flex items-center justify-between gap-4 border-slate-800 transition-all ${
                !notif.read ? 'border-purple-500/40 bg-purple-500/5' : ''
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#080B14] border border-slate-700/80 flex items-center justify-center shrink-0">
                  {getNotifIcon(notif.type)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{notif.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{notif.message}</p>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {new Date(notif.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDelete(notif._id)}
                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
