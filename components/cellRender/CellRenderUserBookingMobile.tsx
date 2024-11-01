import {
  dictionaryBackground,
  dictionaryName,
  dictionaryTextcolor,
} from "@/utils/bookingHelper";
import React from "react";

function gridCellData(gridData: any) {
  return gridData.data[gridData.column.caption.toLowerCase()];
}

export default function CellRenderUserBookingMobile(cellData: any) {
  const data = gridCellData(cellData);
  const rowData = cellData.data;

  const className = `${
    dictionaryTextcolor[rowData.status]
  } flex flex-col rounded-md text-sm text-center`;

  return (
    <div>
      <div
        style={{
          backgroundColor: dictionaryBackground[rowData.status],
          fontSize: 12,
          paddingTop: 6,
          height: 32,
        }}
        className={className}
      >
        {dictionaryName[rowData.status]}
      </div>
      <strong className="text-sm">{rowData.number}</strong>
      <br />
      {rowData.location.name}
      <br />
      {rowData.parkingSpot}
      <br />
      {rowData.car.licenseNumber}
      <br />
    </div>
  );
}
