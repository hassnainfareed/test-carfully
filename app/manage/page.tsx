"use client";

import { Booking, Location } from "@prisma/client";
import { DataGrid, SelectBox } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import React, { useEffect, useState } from "react";
import deMessages from "devextreme/localization/messages/de.json";
import { locale, loadMessages } from "devextreme/localization";
import CellRenderBookingInfo from "@/components/cellRender/CellRenderBookingInfo";
import CellRenderBookingStatusClickable from "@/components/cellRender/CellRenderBookingStatusClickable";
import LocationService from "@/services/LocationService";
import { getBookingsByLocation } from "@/services/BookingService";
import { LocationModel } from "@/services/contracts/LocationRepository";
import Cookies from "universal-cookie";
import { COOKIE_KEY_LOCATION_ID } from "@/constants";

export default function Manage() {
  loadMessages(deMessages);
  locale("de-DE");

  const cookies = new Cookies(null, { path: "/" });

  const [locations, setLocations] = useState<Location[]>();
  const [locationId, setLocationId] = useState<string>();
  const [bookings, setBookings] = useState<Booking[]>();

  const locationService = new LocationService();

  useEffect(() => {
    initializeLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initializeLocations() {
    locationService.getAll().then((data) => {
      setLocations(data);

      var cook_loactionId = cookies.get(COOKIE_KEY_LOCATION_ID);
      if (cook_loactionId) {
        setLocationId(cook_loactionId);
      }
    });
    // setLocations(await getLocations());
  }

  useEffect(() => {
    if (!locationId) {
      return;
    }
    cookies.set(COOKIE_KEY_LOCATION_ID, locationId);
    getBookingsByLocation(locationId).then((data) => setBookings(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  function getDisplayTitle(item: LocationModel) {
    if (!item) {
      return "";
    }

    return `${item.city}, ${item.name}`;
  }

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="flex flex-col">
        <SelectBox
          items={locations}
          className="grow"
          displayExpr={getDisplayTitle}
          label="Standort wählen"
          labelMode="floating"
          height={52}
          valueExpr={"id"}
          value={locationId}
          onValueChange={(e) => {
            setLocationId(e);
          }}
        />
      </div>
      <div className="border-gray-300 rounded-xl mt-4">
        <h3 className="text-lg font-semibold text-sky-600 mb-4">Buchungen</h3>
        <DataGrid
          dataSource={bookings}
          keyExpr="id"
          // defaultColumns={columns}
          showBorders={true}
          showRowLines={true}
        >
          <Column
            dataField="number"
            cellRender={CellRenderBookingInfo}
            dataType="string"
            caption="Info"
          />

          <Column
            dataField="date"
            cellRender={CellRenderBookingInfo}
            dataType="datetime"
            sortIndex={1}
            sortOrder="desc"
            visible={false}
            caption="Info"
          />

          <Column
            width={120}
            dataField="status"
            cellRender={CellRenderBookingStatusClickable}
            dataType="string"
            caption="Status"
          />
        </DataGrid>
      </div>
    </div>
  );
}
