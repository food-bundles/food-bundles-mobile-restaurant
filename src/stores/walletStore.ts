import { create } from 'zustand';
import { account } from '@/mocks/account';
import { transactions as seedTransactions } from '@/mocks/transactions';
import type { Transaction } from '@/mocks/types';
import { sleep } from '@/lib';

export type AsyncStatus = 'idle' | 'loading' | 'ready' | 'error';

const MAX_TOP_UP = 5000000;

interface WalletState {
  status: AsyncStatus;
  balance: number;
  transactions: Transaction[];
  fetch: () => Promise<void>;
  topUp: (amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  status: 'idle',
  balance: account.walletBalance,
  transactions: [],
  fetch: async () => {
    set({ status: 'loading' });
    await sleep(700);
    set({ status: 'ready', transactions: seedTransactions });
  },
  topUp: async (amount) => {
    const clamped = Math.min(MAX_TOP_UP, Math.max(0, Math.round(amount)));
    set({ status: 'loading' });
    await sleep(1300);
    set({ status: 'ready', balance: get().balance + clamped });
  },
}));

export { MAX_TOP_UP };
