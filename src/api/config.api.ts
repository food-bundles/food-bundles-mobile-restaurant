import { request } from './client';

export interface ApiPaymentMethod {
  id: string;
  name: string;
  description: string | null;
}

export async function getPaymentMethodsApi(): Promise<ApiPaymentMethod[]> {
  const res = await request<{ data: ApiPaymentMethod[] }>('/config/payment-methods');
  return res.data;
}

export async function getDeliveryFeeApi(): Promise<number> {
  const res = await request<{ data: { fee: number } }>('/config/delivery-fee');
  return res.data.fee;
}
