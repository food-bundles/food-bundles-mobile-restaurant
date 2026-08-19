import { create } from 'zustand';
import { notifications as seedNotifications } from '@/mocks/notifications';
import type { NotificationItem } from '@/mocks/types';
import { sleep, getCache, setCache, clearCache } from '@/lib';

export type AsyncStatus = 'idle' | 'loading' | 'ready' | 'error';

const CACHE_KEY = 'notifications_list';
const CACHE_TTL_MS = 60_000;

interface NotificationsState {
  status: AsyncStatus;
  items: NotificationItem[];
  fetch: () => Promise<void>;
  markRead: (id: string) => void;
  unreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  status: 'idle',
  items: [],
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
}));
