import { MailBaseParams } from "./mailBase";
import MailBase from "./mailBase";
import { Resend } from "resend";
import Logger from "@/utils/winstonLogger";
import dayjs from "dayjs";
import { TIMEZONE } from "@/constants";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault(TIMEZONE);

var logger = Logger("SendMailBookingEmployee");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailBookingEmployee(
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

  logger.info(`started`);

  const link = `${process.env.SERVER_URL}manage/${bookingId}`;

  let timeDescription = "";

  if (isNow) {
    timeDescription = `Parkplatz ${parkingSpot}`;
  } else {
    if (appointmentDate && appointmentTime)
      timeDescription = `Termin ${dayjs.tz(appointmentDate).format("DD.MM.YYYY")}-${dayjs.tz(appointmentTime).format("HH:mm")}`;
  }

  var mailBaseParams: MailBaseParams = {
    title: `Buchung eingegangen`,
    content: `
      Hi,<br/>
      eine neue Buchung ist eingegangen.
      <br/><br/>
      Hier sind die Details der Buchung:
      <br/><br/>
      Buchungsnummer: ${bookingNumber}<br/>
      Standort: ${locationName}<br/>
      Info: ${timeDescription}<br/>
      Kennzeichen: ${licenseNumber}<br/>
      Dienstleistungen: ${services}<br/>
      <br/><br/>
      Hier geht es zu den Details<br/><br/>
      ${link}
        `,
  };

  const html = MailBase(mailBaseParams);

  try {
    const receiversArray = receivers.split(";");

    if (receiversArray) {
      const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM!,
        to: receiversArray,
        subject: `Buchung eingegangen`,
        html: html,
      });
      logger.info(`sent`);
      if (error) {
        logger.error(JSON.stringify(error));
        return error;
      }

      logger.info(`finished`);
      return data;
    }
  } catch (error) {
    logger.error(JSON.stringify(error));
    return error;
  }
}
