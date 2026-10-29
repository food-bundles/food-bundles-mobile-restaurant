import { create } from "zustand";
import type { Transaction } from "@/types";
import { getCache, setCache, clearCache } from "@/lib";
import {
  getWalletApi,
  topUpWalletApi,
  getTransactionsApi,
  verifyTopUpApi,
  getVoucherTransfersApi,
  type TopUpResult,
  type VoucherTransfer,
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
  voucherTransfers: VoucherTransfer[];
  fetch: () => Promise<void>;
  fetchVoucherTransfers: () => Promise<void>;
  topUp: (
    amount: number,
    method?: "MOBILE_MONEY" | "CARD",
    phone?: string,
  ) => Promise<TopUpResult>;
  verifyTopUp: (txId: string) => Promise<{ verified: boolean; status: string; message?: string }>;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  status: "idle",
  walletId: null,
  balance: 0,
  transactions: [],
  voucherTransfers: [],

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

  fetchVoucherTransfers: async () => {
    try {
      const transfers = await getVoucherTransfersApi();
      set({ voucherTransfers: transfers });
    } catch {
      // non-critical — leave existing state
    }
  },

  topUp: async (amount, method = "MOBILE_MONEY", phone) => {
    const clamped = Math.min(MAX_TOP_UP, Math.max(0, Math.round(amount)));
    set({ status: "loading" });
    const walletId = get().walletId;
    try {
      let result: TopUpResult = { transactionId: '', status: 'pending' };
      if (walletId) {
        result = await topUpWalletApi({
          walletId,
          amount: clamped,
          paymentMethod: method,
          phoneNumber: phone,
        });
      }
      await clearCache(CACHE_KEY);
      // For MoMo: optimistically credit; real balance refreshed on next fetch.
      // For Card: balance will only be credited after Flutterwave confirms — don't optimistically add.
      if (method !== 'CARD') {
        set({ status: "ready", balance: get().balance + clamped });
      } else {
        set({ status: "ready" });
      }
      return result;
    } catch {
      set({ status: "ready" });
      throw new Error("Top-up failed. Please try again.");
    }
  },

  verifyTopUp: async (txId: string) => {
    const result = await verifyTopUpApi(txId);
    if (result.verified) {
      await clearCache(CACHE_KEY);
      // Re-fetch to get the actual confirmed balance
      const wallet = await getWalletApi();
      set({ walletId: wallet.id, balance: wallet.balance });
    }
    return result;
  },
}));
