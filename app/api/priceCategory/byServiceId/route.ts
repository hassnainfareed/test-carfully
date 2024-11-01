import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { ServicesOnPriceCategory } from "@prisma/client";
import { getSession, isAdmin } from "../../roleChecker";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route priceCategory byServiceId");

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const servicesOnPriceCategory = await prisma.servicesOnPriceCategory.findMany(
    {
      where: {
        serviceId: serviceId!,
      },
      select: {
        priceCategoryId: true,
        serviceId: true,
        price: true,
      },
    }
  );

  return NextResponse.json(servicesOnPriceCategory);
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

  const data = (await req.json()) as ServicesOnPriceCategory;

  await prisma.servicesOnPriceCategory.create({
    data: data,
  });

  return NextResponse.json(null, { status: 200 });
}

export async function PUT(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const data = (await req.json()) as ServicesOnPriceCategory;

  await prisma.servicesOnPriceCategory.updateMany({
    where: {
      AND: [
        {
          serviceId: data.serviceId!,
        },
        {
          priceCategoryId: data.priceCategoryId!,
        },
      ],
    },
    data: {
      price: data.price,
    },
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
  const serviceId = params.get("serviceId");
  const priceCategoryId = params.get("priceCategoryId");

  await prisma.servicesOnPriceCategory.deleteMany({
    where: {
      AND: [
        {
          serviceId: serviceId!,
        },
        {
          priceCategoryId: priceCategoryId!,
        },
      ],
    },
  });

  return NextResponse.json(null, { status: 200 });
}
