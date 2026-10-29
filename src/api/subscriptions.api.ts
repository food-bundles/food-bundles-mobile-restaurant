import { request } from './client';
import type { Plan, Tier } from '@/types';

interface ApiPlan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  voucherAccess: boolean;
  freeDelivery: boolean;
  stablePricing?: boolean;
  receiveEBM?: boolean;
  advertisingAccess?: boolean;
  otherServices?: boolean;
  isActive: boolean;
}

interface ApiSubscription {
  id: string;
  planId: string;
  status: string;
  startDate: string;
  endDate: string;
  daysRemaining: number;
  plan: ApiPlan;
  txRef?: string;
}

function toMobilePlan(p: ApiPlan): Plan {
  const isWeekly = p.duration <= 7;
  const monthly = isWeekly ? p.price * 4 : p.price;
  const weekly = isWeekly ? p.price : Math.round(p.price / 4);
  const upper = p.name.toUpperCase();
  const tier: Exclude<Tier, 'NONE'> =
    upper.includes('PREMIUM') ? 'PREMIUM' : upper.includes('STANDARD') ? 'STANDARD' : 'BASIC';
  return {
    id: tier,
    dbId: p.id, // actual DB UUID used when subscribing
    name: p.name,
    monthly,
    weekly,
    features: p.features ?? [],
    voucherAccess: p.voucherAccess,
    freeDelivery: p.freeDelivery,
    stablePricing: p.stablePricing,
    receiveEBM: p.receiveEBM,
    advertisingAccess: p.advertisingAccess,
  };
}

export async function getSubscriptionPlansApi(): Promise<Plan[]> {
  const res = await request<{ data: ApiPlan[] }>('/subscriptions/plans');
  return res.data.map(toMobilePlan);
}

export interface CurrentSubscription {
  id: string;
  status: string;
  daysRemaining: number;
  plan: Plan;
  endDate: string;
  txRef?: string;
}

export async function getCurrentSubscriptionApi(): Promise<CurrentSubscription | null> {
  const res = await request<{ data: ApiSubscription | null }>('/subscriptions/current');
  if (!res.data) return null;
  return {
    id: res.data.id,
    status: res.data.status,
    daysRemaining: res.data.daysRemaining,
    endDate: res.data.endDate,
    txRef: res.data.txRef,
    plan: toMobilePlan(res.data.plan),
  };
}

export interface SubscribeResult {
  txRef?: string;
  redirectUrl?: string;
  status: string;
  requiresPolling: boolean;
}

export async function subscribeApi(data: {
  planId: string;
  paymentMethod?: string;
  phoneNumber?: string;
}): Promise<SubscribeResult> {
  const res = await request<{
    data: {
      subscription?: { txRef?: string };
      payment?: { redirectUrl?: string; status?: string; transactionId?: string };
      isUpgrade?: boolean;
      isDowngrade?: boolean;
    };
  }>('/subscriptions', { method: 'POST', body: data });

  const txRef = res.data?.subscription?.txRef ?? undefined;
  const redirectUrl = res.data?.payment?.redirectUrl ?? undefined;
  const status = res.data?.payment?.status ?? 'pending';
  const requiresPolling = status === 'pending' || status === 'processing';
  return { txRef, redirectUrl, status, requiresPolling };
}

export async function changePlanApi(data: {
  newPlanId: string;
  phoneNumber?: string;
}): Promise<SubscribeResult> {
  const res = await request<{
    data: {
      subscription?: { txRef?: string };
      payment?: { redirectUrl?: string; status?: string };
    };
  }>('/subscriptions/change-plan', { method: 'PATCH', body: data });

  const txRef = res.data?.subscription?.txRef ?? undefined;
  const redirectUrl = res.data?.payment?.redirectUrl ?? undefined;
  const status = res.data?.payment?.status ?? 'pending';
  return { txRef, redirectUrl, status, requiresPolling: status === 'pending' || status === 'processing' };
}

export async function renewSubscriptionApi(data?: {
  phoneNumber?: string;
}): Promise<SubscribeResult> {
  const res = await request<{
    data: {
      subscription?: { txRef?: string };
      payment?: { redirectUrl?: string; status?: string };
    };
  }>('/subscriptions/renew', { method: 'POST', body: data ?? {} });

  const txRef = res.data?.subscription?.txRef ?? undefined;
  const redirectUrl = res.data?.payment?.redirectUrl ?? undefined;
  const status = res.data?.payment?.status ?? 'pending';
  return { txRef, redirectUrl, status, requiresPolling: status === 'pending' || status === 'processing' };
}

export async function verifySubscriptionPaymentApi(txRef: string): Promise<{
  verified: boolean;
  status: string;
  subscriptionStatus?: string;
  planName?: string;
}> {
  const res = await request<{
    data: { verified: boolean; status: string; subscriptionStatus?: string; planName?: string };
  }>(`/subscriptions/verify/${encodeURIComponent(txRef)}`);
  return res.data;
}

export interface SubscriptionHistoryEntry {
  id: string;
  action: string;
  oldStatus?: string;
  newStatus?: string;
  reason?: string;
  createdAt: string;
}

export async function getSubscriptionHistoryApi(): Promise<SubscriptionHistoryEntry[]> {
  const res = await request<{ data: SubscriptionHistoryEntry[] }>('/subscriptions/history');
  return res.data ?? [];
}

export async function cancelSubscriptionApi(reason?: string): Promise<void> {
  await request('/subscriptions', { method: 'DELETE', body: { reason } });
}
