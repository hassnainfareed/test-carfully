import Logger from "@/utils/winstonLogger";

var logger = Logger("SendSmsBookingInbound");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken, {
  logLevel: "debug",
});

export default async function sendSms(toNumber: string, bodyMessage: string) {
  try {
    const message = await client.messages.create({
      body: bodyMessage,
      from: process.env.TWILIO_FROM,
      to: toNumber,
    });
  } catch (err: any) {
    logger.error(JSON.stringify(err));
    console.error(err);
  }
}
