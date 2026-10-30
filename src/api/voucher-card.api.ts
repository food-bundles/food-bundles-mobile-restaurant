import { request } from "./client";

export interface VoucherCard {
  id: string;
  pan: string;
  status: "ACTIVE" | "SUSPENDED" | "CANCELLED";
  loanLimit: number;
  totalOutstandingLoans: number;
  qualifyingOrders: number;
  totalLoansReceived: number;
  isEligible: boolean;
  eligibilityReason?: string;
  activeLoanSession: LoanSession | null;
  createdAt: string;
}

export interface LoanSession {
  id: string;
  rrn: string;
  status:
    | "REQUESTED"
    | "APPROVED_LOCKED"
    | "UNLOCK_FEE_PENDING"
    | "ACTIVE"
    | "PARTIALLY_USED"
    | "FULLY_USED"
    | "SETTLED"
    | "CLOSED"
    | "REJECTED"
    | "OVERDUE";
  requestedAmount: number;
  approvedAmount: number | null;
  unlockFee: number | null;
  amountUsed: number;
  amountRepaid: number;
  outstandingAmount: number;
  repaymentDays: number;
  purpose: string | null;
  loanProviderType: "FOOD_BUNDLES" | "TRADER";
  requestedAt: string;
  approvedAt: string | null;
  dueDate: string | null;
}

export interface LoanTerms {
  providerType: "FOOD_BUNDLES" | "TRADER";
  providerId: string;
  providerName: string;
  terms: string;
  accepted: boolean;
  requiresSubscription: boolean;
  hasActiveSubscription: boolean;
}

export interface KycInput {
  restaurantName: string;
  tinNumber: string;
  phoneNumber: string;
  businessAddress: string;
  district: string;
  sector?: string;
  ownerName: string;
  ownerNationalId: string;
  businessType: string;
  yearsInOperation: number;
  consentVubaBuba: boolean;
  consentKayko: boolean;
  consentRRA: boolean;
}

export async function getVoucherCardApi(): Promise<VoucherCard | null> {
  const res = await request<{ data: VoucherCard | null }>("/voucher-card");
  return res.data;
}

export async function submitKycApi(data: KycInput): Promise<void> {
  await request("/voucher-card/kyc", { method: "POST", body: data });
}

export async function requestVoucherCardApi(): Promise<void> {
  await request("/voucher-card/request", { method: "POST", body: {} });
}

export async function getLoanTermsApi(
  providerType: "FOOD_BUNDLES" | "TRADER" = "FOOD_BUNDLES",
  fundingTraderId?: string,
): Promise<LoanTerms> {
  const params = new URLSearchParams({ providerType });
  if (fundingTraderId) params.set("fundingTraderId", fundingTraderId);
  const res = await request<{ data: LoanTerms }>(`/voucher-card/loan-terms?${params}`);
  return res.data;
}

export async function acceptLoanTermsApi(data: {
  providerType: "FOOD_BUNDLES" | "TRADER";
  providerId: string;
  providerName: string;
}): Promise<void> {
  await request("/voucher-card/loan-terms/accept", { method: "POST", body: data });
}

export async function getLoanSessionsApi(): Promise<LoanSession[]> {
  const res = await request<{ data: LoanSession[] }>("/voucher-card/loan-sessions");
  return res.data;
}

export async function requestLoanSessionApi(data: {
  requestedAmount: number;
  repaymentDays?: number;
  purpose?: string;
  loanProviderType?: "FOOD_BUNDLES" | "TRADER";
  fundingTraderId?: string;
}): Promise<LoanSession> {
  const res = await request<{ data: LoanSession }>("/voucher-card/loan-sessions", {
    method: "POST",
    body: data,
  });
  return res.data;
}

export async function payUnlockFeeApi(
  loanSessionId: string,
  data: { paymentMethod: string; phoneNumber?: string },
): Promise<{ redirectUrl?: string; requiresRedirect?: boolean; status?: string }> {
  const res = await request<{ data: any }>(`/voucher-card/loan-sessions/${loanSessionId}/unlock-fee`, {
    method: "POST",
    body: data,
  });
  return res.data;
}
