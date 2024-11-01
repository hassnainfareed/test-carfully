import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const addressId = req.url.slice(req.url.lastIndexOf("/") + 1);

  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    return new NextResponse("Benuter existiert nicht", { status: 401 });
  }

  const address = await prisma.address.findUnique({
    where: {
      id: addressId!,
      userId: user?.id,
    },
    select: {
      id: true,
      genderType: true,
      firstname: true,
      lastname: true,
      companyName: true,
      street: true,
      number: true,
      additional: true,
      postalCode: true,
      city: true,
      addressType: true,
    },
  });

  return NextResponse.json(address);
}
