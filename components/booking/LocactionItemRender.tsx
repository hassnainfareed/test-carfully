import React from "react";
import { LocationModel } from "@/services/contracts/LocationRepository";

export default function LocationItemRender(data: LocationModel) {
  return (
    <div className="custom-item">
      <div className="font-bold border-t-[1px] border-gray-300">
        {data.city}
      </div>
      <div>{data.name}</div>
      {data.disabledByMaxBookings && (
        <div className=" bg-orange-800 text-gray-100 px-1 rounded-md">
          voll ausgebucht
        </div>
      )}
      {!data.disabledByMaxBookings && data.disabledByHighBookings && (
        <div className=" bg-orange-800 text-gray-100 px-1 rounded-md">
          aktuell hohe Nachfrage
        </div>
      )}
    </div>
  );
}
