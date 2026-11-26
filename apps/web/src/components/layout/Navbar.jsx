import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, Coins, Bell, LogOut, User as UserIcon, Settings, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore.js';
import { useGamificationStore } from '../../store/useGamificationStore.js';
import apiClient from '../../services/api.js';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { profile, fetchProfile } = useGamificationStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
      apiClient.get('/notifications?limit=1')
        .then((res) => {
          if (res.unreadCount !== undefined) setUnreadCount(res.unreadCount);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6] via-[#38BDF8] to-[#22D3EE] p-[2px] shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all">
            <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#22D3EE]" />
            </div>
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white font-heading">
              LIFE<span className="text-[#38BDF8]">VERSE</span>
            </span>
          </div>
        </Link>

        {/* Center / Navigation Links for Guests */}
        {!isAuthenticated && (
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link to="/explore" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Explore World
            </Link>
            <Link to="/challenges" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Challenges
            </Link>
            <Link to="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              About
            </Link>
          </nav>
        )}

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Level & XP Widget */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#171E30]/80 border border-slate-700/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-200">Lv {profile?.level || 1}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {profile?.rank || 'Beginner'}
                  </span>
                </div>
                <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/60">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${profile?.progressPercentage || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Virtual Coins */}
              <Link
                to="/marketplace"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-all"
                title="Virtual Coins"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold">{profile?.coins || 0}</span>
              </Link>

              {/* Notifications */}
              <Link
                to="/notifications"
                className="relative p-2 rounded-xl bg-[#171E30] text-slate-300 hover:text-white hover:bg-[#1E2740] border border-slate-700/60 transition-all"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-[#171E30] border border-slate-700/60 hover:border-purple-500/50 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#101625] border border-slate-700/70 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs font-semibold text-white truncate">{user?.username}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-purple-400 hover:bg-purple-500/10"
                      >
                        <Shield className="w-3.5 h-3.5" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      Player Profile
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 border-t border-slate-800 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 transition-all"
              >
                Join LIFEVERSE
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
