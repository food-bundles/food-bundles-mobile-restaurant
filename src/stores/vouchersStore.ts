import { create } from "zustand";
import type { CreditScore, DataConsent, DataConsentSource, Tier, Voucher } from "@/types";
import { getVouchersApi, applyForVoucherApi } from "@/api/vouchers.api";

const INITIAL_CONSENT: DataConsent[] = [
  { source: 'eucl', granted: false, grantedAt: null, expiresAt: null },
  { source: 'rra', granted: false, grantedAt: null, expiresAt: null },
  { source: 'vubaVuba', granted: false, grantedAt: null, expiresAt: null },
  { source: 'kayko', granted: false, grantedAt: null, expiresAt: null },
  { source: 'foodbundles', granted: true, grantedAt: null, expiresAt: null },
  { source: 'creditBureau', granted: false, grantedAt: null, expiresAt: null },
];

const CONSENT_WINDOW_DAYS = 30;

interface VouchersState {
  vouchers: Voucher[];
  status: "idle" | "loading" | "ready" | "error";
  fetchVouchers: () => Promise<void>;
  nextGrantDate: string;
  consentList: DataConsent[];
  creditScore: CreditScore | null;
  /** Marks one voucher as used against an order; no-op if it's already spent or missing. */
  redeemVoucher: (voucherId: string, orderId: string) => void;
  /** Grants or revokes a data source. When granting with `remember`, the consent never expires and won't be re-asked. */
  setConsent: (
    source: DataConsentSource,
    granted: boolean,
    remember?: boolean,
  ) => void;
  /** True once a previously granted source's 30-day window has elapsed. */
  isConsentExpired: (source: DataConsentSource) => boolean;
  /** Stores the outcome of a scoring run, shown on the score-result screen. */
  setCreditScore: (score: CreditScore) => void;
  /** Submits a real voucher/loan application to the backend. Returns the loan ID. */
  requestVoucher: (amountRwf: number) => Promise<string>;
}

/** Voucher pool, monthly grant schedule, and data-consent/credit-score state for the voucher application flow. */
export const useVouchersStore = create<VouchersState>((set, get) => ({
  vouchers: [],
  status: "idle",
  nextGrantDate: "",
  consentList: INITIAL_CONSENT,
  creditScore: null,
  fetchVouchers: async () => {
    set({ status: "loading" });
    try {
      const vouchers = await getVouchersApi();
      set({ vouchers, status: "ready" });
    } catch {
      set({ vouchers: [], status: "error" });
    }
  },
  redeemVoucher: (voucherId, orderId) =>
    set((state) => ({
      vouchers: state.vouchers.map((voucher) =>
        voucher.id === voucherId && voucher.status === "AVAILABLE"
          ? {
              ...voucher,
              status: "USED",
              usedAt: new Date().toISOString(),
              orderId,
            }
          : voucher,
      ),
    })),
  setConsent: (source, granted, remember) =>
    set((state) => ({
      consentList: state.consentList.map((consent) => {
        if (consent.source !== source) return consent;
        if (!granted)
          return {
            ...consent,
            granted: false,
            grantedAt: null,
            expiresAt: null,
          };
        const grantedAt = new Date();
        if (remember) {
          return {
            ...consent,
            granted: true,
            grantedAt: grantedAt.toISOString(),
            expiresAt: null,
          };
        }
        const expiresAt = new Date(grantedAt);
        expiresAt.setDate(expiresAt.getDate() + CONSENT_WINDOW_DAYS);
        return {
          ...consent,
          granted: true,
          grantedAt: grantedAt.toISOString(),
          expiresAt: expiresAt.toISOString(),
        };
      }),
    })),
  isConsentExpired: (source) => {
    const consent = get().consentList.find((c) => c.source === source);
    if (!consent?.granted || !consent.expiresAt) return false;
    return new Date(consent.expiresAt).getTime() < Date.now();
  },
  setCreditScore: (creditScore) => set({ creditScore }),
  requestVoucher: async (amountRwf) => {
    const result = await applyForVoucherApi({ requestedAmount: amountRwf });
    // Refresh vouchers after application
    try {
      const vouchers = await getVouchersApi();
      set({ vouchers });
    } catch {
      // non-fatal
    }
    return result.loanId;
  },
}));

/** True once the restaurant has subscribed to any paid tier — vouchers require an active subscription. */
export const isVouchersUnlocked = (tier: Tier): boolean => tier !== "NONE";
