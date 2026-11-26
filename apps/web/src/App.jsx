import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/useAuthStore.js';
import { useGamificationStore } from './store/useGamificationStore.js';

// Layout & Common
import Navbar from './components/layout/Navbar.jsx';
import Sidebar from './components/layout/Sidebar.jsx';
import Footer from './components/layout/Footer.jsx';
import { ProtectedRoute, AdminRoute } from './components/layout/ProtectedRoute.jsx';
import RewardCelebration from './components/common/RewardCelebration.jsx';

// Public Pages
import LandingPage from './pages/LandingPage.jsx';
import FeaturesPage from './pages/public/FeaturesPage.jsx';
import ExplorePage from './pages/public/ExplorePage.jsx';
import ChallengesPage from './pages/public/ChallengesPage.jsx';
import AboutPage from './pages/public/AboutPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/auth/ResetPasswordPage.jsx';

// Protected User Pages
import OnboardingPage from './pages/onboarding/OnboardingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import QuestsPage from './pages/QuestsPage.jsx';
import HabitsPage from './pages/HabitsPage.jsx';
import GoalsPage from './pages/GoalsPage.jsx';
import FitnessPage from './pages/FitnessPage.jsx';
import LearningPage from './pages/LearningPage.jsx';
import AvatarPage from './pages/AvatarPage.jsx';
import WorldPage from './pages/WorldPage.jsx';
import MarketplacePage from './pages/MarketplacePage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import AchievementsPage from './pages/AchievementsPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import LeaderboardPage from './pages/LeaderboardPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import NotificationsPage from './pages/NotificationsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import AdminReportsPage from './pages/admin/AdminReportsPage.jsx';
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage.jsx';

const queryClient = new QueryClient();

// Main Layout with Sidebar for Authenticated Views
const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

// Public Layout without Sidebar
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#080B14]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App = () => {
  const { checkAuth } = useAuthStore();
  const { initSocketListeners } = useGamificationStore();

  useEffect(() => {
    checkAuth();
    initSocketListeners();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RewardCelebration />
        <Routes>
          {/* Public Views */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
          </Route>

          {/* Onboarding View */}
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>

          {/* Authenticated User Views (Inside AppLayout with Sidebar) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/quests" element={<QuestsPage />} />
              <Route path="/habits" element={<HabitsPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/fitness" element={<FitnessPage />} />
              <Route path="/learning" element={<LearningPage />} />
              <Route path="/avatar" element={<AvatarPage />} />
              <Route path="/world" element={<WorldPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/friends" element={<FriendsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/profile" element={<SettingsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Admin Protected Views */}
          <Route element={<AdminRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/audit-logs" element={<AdminAuditLogsPage />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
