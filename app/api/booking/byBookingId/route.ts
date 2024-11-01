import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getSession, isEmployee } from "../../roleChecker";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const bookingId = req.nextUrl.searchParams.get("bookingId");

  // Employee
  if (await isEmployee(session)) {
    const booking = await prisma.booking.findUnique({
      where: {
        id: bookingId!,
      },
      select: {
        id: true,
        carId: true,
        locationId: true,
        date: true,
        status: true,
        number: true,
        parkingSpot: true,
        totalPrice: true,
        userId: true,
        assigned: true,
        isNow: true,
        appointmentDate: true,
        appointmentTime: true,
      },
    });

    return NextResponse.json(booking);
  }

  // User
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId!,
    },
    select: {
      id: true,
      carId: true,
      locationId: true,
      date: true,
      status: true,
      number: true,
      parkingSpot: true,
      totalPrice: true,
      userId: true,
      isNow: true,
      appointmentDate: true,
      appointmentTime: true,
    },
  });

  return NextResponse.json(booking);
}
