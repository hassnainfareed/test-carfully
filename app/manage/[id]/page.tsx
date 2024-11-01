"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  dictionaryBackground,
  dictionaryName,
  dictionaryTextcolor,
} from "@/utils/bookingHelper";
import { Booking, BookingStatus, Car, Location, Service } from "@prisma/client";
import { getBooking, updateStatus } from "@/services/BookingService";
import { getCar } from "@/services/CarService";
import { Form } from "devextreme-react";
import { Label, SimpleItem } from "devextreme-react/form";
import deMessages from "devextreme/localization/messages/de.json";
import { locale, loadMessages } from "devextreme/localization";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import LocationService from "@/services/LocationService";
import ServiceService from "@/services/ServiceService";
import { AddBookingComment } from "@/components/booking/AddBookingComment";
import dayjs from "dayjs";
// import { TIMEZONE } from "@/constants";
// import timezone from "dayjs/plugin/timezone";
// import utc from "dayjs/plugin/utc";

// dayjs.extend(utc);
// dayjs.extend(timezone);
// dayjs.tz.setDefault(TIMEZONE);

const crypto = require("crypto");

export default function ManageDetails({ params }: { params: { id: string } }) {
  loadMessages(deMessages);
  locale("de-DE");

  const [booking, setBooking] = useState<Booking>();
  const [car, setCar] = useState<Car>();
  const [location, setLocation] = useState<Location>();
  const [services, setServices] = useState<Service[]>();
  const [description, setDescription] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonActiveDisabled, setIsButtonActiveDisabled] = useState(true);
  const [isButtonFinishedDisabled, setIsButtonFinishedDisabled] =
    useState(true);
  const [isButtonCanceledDisabled, setIsButtonCanceledDisabled] =
    useState(true);
  const [changeBookingStatus, setChangeBookingStatus] =
    useState<BookingStatus>();
  const [showBookingComment, setShowBookingComment] = useState<boolean>(false);
  const [key, setKey] = useState<string>();

  const locationService = new LocationService();
  const serviceService = new ServiceService();

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function load() {
    setIsLoading(true);
    getBooking(params.id).then((data: Booking) => {
      setBooking(data);

      // handle button disabled
      if (data.status === "CREATED" || data.status === "ASSIGNING") {
        setIsButtonActiveDisabled(false);
        setIsButtonFinishedDisabled(true);
        setIsButtonCanceledDisabled(false);
      } else if (data.status === "ACTIVE") {
        setIsButtonActiveDisabled(true);
        setIsButtonFinishedDisabled(false);
        setIsButtonCanceledDisabled(false);
      } else if (data.status === "FINISHED" || data.status === "CANCELED") {
        setIsButtonActiveDisabled(true);
        setIsButtonFinishedDisabled(true);
        setIsButtonCanceledDisabled(true);
      }

      Promise.all([
        getCar(data.carId),
        locationService.get(data.locationId),
        serviceService.getServicesByBooking(data.id),
      ]).then((datas) => {
        setCar(datas[0]);
        setLocation(datas[1]);
        setServices(datas[2]!);
        setIsLoading(false);
      });
    });
  }

  useEffect(() => {
    if (services) {
      var desc = "";
      services!.forEach((e, i) => {
        desc += `${e.name} `;
      });
      setDescription(desc);
    }
  }, [services]);

  async function handleButtonActive() {
    setIsLoading(true);
    await updateStatus({
      bookingId: booking!.id,
      bookingStatus: BookingStatus.ACTIVE,
      remarkEmployee: "",
    });
    load();
  }

  async function handleButtonFinished() {
    setIsLoading(true);
    setChangeBookingStatus(BookingStatus.FINISHED);
    setKey(crypto.randomBytes(20).toString("hex"));
    setShowBookingComment(true);
    setIsLoading(false);
  }

  async function handleButtonCanceled() {
    setIsLoading(true);
    setChangeBookingStatus(BookingStatus.CANCELED);
    setKey(crypto.randomBytes(20).toString("hex"));
    setShowBookingComment(true);
    setIsLoading(false);
  }

  useEffect(() => {
    if (showBookingComment === false) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBookingComment]);

  const renderStatus = () => {
    const data = booking?.status.toString();
    const className = `${
      dictionaryTextcolor[data!]
    } border-[1px] border-gray-950 text-center`;

    return (
      <div
        style={{
          backgroundColor: dictionaryBackground[data!],
          height: 40,
          fontSize: 18,
          paddingTop: 8,
          marginTop: 8,
        }}
        className={className}
      >
        {dictionaryName[data!]}
      </div>
    );
  };

  const renderDate = () => {
    return (
      <div
        style={{
          height: 40,
          fontSize: 18,
          paddingTop: 8,
          marginTop: 8,
        }}
      >
        Buchungsdatum: {dayjs(booking?.date).format("DD.MM.YYYY HH:mm")}
      </div>
    );
  };

  const renderAppointment = () => {
    let timeDescription = "";

    if (booking?.isNow) {
      timeDescription = `Parkplatz ${booking?.parkingSpot}`;
    } else {
      if (booking?.appointmentDate && booking?.appointmentTime)
        timeDescription = `Termin ${dayjs(booking?.appointmentDate).format("DD.MM.YYYY")}-${dayjs(booking?.appointmentTime).format("HH:mm")}`;
    }

    return (
      <div
        style={{
          height: 40,
          fontSize: 18,
          paddingTop: 8,
          marginTop: 8,
        }}
      >
        {timeDescription}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col flex-wrap mx-auto max-w-7xl p-4">
        <div className="text-2xl sm:text-4xl text-sky-600 mb-4">
          <a href="/manage">
            <FontAwesomeIcon
              icon={faChevronLeft}
              className="w-8 h-8 text-sky-600 mr-4"
            />
          </a>
          Buchung bearbeiten
        </div>
        <div className="flex flex-col gap-x-3 gap-y-3 sm:flex-row mt-2 mb-2">
          <div className="flex-1">
            <button
              type="button"
              disabled={isLoading || isButtonActiveDisabled}
              onClick={handleButtonActive}
              className="block w-full bg-orange-600 py-2 rounded-xl disabled:bg-gray-500 text-white hover:bg-orange-700"
            >
              In Bearbeitung
            </button>
          </div>
          <div className="flex-1">
            <button
              type="button"
              disabled={isLoading || isButtonFinishedDisabled}
              onClick={handleButtonFinished}
              className="block w-full bg-green-800 py-2 rounded-xl disabled:bg-gray-500 text-white hover:bg-green-900"
            >
              Abgeschlossen
            </button>
          </div>
          <div className="flex-1">
            <button
              type="button"
              disabled={isLoading || isButtonCanceledDisabled}
              onClick={handleButtonCanceled}
              className="block w-full bg-red-700 py-2 rounded-xl disabled:bg-gray-500 text-white hover:bg-red-800"
            >
              Abgebrochen
            </button>
          </div>
        </div>

        <Form
          formData={booking}
          colCount={1}
          readOnly={true}
          labelMode="floating"
        >
          <SimpleItem name="showOrder" render={renderStatus}>
            <Label text="Statusr" />
          </SimpleItem>

          <SimpleItem
            dataField="date"
            editorType="dxDateBox"
            render={renderDate}
          >
            <Label text="Buchungszeit" />
          </SimpleItem>

          <SimpleItem name="isNow" render={renderAppointment}></SimpleItem>

          <SimpleItem dataField="number">
            <Label text="Buchungsnummer" />
          </SimpleItem>

          <SimpleItem dataField="totalPrice">
            <Label text="Betrag €" />
          </SimpleItem>

          <SimpleItem dataField="assigned">
            <Label text="Zugewiesen an" />
          </SimpleItem>
        </Form>

        <Form
          formData={location}
          colCount={1}
          readOnly={true}
          labelMode="floating"
          className="mt-2"
        >
          <SimpleItem dataField="name">
            <Label text="Standort" />
          </SimpleItem>
        </Form>

        <Form
          formData={car}
          colCount={1}
          readOnly={true}
          labelMode="floating"
          className="mt-2"
        >
          <SimpleItem dataField="licenseNumber">
            <Label text="Kennzeichen" />
          </SimpleItem>
        </Form>
        {/* <div className="border-gray-800 p-3 border-2 rounded-xl mt-4">
          <h3 className="text-lg font-semibold text-sky-600 mb-4">
            Kfz-Bewertung
          </h3>
        </div> */}
      </div>
      <AddBookingComment
        key={key}
        isOpen={showBookingComment}
        bookingId={params.id}
        bookingStatus={changeBookingStatus!}
        setIsOpen={setShowBookingComment}
      />
    </>
  );
}
