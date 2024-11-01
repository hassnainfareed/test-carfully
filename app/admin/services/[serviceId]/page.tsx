"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  PriceCategory,
  Service,
  ServicesOnPriceCategory,
} from "@prisma/client";
import { GUID_EMPTY } from "@/constants";
import { CheckBox, DataGrid, Form } from "devextreme-react";
import { GroupItem, Item, Label, SimpleItem } from "devextreme-react/form";
import ServiceService from "@/services/ServiceService";
import { FieldDataChangedEvent } from "devextreme/ui/form";
import { useRouter } from "next/navigation";
import { Column, Editing, Lookup, Selection } from "devextreme-react/data-grid";
import PriceCategoryService from "@/services/PriceCategoryService";
import deMessages from "devextreme/localization/messages/de.json";
import { locale, loadMessages } from "devextreme/localization";
import {
  RowInsertedEvent,
  RowInsertingEvent,
  RowRemovedEvent,
  RowUpdatedEvent,
} from "devextreme/ui/data_grid";
import { convertFileToBase64 } from "@/utils/ImageHelper";
import { ServiceUpdateImageProps } from "@/services/ServiceService";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import ServiceCard from "@/components/service/ServiceCard";

const dropzoneStyles: React.CSSProperties = {
  border: "2px dashed #cccccc",
  borderRadius: "4px",
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
  width: 400,
};

interface Props {
  serviceId: string;
}

