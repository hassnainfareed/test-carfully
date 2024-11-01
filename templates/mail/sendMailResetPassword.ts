import { MailBaseParams } from "./mailBase";
import MailBase from "./mailBase";
import { Resend } from "resend";
import Logger from "@/utils/winstonLogger";

var logger = Logger("SendMailResetPassword");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailResetPassword(
  to: string,
  resetPasswordId: string
) {
  logger.info(`started`);
  const resetPasswordLink = `${process.env.SERVER_URL}authentication/resetPassword/${resetPasswordId}`;
  var mailBaseParams: MailBaseParams = {
    title: "Passwort zurücksetzen",
    content: `
    Es scheint, als ob du Schwierigkeiten beim Anmelden auf deinem Konto bei Carfully hast. Keine Sorge, wir sind hier, um zu helfen!
                        <br />
                        <br />
                        Um dein Passwort zurückzusetzen, klicke bitte den folgenden Link.
                        <br />
                        <br />
                        <div
                          height="40"
                          align="center"
                          style="
                            font-family: 'Open sans', Arial, sans-serif;
                            color: #0284c7;
                            font-size: 13px;
                            padding-left: 15px;
                            padding-right: 15px;
                            font-weight: normal;
                            border: 2px solid #0284c7;
                          "
                        >
                          <a href="${resetPasswordLink}">
                            <singleline label="button-2"
                              >Passwort zurücksetzen</singleline
                            >
                          </a>
                        </div>
                        <br />
                        <strong>Link zum zurücksetzen</strong>
                        <a href="${resetPasswordLink}">
                            ${resetPasswordLink}
                        </a>
                        <br />
                        <br />
                        Falls der Link nicht funktioniert, kopiere ihn bitte und
                        füge ihn in die Adressleiste deines Browsers ein.
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
      subject: "Passwort zurücksetzen",
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
