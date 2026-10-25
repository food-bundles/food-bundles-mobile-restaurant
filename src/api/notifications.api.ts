import { request } from './client';
import type { AppNotification, NotificationChannel } from '@/mocks/types';

interface ApiNotification {
  id: string;
  title: string;
  message: string;
  eventType: string;
  isRead: boolean;
  createdAt: string;
  metadata?: { deepLink?: string; imageUri?: string; actionLabel?: string };
}

const EVENT_TO_CHANNEL: Record<string, NotificationChannel> = {
  ORDER_PLACED: 'order', ORDER_CONFIRMED: 'order', ORDER_DELIVERED: 'order',
  ORDER_CANCELLED: 'order', ORDER_STATUS_CHANGED: 'order',
  WALLET_TOP_UP: 'wallet', WALLET_PAYMENT: 'wallet', LOW_BALANCE: 'wallet',
  VOUCHER_ISSUED: 'voucher', VOUCHER_APPLIED: 'voucher', VOUCHER_EXPIRING: 'voucher',
  MARKET_PRICE_UPDATE: 'marketPrice', PRICE_ALERT: 'priceAlert',
  DATA_CONSENT_EXPIRING: 'consent', REPAYMENT_DUE: 'repayment', REPAYMENT_SETTLED: 'repayment',
  PRODUCT_APPROVED: 'system', SYSTEM: 'system',
};

function toMobileNotification(n: ApiNotification): AppNotification {
  return {
    id: n.id,
    channel: EVENT_TO_CHANNEL[n.eventType] ?? 'system',
    title: n.title,
    body: n.message,
    imageUri: n.metadata?.imageUri,
    deepLink: n.metadata?.deepLink,
    timestamp: n.createdAt,
    read: n.isRead,
    actionLabel: n.metadata?.actionLabel,
  };
}

export async function getNotificationsApi(params?: {
  page?: number;
  limit?: number;
  isRead?: boolean;
}): Promise<{ notifications: AppNotification[]; total: number }> {
  const res = await request<{
    data: ApiNotification[];
    pagination: { total: number };
  }>('/notifications', { params: params as any });
  return {
    notifications: res.data.map(toMobileNotification),
    total: res.pagination.total,
  };
}

export async function getUnreadCountApi(): Promise<number> {
  const res = await request<{ data: { unreadCount: number } }>('/notifications/unread-count');
  return res.data.unreadCount;
}

export async function markNotificationReadApi(notificationId: string): Promise<void> {
  await request(`/notifications/${notificationId}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsReadApi(): Promise<void> {
  await request('/notifications/mark-all-read', { method: 'PATCH' });
}
