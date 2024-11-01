import { ApplyJobItem } from "@/components/JoinTheTeam";
import { MailBaseParams } from "./mailBase";
import MailBase from "./mailBase";
import { Resend } from "resend";
import Logger from "@/utils/winstonLogger";

var logger = Logger("SendMailJobApply");
const resend = new Resend(process.env.RESEND_API_KEY);

export async function SendMailJobApply(applyJobItem: ApplyJobItem) {
  let birthdate: String = "";
  let asap: String = "";

  logger.info(`started`);
  if (applyJobItem.birthdate) {
    let currentDate = new Date(applyJobItem.birthdate!);
    birthdate = currentDate.toLocaleDateString("de-DE");
  }

  if (applyJobItem.asapStartDate) {
    let currentDate = new Date(applyJobItem.asapStartDate!);
    asap = currentDate.toLocaleDateString("de-DE");
  }

  var mailBaseParams: MailBaseParams = {
    title: "Jobanfrage",
    content: `
        Wir haben eine neue Jobanfrage!
                        <br />
                        <br />
                        Vorname: ${applyJobItem.firstName}<br />
                        Nachname: ${applyJobItem.lastName}<br />
                        E-Mail: ${applyJobItem.email}<br />
                        Geburtsdatum: ${birthdate}<br />
                        Telefon: ${applyJobItem.phone}<br />
                        Starttermin: ${asap}<br />
                        <br />
                        
        `,
  };

  const html = MailBase(mailBaseParams);

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: [process.env.EMAIL_SUPPORT!],
      subject: "[Carfully] Jobanfrage",
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
