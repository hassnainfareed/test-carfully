import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import Logger from "@/utils/winstonLogger";
import { getSession, isAdmin } from "../../roleChecker";

var logger = Logger("route service");

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const serviceId = req.url.slice(req.url.lastIndexOf("/") + 1);
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId!,
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      averageHandlingTime: true,
      imageBase64: true,
    },
  });

  return NextResponse.json(service);
}
