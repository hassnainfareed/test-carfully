import { NextResponse } from "next/server";
import prisma from "@/db";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route authentication/verify");

export async function POST(request: Request) {
  const { id } = await request.json();

  logger.info(`User verification starts with token ${id}`);

  const user = await prisma.user.findFirst({
    where: {
      verificationId: id,
    },
  });

  logger.info(`User found`);

  if (!user) {
    return NextResponse.json("Benuter existiert nicht", { status: 401 });
  }

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      verificationId: null,
      emailVerified: new Date(),
    },
  });

  logger.info(`Upldate User successfull`);

  return NextResponse.json(true);
}
