import { request } from './client';
import type { Order, OrderStatus, PaymentMethod } from '@/mocks/types';

interface ApiOrderItem {
  id: string;
  productId: string;
  product: { productName: string; unit: string };
  quantity: number;
  unitPrice: number;
}

interface ApiOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  deliveryFee: number;
  subtotal?: number;
  deliveryAddress: string;
  deliveryWindow?: string;
  orderItems: ApiOrderItem[];
}

interface OrdersResponse {
  data: ApiOrder[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const STATUS_STEP: Record<string, number> = {
  PENDING: 1, CONFIRMED: 2, PREPARING: 3, READY: 4, IN_TRANSIT: 5, DELIVERED: 6, CANCELLED: 0, REFUNDED: 0,
};

const METHOD_MAP: Record<string, PaymentMethod> = {
  MOBILE_MONEY: 'MOBILE_MONEY', CARD: 'CARD', CASH: 'CASH', VOUCHER: 'VOUCHER',
};

function toMobileOrder(o: ApiOrder): Order {
  const subtotal = o.subtotal ?? (o.totalAmount - (o.deliveryFee ?? 0));
  return {
    id: o.orderNumber ?? o.id,
    placedAt: o.createdAt,
    status: o.status as OrderStatus,
    step: STATUS_STEP[o.status] ?? 0,
    lines: (o.orderItems ?? []).map((item) => ({
      productId: item.productId,
      name: item.product?.productName ?? '',
      unit: item.product?.unit ?? '',
      qty: item.quantity,
      each: item.unitPrice,
    })),
    subtotal,
    deliveryFee: o.deliveryFee ?? 0,
    total: o.totalAmount,
    method: METHOD_MAP[o.paymentMethod] ?? 'CASH',
    window: o.deliveryWindow ?? '',
    address: o.deliveryAddress ?? '',
    ebmAvailable: false,
  };
}

export async function getOrdersApi(params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{ orders: Order[]; total: number; page: number; totalPages: number }> {
  const res = await request<OrdersResponse>('/orders', { params: params as any });
  return {
    orders: res.data.map(toMobileOrder),
    total: res.pagination.total,
    page: res.pagination.page,
    totalPages: res.pagination.totalPages,
  };
}

export async function getOrderByIdApi(orderId: string): Promise<Order> {
  const res = await request<{ data: ApiOrder }>(`/orders/${orderId}`);
  return toMobileOrder(res.data);
}

export async function cancelOrderApi(orderId: string, reason?: string): Promise<void> {
  await request(`/orders/${orderId}/cancel`, { method: 'POST', body: { reason } });
}

export async function reorderApi(orderId: string): Promise<void> {
  await request(`/orders/${orderId}/reorder`, { method: 'POST' });
}

export interface OrderStats {
  totalOrders: number;
  totalSpent: number;
  completedOrders: number;
  cancelledOrders: number;
}

export async function getOrderStatsApi(): Promise<OrderStats> {
  const res = await request<{ data: OrderStats }>('/orders/statistics');
  return res.data;
}
