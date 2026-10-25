import { create } from "zustand";
import { ORDER_STEPS, type Order } from "@/mocks/types";
import { getCache, setCache, clearCache } from "@/lib";
import {
  getOrdersApi,
  getOrderByIdApi,
  cancelOrderApi,
  reorderApi,
} from "@/api/orders.api";
export type AsyncStatus = "idle" | "loading" | "ready" | "error";

const CACHE_KEY = "orders_list";
const CACHE_TTL_MS = 30_000;

export interface OrderStatusAdvance {
  orderId: string;
  newStatus: (typeof ORDER_STEPS)[number];
}

interface OrdersState {
  status: AsyncStatus;
  orders: Order[];
  fetch: () => Promise<void>;
  refresh: () => Promise<void>;
  simulateFailure: () => Promise<void>;
  fetchById: (orderId: string) => Promise<Order | null>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
  reorder: (orderId: string) => Promise<void>;
  advanceOrderStatus: (orderId: string) => OrderStatusAdvance | null;
}

export const useOrdersStore = create<OrdersState>((set, get) => ({
  status: "idle",
  orders: [],

  fetch: async () => {
    set({ status: "loading" });
    const cached = await getCache<Order[]>(CACHE_KEY);
    if (cached) {
      set({ status: "ready", orders: cached });
      return;
    }
    try {
      const result = await getOrdersApi({ limit: 50 });
      await setCache(CACHE_KEY, result.orders, CACHE_TTL_MS);
      set({ status: "ready", orders: result.orders });
    } catch {
      set({ status: "error", orders: [] });
    }
  },

  refresh: async () => {
    set({ status: "loading" });
    await clearCache(CACHE_KEY);
    try {
      const result = await getOrdersApi({ limit: 50 });
      await setCache(CACHE_KEY, result.orders, CACHE_TTL_MS);
      set({ status: "ready", orders: result.orders });
    } catch {
      set({ status: "error", orders: [] });
    }
  },

  simulateFailure: async () => {
    set({ status: "loading" });
    set({ status: "error", orders: [] });
  },

  fetchById: async (orderId) => {
    try {
      return await getOrderByIdApi(orderId);
    } catch {
      return get().orders.find((o) => o.id === orderId) ?? null;
    }
  },

  cancelOrder: async (orderId, reason) => {
    await cancelOrderApi(orderId, reason);
    await clearCache(CACHE_KEY);
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, status: "CANCELLED", step: 0 } : o,
      ),
    }));
  },

  reorder: async (orderId) => {
    await reorderApi(orderId);
    await clearCache(CACHE_KEY);
  },

  advanceOrderStatus: (orderId) => {
    const order = get().orders.find((o) => o.id === orderId);
    if (!order) return null;
    const currentIndex = ORDER_STEPS.indexOf(
      order.status as (typeof ORDER_STEPS)[number],
    );
    if (currentIndex === -1 || currentIndex >= ORDER_STEPS.length - 1)
      return null;
    const newStatus = ORDER_STEPS[currentIndex + 1];
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, step: currentIndex + 2 }
          : o,
      ),
    }));
    clearCache(CACHE_KEY);
    return { orderId, newStatus };
  },
}));
