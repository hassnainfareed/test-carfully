import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { SendMailResetPassword } from "@/templates/mail/sendMailResetPassword";
import { v4 as uuidv4 } from "uuid";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route authentication/createResetPassword");

export async function POST(req: Request, res: Response) {
  const { email } = await req.json();

  const emailString = email as string;
  const emailLower = emailString.toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: emailLower,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return NextResponse.json("Benuter existiert nicht", { status: 400 });
  }

  const resetPasswordId = uuidv4();
  var resetPasswordExpired = new Date();
  resetPasswordExpired.setDate(resetPasswordExpired.getDate() + 1);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      resetPasswordId: resetPasswordId,
      resetPasswordExpired: resetPasswordExpired,
    },
  });

  logger.info(`Reset password token was created for user ${email}`);

  await SendMailResetPassword(email, resetPasswordId);

  logger.info(`Reset password was send to user ${email}`);

  return NextResponse.json(true);
}
