import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface MailInfo {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export default async function sendMail(mailInfo: MailInfo) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Carfully <carfully@sonsoft.de>",
      to: mailInfo.to,
      subject: mailInfo.subject,
      html: "",
    });

    if (error) {
      return NextResponse.json({ error });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error });
  }
}
