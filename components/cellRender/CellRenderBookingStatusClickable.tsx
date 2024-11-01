import { Booking } from "@prisma/client";
import React from "react";
import {
  dictionaryTextcolor,
  dictionaryBackground,
  dictionaryName,
} from "@/utils/bookingHelper";

function gridCellData(gridData: any) {
  return gridData.data[gridData.column.caption.toLowerCase()];
}

export default function CellRenderBookingStatusClickable(cellData: any) {
  const data = gridCellData(cellData);
  const rowData: Booking = cellData.data;
  const className = `${dictionaryTextcolor[data]} flex flex-col rounded-md text-center`;

  const detailsLink = `/manage/${rowData.id}`;
  return (
    <div
      style={{
        backgroundColor: dictionaryBackground[data],
        fontSize: 14,
        paddingTop: 24,
        height: 64,
      }}
      className={className}
    >
      <a className="grow" href={detailsLink}>
        {dictionaryName[data]}
      </a>
    </div>
  );
}
