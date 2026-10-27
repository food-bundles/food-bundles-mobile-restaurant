import { request } from './client';

export interface GuestOrderLine {
  productId: string;
  qty: number;
  unitPrice: number;
}

export interface PlaceGuestOrderPayload {
  lines: GuestOrderLine[];
  contactName: string;
  contactPhone: string;
  deliveryStreet: string;
  deliveryLandmark?: string;
  paymentMethod: string;
}

export interface GuestOrderResult {
  reference: string;
  total: number;
  orderId: string;
}

export async function placeGuestOrderApi(payload: PlaceGuestOrderPayload): Promise<GuestOrderResult> {
  const res = await request<{ data: GuestOrderResult }>('/guest/orders', {
    method: 'POST',
    body: payload,
    auth: false,
  });
  return res.data;
}
