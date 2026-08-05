import { create } from 'zustand';

export type Role = 'RESTAURANT' | 'HOTEL' | 'AFFILIATOR';
export type Tier = 'NONE' | 'BASIC' | 'PREMIUM';

interface SessionState {
  isAuthenticated: boolean;
  role: Role;
  tier: Tier;
  subscribed: boolean;
  canRequestVouchers: boolean;
  login: () => void;
  logout: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  isAuthenticated: false,
  role: 'RESTAURANT',
  tier: 'NONE',
  subscribed: false,
  canRequestVouchers: true,
  login: () => set({ isAuthenticated: true }),
  logout: () =>
    set({ isAuthenticated: false, role: 'RESTAURANT', tier: 'NONE', subscribed: false }),
}));
