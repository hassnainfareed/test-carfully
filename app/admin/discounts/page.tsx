"use client";

import React, { useState, useEffect } from "react";
import DataGrid, { Column, Button } from "devextreme-react/data-grid";
import "devextreme-react/text-area";
import deMessages from "devextreme/localization/messages/de.json";
import { locale, loadMessages } from "devextreme/localization";
import { Discount, DiscountType } from "@prisma/client";
import { RowInsertedEvent, SavedEvent } from "devextreme/ui/data_grid";
import { useRouter } from "next/navigation";
import DiscountService from "@/services/DiscountService";
import ServiceService from "@/services/ServiceService";
import { GUID_EMPTY } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function Discounts() {
  loadMessages(deMessages);
  locale("de-DE");

  const router = useRouter();

  const discountService = new DiscountService();

  const [discounts, setDiscounts] = useState<Discount[]>();

  useEffect(() => {
    discountService.getAll().then((data) => setDiscounts(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onRowInserted(e: RowInsertedEvent) {
    var data = e.data;
    data.id = GUID_EMPTY;
  }

  function insertDiscount() {
    router.push(`/admin/discounts/${GUID_EMPTY}`);
  }

  function handleEdit(e: any) {
    router.push(`/admin/discounts/${e.row.key}`);
  }

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex flex-row justify-end mb-2">
          <a
            onClick={(e) => insertDiscount()}
            className="relative flex ml-2 items-center justify-center h-10 px-4 m-y-2 bg-green-700 rounded-lg hover:bg-green-800 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="h-5 w-5 pr-2 text-slate-100"
            />
            <span className="relative text-md font-normal text-slate-100 max-md:hidden">
              Rabatt hinzufügen
            </span>
          </a>
        </div>
        <DataGrid
          dataSource={discounts}
          keyExpr="id"
          showBorders={true}
          onRowInserted={onRowInserted}
        >
          <Column type="buttons" width={110}>
            <Button
              hint="Bearbeiten"
              text="Bearbeiten"
              visible={true}
              onClick={handleEdit}
            />
          </Column>
          <Column dataField="name" caption="Rabatt" />
          <Column dataField="description" caption="Beschreibung" />
          <Column dataField="valid" caption="Gültig" width={100} />
          <Column dataField="oneTime" caption="Einmalig" width={100} />
          <Column
            dataField="validFrom"
            caption="Gültig von"
            width={100}
            dataType="date"
            format="dd.MM.yyyy"
          />
          <Column
            dataField="validTo"
            caption="Gültig bis"
            width={100}
            dataType="date"
            format="dd.MM.yyyy"
          />
        </DataGrid>
      </div>
    </div>
  );
}
