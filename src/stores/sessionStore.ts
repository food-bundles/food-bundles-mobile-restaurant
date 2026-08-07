import { create } from 'zustand';
import type { Role, Tier } from '@/mocks/types';

interface SessionState {
  isAuthenticated: boolean;
  role: Role;
  tier: Tier;
  subscribed: boolean;
  termsAccepted: boolean;
  login: () => void;
  logout: () => void;
  setTier: (tier: Tier) => void;
  setRole: (role: Role) => void;
  acceptTerms: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,
  role: 'RESTAURANT',
  tier: 'NONE',
  subscribed: false,
  termsAccepted: false,
  login: () => set({ isAuthenticated: true }),
  logout: () =>
    set({ isAuthenticated: false, role: 'RESTAURANT', tier: 'NONE', subscribed: false, termsAccepted: false }),
  setTier: (tier) => set({ tier, subscribed: tier !== 'NONE' }),
  setRole: (role) => set({ role }),
  acceptTerms: () => set({ termsAccepted: true }),
}));

export const canRequestVouchers = (role: Role): boolean => role !== 'AFFILIATOR';
