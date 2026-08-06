import { create } from 'zustand';
import type { Role, Tier } from '@/mocks/types';

interface SessionState {
  isAuthenticated: boolean;
  role: Role;
  tier: Tier;
  subscribed: boolean;
  login: () => void;
  logout: () => void;
  setTier: (tier: Tier) => void;
  setRole: (role: Role) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,
  role: 'RESTAURANT',
  tier: 'NONE',
  subscribed: false,
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, role: 'RESTAURANT', tier: 'NONE', subscribed: false }),
  setTier: (tier) => set({ tier, subscribed: tier !== 'NONE' }),
  setRole: (role) => set({ role }),
}));

export const canRequestVouchers = (role: Role): boolean => role !== 'AFFILIATOR';
