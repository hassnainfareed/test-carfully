import { TIMEZONE } from "@/constants";
import { Booking } from "@prisma/client";
import dayjs from "dayjs";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault(TIMEZONE);

export function getBookingNumber() {
  var date = new Date();
  var yyyy = date.getUTCFullYear();
  var gg = date.getUTCDate();
  var ggString = gg.toString();
  var mm = date.getUTCMonth() + 1;
  var mmString = mm.toString();

  if (gg < 10) ggString = "0" + ggString;

  if (mm < 10) mmString = "0" + mmString;

  var yyyyString = yyyy.toString().substring(2, 4);
  var hours = date.getUTCHours();
  var hoursString = hours.toString();
  var minutes = date.getUTCMinutes();
  var minutesString = minutes.toString();
  var seconds = date.getUTCSeconds();
  var secondsString = seconds.toString();
  var milliseconds = date.getUTCMilliseconds();
  var millisecondsString = milliseconds.toString();

  if (hours < 10) hoursString = "0" + hours;

  if (minutes < 10) minutesString = "0" + minutes;

  if (seconds < 10) secondsString = "0" + seconds;

  if (milliseconds < 10) {
    millisecondsString = "00" + milliseconds;
  } else if (milliseconds < 100) {
    millisecondsString = "0" + milliseconds;
  }

  return (
    "B" +
    millisecondsString +
    mmString +
    yyyyString +
    ggString +
    hoursString +
    secondsString +
    minutesString
  );
}

export const getTimeDescription = (booking: Booking) => {
  let timeDescription = "";
  if (booking?.isNow) {
    timeDescription = `Parkplatz ${booking?.parkingSpot}`;
  } else {
    if (booking?.appointmentDate && booking?.appointmentTime)
      timeDescription = `Termin ${dayjs(booking?.appointmentDate).format("DD.MM.YYYY")}-${dayjs(booking?.appointmentTime).format("HH:mm")}`;
  }
  return timeDescription;
};

export const dictionaryName: { [key: string]: string } = {
  CREATED: "Erstellt",
  ASSIGNING: "Offen",
  ACTIVE: "In Bearbeitung",
  CANCELED: "Abgebrochen",
  FINISHED: "Abgeschlossen",
};

export const dictionaryBackground: { [key: string]: string } = {
  CREATED: "#6b7280",
  ASSIGNING: "#6b7280",
  ACTIVE: "#ea580c",
  CANCELED: "#b91c1c",
  FINISHED: "#166534",
};

export const dictionaryTextcolor: { [key: string]: string } = {
  CREATED: "text-gray-200",
  ASSIGNING: "text-gray-200",
  ACTIVE: "text-gray-200",
  CANCELED: "text-gray-200",
  FINISHED: "text-gray-200",
};
