import { request } from "./client";

export interface PromoResult {
  code: string;
  discountAmount: number;
  originalAmount: number;
  finalAmount: number;
  savings: number;
  description?: string;
}

export async function applyPromoCodeApi(cartId: string, code: string): Promise<PromoResult> {
  const res = await request<{ data: PromoResult }>("/promo/calculate", {
    method: "POST",
    body: { cartId, code },
  });
  return res.data;
}

export async function getMyPromosApi(): Promise<{ id: string; code: string; name: string; description?: string; discountType: string; discountValue: number; expiryDate?: string }[]> {
  const res = await request<{ data: any[] }>("/promo/my");
  return res.data;
}