export default function ServiceDetails({ params }: { params: Props }) {
  loadMessages(deMessages);
  locale("de-DE");

  const [service, setService] = useState<Service | undefined>();
  const [isNew, setIsNew] = useState(false);
  const [priceCategories, setPriceCategories] = useState<PriceCategory[]>();
  const [serviceOnPriceCategories, setServiceOnPriceCategories] =
    useState<ServicesOnPriceCategory[]>();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Assuming only one file is dropped/uploaded
    const file = acceptedFiles[0];

    if (file) {
      const base64 = await convertFileToBase64(file);

      const data: ServiceUpdateImageProps = {
        serviceId: params.serviceId,
        image: base64,
      };

      await serviceService.updateImage(data).then((data) => setService(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const serviceService = new ServiceService();
  const priceCategoryService = new PriceCategoryService();

  const router = useRouter();

  // const formElement = React.createRef<HTMLFormElement>();

  // const arrayBufferToBase64 = (buffer: any) => {
  //   let binary = "";
  //   let bytes = buffer.data;
  //   let len = bytes.length;

  //   for (let i = 0; i < len; i++) {
  //     binary += String.fromCharCode(bytes[i]);
  //   }
  //   return btoa(binary);
  // };

  useEffect(() => {
    if (params.serviceId === GUID_EMPTY) {
      setIsNew(true);
      return;
    }

    serviceService.get(params.serviceId).then((data) => {
      setService(data);
    });

    priceCategoryService.getAll().then((data) => setPriceCategories(data));

    priceCategoryService
      .getPriceCategoriesByServiceId(params.serviceId)
      .then((data) => setServiceOnPriceCategories(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSaveClick() {
    if (isNew) {
      serviceService.create(service!);
    } else {
      serviceService.update(service!);
    }
    router.push("/admin/services");
  }

  const uploadUrl = `/api/service/${service?.id}`;

  const [file, setFile] = useState<File>();

  // // const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // const onSubmit = async (e: ClickEvent) => {
  //   if (!file) return;

  //   try {
  //     const data = new FormData();
  //     data.set("file", file);

  //     const res = await fetch(uploadUrl, {
  //       method: "POST",
  //       body: data,
  //     });

  //     window.location.reload();
  //     // handle the error
  //     if (!res.ok) throw new Error(await res.text());
  //   } catch (e: any) {
  //     // Handle errors here
  //     console.error(e);
  //   }
  // };

  function onFieldDataChanged(e: FieldDataChangedEvent) {
    if (isNew) {
      const formData = e.component.option("formData");
      setService(formData);
    }
  }

  async function onRowInserted(e: RowInsertedEvent<ServicesOnPriceCategory>) {
    const data: ServicesOnPriceCategory = {
      price: e.data.price,
      serviceId: params.serviceId,
      priceCategoryId: e.data.priceCategoryId,
    };

    await priceCategoryService.createPriceCategoryForService(data);
  }

  async function onRowInserting(
    e: RowInsertingEvent<ServicesOnPriceCategory>
  ) {}

  async function onRowUpdated(e: RowUpdatedEvent<ServicesOnPriceCategory>) {
    const data: ServicesOnPriceCategory = {
      price: e.data.price,
      serviceId: params.serviceId,
      priceCategoryId: e.data.priceCategoryId,
    };

    await priceCategoryService.updatePriceCategoryForService(data);
  }

  async function onRowRemoved(e: RowRemovedEvent<ServicesOnPriceCategory>) {
    await priceCategoryService.deletePriceCategoryForService(
      params.serviceId,
      e.data.priceCategoryId
    );
  }

  // function onClick() {
  //   formElement.current!.submit();
  // }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <Form
        formData={service}
        onFieldDataChanged={onFieldDataChanged}
        colCount={2}
        readOnly={false}
        labelMode="floating"
      >
        <GroupItem caption="Allgemein" cssClass="text-sky-600 font-bold">
          <SimpleItem dataField="name">
            <Label text="Dienstleistung" />
          </SimpleItem>
          <SimpleItem
            dataField="description"
            editorType="dxTextArea"
            editorOptions={{ height: 150 }}
          >
            <Label text="Beschreibung" />
          </SimpleItem>
        </GroupItem>
        <GroupItem caption="Konfiguration" cssClass="text-sky-600 font-bold">
          <SimpleItem
            dataField="price"
            editorType="dxNumberBox"
            editorOptions={{ format: "#,##0.00 €" }}
          >
            <Label text="Fallback-Preis" />
          </SimpleItem>
          <SimpleItem
            dataField="averageHandlingTime"
            editorType="dxNumberBox"
            editorOptions={{ format: "#,##0 min" }}
          >
            <Label text="Durchschnittliche Bearbeitungszeit" />
          </SimpleItem>

          {/* <div className="fileuploader-container">
            <FileUploader
              selectButtonText="Select photo"
              labelText=""
              accept="image/*"
              uploadMode="useForm"
            />
          </div> */}
        </GroupItem>
        {/* <Button
          className="button"
          text="Update profile"
          type="success"
          onClick={onSubmit}
        /> */}
      </Form>

      <div className="flex flex-row justify-end">
        <button
          type="button"
          onClick={onSaveClick}
          className="w-32 bg-sky-600 mt-4 py-2 rounded-2xl disabled:bg-gray-500 text-white font-semibold mb-2 hover:bg-sky-700"
        >
          {isNew ? "Erstellen" : "Speichern"}
        </button>
      </div>

      <div className="flex flex-col mt-4">
        <h1 className="text-xl font-bold text-sky-600 mb-6 border-b-[1px] border-b-gray-500 border-spacing-2">
          Preiskategorien
        </h1>
        <DataGrid
          dataSource={serviceOnPriceCategories}
          showBorders={true}
          // ref={dataGridRef}
          keyExpr="priceCategoryId"
          id="dataGridServiceOnPriceCategories"
          onRowInserted={onRowInserted}
          onRowInserting={onRowInserting}
          onRowUpdated={onRowUpdated}
          onRowRemoved={onRowRemoved}
        >
          <Editing
            mode="row"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true}
            selectTextOnEditStart={true}
            startEditAction="click"
          />
          <Column dataField="priceCategoryId" caption="Preiskategorie">
            <Lookup
              dataSource={priceCategories}
              valueExpr="id"
              displayExpr="name"
            />
          </Column>
          <Column
            dataField="price"
            caption="Preis"
            sortIndex={1}
            sortOrder="asc"
            width={90}
            dataType="number"
            format="#,##0.00 €"
          />
        </DataGrid>
      </div>

      <div className="flex flex-col mt-4">
        <h1 className="text-xl font-bold text-sky-600 mb-6 border-b-[1px] border-b-gray-500 border-spacing-2">
          Vorschau
        </h1>
        <div className="flex flex-col gap-y-4">
          <div {...getRootProps()} style={dropzoneStyles}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Bild hier ablegen ...</p>
            ) : (
              <p>
                Bild per Drag & Drop hier reinlegen oder per Klick ein Bild
                auswählen
              </p>
            )}
          </div>
          {service?.imageBase64 && (
            <div className="flex max-[400px]:flex-col gap-y-3 justify-content-start gap-x-4 mt-6">
              <ServiceCard
                id={service.id}
                name={service.name}
                description={service.description}
                price={service.price}
                imageBase64={service.imageBase64}
                key={service.id}
              />
              {/* <div
                key={service.id}
                className="flex flex-col max-w-sm bg-gray-900 border border-gray-500 rounded-lg shadow"
              >
                {service?.imageBase64 && (
                  <Image
                    src={service?.imageBase64!}
                    alt="photo"
                    width={384}
                    height={384}
                    className="rounded-lg "
                  />
                )}
                <div className="p-5 grow">
                  <a href="#">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-200">
                      {service.name}
                    </h5>
                  </a>
                  <p className="mb-3 font-normal text-gray-400">
                    {service.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mx-4 my-4">
                  <CheckBox />
                  <span className="ml-3 text-sm font-medium text-gray-200">
                    {service.price.toFixed(2)} €
                  </span>
                </label>
              </div> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
