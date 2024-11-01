import sendWhatsApp from "@/utils/whatsAppSender";
import Logger from "@/utils/winstonLogger";

var logger = Logger("SendWhatsAppBookingInbound");

export function BookingInboundTemplate(
  bookingId: string,
  bookingNumber: string,
  locationName: string,
  parkingSpot: string,
  licenseNumber: string,
  services: string
) {
  //   return `Carfully Buchungseingang ${bookingNumber} - Standort ${locationName} - Parkplatz ${parkingSpot} - Kennzeichen ${licenseNumber} - Dienstleistung(en) ${services.trimEnd()}
  // Hier geht es zur Buchung:
  // https://carfully.vercel.app/manage/${bookingId}`;
  return `[TEST] Carfully Buchungseingang ${bookingNumber} - Standort ${locationName} - Parkplatz ${parkingSpot} - Kennzeichen ${licenseNumber} - Dienstleistung(en) ${services.trimEnd()}`;
}

export default async function SendWhatsAppBookingInbound(
  receivers: string | undefined | null,
  bookingId: string,
  bookingNumber: string,
  locationName: string,
  parkingSpot: string,
  licenseNumber: string,
  services: string
) {
  if (!receivers) {
    return;
  }

  const body = BookingInboundTemplate(
    bookingId,
    bookingNumber,
    locationName,
    parkingSpot,
    licenseNumber,
    services
  );

  logger.info(`Sending WhatsApp message: ${body}`);

  const whatsAppReceiversArray = receivers.split(";");

  if (whatsAppReceiversArray) {
    for (var i = 0; i < whatsAppReceiversArray!.length; i++) {
      await sendWhatsApp(whatsAppReceiversArray[i], body);
    }
  }

  logger.info(`Sending WhatsApp message finished`);
}
