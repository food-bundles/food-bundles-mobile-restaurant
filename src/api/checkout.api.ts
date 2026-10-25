import { request } from './client';

export interface CheckoutPayload {
  cartId: string;
  paymentMethodId: string;
  deliveryAddress: string;
  deliveryWindow?: string;
  phoneNumber?: string;
  voucherCode?: string;
  loanSessionRrn?: string;
  promoCode?: string;
  verificationType?: 'OTP' | '2FA';
}

export interface CheckoutInitiateResult {
  requiresVerification: boolean;
  verificationType?: 'OTP' | '2FA';
  otpDelivery?: string[];
  checkoutSessionId?: string;
  orderId?: string;
  orderNumber?: string;
  totalAmount?: number;
  paymentStatus?: string;
}

export interface LoanSession {
  id: string;
  rrn: string;
  amount: number;
  remainingAmount: number;
  expiresAt: string;
}

export interface PlacedOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryWindow?: string;
  orderItems: { productId: string; productName: string; quantity: number; unitPrice: number }[];
}

export async function initiateCheckoutApi(payload: CheckoutPayload): Promise<CheckoutInitiateResult> {
  const res = await request<{ data: CheckoutInitiateResult }>('/checkouts', {
    method: 'POST',
    body: payload,
  });
  return res.data;
}

export async function verifyCheckoutOtpApi(otp: string, checkoutSessionId: string): Promise<PlacedOrder> {
  const res = await request<{ data: PlacedOrder }>('/checkouts/verify-voucher-otp', {
    method: 'POST',
    body: { otp, checkoutSessionId },
  });
  return res.data;
}

export async function getCheckoutStatusApi(orderId: string): Promise<{
  orderId: string;
  orderNumber: string;
  paymentStatus: string;
  orderStatus: string;
  totalAmount: number;
}> {
  const res = await request<{ data: any }>(`/checkouts/${orderId}/status`);
  return res.data;
}

export async function getLoanSessionsApi(): Promise<LoanSession[]> {
  const res = await request<{ data: LoanSession[] }>('/checkouts/loan-sessions');
  return res.data;
}
