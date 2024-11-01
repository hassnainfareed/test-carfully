import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getSession, isAdmin } from "../../roleChecker";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route location includeServices");

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const locationId = req.nextUrl.searchParams.get("locationId");
  if (locationId) {
    const locations = await prisma.location.findUnique({
      where: {
        id: locationId!,
      },
      select: {
        id: true,
        city: true,
        name: true,
        number: true,
        postalCode: true,
        street: true,
        ServicesOnLocations: {
          select: {
            locationId: true,
            serviceId: true,
          },
        },
      },
    });

    return NextResponse.json(locations);
  }

  return NextResponse.json(null, { status: 400 });
}
