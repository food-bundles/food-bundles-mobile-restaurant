import { create } from "zustand";
import {
  getCartApi,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
  type ApiCart,
} from "@/api/cart.api";
import { ApiError } from "@/api/client";

export interface CartLine {
  productId: string;
  cartItemId?: string; // backend cart item id, present after sync
  qty: number;
  unitPrice?: number;
  name?: string;
  unit?: string;
  imageUrl?: string;
}

interface CartState {
  lines: CartLine[];
  serverCart: ApiCart | null;
  synced: boolean;
  /** Pull cart from backend; falls back to local lines on 401. */
  fetchCart: () => Promise<void>;
  add: (productId: string) => void;
  addQty: (productId: string, qty: number) => void;
  inc: (productId: string) => void;
  dec: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  /** Sync a single add to the backend. */
  syncAdd: (productId: string, quantity: number) => Promise<void>;
  /** Sync a quantity update to the backend. */
  syncUpdate: (cartItemId: string, quantity: number) => Promise<void>;
  /** Sync a remove to the backend. */
  syncRemove: (cartItemId: string) => Promise<void>;
  /** Sync clear to the backend. */
  syncClear: () => Promise<void>;
  itemCount: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  lines: [],
  serverCart: null,
  synced: false,

  fetchCart: async () => {
    try {
      const cart = await getCartApi();
      if (!cart) {
        set({ serverCart: null, lines: [], synced: true });
        return;
      }
      const lines: CartLine[] = cart.cartItems.map((item) => ({
        productId: item.productId,
        cartItemId: item.id,
        qty: item.quantity,
        unitPrice: item.unitPrice,
        name: item.product?.productName,
        unit: item.product?.unit,
        imageUrl: item.product?.images?.[0] ?? undefined,
      }));
      set({ serverCart: cart, lines, synced: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        set({ synced: false });
      }
    }
  },

  add: (productId) =>
    set((state) => {
      const existing = state.lines.find((l) => l.productId === productId);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, qty: l.qty + 1 } : l,
          ),
        };
      }
      return { lines: [...state.lines, { productId, qty: 1 }] };
    }),

  addQty: (productId, qty) =>
    set((state) => {
      const existing = state.lines.find((l) => l.productId === productId);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.productId === productId ? { ...l, qty: l.qty + qty } : l,
          ),
        };
      }
      return { lines: [...state.lines, { productId, qty }] };
    }),

  inc: (productId) =>
    set((state) => ({
      lines: state.lines.map((l) =>
        l.productId === productId ? { ...l, qty: l.qty + 1 } : l,
      ),
    })),

  dec: (productId) =>
    set((state) => ({
      lines: state.lines
        .map((l) => (l.productId === productId ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    })),

  remove: (productId) =>
    set((state) => ({
      lines: state.lines.filter((l) => l.productId !== productId),
    })),

  clear: () => set({ lines: [], serverCart: null }),

  syncAdd: async (productId, quantity) => {
    const item = await addToCartApi(productId, quantity);
    set((state) => ({
      lines: state.lines.map((l) =>
        l.productId === productId
          ? {
              ...l,
              cartItemId: item.id,
              unitPrice: item.unitPrice,
              name: item.product?.productName ?? l.name,
              unit: item.product?.unit ?? l.unit,
              imageUrl: item.product?.images?.[0] ?? l.imageUrl,
            }
          : l,
      ),
    }));
  },

  syncUpdate: async (cartItemId, quantity) => {
    await updateCartItemApi(cartItemId, quantity);
  },

  syncRemove: async (cartItemId) => {
    await removeCartItemApi(cartItemId);
  },

  syncClear: async () => {
    await clearCartApi();
    set({ lines: [], serverCart: null });
  },

  itemCount: () => get().lines.reduce((sum, l) => sum + l.qty, 0),

  subtotal: () =>
    get().lines.reduce((sum, l) => {
      return sum + (l.unitPrice ?? 0) * l.qty;
    }, 0),
}));
