import { Invoice } from "@prisma/client";
import BaseService from "./BaseService";
import { InvoiceRepository } from "./contracts/InvoiceRepository";
import axios from "axios";

export default class InvoiceService
  extends BaseService<Invoice>
  implements InvoiceRepository
{
  constructor() {
    super("/api/invoice/");
  }

  async getInvoiceByBookingId(bookingId: string): Promise<Invoice | null> {
    var res = await axios.get(
      `${this.urlPath}byBookingId?bookingId=${bookingId}`
    );
    return res.data as Invoice;
  }

  async getPdfByBookingId(bookingId: string): Promise<ArrayBuffer | null> {
    var res = await axios.post(`${this.urlPath}byBookingId`, {
      bookingId: bookingId,
    });

    return res.data as ArrayBuffer;
  }
}
