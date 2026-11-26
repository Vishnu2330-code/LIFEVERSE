import React, { useState } from 'react';
import { Settings, Shield, Bell, Download, Trash2, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore.js';
import apiClient from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';

export const SettingsPage = () => {
  const { user, updateUserProfile, logout } = useAuthStore();
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC');
  const [isPublic, setIsPublic] = useState(user?.profile?.isPublic ?? true);
  const [shareActivity, setShareActivity] = useState(user?.profile?.shareActivity ?? true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiClient.patch('/users/profile', {
        bio,
        timezone,
        isPublic,
        shareActivity,
      });
      if (res.data) {
        updateUserProfile(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await apiClient.get('/users/export-data');
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `lifeverse_personal_data.json`;
      a.click();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to permanently delete your LIFEVERSE account? This action cannot be reversed.')) {
      try {
        await apiClient.delete('/users/account');
        await logout();
        window.location.href = '/';
      } catch (err) {
        console.error('Delete account error:', err);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div>
        <h1 className="text-3xl font-black text-white font-heading">Player Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your identity, privacy, and account security</p>
      </div>

      <GlassCard className="p-6 border-slate-800 space-y-6">
        <h2 className="text-lg font-bold text-white">Profile Configuration</h2>
        {saveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" /> Preferences saved successfully
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Adventurer Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="2"
              placeholder="Tell other heroes about your mission..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Timezone (for habit calculations)</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white"
            />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs text-slate-300">Public Profile (Visible on Leaderboard & Search)</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shareActivity}
                onChange={(e) => setShareActivity(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs text-slate-300">Broadcast Completed Quests to Community Feed</span>
            </label>
          </div>

          <Button type="submit" variant="primary" isLoading={saving}>
            Save Preferences
          </Button>
        </form>
      </GlassCard>

      {/* Danger & GDPR Zone */}
      <GlassCard className="p-6 border-red-500/20 space-y-4">
        <h2 className="text-lg font-bold text-red-400">Data Privacy & Danger Zone</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div>
            <p className="text-sm font-bold text-white">Export Personal Data (GDPR)</p>
            <p className="text-xs text-slate-400">Download a full JSON copy of all your quests, habits, and transactions.</p>
          </div>
          <Button size="sm" variant="secondary" icon={Download} onClick={handleExportData}>
            Export My Data
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div>
            <p className="text-sm font-bold text-red-400">Delete Account</p>
            <p className="text-xs text-slate-400">Permanently delete your user profile, level, quests, and virtual world island.</p>
          </div>
          <Button size="sm" variant="danger" icon={Trash2} onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};

export default SettingsPage;
