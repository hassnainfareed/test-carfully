import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Address, Invoice } from "@prisma/client";
import { TAX_AMOUNT } from "@/constants";
import { getInvoiceNumber } from "@/utils/invoiceHelper";
import dayjs from "dayjs";
import { TIMEZONE } from "@/constants";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(TIMEZONE);

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse("Nicht eingeloggt", { status: 401 });
  }

  const bookingId = req.nextUrl.searchParams.get("bookingId");
  const addressId = req.nextUrl.searchParams.get("addressId");

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

  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId!,
      userId: user?.id,
    },
  });

  if (!booking) {
    return new NextResponse(null, { status: 403 });
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

  let buffer: Buffer;
  const doc = await createInvoicePdfServer(bookingId!, addressId!);
  const docBytes = doc?.output("arraybuffer");

  if (!docBytes) {
    return NextResponse.json(null, { status: 400 });
  }

  buffer = Buffer.from(docBytes);

  await prisma.invoice.update({
    where: {
      bookingId: bookingId!,
    },
    data: {
      document: buffer,
      documentCreated: new Date(),
    },
    select: {
      id: true,
      number: true,
    },
  });

  const response = new NextResponse(buffer);
  response.headers.set("content-type", "application/pdf");
  response.headers.set(
    "Content-Disposition",
    `attachment; filename=${getInvoiceNumber(invoice?.number)}.pdf`
  );
  response.headers.set("Content-Length", buffer.byteLength.toString());
  return response;
}

