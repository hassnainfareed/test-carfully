"use client";

import { Booking } from "@prisma/client";
import React from "react";
import {
  dictionaryTextcolor,
  dictionaryBackground,
  dictionaryName,
} from "@/utils/bookingHelper";

// function gridCellData(gridData: any) {
//   return gridData.data[gridData.column.caption.toLowerCase()];
// }

// export default function CellRenderBookingStatus(cellData: any) {
//   const data = gridCellData(cellData);
//   const rowData: Booking = cellData.data;
//   const className = `${dictionaryTextcolor[data]} flex flex-col rounded-md text-xs text-center`;

//   return (
//     <>
//       <div
//         style={{
//           backgroundColor: dictionaryBackground[data],
//           fontSize: 12,
//           paddingTop: 6,
//           height: 32,
//         }}
//         className={className}
//       >
//         {dictionaryName[data]}
//       </div>
//     </>
//   );
// }

export interface CellRenderBookingStatusProps {
  booking: Booking;
}

export default function CellRenderBookingStatus(
  props: CellRenderBookingStatusProps
) {
  const className = `${dictionaryTextcolor[props.booking.status]} flex flex-col rounded-md text-xs text-center`;

  return (
    <>
      <div
        style={{
          backgroundColor: dictionaryBackground[props.booking.status],
          fontSize: 12,
          // paddingTop: 6,
          padding: 6,
          height: 32,
        }}
        className={className}
      >
        {dictionaryName[props.booking.status]}
      </div>
    </>
  );
}
