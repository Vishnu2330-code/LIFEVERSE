import { create } from 'zustand';
import * as Haptics from 'expo-haptics';
import mobileApiClient from '../services/api.js';

export const useMobileGamification = create((set, get) => ({
  profile: null,
  isLoading: false,

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const res = await mobileApiClient.get('/gamification/profile');
      if (res.success && res.data) {
        set({ profile: res.data, isLoading: false });
      }
    } catch (err) {
      set({ isLoading: false });
    }
  },

  triggerHapticReward: async (rewards) => {
    try {
      if (rewards?.levelUp) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    } catch (err) {
      // Haptics optional
    }
  },
}));

export default useMobileGamification;
