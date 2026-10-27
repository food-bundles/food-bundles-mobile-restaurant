import { request } from './client';
import type { Affiliator } from '@/types';

interface ApiAffiliator {
  id: string;
  name: string;
  role: string;
  createdAt: string;
}

function toMobileAffiliator(a: ApiAffiliator): Affiliator {
  return {
    id: a.id,
    name: a.name,
    role: a.role ?? 'Staff',
    status: 'ACTIVE',
  };
}

export async function getAffiliatorsApi(): Promise<Affiliator[]> {
  const res = await request<{ data: ApiAffiliator[] }>('/affiliators');
  return res.data.map(toMobileAffiliator);
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

export async function deleteAffiliatorApi(affiliatorId: string): Promise<void> {
  await request(`/affiliators/${affiliatorId}`, { method: 'DELETE' });
}
