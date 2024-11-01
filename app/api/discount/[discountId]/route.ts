import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getSession, isAdmin } from "../../roleChecker";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route discount");

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter admin discount`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const discountId = req.url.slice(req.url.lastIndexOf("/") + 1);
  const discount = await prisma.discount.findUnique({
    where: {
      id: discountId!,
    },
    select: {
      id: true,
      name: true,
      description: true,
      discountType: true,
      oneTime: true,
      valid: true,
      code: true,
      validForUserId: true,
      validForServiceId: true,
      validFrom: true,
      validTo: true,
      value: true,
    },
  });

  return NextResponse.json(discount);
}
