import { create } from 'zustand';
import type { Plan, Tier } from '@/types';
import type { CurrentSubscription } from '@/api/subscriptions.api';
import {
  getSubscriptionPlansApi,
  getCurrentSubscriptionApi,
  subscribeApi,
  cancelSubscriptionApi,
} from '@/api/subscriptions.api';

interface SubscriptionsState {
  plans: Plan[];
  current: CurrentSubscription | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  fetchPlans: () => Promise<void>;
  fetchCurrent: () => Promise<void>;
  subscribe: (planId: string, paymentMethod?: string, phoneNumber?: string) => Promise<void>;
  cancel: (reason?: string) => Promise<void>;
  /** Derive the active Tier from the current subscription for sessionStore compatibility */
  activeTier: () => Tier;
}

export const useSubscriptionsStore = create<SubscriptionsState>((set, get) => ({
  plans: [],
  current: null,
  status: 'idle',

  fetchPlans: async () => {
    set({ status: 'loading' });
    try {
      const plans = await getSubscriptionPlansApi();
      set({ plans, status: 'ready' });
    } catch {
      set({ status: 'error' });
    }
  },

  fetchCurrent: async () => {
    try {
      const current = await getCurrentSubscriptionApi();
      set({ current });
    } catch {
      // non-fatal
    }
  },

  subscribe: async (planId, paymentMethod, phoneNumber) => {
    await subscribeApi({ planId, paymentMethod, phoneNumber });
    await get().fetchCurrent();
  },

  cancel: async (reason) => {
    await cancelSubscriptionApi(reason);
    set({ current: null });
  },

  activeTier: () => {
    const { current } = get();
    if (!current || current.status !== 'ACTIVE') return 'NONE';
    return current.plan.id as Tier;
  },
}));
