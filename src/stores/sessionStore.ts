import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Role, Tier } from '@/types';
import { loginApi, getMeApi, logoutApi, forgotPasswordApi, resetPasswordApi } from '@/api/auth.api';
import { get2FAStatusApi } from '@/api/twoFactor.api';
import type { LoginPayload, MeResponse } from '@/api/auth.api';

interface SessionState {
  isAuthenticated: boolean;
  role: Role;
  tier: Tier;
  subscribed: boolean;
  termsAccepted: boolean;
  restaurantImageUri: string | null;
  twoFactorEnabled: boolean;
  totpSecret: string | null;
  profile: MeResponse | null;
  /** Real API login — throws ApiError on failure. */
  login: (payload?: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
  fetchTwoFactorStatus: () => Promise<void>;
  forgotPassword: (phone: string) => Promise<void>;
  resetPassword: (phone: string, otp: string, newPassword: string) => Promise<void>;
  setTier: (tier: Tier) => void;
  setRole: (role: Role) => void;
  acceptTerms: () => void;
  setRestaurantImage: (uri: string) => void;
  enableTwoFactor: (secret: string) => void;
  disableTwoFactor: () => void;
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
      twoFactorEnabled: false,
      totpSecret: null,
      profile: null,
      login: async (payload) => {
        if (payload) {
          const res = await loginApi(payload);
          const role = (res.data.role as Role) ?? 'RESTAURANT';
          set({ isAuthenticated: true, role, profile: res.data });
        } else {
          set({ isAuthenticated: true });
        }
      },
      logout: async () => {
        await logoutApi();
        set({ isAuthenticated: false, role: 'RESTAURANT', tier: 'NONE', subscribed: false, termsAccepted: false, profile: null });
      },
      fetchMe: async () => {
        const profile = await getMeApi();
        const role = (profile.role as Role) ?? 'RESTAURANT';
        set({ profile, role, isAuthenticated: true });
      },
      fetchTwoFactorStatus: async () => {
        try {
          const status = await get2FAStatusApi();
          set({ twoFactorEnabled: status.enabled });
        } catch {
          // non-fatal
        }
      },
      forgotPassword: async (phone) => { await forgotPasswordApi(phone); },
      resetPassword: async (phone, otp, newPassword) => { await resetPasswordApi(phone, otp, newPassword); },
      setTier: (tier) => set({ tier, subscribed: tier !== 'NONE' }),
      setRole: (role) => set({ role }),
      acceptTerms: () => set({ termsAccepted: true }),
      setRestaurantImage: (uri) => set({ restaurantImageUri: uri }),
      enableTwoFactor: (secret) => set({ twoFactorEnabled: true, totpSecret: secret }),
      disableTwoFactor: () => set({ twoFactorEnabled: false, totpSecret: null }),
    }),
    {
      name: 'restaurantImageUri',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        restaurantImageUri: state.restaurantImageUri,
        twoFactorEnabled: state.twoFactorEnabled,
        totpSecret: state.totpSecret,
      }),
    },
  ),
);

export const canRequestVouchers = (role: Role): boolean => role !== 'AFFILIATOR';
