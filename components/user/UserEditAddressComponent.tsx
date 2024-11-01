"use client";

import { ADDRESS_TYPES, GENDER_TYPES, GUID_EMPTY } from "@/constants";
import AddressService from "@/services/AddressService";
import { Dialog, Transition } from "@headlessui/react";
import { Address } from "@prisma/client";
import React, { Fragment, useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";

export const UserEditAddressComponent = (props: {
  onConfirm: Function | undefined;
  onClose: Function | undefined;
  open: boolean;
  addressId: string | undefined;
}) => {
  const addressService = new AddressService();

  let isNew = props.addressId === GUID_EMPTY;

  const [isOpen, setIsOpen] = useState(props.open);
  const [isSaving, setIsSaving] = useState(false);
  const [address, setAddress] = useState<Address>();
  const [addressType, setAddressType] = useState<string | undefined>(
    ADDRESS_TYPES.find((x) => x.value === "PRIVATE")?.value
  );
  const [genderType, setGenderType] = useState<string | undefined>(
    GENDER_TYPES.find((x) => x.value === "NOT_SPECIFIED")?.value
  );
  const [isCompanyNameVisible, setIsCompanyNameVisible] =
    useState<boolean>(false);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ values: address });

  useEffect(() => {
    if (!isNew) {
      addressService.get(props.addressId!).then((data) => {
        setAddress(data);
        setAddressType(data.addressType);
        setGenderType(data.genderType);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsCompanyNameVisible(addressType === "BUSINESS");
  }, [addressType]);

  function closeModal() {
    setIsOpen(false);
    if (props.onClose) {
      props.onClose();
    }
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 mb-5"
                >
                  {isNew ? "Adresse erstellen" : "Adresse bearbeiten"}
                </Dialog.Title>

                <div className="mt-2 flex flex-col gap-y-2">
                  <form
                    className="flex flex-col gap-y-3"
                    onSubmit={handleSubmit(async (data) => {
                      setIsSaving(true);
                      if (isNew) {
                        await addressService.create(data);
                      } else {
                        await addressService.update(data);
                      }
                      if (props.onConfirm) {
                        props.onConfirm();
                        setIsOpen(false);
                      }
                    })}
                  >
                    <FormControl fullWidth>
                      <InputLabel id="selectLabelAddressType">Typ</InputLabel>
                      <Select
                        labelId="selectLabelAddressType"
                        id="selectAddressType"
                        label="Typ"
                        {...register("addressType")}
                        value={addressType}
                        onChange={(e) => {
                          setAddressType(e.target.value);
                        }}
                      >
                        {ADDRESS_TYPES.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.display}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    {isCompanyNameVisible && (
                      <TextField
                        id="outlined-basic"
                        label="Firma"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        disabled={watch("addressType") === "PRIVATE"}
                        variant="outlined"
                        {...register("companyName")}
                      />
                    )}

                    <FormControl fullWidth>
                      <InputLabel id="selectLabelGenderType">Titel</InputLabel>
                      <Select
                        labelId="selectLabelGenderType"
                        id="selectGenderType"
                        label="Titel"
                        {...register("genderType")}
                        value={genderType}
                        onChange={(e) => setGenderType(e.target.value)}
                      >
                        {GENDER_TYPES.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.display}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Vorname"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      {...register("firstname", {
                        required: "Vorname ist ein Pflichtfeld",
                      })}
                      error={Boolean(errors.firstname)}
                      helperText={errors.firstname?.message?.toString()}
                    />

                    <TextField
                      label="Nachname"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      {...register("lastname", {
                        required: "Nachname ist ein Pflichtfeld",
                      })}
                      error={Boolean(errors.lastname)}
                      helperText={errors.lastname?.message?.toString()}
                    />

                    <TextField
                      label="Straße"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      {...register("street", {
                        required: "Straße ist ein Pflichtfeld",
                      })}
                      error={Boolean(errors.street)}
                      helperText={errors.street?.message?.toString()}
                    />

                    <TextField
                      label="Hausnummer"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      {...register("number", {
                        required: "Hausnummer ist ein Pflichtfeld",
                      })}
                      error={Boolean(errors.number)}
                      helperText={errors.number?.message?.toString()}
                    />

                    <TextField
                      label="Adresszusatz"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      {...register("additional")}
                    />

                    <TextField
                      label="Postleitzahl"
                      fullWidth
                      type="number"
                      InputProps={{ inputProps: { min: 0, max: 99999 } }}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      {...register("postalCode", {
                        valueAsNumber: true,
                        required: "Postleitzahl ist ein Pflichtfeld",
                      })}
                      error={Boolean(errors.postalCode)}
                      helperText={errors.postalCode?.message?.toString()}
                    />

                    <TextField
                      label="Stadt"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                      {...register("city", {
                        required: "Stadt ist ein Pflichtfeld",
                      })}
                      error={Boolean(errors.city)}
                      helperText={errors.city?.message?.toString()}
                    />

                    <div className="px-3 w-full">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="block w-full bg-sky-600 mt-4 py-2 rounded-2xl disabled:bg-gray-600  text-white font-semibold mb-2 hover:bg-sky-700"
                      >
                        Speichern
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
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
