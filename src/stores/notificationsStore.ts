import { create } from 'zustand';
import { notifications as seedNotifications } from '@/mocks/notifications';
import type { NotificationItem } from '@/mocks/types';
import { sleep } from '@/lib';

export type AsyncStatus = 'idle' | 'loading' | 'ready' | 'error';

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
    await sleep(700);
    set({ status: 'ready', items: seedNotifications });
  },
  markRead: (id) =>
    set((state) => ({
      items: state.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
    })),
  unreadCount: () => get().items.filter((item) => !item.read).length,
}));
