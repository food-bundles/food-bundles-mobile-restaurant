import { create } from 'zustand';
import { orders as seedOrders } from '@/mocks/orders';
import type { Order } from '@/mocks/types';
import { sleep } from '@/lib';

export type AsyncStatus = 'idle' | 'loading' | 'ready' | 'error';

interface OrdersState {
  status: AsyncStatus;
  orders: Order[];
  fetch: () => Promise<void>;
  refresh: () => Promise<void>;
  simulateFailure: () => Promise<void>;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  status: 'idle',
  orders: [],
  fetch: async () => {
    set({ status: 'loading' });
    await sleep(900);
    set({ status: 'ready', orders: seedOrders });
  },
  refresh: async () => {
    set({ status: 'loading' });
    await sleep(900);
    set({ status: 'ready', orders: seedOrders });
  },
  simulateFailure: async () => {
    set({ status: 'loading' });
    await sleep(900);
    set({ status: 'error', orders: [] });
  },
}));
