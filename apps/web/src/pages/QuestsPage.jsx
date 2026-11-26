import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  Edit2,
  Calendar,
  Kanban,
  List as ListIcon,
  Tag,
  AlertCircle,
} from 'lucide-react';
import apiClient from '../services/api.js';
import { useGamificationStore } from '../store/useGamificationStore.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const QuestsPage = () => {
  const [quests, setQuests] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban' | 'calendar'
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('productivity');
  const [difficulty, setDifficulty] = useState('medium');
  const [priority, setPriority] = useState('medium');
  const [estimatedDuration, setEstimatedDuration] = useState(30);
  const [checklistItems, setChecklistItems] = useState([{ text: '', isCompleted: false }]);

  const { triggerRewardCelebration, fetchProfile } = useGamificationStore();

  useEffect(() => {
    loadQuests();
  }, [filterCategory, filterDifficulty, searchQuery]);

  const loadQuests = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.append('category', filterCategory);
      if (filterDifficulty !== 'all') params.append('difficulty', filterDifficulty);
      if (searchQuery) params.append('search', searchQuery);

      const res = await apiClient.get(`/quests?${params.toString()}`);
      if (res.data) setQuests(res.data);
    } catch (err) {
      console.error('Failed to load quests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuest = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const validChecklist = checklistItems.filter((item) => item.text.trim() !== '');
      await apiClient.post('/quests', {
        title,
        description,
        category,
        difficulty,
        priority,
        estimatedDuration: parseInt(estimatedDuration, 10),
        checklist: validChecklist,
      });

      setIsModalOpen(false);
      resetForm();
      loadQuests();
    } catch (err) {
      console.error('Error creating quest:', err);
    }
  };

  const handleCompleteQuest = async (id) => {
    try {
      const res = await apiClient.post(`/quests/${id}/complete`);
      if (res.success && res.data?.rewards) {
        triggerRewardCelebration(res.data.rewards);
        loadQuests();
        fetchProfile();
      }
    } catch (err) {
      console.error('Failed to complete quest:', err);
    }
  };

  const handleDeleteQuest = async (id) => {
    try {
      await apiClient.delete(`/quests/${id}`);
      setQuests(quests.filter((q) => q._id !== id));
    } catch (err) {
      console.error('Failed to delete quest:', err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('productivity');
    setDifficulty('medium');
    setPriority('medium');
    setEstimatedDuration(30);
    setChecklistItems([{ text: '', isCompleted: false }]);
  };

  const pendingQuests = quests.filter((q) => q.status === 'pending');
  const inProgressQuests = quests.filter((q) => q.status === 'in_progress');
  const completedQuests = quests.filter((q) => q.status === 'completed');

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">Quest Management</h1>
          <p className="text-xs text-slate-400 mt-1">Conquer your daily challenges and claim server-verified XP</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsModalOpen(true)}>
          New Quest
        </Button>
      </div>

      {/* Control Bar: Filters & Views */}
      <GlassCard className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 border-slate-800">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search quests..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#080B14] border border-slate-700/60 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700/60 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="productivity">Productivity</option>
            <option value="learning">Learning</option>
            <option value="fitness">Fitness</option>
            <option value="career">Career</option>
          </select>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700/60 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy (10 XP)</option>
            <option value="medium">Medium (25 XP)</option>
            <option value="hard">Hard (50 XP)</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#080B14] border border-slate-700/60 rounded-xl">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'list' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListIcon className="w-4 h-4" /> List
          </button>
          <button
            onClick={() => setViewMode('kanban')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'kanban' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Kanban className="w-4 h-4" /> Board
          </button>
        </div>
      </GlassCard>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {quests.length === 0 ? (
            <GlassCard className="text-center py-16 border-dashed border-slate-800">
              <p className="text-sm text-slate-400 mb-4">No quests found matching your filters.</p>
              <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
                Create a Quest
              </Button>
            </GlassCard>
          ) : (
            quests.map((q) => (
              <GlassCard
                key={q._id}
                hoverEffect
                className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-slate-800 ${
                  q.status === 'completed' ? 'opacity-65' : ''
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={q.difficulty === 'hard' ? 'red' : q.difficulty === 'medium' ? 'purple' : 'green'} size="xs">
                      {q.difficulty}
                    </Badge>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{q.category}</span>
                    {q.priority === 'urgent' && <Badge variant="red" size="xs">URGENT</Badge>}
                  </div>

                  <h3 className={`text-base font-bold ${q.status === 'completed' ? 'line-through text-slate-400' : 'text-white'}`}>
                    {q.title}
                  </h3>

                  {q.description && <p className="text-xs text-slate-400">{q.description}</p>}

                  {/* Checklist Preview */}
                  {q.checklist?.length > 0 && (
                    <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                      <span>
                        Checklist: {q.checklist.filter((i) => i.isCompleted).length} / {q.checklist.length}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {q.status !== 'completed' ? (
                    <Button
                      size="sm"
                      variant="cyan"
                      icon={CheckCircle2}
                      onClick={() => handleCompleteQuest(q._id)}
                    >
                      Complete
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      Completed (+{q.xpEarned || 25} XP)
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteQuest(q._id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pending Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-slate-300">Pending</span>
              <Badge variant="slate" size="xs">{pendingQuests.length}</Badge>
            </div>
            {pendingQuests.map((q) => (
              <GlassCard key={q._id} className="p-3.5 space-y-2 border-slate-800">
                <Badge variant={q.difficulty === 'hard' ? 'red' : 'green'} size="xs">{q.difficulty}</Badge>
                <p className="text-sm font-bold text-white">{q.title}</p>
                <Button size="sm" variant="cyan" className="w-full mt-2" onClick={() => handleCompleteQuest(q._id)}>
                  Complete Quest
                </Button>
              </GlassCard>
            ))}
          </div>

          {/* In Progress Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-purple-400">In Progress</span>
              <Badge variant="purple" size="xs">{inProgressQuests.length}</Badge>
            </div>
            {inProgressQuests.map((q) => (
              <GlassCard key={q._id} className="p-3.5 space-y-2 border-purple-500/20">
                <Badge variant="purple" size="xs">{q.difficulty}</Badge>
                <p className="text-sm font-bold text-white">{q.title}</p>
                <Button size="sm" variant="cyan" className="w-full mt-2" onClick={() => handleCompleteQuest(q._id)}>
                  Complete Quest
                </Button>
              </GlassCard>
            ))}
          </div>

          {/* Completed Column */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-sm font-bold text-emerald-400">Completed</span>
              <Badge variant="green" size="xs">{completedQuests.length}</Badge>
            </div>
            {completedQuests.map((q) => (
              <GlassCard key={q._id} className="p-3.5 space-y-2 border-slate-800 opacity-60">
                <p className="text-sm font-bold text-white line-through">{q.title}</p>
                <span className="text-[11px] text-emerald-400 font-bold block">Reward Claimed</span>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* CREATE QUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card bg-[#101625] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Create New Mission</h2>
            <form onSubmit={handleCreateQuest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quest Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Master Three.js Shaders"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  placeholder="Details and criteria..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                  >
                    <option value="productivity">Productivity</option>
                    <option value="learning">Learning</option>
                    <option value="fitness">Fitness</option>
                    <option value="career">Career</option>
                    <option value="health">Health</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                  >
                    <option value="easy">Easy (+10 XP, +5 Coins)</option>
                    <option value="medium">Medium (+25 XP, +10 Coins)</option>
                    <option value="hard">Hard (+50 XP, +20 Coins)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Deploy Quest
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestsPage;
