import { INVOICE_PAD_START } from "@/constants";

export function getInvoiceNumber(invoiceNumber: number | undefined): string {
  if (!invoiceNumber) {
    return "";
  }

  return `C${invoiceNumber.toString().padStart(INVOICE_PAD_START, "0")}`;
}
