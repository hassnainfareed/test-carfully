"use client";

import React, { useState, useEffect } from "react";
import DataGrid, { Column, Button } from "devextreme-react/data-grid";
import deMessages from "devextreme/localization/messages/de.json";
import { locale, loadMessages } from "devextreme/localization";
import { Service } from "@prisma/client";
import { useRouter } from "next/navigation";
import { SavedEvent } from "devextreme/ui/data_grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { GUID_EMPTY } from "@/constants";
import ServiceService from "@/services/ServiceService";

export default function Services() {
  loadMessages(deMessages);
  locale("de-DE");

  const router = useRouter();

  const serviceService = new ServiceService();
  const [services, setServices] = useState<Service[]>();

  useEffect(() => {
    serviceService.getAll().then((data) => setServices(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSaved(e: SavedEvent) {
    if (retryButtonVisible) setRetryButtonVisible(false);
    if (e.changes?.[0]?.data) {
      const data = e.changes[0].data;
      serviceService.update(data);
    }
  }
  const [retryButtonVisible, setRetryButtonVisible] = useState(false);

  function handleEdit(e: any) {
    router.push(`/admin/services/${e.row.key}`);
  }

  function insertService() {
    router.push(`/admin/services/${GUID_EMPTY}`);
  }

  return (
    <div className="p-4">
      <div className="flex flex-col">
        <div className="flex flex-row justify-end mb-2">
          <a
            onClick={(e) => insertService()}
            className="relative flex ml-2 items-center justify-center h-10 px-4 m-y-2 bg-green-700 rounded-lg hover:bg-green-800 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="h-5 w-5 pr-2 text-slate-100"
            />
            <span className="relative text-md font-normal text-slate-100 max-md:hidden">
              Dienstleistung hinzufügen
            </span>
          </a>
        </div>
        <DataGrid
          dataSource={services}
          keyExpr="id"
          showBorders={true}
          // onSaved={onSaved}
        >
          <Column type="buttons" width={110}>
            <Button
              hint="Bearbeiten"
              text="Bearbeiten"
              visible={true}
              onClick={handleEdit}
            />
          </Column>

          <Column dataField="createdAt" caption="" visible={false} />
          <Column
            dataField="name"
            caption="Dienstleistung"
            sortIndex={1}
            sortOrder="asc"
          />
          <Column dataField="description" caption="Beschreibung" />
          <Column
            dataField="price"
            caption="Preis"
            width={90}
            dataType="number"
            format="#,##0.00 €"
          />
        </DataGrid>
      </div>
    </div>
  );
}
