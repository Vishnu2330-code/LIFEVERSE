import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Heart, Plus, Send, Flag, Sparkles } from 'lucide-react';
import apiClient, { getSocket } from '../services/api.js';
import { useAuthStore } from '../store/useAuthStore.js';
import GlassCard from '../components/common/GlassCard.jsx';
import Button from '../components/common/Button.jsx';
import Badge from '../components/common/Badge.jsx';

export const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('discussion');
  const [commentInputs, setCommentInputs] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [commentsMap, setCommentsMap] = useState({});
  const { user } = useAuthStore();

  useEffect(() => {
    loadPosts();

    const socket = getSocket();
    if (socket) {
      socket.on('new_post', (post) => {
        setPosts((prev) => [post, ...prev]);
      });
    }
  }, []);

  const loadPosts = async () => {
    try {
      const res = await apiClient.get('/community/posts');
      if (res.data) setPosts(res.data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      await apiClient.post('/community/posts', {
        content: newPostContent,
        category: selectedCategory,
      });
      setNewPostContent('');
      loadPosts();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const res = await apiClient.post(`/community/posts/${postId}/like`);
      if (res.data) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === postId
              ? { ...p, likesCount: res.data.likesCount, hasLiked: res.data.hasLiked }
              : p
          )
        );
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const toggleComments = async (postId) => {
    const isExpanded = expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: !isExpanded }));

    if (!isExpanded && !commentsMap[postId]) {
      try {
        const res = await apiClient.get(`/community/posts/${postId}/comments`);
        if (res.data) {
          setCommentsMap((prev) => ({ ...prev, [postId]: res.data }));
        }
      } catch (err) {
        console.error('Failed to load comments:', err);
      }
    }
  };

  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    try {
      const res = await apiClient.post(`/community/posts/${postId}/comments`, { content: text });
      if (res.data) {
        setCommentsMap((prev) => ({
          ...prev,
          [postId]: [...(prev[postId] || []), res.data],
        }));
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error('Add comment error:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div>
        <h1 className="text-3xl font-black text-white font-heading">Adventurer Plaza</h1>
        <p className="text-xs text-slate-400 mt-1">Connect, share accomplishments, and cheer on fellow heroes</p>
      </div>

      {/* Post Composer */}
      <GlassCard className="p-5 border-slate-800 space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-slate-300">Share your progress</span>
        </div>
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          rows="3"
          placeholder="What milestone or workout did you conquer today?"
          className="w-full px-4 py-3 rounded-2xl bg-[#080B14] border border-slate-700/70 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
        <div className="flex items-center justify-between pt-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-slate-300"
          >
            <option value="discussion">General Discussion</option>
            <option value="achievement">Achievement Unlocked</option>
            <option value="quest_completed">Quest Accomplished</option>
            <option value="workout">Workout Victory</option>
          </select>
          <Button size="sm" variant="primary" icon={Send} onClick={handleCreatePost}>
            Publish
          </Button>
        </div>
      </GlassCard>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <GlassCard key={post._id} className="p-6 space-y-4 border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center font-bold text-xs text-white">
                  {post.userId?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{post.userId?.username || 'Hero'}</h4>
                  <span className="text-[11px] text-slate-500">
                    {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <Badge variant="purple" size="xs">{post.category}</Badge>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed">{post.content}</p>

            <div className="flex items-center gap-6 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <button
                onClick={() => handleLikePost(post._id)}
                className={`flex items-center gap-1.5 transition-colors ${
                  post.hasLiked ? 'text-red-400 font-bold' : 'hover:text-red-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                <span>{post.likesCount || 0}</span>
              </button>

              <button
                onClick={() => toggleComments(post._id)}
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{post.commentsCount || 0} Comments</span>
              </button>
            </div>

            {/* Comments Expanded Section */}
            {expandedComments[post._id] && (
              <div className="pt-3 border-t border-slate-800/60 space-y-3">
                <div className="space-y-2">
                  {commentsMap[post._id]?.map((c) => (
                    <div key={c._id} className="p-2.5 rounded-xl bg-[#080B14] border border-slate-800/80 text-xs">
                      <span className="font-bold text-purple-300 mr-2">{c.userId?.username}:</span>
                      <span className="text-slate-300">{c.content}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInputs[post._id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [post._id]: e.target.value })
                    }
                    placeholder="Write a supportive comment..."
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[#080B14] border border-slate-700 text-xs text-white"
                  />
                  <Button size="sm" variant="cyan" onClick={() => handleAddComment(post._id)}>
                    Reply
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
