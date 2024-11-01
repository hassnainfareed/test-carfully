import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getSession } from "../../roleChecker";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getSession();
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

  const bookingId = req.nextUrl.searchParams.get("bookingId");

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId!,
      userId: user.id,
    },
    select: {
      id: true,
      userId: true,
    },
  });

  if (!booking) {
    return new NextResponse("Nicht autorisiert", { status: 403 });
  }

  const invoice = await prisma.invoice.findUnique({
    where: {
      bookingId: booking.id!,
    },
    select: {
      id: true,
      number: true,
      documentCreated: true,
    },
  });

  return NextResponse.json(invoice);
}
