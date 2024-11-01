import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { ServiceUpdateImageProps } from "@/services/ServiceService";
import Logger from "@/utils/winstonLogger";
import { getSession, isAdmin } from "../../roleChecker";

var logger = Logger("route service updateImage");

export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const data = (await req.json()) as ServiceUpdateImageProps;

  if (data.serviceId) {
    await prisma.service.update({
      where: {
        id: data.serviceId,
      },
      data: {
        imageBase64: data.image,
      },
    });

    const service = await prisma.service.findFirst({
      where: {
        id: data.serviceId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageBase64: true,
      },
    });

    return NextResponse.json(service, { status: 200 });
  }

  return NextResponse.json(null, { status: 400 });
}
