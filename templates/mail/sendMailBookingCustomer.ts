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

var logger = Logger("SendMailBookingCustomer");

const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailBookingCustomer(
  to: string,
  bookingNumber: string,
  locationName: string,
  parkingSpot: string,
  licenseNumber: string,
  services: string,
  isNow: boolean,
  appointmentDate: Date | null,
  appointmentTime: Date | null
) {
  logger.info(`started`);

  let timeDescription = "";
  let steps = "";

  if (isNow) {
    timeDescription = `Parkplatz ${parkingSpot}`;
    steps =
      "Komme ganz bequem zu unserem einladenden Check-in-Schalter auf der 1. Etage direkt auf dem Parkplatz mit der Parkplatznummer 1115. Hier kannst du auch deinen Autoschlüssel abgeben und später auch wieder abholen. ";
  } else {
    if (appointmentDate && appointmentTime) {
      timeDescription = `Termin ${dayjs.tz(appointmentDate).format("DD.MM.YYYY")}-${dayjs.tz(appointmentTime).format("HH:mm")}`;

      steps = `1.	Ankunft im Parkhaus:
      <br/><br/>
      Wir freuen uns darauf, dich zu unserem vereinbarten Zeitpunkt im Parkhaus zu begrüßen. 
      <br/><br/>
      2.	Dein selbstausgewählter Parkplatz:
      <br/><br/>
      Komme ganz bequem zu unserem einladenden Check-in-Schalter auf der 1. Etage direkt auf dem Parkplatz mit der Parkplatznummer 1115. Hier kannst du auch deinen Autoschlüssel abgeben und später auch wieder abholen. `;
    }
  }

  var mailBaseParams: MailBaseParams = {
    title: `Ihre Buchung ${bookingNumber}`,
    content: `
      Wir freuen uns, dir mitteilen zu können, dass deine Buchung für dein Auto bei uns erfolgreich eingegangen ist. 
      <br/><br/>
      Wie geht es nun weiter? 
      <br/>
      ${steps}
      <br/><br/>
      Vielen Dank, dass du unsere Dienstleistungen in Anspruch nimmst!
      <br/><br/>
      Hier sind die Details deiner Buchung:
      <br/><br/>
      Buchungsnummer: ${bookingNumber}<br/>
      Standort: ${locationName}<br/>
      Info: ${timeDescription}<br/>
      Kennzeichen: ${licenseNumber}<br/>
      Dienstleistungen: ${services}<br/>
      <br/><br/>
      Unsere qualifizierten Mitarbeiter werden sich um dein Fahrzeug kümmern und sicherstellen, dass es in kürzester Zeit im besten Glanz erstrahlt. Wir verwenden umweltfreundliche Produkte, um eine schonende und effektive Reinigung zu gewährleisten.
      <br/><br/> 
      Wir freuen uns darauf, deinem Auto den Glanz zu verleihen, den es verdient!
      <br />
      <br />
      Bei Fragen oder Problemen stehen wir dir gerne zur
      Verfügung. Schreibe einfach eine E-Mail an
      <a href="mailto:support@carfully.de">
        support@carfully.de </a
      > oder kontaktiere uns telefonisch unter der Telefonnummer <a href="tel:+49 1768 7731630">+49 1768 7731630</a>.
      <br />
      <br />
      Mit freundlichen Grüßen, <br />Dein Carfully Team
        `,
  };

  const html = MailBase(mailBaseParams);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [to],
      subject: `Deine Buchung ${bookingNumber}`,
      html: html,
    });

    logger.info(`sent`);

    if (error) {
      logger.error(JSON.stringify(error));
      return error;
    }

    logger.info(`finished`);

    return data;
  } catch (error) {
    logger.error(JSON.stringify(error));
    return error;
  }
}
