import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getInvoiceNumber } from "@/utils/invoiceHelper";
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

  const invoice = await prisma.invoice.findFirst({
    where: {
      bookingId: bookingId!,
    },
    select: {
      id: true,
      number: true,
      document: true,
    },
  });

  let buffer: Buffer = invoice?.document!;

  const response = new NextResponse(buffer);
  response.headers.set("content-type", "application/pdf");
  response.headers.set(
    "Content-Disposition",
    `attachment; filename=${getInvoiceNumber(invoice?.number)}.pdf`
  );
  response.headers.set("Content-Length", buffer.byteLength.toString());
  return response;
}
