import { CARFULLY_LOGO_BASE64, INVOICE_PAD_START, TIMEZONE } from "@/constants";
import { getBooking } from "@/services/BookingService";
import InvoiceService from "@/services/InvoiceService";
import { Booking } from "@prisma/client";
import dayjs from "dayjs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(TIMEZONE);

export async function DownloadInvoice(bookingId: string) {
  const router = useRouter();
  router.push(`/api/invoice/${bookingId}`);
}
export async function createInvoicePdf(bookingId: string) {
  const booking: Booking = await getBooking(bookingId);

  const invoiceService = new InvoiceService();
  const invoice = await invoiceService.getInvoiceByBookingId(bookingId);

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
            textColor: "#ffffff",
          },
        },
      ],
    ],
    didDrawCell: (data) => {
      if (data.section === "body" && data.column.index === 0) {
        var base64Img = CARFULLY_LOGO_BASE64;
        doc.addImage(base64Img, "PNG", data.cell.x + 2, data.cell.y + 2, 52, 7);
      }
    },
    theme: "plain",
    styles: {
      fillColor: "#172554",
    },
  });

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
          content:
            `son software` +
            "\nIbrahim Son" +
            "\nGladbacher Str. 316" +
            "\n1 OG" +
            "\n47805 Krefeld",
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
      [`Buchungsnummer`, `${booking.number}`],
      [`Datum`, `${dayjs.tz(booking.date).format("DD.MM.YYYY HH:mm")}`],
      [
        `Rechnungsnummer`,
        `${invoice?.number.toString().padStart(INVOICE_PAD_START, "0")}`,
      ],
    ],

    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 50 },
    },
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content:
            "Billed to:" +
            "\nJohn Doe" +
            "\nBilling Address line 1" +
            "\nBilling Address line 2" +
            "\nZip code - City" +
            "\nCountry",
          styles: {
            halign: "left",
          },
        },
        {
          content:
            "Shipping address:" +
            "\nJohn Doe" +
            "\nShipping Address line 1" +
            "\nShipping Address line 2" +
            "\nZip code - City" +
            "\nCountry",
          styles: {
            halign: "left",
          },
        },
        {
          content:
            "From:" +
            "\nCompany name" +
            "\nShipping Address line 1" +
            "\nShipping Address line 2" +
            "\nZip code - City" +
            "\nCountry",
          styles: {
            halign: "right",
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content: "Amount due:",
          styles: {
            halign: "right",
            fontSize: 14,
          },
        },
      ],
      [
        {
          content: "$4000",
          styles: {
            halign: "right",
            fontSize: 20,
            textColor: "#3366ff",
          },
        },
      ],
      [
        {
          content: "Due date: 2022-02-01",
          styles: {
            halign: "right",
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content: "Products & Services",
          styles: {
            halign: "left",
            fontSize: 14,
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    head: [["Items", "Category", "Quantity", "Price", "Tax", "Amount"]],
    body: [
      ["Product or service name", "Category", "2", "$450", "$50", "$1000"],
      ["Product or service name", "Category", "2", "$450", "$50", "$1000"],
      ["Product or service name", "Category", "2", "$450", "$50", "$1000"],
      ["Product or service name", "Category", "2", "$450", "$50", "$1000"],
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

  autoTable(doc, {
    body: [
      [
        {
          content: "Subtotal:",
          styles: {
            halign: "right",
          },
        },
        {
          content: "$3600",
          styles: {
            halign: "right",
          },
        },
      ],
      [
        {
          content: "Total tax:",
          styles: {
            halign: "right",
          },
        },
        {
          content: "$400",
          styles: {
            halign: "right",
          },
        },
      ],
      [
        {
          content: "Total amount:",
          styles: {
            halign: "right",
          },
        },
        {
          content: "$4000",
          styles: {
            halign: "right",
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content: "Terms & notes",
          styles: {
            halign: "left",
            fontSize: 14,
          },
        },
      ],
      [
        {
          content:
            "orem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia" +
            "molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum" +
            "numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium",
          styles: {
            halign: "left",
          },
        },
      ],
    ],
    theme: "plain",
  });

  autoTable(doc, {
    body: [
      [
        {
          content: "This is a centered footer",
          styles: {
            halign: "center",
          },
        },
      ],
    ],
    theme: "plain",
  });

  const addFooters = (doc: jsPDF) => {
    const pageCount = doc.getNumberOfPages();

    doc.setFont("helvetica");
    doc.setFontSize(8);
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        "Seite " + String(i) + " von " + String(pageCount),
        doc.internal.pageSize.width / 2,
        287,
        {
          align: "center",
        }
      );
    }
  };

  addFooters(doc);

  return doc.save(`Carfully Rechnung ${booking.number}`);
}
