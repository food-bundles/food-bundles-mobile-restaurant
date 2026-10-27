import { request } from './client';

export interface ApiCartItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product: { productName: string; unit: string; images: string[] };
}

export interface ApiCart {
  id: string;
  totalAmount: number;
  cartItems: ApiCartItem[];
}

export async function getCartApi(): Promise<ApiCart | null> {
  const res = await request<{ data: ApiCart | null }>('/carts');
  return res.data;
}

export async function addToCartApi(productId: string, quantity: number): Promise<ApiCartItem> {
  const res = await request<{ data: ApiCartItem }>('/carts', {
    method: 'POST',
    body: { productId, quantity },
  });
  return res.data;
}

export async function updateCartItemApi(cartItemId: string, quantity: number): Promise<ApiCartItem> {
  const res = await request<{ data: ApiCartItem }>(`/carts/items/${cartItemId}`, {
    method: 'PUT',
    body: { quantity },
  });
  return res.data;
}

export async function removeCartItemApi(cartItemId: string): Promise<void> {
  await request(`/carts/items/${cartItemId}`, { method: 'DELETE' });
}

export async function clearCartApi(): Promise<void> {
  await request('/carts/clear', { method: 'DELETE' });
}
