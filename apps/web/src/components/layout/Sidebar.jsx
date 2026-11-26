import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Target,
  Dumbbell,
  BookOpen,
  User,
  Globe2,
  ShoppingBag,
  Package,
  Award,
  Users,
  Trophy,
  BarChart3,
  Settings,
} from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Quests', path: '/quests', icon: CheckSquare },
    { name: 'Habits', path: '/habits', icon: Flame },
    { name: 'Goals', path: '/goals', icon: Target },
    { name: 'Fitness', path: '/fitness', icon: Dumbbell },
    { name: 'Learning', path: '/learning', icon: BookOpen },
    { name: 'Avatar', path: '/avatar', icon: User },
    { name: 'World', path: '/world', icon: Globe2 },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Inventory', path: '/inventory', icon: Package },
    { name: 'Achievements', path: '/achievements', icon: Award },
    { name: 'Community', path: '/community', icon: Users },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800/80 bg-[#080B14]/90 backdrop-blur-xl shrink-0 h-[calc(100vh-4rem)] sticky top-16 custom-scrollbar overflow-y-auto p-4">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/25 to-indigo-600/10 text-white border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-purple-400" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
