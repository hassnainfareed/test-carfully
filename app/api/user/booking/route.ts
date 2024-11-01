import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import prisma from "@/db";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session!.user!.email!,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    return new NextResponse("Benuter existiert nicht", { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: {
      userId: user?.id,
      status: {
        not: "CREATED",
      },
    },
    select: {
      id: true,
      date: true,
      locationId: true,
      userId: true,
      carId: true,
      status: true,
      parkingSpot: true,
      number: true,
      car: true,
      isNow: true,
      appointmentDate: true,
      appointmentTime: true,
      location: {
        select: {
          id: true,
          name: true,
          street: true,
          number: true,
          postalCode: true,
          city: true,
        },
      },
    },
  });

  return NextResponse.json(bookings);
}
