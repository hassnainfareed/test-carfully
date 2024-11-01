import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { BookingStatus } from "@prisma/client";
import { getSession, isEmployee } from "../../roleChecker";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route booking byLocationId");

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isEmployee(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const locationId = req.nextUrl.searchParams.get("locationId");
  const bookings = await prisma.booking.findMany({
    where: {
      locationId: locationId!,
      OR: [
        {
          status: BookingStatus.ASSIGNING,
        },
        {
          status: BookingStatus.ACTIVE,
        },
      ],
    },
    select: {
      id: true,
      carId: true,
      locationId: true,
      date: true,
      status: true,
      number: true,
      parkingSpot: true,
      totalPrice: true,
      userId: true,
      isNow: true,
      appointmentDate: true,
      appointmentTime: true,
      location: {
        select: {
          id: true,
          street: true,
          number: true,
          postalCode: true,
          city: true,
          name: true,
        },
      },
      car: {
        select: {
          id: true,
          carBrandId: true,
          carModelId: true,
          licenseNumber: true,
          userId: true,
        },
      },
    },
  });

  return NextResponse.json(bookings);
}
