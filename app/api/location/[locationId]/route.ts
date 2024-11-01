import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getSession, isEmployee } from "../../roleChecker";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const locationId = req.url.slice(req.url.lastIndexOf("/") + 1);

  // Admin | Employee
  if (await isEmployee(session)) {
    const location = await prisma.location.findUnique({
      where: {
        id: locationId!,
      },
      select: {
        id: true,
        city: true,
        name: true,
        number: true,
        postalCode: true,
        street: true,
        activeFromDate: true,
        highBookings: true,
        maxBookings: true,
        emailReceiver: true,
        smsReceiver: true,
        whatsAppReceiver: true,
        mondayStart: true,
        mondayEnd: true,
        tuesdayStart: true,
        tuesdayEnd: true,
        wednesdayStart: true,
        wednesdayEnd: true,
        thursdayStart: true,
        thursdayEnd: true,
        fridayStart: true,
        fridayEnd: true,
        saturdayStart: true,
        saturdayEnd: true,
        sundayStart: true,
        sundayEnd: true,
      },
    });

    return NextResponse.json(location);
  }

  // User
  const location = await prisma.location.findUnique({
    where: {
      id: locationId!,
    },
    select: {
      id: true,
      city: true,
      name: true,
      number: true,
      postalCode: true,
      street: true,
      activeFromDate: true,
      highBookings: true,
      maxBookings: true,
    },
  });

  return NextResponse.json(location);
}
