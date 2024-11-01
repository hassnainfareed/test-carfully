import { MailBaseParams } from "./mailBase";
import MailBase from "./mailBase";
import { Resend } from "resend";
import Logger from "@/utils/winstonLogger";

var logger = Logger("SendMailBookingCustomerStatusFinished");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailBookingCustomerStatusFinished(
  to: string,
  bookingNumber: string
) {
  logger.info(`started`);

  var mailBaseParams: MailBaseParams = {
    title: `Deine Buchung`,
    content: `
    Wir danken dir herzlich für die Wahl unserer Dienstleistungen bei Carfully! Deine Zufriedenheit liegt uns am Herzen, und wir freuen uns darauf, dein Fahrzeug erneut anzutreffen.
      <br/><br/>
      Deine Buchung ist nun abgeschlossen - wir wünschen eine gute Fahrt.
      <br/><br/>
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
      subject: `✅ Buchung fertiggestellt ${bookingNumber}`,
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
