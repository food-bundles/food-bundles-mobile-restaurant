import { create } from "zustand";
import type { Transaction } from "@/types";
import { getCache, setCache, clearCache } from "@/lib";
import {
  getWalletApi,
  topUpWalletApi,
  getTransactionsApi,
} from "@/api/wallet.api";
export type AsyncStatus = "idle" | "loading" | "ready" | "error";

export const MAX_TOP_UP = 5000000;
const CACHE_KEY = "wallet_transactions";
const CACHE_TTL_MS = 30_000;

interface WalletState {
  status: AsyncStatus;
  walletId: string | null;
  balance: number;
  transactions: Transaction[];
  fetch: () => Promise<void>;
  topUp: (
    amount: number,
    method?: "MOBILE_MONEY" | "CARD",
    phone?: string,
  ) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  status: "idle",
  walletId: null,
  balance: 0,
  transactions: [],

  fetch: async () => {
    set({ status: "loading" });
    const cached = await getCache<Transaction[]>(CACHE_KEY);
    if (cached) {
      set({ status: "ready", transactions: cached });
      return;
    }
    try {
      const [wallet, txResult] = await Promise.all([
        getWalletApi(),
        getTransactionsApi({ limit: 50 }),
      ]);
      await setCache(CACHE_KEY, txResult.transactions, CACHE_TTL_MS);
      set({
        status: "ready",
        walletId: wallet.id,
        balance: wallet.balance,
        transactions: txResult.transactions,
      });
    } catch {
      set({ status: "error", balance: 0, transactions: [] });
    }
  },

  topUp: async (amount, method = "MOBILE_MONEY", phone) => {
    const clamped = Math.min(MAX_TOP_UP, Math.max(0, Math.round(amount)));
    set({ status: "loading" });
    const walletId = get().walletId;
    try {
      if (walletId) {
        await topUpWalletApi({
          walletId,
          amount: clamped,
          paymentMethod: method,
          phoneNumber: phone,
        });
      }
      await clearCache(CACHE_KEY);
      // Optimistically update balance; real balance refreshed on next fetch
      set({ status: "ready", balance: get().balance + clamped });
    } catch {
      set({ status: "ready" });
      throw new Error("Top-up failed. Please try again.");
    }
  },
}));
