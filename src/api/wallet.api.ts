import { request } from './client';
import type { Transaction } from '@/types';

interface ApiTransaction {
  id: string;
  type: string;
  amount: number;
  createdAt: string;
  orderId?: string;
  description?: string;
  note?: string;
}

interface ApiWallet {
  id: string;
  balance: number;
  restaurantId: string;
}

const TX_TYPE_MAP: Record<string, Transaction['type']> = {
  TOP_UP: 'TOP_UP', CREDIT: 'TOP_UP', DEBIT: 'PAYMENT', PAYMENT: 'PAYMENT', REFUND: 'REFUND',
};

function toMobileTransaction(t: ApiTransaction): Transaction {
  return {
    id: t.id,
    type: TX_TYPE_MAP[t.type] ?? 'PAYMENT',
    amount: t.amount,
    date: t.createdAt,
    orderId: t.orderId,
    note: t.note ?? t.description ?? '',
  };
}

export async function getWalletApi(): Promise<{ id: string; balance: number }> {
  const res = await request<{ data: ApiWallet }>('/wallets');
  return { id: res.data.id, balance: res.data.balance };
}

export interface TopUpResult {
  transactionId: string;
  redirectUrl?: string;
  status: string;
}

export async function topUpWalletApi(params: {
  walletId: string;
  amount: number;
  paymentMethod: 'MOBILE_MONEY' | 'CARD';
  phoneNumber?: string;
}): Promise<TopUpResult> {
  const res = await request<{ data: { transaction?: { id: string }; redirectUrl?: string; status?: string } }>(
    '/wallets/top-up',
    { method: 'POST', body: params },
  );
  return {
    transactionId: res.data?.transaction?.id ?? '',
    redirectUrl: res.data?.redirectUrl,
    status: res.data?.status ?? 'pending',
  };
}

export async function verifyTopUpApi(txId: string): Promise<{ verified: boolean; status: string; message?: string }> {
  const res = await request<{ data: { verified: boolean; status: string; message?: string } }>(
    `/wallets/verify-top-up/${txId}`,
  );
  return res.data;
}

export interface VoucherTransfer {
  id: string;
  amount: number;
  source: string;
  status: string;
  transferredAt?: string;
  createdAt: string;
  notes?: string;
}

export async function getVoucherTransfersApi(): Promise<VoucherTransfer[]> {
  const res = await request<{ data: VoucherTransfer[] }>('/wallets/my-transfers');
  return res.data ?? [];
}

export async function getTransactionsApi(params?: {
  page?: number;
  limit?: number;
  type?: string;
}): Promise<{ transactions: Transaction[]; total: number; page: number; totalPages: number }> {
  const res = await request<{
    data: ApiTransaction[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  }>('/wallets/transactions', { params: params as any });
  return {
    transactions: res.data.map(toMobileTransaction),
    total: res.pagination.total,
    page: res.pagination.page,
    totalPages: res.pagination.totalPages,
  };
}
