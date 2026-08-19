import { create } from 'zustand';
import { vouchers as seedVouchers } from '@/mocks/vouchers';
import type { Tier, Voucher } from '@/mocks/types';

interface VouchersState {
  vouchers: Voucher[];
  nextGrantDate: string;
  /** Marks one voucher as used against an order; no-op if it's already spent or missing. */
  redeemVoucher: (voucherId: string, orderId: string) => void;
}

export const useVouchersStore = create<VouchersState>((set) => ({
  vouchers: seedVouchers,
  nextGrantDate: '2026-09-01',
  redeemVoucher: (voucherId, orderId) =>
    set((state) => ({
      vouchers: state.vouchers.map((voucher) =>
        voucher.id === voucherId && voucher.status === 'AVAILABLE'
          ? { ...voucher, status: 'USED', usedAt: new Date().toISOString(), orderId }
          : voucher,
      ),
    })),
}));

export const isVouchersUnlocked = (tier: Tier): boolean => tier !== 'NONE';
