"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resend_1 = require("resend");
var resend = new resend_1.Resend("re_e3k4b96i_Mhtt4bJUqXN8PYpWqHnfHwkx");
resend.emails.send({
    from: "Carfully <noreply@carfullygmbh.de>",
    to: "ibrahim.son@gmx.de",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});
