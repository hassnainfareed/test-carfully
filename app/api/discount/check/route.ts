import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route discount check");

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const data = await req.json();

  const date = new Date();

  if (!data.code) {
    logger.error("Rabattcode konnte nicht gelesen werden");
    return NextResponse.json("Rabattcode konnte nicht gelesen werden", {
      status: 400,
    });
  }

  logger.info(`Checking discount code ${data.code}`);

  //TODO validation check date
  const discount = await prisma.discount.findFirst({
    where: {
      code: data.code,
      valid: true,
    },
    select: {
      discountType: true,
      value: true,
      validForServiceId: true,
      validForUserId: true,
    },
  });

  if (discount == null) {
    logger.error("Rabatt nicht gültig");
    return NextResponse.json("Rabatt nicht gültig", { status: 400 });
  }

  if (discount && discount.validForUserId) {
    const user = await prisma.user.findUnique({
      where: {
        email: session!.user!.email!,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      logger.error("User für Validierung nicht gefunden");
      return NextResponse.json("User für Validierung nicht gefunden", {
        status: 400,
      });
    }

    if (discount.validForUserId !== user!.id) {
      logger.error("Rabatt nicht gültig für angemeldeten User");
      return NextResponse.json("Rabatt nicht gültig für angemeldeten User", {
        status: 400,
      });
    }
  }

  return NextResponse.json(discount, { status: 200 });
}
