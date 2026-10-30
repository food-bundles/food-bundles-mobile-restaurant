import { create } from 'zustand';
import type { Affiliator } from '@/types';
import {
  getAffiliatorsApi,
  getAffiliatorApi,
  createAffiliatorApi,
  updateAffiliatorApi,
  deleteAffiliatorApi,
} from '@/api/affiliators.api';

interface AffiliatorsState {
  affiliators: Affiliator[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  fetch: () => Promise<void>;
  getById: (affiliatorId: string) => Promise<Affiliator>;
  create: (data: { name: string; email?: string; phone?: string }) => Promise<void>;
  update: (affiliatorId: string, data: { name?: string; phone?: string }) => Promise<void>;
  remove: (affiliatorId: string) => Promise<void>;
}

export const useAffiliatorsStore = create<AffiliatorsState>((set) => ({
  affiliators: [],
  status: 'idle',

  fetch: async () => {
    set({ status: 'loading' });
    try {
      const affiliators = await getAffiliatorsApi();
      set({ affiliators, status: 'ready' });
    } catch {
      set({ status: 'error' });
    }
  },

  getById: async (affiliatorId) => {
    return getAffiliatorApi(affiliatorId);
  },

  create: async (data) => {
    const affiliator = await createAffiliatorApi(data);
    set((state) => ({ affiliators: [...state.affiliators, affiliator] }));
  },

  update: async (affiliatorId, data) => {
    const updated = await updateAffiliatorApi(affiliatorId, data);
    set((state) => ({
      affiliators: state.affiliators.map((a) => (a.id === affiliatorId ? updated : a)),
    }));
  },

  remove: async (affiliatorId) => {
    await deleteAffiliatorApi(affiliatorId);
    set((state) => ({
      affiliators: state.affiliators.filter((a) => a.id !== affiliatorId),
    }));
  },
}));
