import { MailBaseParams } from "./mailBase";
import MailBase from "./mailBase";
import { Resend } from "resend";
import Logger from "@/utils/winstonLogger";

var logger = Logger("SendMailNewUserDiscount");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailNewUserDiscount(to: string, code: string) {
  logger.info(`started`);
  var mailBaseParams: MailBaseParams = {
    title: "Deine erste Wäsche geht auf uns",
    content: `
    Vielen Dank für deine Registrierung. Als Dankeschön erhälst du deine erste Außenwäsche gratis.
                        <br />
                        <br />
                        Trage den unten aufgeführten Rabattcode bei deiner ersten Buchung in die dafür vorgesehene Fläche ein.
                        <br />
                        <br />
                        Dieser Rabattcode verfällt nach einem Monat.
                        <br />
                        <br />
                        <div
                          height="40"
                          align="center"
                          style="
                            font-family: 'Open sans', Arial, sans-serif;
                            color: #0284c7;
                            font-size: 18px;
                            padding-left: 15px;
                            padding-right: 15px;
                            font-weight: normal;
                            border: 2px solid #0284c7;
                          "
                        >
                          ${code}
                        </div>
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
      subject: "🎁 Carfully Rabattcode",
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
