import { getTimeDescription } from "@/utils/bookingHelper";
import React from "react";

export default function CellRenderBookingInfo(cellData: any) {
  const booking = cellData.data;

  return (
    <div>
      <strong>{booking.number}</strong>
      <br />
      {booking.location.name}
      <br />
      {getTimeDescription(booking)}
      <br />
      {booking.car.licenseNumber}
      <br />
    </div>
  );
}
