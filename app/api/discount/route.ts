import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { Discount } from "@prisma/client";
import Logger from "@/utils/winstonLogger";
import { getSession, isAdmin } from "../roleChecker";

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

  const discounts = await prisma.discount.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      discountType: true,
      oneTime: true,
      valid: true,
      validForUserId: true,
      validForServiceId: true,
      validFrom: true,
      validTo: true,
      value: true,
    },
  });

  return NextResponse.json(discounts);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter admin discount`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const data = (await req.json()) as Discount;

  const discount = await prisma.discount.create({
    data: {
      name: data.name,
      description: data.description,
      value: data.value,
      validFrom: data.validFrom,
      validTo: data.validTo,
      oneTime: data.oneTime,
      discountType: data.discountType,
      validForServiceId: data.validForServiceId,
      validForUserId: data.validForUserId,
      valid: data.valid,
      code: data.code,
    },
  });

  return NextResponse.json(true, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter admin discount`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const reqData = (await req.json()) as Discount;

  const discount = await prisma.discount.update({
    data: reqData,
    where: {
      id: reqData.id,
    },
  });

  return NextResponse.json(true, { status: 200 });
}
