import { create } from 'zustand';
import type { Affiliator } from '@/types';
import { getAffiliatorsApi, createAffiliatorApi, deleteAffiliatorApi } from '@/api/affiliators.api';

interface AffiliatorsState {
  affiliators: Affiliator[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  fetch: () => Promise<void>;
  create: (data: { name: string; email?: string; phone?: string }) => Promise<void>;
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

  create: async (data) => {
    const affiliator = await createAffiliatorApi(data);
    set((state) => ({ affiliators: [...state.affiliators, affiliator] }));
  },

  remove: async (affiliatorId) => {
    await deleteAffiliatorApi(affiliatorId);
    set((state) => ({
      affiliators: state.affiliators.filter((a) => a.id !== affiliatorId),
    }));
  },
}));
