/** Derives stable mock SDC serial + receipt/invoice numbers from the order id (no backend to issue real ones). */
export function deriveFiscalIds(orderId: string): { sdcId: string; receiptNo: string; invoiceNo: string } {
  const digits = orderId.replace(/\D/g, '').padStart(6, '0');
  return {
    sdcId: `SDC${digits.slice(-6)}`,
    receiptNo: `${digits.slice(-4)}/1NS`,
    invoiceNo: `EBM-${digits.slice(-5)}-01`,
  };
}
