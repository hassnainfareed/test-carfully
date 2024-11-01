import { MailBaseParams } from "./mailBase";
import MailBase from "./mailBase";
import { Resend } from "resend";
import Logger from "@/utils/winstonLogger";

var logger = Logger("SendMailBookingCustomerStatusActive");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailBookingCustomerStatusActive(
  to: string,
  bookingNumber: string,
  averageHandlingTime: number
) {
  logger.info(`started`);

  let averageHandlingTimeParagraph = "";
  if (averageHandlingTime && averageHandlingTime !== 0) {
    averageHandlingTimeParagraph = `Deine ausgewählte Dienstleistung hat eine ungefähre Bearbeitungszeit von <strong> ${averageHandlingTime} Minuten </strong>.
      <br/><br/>`;
  }

  var mailBaseParams: MailBaseParams = {
    title: `Deine Buchung`,
    content: `
    Wir starten jetzt mit der Bearbeitung deiner Buchung.
      <br/><br/>
      ${averageHandlingTimeParagraph}
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
      subject: `🧑‍🏭 Buchung in Bearbeitung ${bookingNumber}`,
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
