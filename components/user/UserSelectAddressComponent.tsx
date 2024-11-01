"use client";

import AddressService from "@/services/AddressService";
import { Dialog, Transition } from "@headlessui/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Address } from "@prisma/client";
import React, { Fragment, useState, useEffect } from "react";

export const UserSelectAddressComponent = (props: {
  onConfirm: Function | undefined;
  onClose: Function | undefined;
  open: boolean;
}) => {
  const addressService = new AddressService();

  const [isOpen, setIsOpen] = useState(props.open);
  const [isValid, setIsValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addressId, setAddressId] = useState<string>();
  const [addresses, setAddresses] = useState<Address[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    addressService.getAll().then((data) => {
      setAddresses(data);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (addressId) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [addressId]);

  function closeModal() {
    setIsOpen(false);
    if (props.onClose) {
      props.onClose();
    }
  }

  async function handleConfirm() {
    setIsSaving(true);
    if (props.onConfirm) {
      props.onConfirm(addressId);
      setIsOpen(false);
    }
  }

  function getDisplayTitle(item: Address) {
    if (!item) {
      return "";
    }

    let result = "";

    if (item.companyName) {
      result += `${item.companyName} - `;
    }

    result += `${item.lastname}, ${item.firstname}: ${item.street} ${item.number}`;

    return result;
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-100 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                  Rechnungsadresse auswählen
                </Dialog.Title>
                <div
                  className="flex items-center bg-red-700 mb-4 text-white text-xs p-4 my-2 rounded-md py-3"
                  role="alert"
                >
                  <svg
                    className="fill-current w-8 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                  </svg>
                  <p>
                    Die Rechnung wird einmalig erzeugt. Eine Anpassung der
                    Rechnungsadresse ist im Nachhinein technisch nicht möglich.
                  </p>
                </div>

                <div className="mt-2">
                  {/* <SelectBox
                    items={addresses}
                    className="grow"
                    displayExpr={getDisplayTitle}
                    label="Adresse wählen"
                    labelMode="floating"
                    // itemRender={AddressItemRender}
                    dropDownOptions={{ height: 170 }}
                    valueExpr={"id"}
                    value={addressId}
                    onValueChange={(e) => {
                      setAddressId(e);
                    }}
                  /> */}
                  {!isLoading && (
                    <FormControl fullWidth>
                      <InputLabel id="selectLabelAddressType">
                        Adresse wählen
                      </InputLabel>
                      <Select
                        labelId="selectLabelAddressType"
                        id="selectAddressType"
                        label="Adresse wählen"
                        value={addressId}
                        onChange={(e) => {
                          setAddressId(e.target.value);
                        }}
                      >
                        {addresses!.map((item) => (
                          <MenuItem key={item.id} value={item.id}>
                            {getDisplayTitle(item)}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  <div className="px-3 w-full">
                    <button
                      type="submit"
                      onClick={handleConfirm}
                      disabled={!isValid || isSaving}
                      className="block w-full bg-sky-600 mt-4 py-2 rounded-2xl disabled:bg-gray-600  text-white font-semibold mb-2 hover:bg-sky-700"
                    >
                      Herunterladen
                    </button>
                  </div>
                  <div className="px-3 w-full">
                    <button
                      type="submit"
                      onClick={closeModal}
                      disabled={isSaving}
                      className="block w-full bg-red-700 mt-4 py-2 rounded-2xl disabled:bg-gray-600  text-white font-semibold mb-2 hover:bg-red-800"
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
