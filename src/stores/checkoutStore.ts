import { create } from 'zustand';
import type { PaymentMethod } from '@/mocks/types';
import {
  initiateCheckoutApi,
  verifyCheckoutOtpApi,
  getCheckoutStatusApi,
  getLoanSessionsApi,
  type CheckoutPayload,
  type PlacedOrder,
  type LoanSession,
} from '@/api/checkout.api';

interface CheckoutState {
  // Delivery / payment selections
  address: string;
  windowIndex: number;
  method: PaymentMethod;
  phone: string;
  selectedVoucherId: string | null;

  // Live checkout session
  cartId: string | null;
  checkoutSessionId: string | null;
  requiresOtp: boolean;
  placedOrder: PlacedOrder | null;
  loanSessions: LoanSession[];
  loading: boolean;
  error: string | null;

  setAddress: (address: string) => void;
  setWindowIndex: (index: number) => void;
  setMethod: (method: PaymentMethod) => void;
  setPhone: (phone: string) => void;
  setSelectedVoucherId: (voucherId: string | null) => void;
  setCartId: (cartId: string) => void;

  /** Calls POST /checkouts. Returns true if OTP required, false if order placed directly. */
  initiateCheckout: (payload: CheckoutPayload) => Promise<boolean>;
  /** Calls POST /checkouts/verify-voucher-otp. Stores placed order on success. */
  verifyOtp: (otp: string) => Promise<PlacedOrder>;
  /** Polls GET /checkouts/:orderId/status */
  pollStatus: (orderId: string) => Promise<string>;
  /** Fetches available loan sessions */
  fetchLoanSessions: () => Promise<void>;

  reset: () => void;
}

const INITIAL = {
  address: '',
  windowIndex: 0,
  method: 'MOBILE_MONEY' as PaymentMethod,
  phone: '',
  selectedVoucherId: null as string | null,
  cartId: null as string | null,
  checkoutSessionId: null as string | null,
  requiresOtp: false,
  placedOrder: null as PlacedOrder | null,
  loanSessions: [] as LoanSession[],
  loading: false,
  error: null as string | null,
};

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  ...INITIAL,

  setAddress: (address) => set({ address }),
  setWindowIndex: (windowIndex) => set({ windowIndex }),
  setMethod: (method) => set({ method }),
  setPhone: (phone) => set({ phone }),
  setSelectedVoucherId: (selectedVoucherId) => set({ selectedVoucherId }),
  setCartId: (cartId) => set({ cartId }),

  initiateCheckout: async (payload) => {
    set({ loading: true, error: null });
    try {
      const result = await initiateCheckoutApi(payload);
      if (result.requiresVerification && result.checkoutSessionId) {
        set({ checkoutSessionId: result.checkoutSessionId, requiresOtp: true, loading: false });
        return true;
      }
      // Direct placement (non-voucher)
      const placed: PlacedOrder = {
        id: result.orderId ?? '',
        orderNumber: result.orderNumber ?? '',
        totalAmount: result.totalAmount ?? 0,
        status: 'PENDING',
        paymentStatus: result.paymentStatus ?? 'PENDING',
        paymentMethod: payload.paymentMethodId,
        deliveryAddress: payload.deliveryAddress,
        deliveryWindow: payload.deliveryWindow,
        orderItems: [],
      };
      set({ placedOrder: placed, requiresOtp: false, loading: false });
      return false;
    } catch (err: any) {
      set({ loading: false, error: err.message ?? 'Checkout failed' });
      throw err;
    }
  },

  verifyOtp: async (otp) => {
    const { checkoutSessionId } = get();
    if (!checkoutSessionId) throw new Error('No active checkout session');
    set({ loading: true, error: null });
    try {
      const order = await verifyCheckoutOtpApi(otp, checkoutSessionId);
      set({ placedOrder: order, loading: false });
      return order;
    } catch (err: any) {
      set({ loading: false, error: err.message ?? 'OTP verification failed' });
      throw err;
    }
  },

  pollStatus: async (orderId) => {
    const result = await getCheckoutStatusApi(orderId);
    return result.paymentStatus;
  },

  fetchLoanSessions: async () => {
    try {
      const sessions = await getLoanSessionsApi();
      set({ loanSessions: sessions });
    } catch {
      // non-fatal
    }
  },

  reset: () => set(INITIAL),
}));
