import { NextRequest, NextResponse } from "next/server";
import createMollieClient, { Payment, PaymentStatus } from "@mollie/api-client";
import prisma from "@/db";
import { BookingPaymentStatus } from "@prisma/client";
import { confirmBooking } from "../route";

const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY as string,
});

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.formData();
  const id: FormDataEntryValue | null = data.get("id");

  if (id) {
    const payment = await mollieClient.payments.get(id.toString());

    const booking = await prisma.booking.findFirst({
      where: {
        paymentId: id.toString(),
      },
    });

    if (!booking) {
      return new NextResponse("Buchung nicht gefunden", { status: 400 });
    }

    var bookingPaymentStatus: BookingPaymentStatus =
      BookingPaymentStatus.FAILED;

    switch (payment.status) {
      case PaymentStatus.authorized:
        bookingPaymentStatus = BookingPaymentStatus.AUTHORIZED;
        break;
      case PaymentStatus.canceled:
        bookingPaymentStatus = BookingPaymentStatus.CANCELED;
        break;
      case PaymentStatus.expired:
        bookingPaymentStatus = BookingPaymentStatus.EXPIRED;
        break;
      case PaymentStatus.failed:
        bookingPaymentStatus = BookingPaymentStatus.FAILED;
        break;
      case PaymentStatus.open:
        bookingPaymentStatus = BookingPaymentStatus.OPEN;
        break;
      case PaymentStatus.paid:
        bookingPaymentStatus = BookingPaymentStatus.PAID;
        break;
      case PaymentStatus.pending:
        bookingPaymentStatus = BookingPaymentStatus.PENDING;
        break;
    }

    await prisma.booking.update({
      where: {
        id: booking?.id,
      },
      data: {
        paymentStatus: bookingPaymentStatus,
      },
    });

    if (payment.status === PaymentStatus.paid) {
      await confirmBooking(booking);
    }

    return NextResponse.json(id, { status: 200 });
  }
}
