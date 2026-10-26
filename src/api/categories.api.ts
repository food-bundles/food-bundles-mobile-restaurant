import { request } from './client';

export interface ApiProductCategory {
  id: string;
  name: string;
  description: string | null;
}

export async function getProductCategoriesApi(): Promise<ApiProductCategory[]> {
  const res = await request<{ data: ApiProductCategory[] }>('/products/categories');
  return res.data;
}
