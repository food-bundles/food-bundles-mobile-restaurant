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
