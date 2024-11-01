import { MailBaseParams } from "./mailBase";
import MailBase from "./mailBase";
import { Resend } from "resend";
import Logger from "@/utils/winstonLogger";

var logger = Logger("SendMailEMailVerification");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailEMailVerification(
  to: string,
  verificationId: string
) {
  const verificationLink = `${process.env.SERVER_URL}authentication/verify/${verificationId}`;

  logger.info(`started`);

  var mailBaseParams: MailBaseParams = {
    title: "E-Mail Adresse verifizieren",
    content: `
        Herzlich willkommen bei Carfully! Wir freuen uns, dass
                        du unsere Dienstleistungen nutzen möchtest.
                        <br />
                        <br />
                        Um sicherzustellen, dass wir die richtige E-Mail-Adresse
                        haben und du alle Vorteile unserer Plattform nutzen
                        kannst, bitten wir dich, deine E-Mail-Adresse zu
                        bestätigen. Dies ist ein wichtiger Schritt, um die
                        Sicherheit deines Kontos zu gewährleisten.
                        <br />
                        <br />
                        Bitte klicke einfach auf 'Verifizieren' oder den Link,
                        um deine E-Mail-Adresse zu verifizieren.
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
                          <a href="${verificationLink}">
                            <singleline label="button-2"
                              >Verifizieren</singleline
                            >
                          </a>
                        </div>
                        <br />
                        <strong>Verifikationslink</strong>
                        <a href="${verificationLink}">
                            ${verificationLink}
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
      subject: "Verifizieren deine E-Mail-Adresse",
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

// export function EmailAddressVerification(verificationId: string): string {
//   const verificationLink = `${process.env.SERVER_URL}authentication/verify/${verificationId}`;

//   var mailBaseParams: MailBaseParams = {
//     title: "E-Mail Adresse verifizieren",
//     content: `
//         Herzlich willkommen bei Carfully! Wir freuen uns, dass
//                         du unsere Dienstleistungen nutzen möchtest.
//                         <br />
//                         <br />
//                         Um sicherzustellen, dass wir die richtige E-Mail-Adresse
//                         haben und du alle Vorteile unserer Plattform nutzen
//                         kannst, bitten wir dich, deine E-Mail-Adresse zu
//                         bestätigen. Dies ist ein wichtiger Schritt, um die
//                         Sicherheit deines Kontos zu gewährleisten.
//                         <br />
//                         <br />
//                         Bitte klicke einfach auf 'Verifizieren' oder den Link,
//                         um deine E-Mail-Adresse zu verifizieren.
//                         <br />
//                         <br />
//                         <div
//                           height="40"
//                           align="center"
//                           style="
//                             font-family: 'Open sans', Arial, sans-serif;
//                             color: #0284c7;
//                             font-size: 13px;
//                             padding-left: 15px;
//                             padding-right: 15px;
//                             font-weight: normal;
//                             border: 2px solid #0284c7;
//                           "
//                         >
//                           <a href="${verificationLink}">
//                             <singleline label="button-2"
//                               >Verifizieren</singleline
//                             >
//                           </a>
//                         </div>
//                         <br />
//                         <strong>Verifikationslink</strong>
//                         <a href="${verificationLink}">
//                             ${verificationLink}
//                         </a>
//                         <br />
//                         <br />
//                         Falls der Link nicht funktioniert, kopiere ihn bitte und
//                         füge ihn in die Adressleiste deines Browsers ein.
//                         <br />
//                         <br />
//                         Bei Fragen oder Problemen stehen wir dir gerne zur
//                         Verfügung. Schreibe einfach eine E-Mail an
//                         <a href="mailto:support@carfully.de">
//                           support@carfully.de </a
//                         >.
//                         <br />
//                         <br />
//                         Mit freundlichen Grüßen, <br />Dein Carfully Team
//         `,
//   };

//   const result = MailBase(mailBaseParams);
//   return result;
// }
