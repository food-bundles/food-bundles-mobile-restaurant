import { create } from 'zustand';
import type { PaymentMethod } from '@/types';

const MINIMUM_ORDER = 100000;
const SMALL_ORDER_FEE = 5000;

export interface CartLine {
  productId: string;
  qty: number;
  unitPrice: number;
}

interface GuestCartState {
  lines: CartLine[];
  add: (productId: string, unitPrice?: number) => void;
  inc: (productId: string) => void;
  dec: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  itemCount: () => number;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
  allowedMethods: () => PaymentMethod[];
}

export const useGuestCartStore = create<GuestCartState>((set, get) => ({
  lines: [],
  add: (productId, unitPrice = 0) =>
    set((state) => {
      const existing = state.lines.find((l) => l.productId === productId);
      if (existing) {
        return { lines: state.lines.map((l) => l.productId === productId ? { ...l, qty: l.qty + 1 } : l) };
      }
      return { lines: [...state.lines, { productId, qty: 1, unitPrice }] };
    }),
  inc: (productId) =>
    set((state) => ({ lines: state.lines.map((l) => l.productId === productId ? { ...l, qty: l.qty + 1 } : l) })),
  dec: (productId) =>
    set((state) => ({
      lines: state.lines.map((l) => l.productId === productId ? { ...l, qty: l.qty - 1 } : l).filter((l) => l.qty > 0),
    })),
  remove: (productId) => set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
  clear: () => set({ lines: [] }),
  itemCount: () => get().lines.reduce((sum, l) => sum + l.qty, 0),
  subtotal: () => get().lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0),
  deliveryFee: () => (get().subtotal() > 0 && get().subtotal() < MINIMUM_ORDER ? SMALL_ORDER_FEE : 0),
  total: () => get().subtotal() + get().deliveryFee(),
  allowedMethods: () => ['MOBILE_MONEY', 'CARD'],
}));

export { MINIMUM_ORDER, SMALL_ORDER_FEE };
