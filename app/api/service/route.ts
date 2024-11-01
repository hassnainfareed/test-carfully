import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { Service } from "@prisma/client";
import Logger from "@/utils/winstonLogger";
import { getSession, isAdmin } from "../roleChecker";

var logger = Logger("route service");

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageBase64: true,
    },
  });

  return NextResponse.json(services, { status: 200 });
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

  const data = (await req.json()) as Service;

  const service = await prisma.service.create({
    data: data,
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

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  if (!(await isAdmin(session))) {
    logger.error(`user ${session!.user!.email} tried to enter`);
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }
  const data = (await req.json()) as Service;

  const service = await prisma.service.update({
    where: {
      id: data.id,
    },
    data: data,
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
