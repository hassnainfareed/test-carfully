import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/db";
import { BookingStatus } from "@prisma/client";
import { SendMailBookingCustomerStatusFinished } from "@/templates/mail/sendMailBookingCustomerStatusFinished";
import { SendMailBookingCustomerStatusActive } from "@/templates/mail/sendMailBookingCustomerStatusActive";
import { getSession, isEmployee } from "../../roleChecker";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route booking updateStatus");

export interface UpdateBookingStatusParams {
  bookingId: string;
  bookingStatus: BookingStatus;
  remarkEmployee: string;
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isEmployee(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const updateBookingStatusParams: UpdateBookingStatusParams = await req.json();

  const booking = await prisma.booking.update({
    where: {
      id: updateBookingStatusParams.bookingId,
    },
    data: {
      status: updateBookingStatusParams.bookingStatus,
      assigned: session!.user!.email!,
      remarkClient: updateBookingStatusParams.remarkEmployee,
    },
    select: {
      userId: true,
      number: true,
      ServicesOnBookings: {
        select: {
          service: true,
        },
      },
    },
  });

  if (updateBookingStatusParams.bookingStatus === BookingStatus.ACTIVE) {
    const user = await prisma.user.findFirst({
      where: { id: booking.userId },
      select: { email: true },
    });

    let averageHandlingTime: number = 0;
    booking.ServicesOnBookings.forEach((serviceOnBooking) => {
      if (serviceOnBooking.service.averageHandlingTime) {
        averageHandlingTime += serviceOnBooking.service.averageHandlingTime;
      }
    });

    await SendMailBookingCustomerStatusActive(
      user?.email!,
      booking.number,
      averageHandlingTime
    );
  }

  if (updateBookingStatusParams.bookingStatus === BookingStatus.FINISHED) {
    const user = await prisma.user.findFirst({
      where: { id: booking.userId },
      select: { email: true },
    });

    await SendMailBookingCustomerStatusFinished(user?.email!, booking.number);
  }

  return NextResponse.json(true, { status: 200 });
}
