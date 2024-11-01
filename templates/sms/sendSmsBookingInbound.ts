import { TIMEZONE } from "@/constants";
import sendSms from "@/utils/smsSender";
import Logger from "@/utils/winstonLogger";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(TIMEZONE);

var logger = Logger("SendSMSBookingInbound");

export default async function SendSmsBookingInbound(
  receivers: string | undefined | null,
  bookingId: string,
  bookingNumber: string,
  locationName: string,
  parkingSpot: string,
  licenseNumber: string,
  services: string,
  isNow: boolean,
  appointmentDate: Date | null,
  appointmentTime: Date | null
) {
  if (!receivers) {
    return;
  }

  let timeDescription = "";

  if (isNow) {
    timeDescription = `Parkplatz ${parkingSpot}`;
  } else {
    if (appointmentDate && appointmentTime)
      timeDescription = `Termin ${dayjs.tz(appointmentDate).format("DD.MM.YYYY")}-${dayjs.tz(appointmentTime).format("HH:mm")}`;
  }

  const body = `Carfully Buchungseingang ${bookingNumber} - 
  Standort ${locationName} - ${timeDescription} - Kennzeichen ${licenseNumber} -
  Dienstleistung(en) ${services.trimEnd()} Link: ${process.env.SERVER_URL}manage/${bookingId}`;

  logger.info(`Sending SMS message: ${body}`);

  const smsReceiversArray = receivers.split(";");

  if (smsReceiversArray) {
    for (var i = 0; i < smsReceiversArray!.length; i++) {
      await sendSms(smsReceiversArray[i], body);
    }
  }

  logger.info(`Sending SMS message finished`);
}
