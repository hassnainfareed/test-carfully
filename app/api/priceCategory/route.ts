import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { PriceCategory } from "@prisma/client";
import Logger from "@/utils/winstonLogger";
import { getSession, isAdmin } from "../roleChecker";

var logger = Logger("route priceCategory");

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const priceCatgories = await prisma.priceCategory.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return NextResponse.json(priceCatgories, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const data = (await req.json()) as PriceCategory;

  const priceCategory = await prisma.priceCategory.create({
    data: data,
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(priceCategory, { status: 200 });
}

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const data = (await req.json()) as PriceCategory;

  const priceCategory = await prisma.priceCategory.update({
    where: {
      id: data.id,
    },
    data: data,
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(priceCategory, { status: 200 });
}
