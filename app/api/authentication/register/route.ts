import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/db";
import { UserDto } from "@/types/user";
import { SendMailEMailVerification } from "@/templates/mail/sendMailEMailVerification";
import { v4 as uuidv4 } from "uuid";
import { Prisma } from "@prisma/client";
import Logger from "@/utils/winstonLogger";
import { SendMailNewUserDiscount } from "@/templates/mail/sendMailNewUserDiscount";

var logger = Logger("Route authentication/register");
var voucher_codes = require("voucher-code-generator");

export async function POST(request: Request) {
  const userDto: UserDto = await request.json();

  if (!userDto.email || !userDto.password) {
    return new NextResponse(
      "E-Mail und/oder Passwort konnten nicht gelesen werden",
      { status: 400 }
    );
  }

  let exists: { id: string } | null = null;

  const emailLower = userDto.email!.toLowerCase();

  try {
    exists = await prisma.user.findUnique({
      where: {
        email: emailLower,
      },
      select: {
        id: true,
      },
    });
  } catch (e) {
    logger.error("Error in database query", userDto.email);
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      logger.error(e.message, userDto.email);
    }
  }

  if (exists) {
    return new NextResponse(
      "Benutzer mit selber E-Mail Adresse existiert bereits",
      { status: 400 }
    );
  }

  const verificationId = uuidv4();

  const user = await prisma.user.create({
    data: {
      email: emailLower,
      password: await bcrypt.hash(userDto.password, 10),
      verificationId: verificationId,
    },
  });

  logger.info("User created", emailLower);

  // // Discount
  // const discountValidFrom = new Date();
  // const discountValidTo = new Date();
  // discountValidTo.setMonth(discountValidTo.getMonth() + 1);
  // const code = voucher_codes.generate({
  //   length: 16,
  //   count: 1,
  //   charset: voucher_codes.charset("alphabetic"),
  // });

  // try {
  //   const discount = await prisma.discount.create({
  //     data: {
  //       name: `Wilkommensrabatt ${userDto.email}`,
  //       description: `Wilkommensrabatt ${userDto.email}`,
  //       value: 0,
  //       validFrom: discountValidFrom,
  //       validTo: discountValidTo,
  //       oneTime: true,
  //       discountType: "SERVICE",
  //       validForServiceId: "bed3d71f-1a10-43da-86d1-9e010dbea99b",
  //       validForUserId: user.id,
  //       valid: true,
  //       code: code[0],
  //     },
  //   });

  //   await SendMailNewUserDiscount(user.email, code);
  // } catch (error) {
  //   logger.error(JSON.stringify(error));
  // }

  await SendMailEMailVerification(user.email, verificationId);

  return NextResponse.json(true);
}
