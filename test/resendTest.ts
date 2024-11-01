import { Resend } from "resend";

const resend = new Resend("re_e3k4b96i_Mhtt4bJUqXN8PYpWqHnfHwkx");

resend.emails.send({
  from: "Carfully <noreply@carfullygmbh.de>",
  to: "ibrahim.son@gmx.de",
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});
