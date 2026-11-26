import { create } from 'zustand';
import apiClient, { getSocket } from '../services/api.js';

export const useGamificationStore = create((set, get) => ({
  profile: null,
  isLoading: false,
  recentReward: null,
  levelUpModal: null,
  achievementModal: null,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await apiClient.get('/gamification/profile');
      if (res.success && res.data) {
        set({ profile: res.data, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  initSocketListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    socket.on('gamification_update', (update) => {
      set((state) => ({
        profile: state.profile ? { ...state.profile, ...update } : update,
      }));
    });

    socket.on('level_up', (data) => {
      set({ levelUpModal: data });
    });

    socket.on('achievement_unlocked', (achievement) => {
      set({ achievementModal: achievement });
    });
  },

  triggerRewardCelebration: (reward) => {
    set({ recentReward: reward });
    setTimeout(() => {
      set({ recentReward: null });
    }, 4000);
  },

  closeLevelUpModal: () => set({ levelUpModal: null }),
  closeAchievementModal: () => set({ achievementModal: null }),
}));

export default useGamificationStore;
