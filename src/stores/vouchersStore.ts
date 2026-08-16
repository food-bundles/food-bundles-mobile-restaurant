import { create } from 'zustand';
import { account } from '@/mocks/account';
import { sleep } from '@/lib';
import type { Tier } from '@/mocks/types';

const CREDIT_MIN = 50000;
const CREDIT_MAX = 500000;

interface VouchersState {
  creditLimit: number;
  creditUsed: number;
  dueDate: string;
  requestedAmount: number;
  approved: boolean;
  submitting: boolean;
  adjustRequested: (delta: number) => void;
  submitRequest: () => Promise<void>;
  /** Records a completed voucher payment against the credit line, raising creditUsed. */
  deductCredit: (amount: number) => void;
}

export const useVouchersStore = create<VouchersState>((set, get) => ({
  creditLimit: account.creditLine.limit,
  creditUsed: account.creditLine.used,
  dueDate: account.creditLine.dueDate,
  requestedAmount: account.creditLine.limit,
  approved: false,
  submitting: false,
  adjustRequested: (delta) =>
    set((state) => ({
      requestedAmount: Math.min(CREDIT_MAX, Math.max(CREDIT_MIN, state.requestedAmount + delta)),
    })),
  submitRequest: async () => {
    set({ submitting: true });
    await sleep(1300);
    set({ submitting: false, approved: true, creditLimit: get().requestedAmount });
  },
  deductCredit: (amount) =>
    set((state) => ({ creditUsed: Math.min(state.creditLimit, state.creditUsed + amount) })),
}));

export const isVouchersUnlocked = (tier: Tier): boolean => tier !== 'NONE';
export { CREDIT_MIN, CREDIT_MAX };
