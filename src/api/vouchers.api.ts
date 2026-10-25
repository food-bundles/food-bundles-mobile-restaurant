import { request } from "./client";
import type { Voucher } from "@/mocks/types";

interface ApiVoucher {
  id: string;
  voucherCode: string;
  creditLimit?: number;
  amount?: number;
  status: string;
  createdAt?: string;
  issuedAt?: string;
  expiryDate?: string;
  expiresAt?: string;
  usedAt?: string;
  repaymentOrderId?: string;
}

function mapStatus(status: string): Voucher["status"] {
  if (status === "USED" || status === "REPAID") return "USED";
  if (status === "EXPIRED" || status === "CANCELLED") return "EXPIRED";
  return "AVAILABLE";
}

export async function getVouchersApi(): Promise<Voucher[]> {
  const res = await request<{ data: ApiVoucher[] }>("/vouchers");
  return res.data.map((voucher) => ({
    id: voucher.id,
    code: voucher.voucherCode,
    amount: voucher.creditLimit ?? voucher.amount ?? 0,
    status: mapStatus(voucher.status),
    issuedAt:
      voucher.createdAt ?? voucher.issuedAt ?? new Date(0).toISOString(),
    expiresAt:
      voucher.expiryDate ?? voucher.expiresAt ?? new Date(0).toISOString(),
    usedAt: voucher.usedAt,
    orderId: voucher.repaymentOrderId,
  }));
}