async function createInvoicePdfServer(
  bookingId: string,
  addressId: string
): Promise<jsPDF | null> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
    include: {
      ServicesOnBookings: {
        include: {
          service: true,
        },
      },
      car: true,
    },
  });

  if (!booking) {
    return null;
  }

  const address: Address | null = await prisma.address.findFirst({
    where: {
      id: addressId,
    },
  });

  if (!address) {
    return null;
  }

  const invoice: Invoice | null = await prisma.invoice.findFirst({
    where: {
      bookingId: bookingId,
    },
  });

  var doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    putOnlyUsedFonts: true,
  });

  // Header
  autoTable(doc, {
    body: [
      [
        {
          content: "Rechnung",
          styles: {
            halign: "right",
            fontSize: 20,
            textColor: "#343a40",
          },
        },
      ],
    ],
    // didDrawCell: (data) => {
    //   if (data.section === "body" && data.column.index === 0) {
    //     var base64Img = CARFULLY_LOGO_BASE64;
    //     doc.addImage(base64Img, "PNG", data.cell.x + 2, data.cell.y + 2, 52, 7);
    //   }
    // },
    theme: "plain",
    // styles: {
    //   fillColor: "#172554",
    // },
  });

  let addressContent: string = "";
  if (address.companyName && address.companyName.length > 0) {
    addressContent += `${address.companyName}`;
  }
  if (address.firstname && address.firstname.length > 0) {
    addressContent += `\n${address.firstname}`;
  }
  if (address.lastname && address.lastname.length > 0) {
    addressContent += ` ${address.lastname}`;
  }
  if (address.street && address.street.length > 0) {
    addressContent += `\n${address.street}`;
  }
  if (address.number && address.number.length > 0) {
    addressContent += ` ${address.number}`;
  }
  if (address.additional && address.additional.length > 0) {
    addressContent += `\n${address.additional}`;
  }
  if (address.postalCode) {
    addressContent += `\n${address.postalCode}`;
  }
  if (address.city) {
    addressContent += ` ${address.city}`;
  }

  // Address lines
  autoTable(doc, {
    body: [
      [
        {
          content: `Carfully GmbH - Duesselweg 10 - 40670 Meerbusch`,
          styles: {
            halign: "left",
            fontSize: 8,
            fontStyle: "bold",
          },
        },
      ],
      [
        {
          content: addressContent,
          styles: {
            halign: "left",
            fontSize: 10,
          },
        },
      ],
    ],
    theme: "plain",
    startY: 45,
  });

  autoTable(doc, {
    body: [
      [
        `Buchungsnummer` +
          `\nBuchungsdatum` +
          `\nRechnungsnummer` +
          `\nKennzeichen`,
        `${booking.number}` +
          `\n${dayjs.tz(booking.date).format("DD.MM.YYYY HH:mm")}` +
          `\n${getInvoiceNumber(invoice?.number)}` +
          `\n${booking.car.licenseNumber}`,
      ],
    ],
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 50 },
    },
    theme: "plain",
  });

  let description = "";

  booking.ServicesOnBookings.forEach((sob) => {
    description += sob.service.name + ", ";
  });

  autoTable(doc, {
    head: [["Beschreibung", "Preis", "Betrag"]],
    body: [
      [
        description,
        `${booking.totalPrice.toString()} €`,
        `${booking.totalPrice.toString()} €`,
      ],
    ],
    // didDrawCell: (data) => {
    //   if (data.section === "body" && data.column.index === 0) {
    //     var base64Img = imgData;
    //     doc.addImage(
    //       base64Img,
    //       "PNG",
    //       data.cell.x + 2,
    //       data.cell.y + 2,
    //       89,
    //       12
    //     );
    //   }
    // },
    theme: "striped",
    headStyles: {
      fillColor: "#343a40",
    },
  });

  const tax = (booking.totalPrice * TAX_AMOUNT).toFixed(2);

  autoTable(doc, {
    body: [
      [
        {
          content: "Gesamt (brutto)",
          styles: {
            halign: "right",
          },
        },
        {
          content: `${booking.totalPrice.toString()} €`,
          styles: {
            halign: "right",
          },
        },
      ],
      [
        {
          content: "Enthaltene USt",
          styles: {
            halign: "right",
          },
        },
        {
          content: `${tax.toString()} €`,
          styles: {
            halign: "right",
          },
        },
      ],
    ],
    theme: "plain",
  });

  //   autoTable(doc, {
  //     body: [
  //       [
  //         {
  //           content: "Terms & notes",
  //           styles: {
  //             halign: "left",
  //             fontSize: 14,
  //           },
  //         },
  //       ],
  //       [
  //         {
  //           content:
  //             "orem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia" +
  //             "molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum" +
  //             "numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium",
  //           styles: {
  //             halign: "left",
  //           },
  //         },
  //       ],
  //     ],
  //     theme: "plain",
  //   });

  //   autoTable(doc, {
  //     body: [
  //       [
  //         {
  //           content: "This is a centered footer",
  //           styles: {
  //             halign: "center",
  //           },
  //         },
  //       ],
  //     ],
  //     theme: "plain",
  //   });

  autoTable(doc, {
    body: [
      [
        {
          content: "Carfully" + "\nsupport@carfully.de" + "\nwww.carfully.de",
          styles: {
            halign: "left",
          },
        },
        {
          content:
            "Bankverbindung" +
            "\nSparkasse Düsseldorf" +
            "\nIBAN DE33 4505 0000 0000 1234 56" +
            "\nBIC SPDUDE33XXX",
          styles: {
            halign: "left",
          },
        },
        {
          content: "Umsatzsteuer-Id Nummer" + "\nDE987654321",
          styles: {
            halign: "right",
          },
        },
      ],
    ],
    theme: "plain",
    startY: 260,
    styles: {
      fontSize: 8,
    },
  });

  const addFooters = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();

    doc.setFont("helvetica");
    doc.setFontSize(8);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      //   doc.text(
      //     "Seite " + String(i) + " von " + String(pageCount),
      //     doc.internal.pageSize.width / 2,
      //     287,
      //     {
      //       align: "center",
      //     }
      //   );
    }
  };

  addFooters(doc);

  // return doc.save(`Carfully Rechnung ${booking.number}`);
  return doc;
}
