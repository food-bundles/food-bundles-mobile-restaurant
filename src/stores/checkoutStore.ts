import { create } from 'zustand';
import type { PaymentMethod } from '@/mocks/types';

interface CheckoutState {
  address: string;
  windowIndex: number;
  method: PaymentMethod;
  phone: string;
  setAddress: (address: string) => void;
  setWindowIndex: (index: number) => void;
  setMethod: (method: PaymentMethod) => void;
  setPhone: (phone: string) => void;
  reset: () => void;
}

const INITIAL = {
  address: 'KG 11 Ave, Kimihurura, Kigali',
  windowIndex: 0,
  method: 'MOBILE_MONEY' as PaymentMethod,
  phone: '+250 788 123 456',
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  ...INITIAL,
  setAddress: (address) => set({ address }),
  setWindowIndex: (windowIndex) => set({ windowIndex }),
  setMethod: (method) => set({ method }),
  setPhone: (phone) => set({ phone }),
  reset: () => set(INITIAL),
}));
