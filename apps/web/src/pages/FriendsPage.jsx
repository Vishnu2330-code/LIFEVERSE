import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Check, X, Shield, Flame } from 'lucide-react';
import apiClient from '../services/api.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [sentRequests, setSentRequests] = useState(new Set());
  const [loadingSearch, setLoadingSearch] = useState(false);

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const res = await apiClient.get('/friends');
      if (res.data) setFriends(res.data);
    } catch (err) {
      console.error('Failed to load friends:', err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoadingSearch(true);
    try {
      const res = await apiClient.get(`/friends/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.data) setSearchResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSendRequest = async (recipientId) => {
    try {
      await apiClient.post('/friends/requests', { recipientId });
      setSentRequests((prev) => new Set([...prev, recipientId]));
    } catch (err) {
      console.error('Send request error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-2">
      <div>
        <h1 className="text-3xl font-black text-white font-heading">Guild & Allies</h1>
        <p className="text-xs text-slate-400 mt-1">Connect with companions, share motivation, and conquer community raids</p>
      </div>

      {/* Friend Search Bar */}
      <GlassCard className="p-5 border-slate-800">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by adventurer username..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#080B14] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <Button type="submit" variant="primary" isLoading={loadingSearch}>
            Search Heroes
          </Button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
            <p className="text-xs font-bold text-slate-400">Search Results</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="p-3 rounded-xl bg-[#080B14] border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center font-bold text-xs text-purple-300">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-white">{user.username}</p>
                      <p className="text-[11px] text-slate-400">{user.profile?.bio || 'Ready for adventure'}</p>
                    </div>
                  </div>

                  {sentRequests.has(user._id) ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Sent
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      icon={UserPlus}
                      onClick={() => handleSendRequest(user._id)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>

      {/* Friends List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" /> My Allies ({friends.length})
        </h2>

        {friends.length === 0 ? (
          <GlassCard className="text-center py-12 border-dashed border-slate-800">
            <p className="text-sm text-slate-400 mb-2">You haven't added any companions yet.</p>
            <p className="text-xs text-slate-500">Search for adventurers above to build your squad!</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {friends.map((friend) => (
              <GlassCard key={friend.id} hoverEffect className="p-4 space-y-3 border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-sm text-white">
                    {friend.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">{friend.username}</h3>
                    <p className="text-xs text-slate-400">{friend.bio || 'Active hero'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <Badge variant="purple" size="xs">
                    Level {friend.gamification?.level || 1} ({friend.gamification?.rank || 'Beginner'})
                  </Badge>
                  <span className="text-orange-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {friend.gamification?.streakCount || 0}d
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
