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
}

function toMobilePlan(p: ApiPlan): Plan {
  // duration in days: 30 = monthly, 7 = weekly
  const isWeekly = p.duration <= 7;
  const monthly = isWeekly ? p.price * 4 : p.price;
  const weekly = isWeekly ? p.price : Math.round(p.price / 4);
  const upper = p.name.toUpperCase();
  const tier: Exclude<Tier, 'NONE'> =
    upper.includes('PREMIUM') ? 'PREMIUM' : upper.includes('STANDARD') ? 'STANDARD' : 'BASIC';
  return {
    id: tier,
    name: p.name,
    monthly,
    weekly,
    features: p.features ?? [],
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
}

export async function getCurrentSubscriptionApi(): Promise<CurrentSubscription | null> {
  const res = await request<{ data: ApiSubscription | null }>('/subscriptions/current');
  if (!res.data) return null;
  return {
    id: res.data.id,
    status: res.data.status,
    daysRemaining: res.data.daysRemaining,
    endDate: res.data.endDate,
    plan: toMobilePlan(res.data.plan),
  };
}

export async function subscribeApi(data: {
  planId: string;
  paymentMethod?: string;
  phoneNumber?: string;
}): Promise<void> {
  await request('/subscriptions', { method: 'POST', body: data });
}

export async function cancelSubscriptionApi(reason?: string): Promise<void> {
  await request('/subscriptions', { method: 'DELETE', body: { reason } });
}
