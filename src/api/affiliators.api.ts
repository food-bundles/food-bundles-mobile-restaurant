import { request } from './client';
import type { Affiliator, AffiliatorOrder } from '@/types';

interface ApiAffiliatorOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface ApiAffiliator {
  id: string;
  name: string;
  role: string;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
  orders?: ApiAffiliatorOrder[];
}

function toMobileAffiliator(a: ApiAffiliator): Affiliator {
  return {
    id: a.id,
    name: a.name,
    role: a.role ?? 'AFFILIATOR',
    status: 'ACTIVE',
    phone: a.phone ?? undefined,
    email: a.email ?? undefined,
    createdAt: a.createdAt,
    orders: a.orders?.map((o): AffiliatorOrder => ({
      id: o.id,
      orderNumber: o.orderNumber,
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: o.createdAt,
    })),
  };
}

export async function getAffiliatorsApi(): Promise<Affiliator[]> {
  const res = await request<{ data: ApiAffiliator[] }>('/affiliators');
  return res.data.map(toMobileAffiliator);
}

export async function getAffiliatorApi(affiliatorId: string): Promise<Affiliator> {
  const res = await request<{ data: ApiAffiliator }>(`/affiliators/${affiliatorId}`);
  return toMobileAffiliator(res.data);
}

export async function createAffiliatorApi(data: {
  name: string;
  email?: string;
  phone?: string;
}): Promise<Affiliator> {
  const res = await request<{ data: ApiAffiliator }>('/affiliators', {
    method: 'POST',
    body: data,
  });
  return toMobileAffiliator(res.data);
}

export async function updateAffiliatorApi(
  affiliatorId: string,
  data: { name?: string; phone?: string },
): Promise<Affiliator> {
  const res = await request<{ data: ApiAffiliator }>(`/affiliators/${affiliatorId}`, {
    method: 'PATCH',
    body: data,
  });
  return toMobileAffiliator(res.data);
}

export async function deleteAffiliatorApi(affiliatorId: string): Promise<void> {
  await request(`/affiliators/${affiliatorId}`, { method: 'DELETE' });
}
