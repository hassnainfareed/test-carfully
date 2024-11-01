import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { BookingStatus, Location } from "@prisma/client";
import { LocationModel } from "@/services/contracts/LocationRepository";
import { getSession, isAdmin } from "../roleChecker";
import Logger from "@/utils/winstonLogger";

var logger = Logger("route location servicesOnLocations");

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const locations = await prisma.location.findMany({
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
      Booking: {
        where: {
          OR: [
            {
              status: BookingStatus.ASSIGNING,
            },
            {
              status: BookingStatus.ACTIVE,
            },
          ],
        },
      },
    },
  });

  var locationModels: LocationModel[] = [];

  var currentDate = new Date();

  locations.map((location) => {
    let locationModel: LocationModel = {
      id: location.id,
      name: location.name,
      street: location.street,
      number: location.number,
      postalCode: location.postalCode,
      city: location.city,
      disabled: false,
    };

    if (location.activeFromDate && location.activeFromDate > currentDate) {
      locationModel.disabledByDate = true;
    }

    if (
      location.highBookings &&
      location.highBookings <= location.Booking.length
    ) {
      locationModel.disabledByHighBookings = true;
    }

    if (
      location.maxBookings &&
      location.maxBookings <= location.Booking.length
    ) {
      locationModel.disabledByMaxBookings = true;
    }

    locationModels.push(locationModel);
  });

  return NextResponse.json(locationModels);
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

  const data = (await req.json()) as Location;

  const location = await prisma.location.create({
    data: {
      city: data.city,
      name: data.name,
      number: data.number,
      postalCode: data.postalCode,
      street: data.street,
    },
  });

  return NextResponse.json(true, { status: 200 });
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
  const reqData = (await req.json()) as Location;

  const location = await prisma.location.update({
    data: reqData,
    where: {
      id: reqData.id,
    },
  });

  return NextResponse.json(true, { status: 200 });
}
