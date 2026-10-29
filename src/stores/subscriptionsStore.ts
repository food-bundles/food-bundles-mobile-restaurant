import { create } from 'zustand';
import type { Plan, Tier } from '@/types';
import type { CurrentSubscription, SubscribeResult, SubscriptionHistoryEntry } from '@/api/subscriptions.api';
import {
  getSubscriptionPlansApi,
  getCurrentSubscriptionApi,
  subscribeApi,
  cancelSubscriptionApi,
  changePlanApi,
  renewSubscriptionApi,
  verifySubscriptionPaymentApi,
  getSubscriptionHistoryApi,
} from '@/api/subscriptions.api';

interface SubscriptionsState {
  plans: Plan[];
  current: CurrentSubscription | null;
  history: SubscriptionHistoryEntry[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  fetchPlans: () => Promise<void>;
  fetchCurrent: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  subscribe: (planId: string, paymentMethod?: string, phoneNumber?: string) => Promise<SubscribeResult>;
  changePlan: (newPlanId: string, phoneNumber?: string) => Promise<SubscribeResult>;
  renew: (phoneNumber?: string) => Promise<SubscribeResult>;
  verifyPayment: (txRef: string) => Promise<{ verified: boolean; status: string }>;
  cancel: (reason?: string) => Promise<void>;
  /** Derive the active Tier from the current subscription for sessionStore compatibility */
  activeTier: () => Tier;
}

export const useSubscriptionsStore = create<SubscriptionsState>((set, get) => ({
  plans: [],
  current: null,
  history: [],
  status: 'idle',

  fetchPlans: async () => {
    set({ status: 'loading' });
    try {
      const plans = await getSubscriptionPlansApi();
      set({ plans, status: 'ready' });
    } catch {
      set({ status: 'error', plans: [] });
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

  fetchHistory: async () => {
    try {
      const history = await getSubscriptionHistoryApi();
      set({ history });
    } catch {
      // non-fatal
    }
  },

  subscribe: async (planId, paymentMethod, phoneNumber) => {
    const result = await subscribeApi({ planId, paymentMethod, phoneNumber });
    if (result.status === 'successful') {
      await get().fetchCurrent();
    }
    return result;
  },

  changePlan: async (newPlanId, phoneNumber) => {
    const result = await changePlanApi({ newPlanId, phoneNumber });
    if (result.status === 'successful') {
      await get().fetchCurrent();
    }
    return result;
  },

  renew: async (phoneNumber) => {
    const result = await renewSubscriptionApi({ phoneNumber });
    if (result.status === 'successful') {
      await get().fetchCurrent();
    }
    return result;
  },

  verifyPayment: async (txRef) => {
    const result = await verifySubscriptionPaymentApi(txRef);
    if (result.verified) {
      await get().fetchCurrent();
    }
    return result;
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
