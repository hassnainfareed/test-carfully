import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getSession, isAdmin } from "../../roleChecker";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route location servicesOnLocations");

interface SaveServiceOnLocations {
  locationId: string;
  serviceId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const data = (await req.json()) as SaveServiceOnLocations;

  const result = await prisma.servicesOnLocations.findFirst({
    where: {
      serviceId: data.serviceId,
      locationId: data.locationId,
    },
  });

  if (result) {
    return NextResponse.json(null, { status: 200 });
  }

  await prisma.servicesOnLocations.create({
    data: data,
  });

  return NextResponse.json(null, { status: 200 });
}

export async function DELETE(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const params = req.nextUrl.searchParams;

  await prisma.servicesOnLocations.deleteMany({
    where: {
      locationId: params.get("locationId")!,
      serviceId: params.get("serviceId")!,
    },
  });

  return NextResponse.json(null, { status: 200 });
}
