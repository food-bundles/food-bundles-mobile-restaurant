import { create } from 'zustand';
import { notifications as seedNotifications } from '@/mocks/notifications';
import type { NotificationItem } from '@/mocks/types';
import { sleep, getCache, setCache, clearCache } from '@/lib';

export type AsyncStatus = 'idle' | 'loading' | 'ready' | 'error';

const CACHE_KEY = 'notifications_list';
const CACHE_TTL_MS = 60_000;

export interface PriceAlert {
  productId: string;
  thresholdRwf: number;
  direction: 'above' | 'below';
}

interface NotificationsState {
  status: AsyncStatus;
  items: NotificationItem[];
  priceAlerts: PriceAlert[];
  fetch: () => Promise<void>;
  markRead: (id: string) => void;
  unreadCount: () => number;
  /** Records a custom price threshold; replaces any existing alert for the same product. */
  setPriceAlert: (productId: string, thresholdRwf: number, direction: PriceAlert['direction']) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  status: 'idle',
  items: [],
  priceAlerts: [],
  fetch: async () => {
    set({ status: 'loading' });
    const cached = await getCache<NotificationItem[]>(CACHE_KEY);
    if (cached) {
      set({ status: 'ready', items: cached });
      return;
    }
    await sleep(700);
    await setCache(CACHE_KEY, seedNotifications, CACHE_TTL_MS);
    set({ status: 'ready', items: seedNotifications });
  },
  markRead: (id) => {
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    }));
    clearCache(CACHE_KEY);
  },
  unreadCount: () => get().items.filter((item) => !item.read).length,
  setPriceAlert: (productId, thresholdRwf, direction) =>
    set((state) => ({
      priceAlerts: [
        ...state.priceAlerts.filter((alert) => alert.productId !== productId),
        { productId, thresholdRwf, direction },
      ],
    })),
}));
