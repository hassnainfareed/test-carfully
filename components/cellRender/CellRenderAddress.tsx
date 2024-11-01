import { Address } from "@prisma/client";
import React from "react";
import { dictionaryTextcolor } from "@/utils/bookingHelper";

function gridCellData(gridData: any) {
  return gridData.data[gridData.column.caption.toLowerCase()];
}

export default function CellRenderAddress(cellData: any) {
  const data = gridCellData(cellData);
  const rowData: Address = cellData.data;
  const className = `${dictionaryTextcolor[data]} flex flex-col rounded-md `;

  return (
    <>
      <div className={className}>
        {rowData.companyName && rowData.companyName.length !== 0 ? (
          <strong>{rowData.companyName}</strong>
        ) : (
          <></>
        )}
        {rowData.firstname} {rowData.lastname}
        <br />
        {rowData.street} {rowData.number}
        <br />
        {rowData.additional && rowData.additional.length !== 0 ? (
          <i>{rowData.additional}</i>
        ) : (
          <></>
        )}
        {rowData.postalCode} {rowData.city}
      </div>
    </>
  );
}
