// // Download the helper library from https://www.twilio.com/docs/node/install
// // Find your Account SID and Auth Token at twilio.com/console
// // and set the environment variables. See http://twil.io/secure
// const accountSid = "AC24de7d1012e56c6b739a6e987cb48963";
// const authToken = "7e94b2e17f4690bfd36578939eea61ed";
// const client = require("twilio")(accountSid, authToken);

// client.messages.create({
//   body: "Carfully - Buchung eingegangen https://www.carfully.de/manage/46ebc7ff-5ef7-5b84-89b9-8334847fdca1",
//   from: "+15613032300",
//   to: "+491776699700",
// });
// //.then((message: { sid: any }) => console.log(message.sid));

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "AC7b6447bcbea2803ae07f994033ae5ccd";
const authToken = "33bfa5a67a4a07b5fd371f7461b0c11d";
const client = require("twilio")(accountSid, authToken);

client.messages.create({
  body: "Carfully - Buchung eingegangen Testnachricht",
  from: "+15169814994",
  to: "+491776699700",
  // to: "+4915906385057",
});
//.then((message: { sid: any }) => console.log(message.sid));
