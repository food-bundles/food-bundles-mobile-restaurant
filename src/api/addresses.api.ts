import { request } from './client';
import type { Address } from '@/types';

interface ApiAddress {
  id: string;
  label: string;
  street: string;
  landmark?: string | null;
  phone: string;
  isDefault: boolean;
}

function toMobileAddress(a: ApiAddress): Address {
  return {
    id: a.id,
    label: a.label,
    street: a.street,
    landmark: a.landmark ?? undefined,
    phone: a.phone,
    isDefault: a.isDefault,
  };
}

export async function getAddressesApi(): Promise<Address[]> {
  const res = await request<{ data: ApiAddress[] }>('/addresses');
  return res.data.map(toMobileAddress);
}

export async function createAddressApi(data: {
  label: string;
  street: string;
  landmark?: string;
  phone: string;
  isDefault?: boolean;
}): Promise<Address> {
  const res = await request<{ data: ApiAddress }>('/addresses', {
    method: 'POST',
    body: data,
  });
  return toMobileAddress(res.data);
}

export async function updateAddressApi(
  addressId: string,
  data: Partial<{ label: string; street: string; landmark: string; phone: string; isDefault: boolean }>,
): Promise<Address> {
  const res = await request<{ data: ApiAddress }>(`/addresses/${addressId}`, {
    method: 'PUT',
    body: data,
  });
  return toMobileAddress(res.data);
}

export async function deleteAddressApi(addressId: string): Promise<void> {
  await request(`/addresses/${addressId}`, { method: 'DELETE' });
}
