"use client";

import React, { useEffect, useState } from "react";
import SiteTitleComponent from "./SiteTitleComponent";
// import ReCAPTCHA from "react-google-recaptcha";
// import { checkRecaptcha } from "@/services/GoogleApiService";
import { sendMailApplyJobItem } from "@/services/MailingService";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Checkbox } from "@mui/material";
import { faL } from "@fortawesome/free-solid-svg-icons";

export interface ApplyJobItem {
  firstName?: string;
  lastName?: string;
  birthdate?: Date;
  email?: string;
  phone?: string;
  asapStartDate?: Date;
}

export function JoinTheTeam() {
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const [isSent, setIsSent] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [asapStartDate, setAsapStartDate] = useState();
  const [checkTerms, setCheckTerms] = useState(false);

  // const sitekey = "6Lfq2UkpAAAAALURq7IQBkAPeORt8KP5QtwJrh-C";

  // async function onChange(value: string | null) {
  //   if (value) {
  //     var response = await checkRecaptcha(value!);
  //     if (response.success) {
  //       setIsButtonEnabled(true);
  //     }
  //   }
  // }

  useEffect(() => {
    if (firstName && lastName && email) {
      if (firstName.length < 3) {
        setIsButtonEnabled(false);
        return;
      }

      if (lastName.length < 3) {
        setIsButtonEnabled(false);
        return;
      }

      if (email.length < 8) {
        setIsButtonEnabled(false);
        return;
      }

      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [firstName, lastName, email]);

  async function applyJob() {
    setIsButtonEnabled(false);

    const applyJobItem: ApplyJobItem = {
      firstName: firstName,
      lastName: lastName,
      birthdate: birthdate,
      email: email,
      phone: phone,
      asapStartDate: asapStartDate,
    };

    await sendMailApplyJobItem(applyJobItem);

    setIsSent(true);
  }

  return (
    <section>
      <div className="py-6 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6 bg-left-top bg-no-repeat max-h-full">
        <SiteTitleComponent text="Werde" coloredText="Teil des Teams!" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="">
            <p className="text-xl">
              Du liebst Autos genauso sehr wie wir? Dann werde Teil unseres
              Teams bei CARFULLY! Wir suchen engagierte und leidenschaftliche
              Mitarbeiter, die unsere Vision teilen, sich um jedes Auto zu
              kümmern, als wäre es ihr eigenes. Ob im Kundenservice, der
              Autopflege {"–"} bei uns findest du spannende Aufgaben und
              Entwicklungsmöglichkeiten. Werde Teil einer dynamischen und
              motivierten Crew und gestalte die Zukunft der Autobranche mit uns.
              Bewirb dich noch heute und bringe deine Leidenschaft für Autos in
              unser Team ein!
            </p>
          </div>
          <div className="rounded-lg p-2 flex flex-col gap-y-3 ">
            <div className="flex flex-col gap-y-3 sm:flex-row gap-x-5">
              <TextField
                label="Vorname"
                className="flex-1"
                disabled={isSent}
                variant="outlined"
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Nachname"
                className="flex-1"
                disabled={isSent}
                variant="outlined"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-y-3 sm:flex-row gap-x-5">
              <DatePicker
                label="Geburtsdatum"
                className="flex-1"
                onChange={(v: any) => {
                  setBirthdate(v.toDate());
                }}
              />

              <TextField
                label="E-Mail"
                className="flex-1"
                disabled={isSent}
                variant="outlined"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-y-3 sm:flex-row gap-x-5">
              <TextField
                label="Telefon"
                className="flex-1"
                disabled={isSent}
                variant="outlined"
                onChange={(e) => setPhone(e.target.value)}
              />

              <DatePicker
                className="flex-1"
                label="möglicher Starttermin"
                onChange={(v: any) => {
                  setAsapStartDate(v.toDate());
                }}
              />
            </div>
            <div className="flex flex-row items-center mt-6 mb-6">
              <Checkbox
                value={checkTerms}
                onChange={(e) => setCheckTerms(e.target.checked)}
              />
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-light">
                  Ich akzeptiere die{" "}
                  <a
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    href="/agb"
                  >
                    Geschäftsbedingungen
                  </a>
                </label>
              </div>
            </div>
            {/* <ReCAPTCHA
              className="mt-2 flex flex-row justify-end"
              sitekey={sitekey!}
              onChange={onChange}
            /> */}
            <button
              disabled={isButtonEnabled && checkTerms ? false : true}
              onClick={applyJob}
              className="block w-full bg-sky-600 mt-4 py-2 disabled:bg-gray-600 rounded-2xl text-white font-semibold mb-2 hover:bg-sky-700"
            >
              {isSent ? "Vielen Dank für die Anfrage 👍" : "Jetzt bewerben"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
