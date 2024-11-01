import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import Logger from "@/utils/winstonLogger";
import { getSession, isEmployee } from "../../roleChecker";

var logger = Logger("route service updateImage");
export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isEmployee(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const bookingId = req.nextUrl.searchParams.get("bookingId");
  if (bookingId) {
    const ServicesOnBookings = await prisma.servicesOnBookings.findMany({
      where: {
        bookingId: bookingId!,
      },
      // include: {
      //   booking: true,
      // },
      select: {
        bookingId: true,
        serviceId: true,
        booking: {
          select: {
            id: true,
            carId: true,
            date: true,
            locationId: true,
            number: true,
            parkingSpot: true,
            status: true,
            userId: true,
            totalPrice: true,
          },
        },
      },
    });

    return NextResponse.json(ServicesOnBookings.map((x) => x.booking));
  }
  return NextResponse.json(null, { status: 400 });
}
