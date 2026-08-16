import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Role, Tier } from '@/mocks/types';

interface SessionState {
  isAuthenticated: boolean;
  role: Role;
  tier: Tier;
  subscribed: boolean;
  termsAccepted: boolean;
  restaurantImageUri: string | null;
  login: () => void;
  logout: () => void;
  setTier: (tier: Tier) => void;
  setRole: (role: Role) => void;
  acceptTerms: () => void;
  setRestaurantImage: (uri: string) => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: 'RESTAURANT',
      tier: 'NONE',
      subscribed: false,
      termsAccepted: false,
      restaurantImageUri: null,
      login: () => set({ isAuthenticated: true }),
      logout: () =>
        set({ isAuthenticated: false, role: 'RESTAURANT', tier: 'NONE', subscribed: false, termsAccepted: false }),
      setTier: (tier) => set({ tier, subscribed: tier !== 'NONE' }),
      setRole: (role) => set({ role }),
      acceptTerms: () => set({ termsAccepted: true }),
      setRestaurantImage: (uri) => set({ restaurantImageUri: uri }),
    }),
    {
      name: 'restaurantImageUri',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ restaurantImageUri: state.restaurantImageUri }),
    },
  ),
);

export const canRequestVouchers = (role: Role): boolean => role !== 'AFFILIATOR';
