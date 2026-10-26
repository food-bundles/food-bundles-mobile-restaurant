import { create } from 'zustand';
import type { Address } from '@/types';
import {
  getAddressesApi,
  createAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from '@/api/addresses.api';

interface AddressesState {
  addresses: Address[];
  status: 'idle' | 'loading' | 'ready' | 'error';
  fetch: () => Promise<void>;
  create: (data: { label: string; street: string; landmark?: string; phone: string; isDefault?: boolean }) => Promise<void>;
  update: (id: string, data: Partial<Address>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useAddressesStore = create<AddressesState>((set) => ({
  addresses: [],
  status: 'idle',

  fetch: async () => {
    set({ status: 'loading' });
    try {
      const addresses = await getAddressesApi();
      set({ addresses, status: 'ready' });
    } catch {
      set({ status: 'error' });
    }
  },

  create: async (data) => {
    const address = await createAddressApi(data);
    set((state) => ({ addresses: [...state.addresses, address] }));
  },

  update: async (id, data) => {
    const updated = await updateAddressApi(id, data);
    set((state) => ({
      addresses: state.addresses.map((a) => (a.id === id ? updated : a)),
    }));
  },

  remove: async (id) => {
    await deleteAddressApi(id);
    set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) }));
  },
}));
