import { create } from "zustand";
import type { AppNotification, NotificationChannel } from "@/mocks/types";
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
} from "@/api/notifications.api";
export interface PriceAlert {
  productId: string;
  thresholdRwf: number;
  direction: "above" | "below";
}

const DEFAULT_CHANNEL_PREFS: Record<NotificationChannel, boolean> = {
  order: true,
  wallet: true,
  voucher: true,
  marketPrice: true,
  priceAlert: true,
  consent: true,
  repayment: true,
  system: true,
};

interface NotificationsState {
  notifications: AppNotification[];
  priceAlerts: PriceAlert[];
  channelPrefs: Record<NotificationChannel, boolean>;
  loaded: boolean;
  unreadCount: () => number;
  fetchNotifications: () => Promise<void>;
  addNotification: (notification: AppNotification) => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotification: (id: string) => void;
  toggleChannel: (channel: NotificationChannel, enabled: boolean) => void;
  setPriceAlert: (
    productId: string,
    thresholdRwf: number,
    direction: PriceAlert["direction"],
  ) => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  priceAlerts: [],
  channelPrefs: DEFAULT_CHANNEL_PREFS,
  loaded: false,

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  fetchNotifications: async () => {
    try {
      const result = await getNotificationsApi({ limit: 100 });
      set({ notifications: result.notifications, loaded: true });
    } catch {
      set({ notifications: [], loaded: true });
    }
  },

  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),

  markRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
    try {
      await markNotificationReadApi(id);
    } catch {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: false } : n,
        ),
      }));
    }
  },

  markAllRead: async () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    try {
      await markAllNotificationsReadApi();
    } catch {
      // best-effort; local state already updated
    }
  },

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  toggleChannel: (channel, enabled) =>
    set((state) => ({
      channelPrefs: { ...state.channelPrefs, [channel]: enabled },
    })),

  setPriceAlert: (productId, thresholdRwf, direction) =>
    set((state) => ({
      priceAlerts: [
        ...state.priceAlerts.filter((a) => a.productId !== productId),
        { productId, thresholdRwf, direction },
      ],
    })),
}));
