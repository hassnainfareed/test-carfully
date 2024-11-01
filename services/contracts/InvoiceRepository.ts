import { Invoice } from "@prisma/client";
import { Repository } from "./Repository";

export interface InvoiceRepository extends Repository<Invoice> {
  getInvoiceByBookingId(bookingId: string): Promise<Invoice | null>;
  getPdfByBookingId(bookingId: string): Promise<ArrayBuffer | null>;
}
