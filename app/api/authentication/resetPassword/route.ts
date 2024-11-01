import { NextResponse } from "next/server";
import prisma from "@/db";
import bcrypt from "bcrypt";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route authentication/resetPassword");

export async function POST(request: Request) {
  const { resetPasswordId, password } = await request.json();

  logger.info(`Reset password starts with token ${resetPasswordId}`);

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordId: resetPasswordId,
    },
    select: {
      id: true,
      resetPasswordExpired: true,
    },
  });

  if (!user || !user.resetPasswordExpired) {
    return NextResponse.json(false);
  }

  var date = new Date();
  if (user.resetPasswordExpired < date) {
    return NextResponse.json(false);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: {
      id: user?.id,
    },
    data: {
      resetPasswordId: null,
      resetPasswordExpired: null,
      password: hashedPassword,
    },
  });

  return NextResponse.json(true);
}
