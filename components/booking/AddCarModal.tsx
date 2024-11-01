"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useEffect } from "react";
import {
  createCar,
  getCarBrands,
  getCarModelByCarBrandId,
} from "@/services/CarService";
import { CarBrand, CarModel } from "@prisma/client";
import { Autocomplete, Box, TextField } from "@mui/material";

interface AddCarModalProps {
  onAddCar: Function | undefined;
  onCloseModal: Function | undefined;
  open: boolean;
  isGuestBooking?: boolean;
}

export const AddCarModal = (props: AddCarModalProps) => {
  let [isOpen, setIsOpen] = useState(props.open);
  const [isValid, setIsValid] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [carBrandId, setCarBrandId] = useState("");
  const [carModelId, setCarModelId] = useState("");
  const [carBrands, setCarBrands] = useState<readonly CarBrand[]>([]);
  const [carModels, setCarModels] = useState<readonly CarModel[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCarBrands(props.isGuestBooking).then((data) => {
      setCarBrands(data);
      setIsLoading(false);
    });
  }, [props.isGuestBooking]);

  function closeModal() {
    setIsOpen(false);
    if (props.onCloseModal) {
      props.onCloseModal();
    }
  }

  useEffect(() => {
    if (carBrandId) {
      console.log('AddCarModal - Selected brand:', carBrandId); // Debug log
      setCarModels([]); // Clear existing models while loading
      getCarModelByCarBrandId(carBrandId, props.isGuestBooking)
        .then((data) => {
          console.log('AddCarModal - Received models:', data); // Debug log
          setCarModels(data);
        })
        .catch((error) => {
          console.error('Error loading car models:', error);
          setCarModels([]);
        });
    }
  }, [carBrandId, props.isGuestBooking]);

  useEffect(() => {
    if (licenseNumber.length > 3 && carBrandId && carModelId) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [licenseNumber, carBrandId, carModelId]);

  async function handleAddCar() {
    setIsSaving(true);
    try {
      await createCar({
        licenseNumber: licenseNumber,
        carBrandId: carBrandId,
        carModelId: carModelId,
        isGuestBooking: props.isGuestBooking  // Make sure this is passed
      }, props.isGuestBooking);

      if (props.onAddCar) {
        props.onAddCar();
      }

      setLicenseNumber("");
      setCarBrandId("");
      setCarModelId("");
      closeModal();
    } catch (error) {
      console.error('Error creating car:', error);
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { }}>
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
                  Auto hinzufügen
                </Dialog.Title>
                <div
                  className="flex items-center bg-blue-500 text-white text-xs p-4 my-2 rounded-md py-3"
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
                    Die Daten Ihres Autos benötigen wir um den Preis der
                    Dienstleistungen zu berechnen und Ihr Auto bspw. in einem
                    Parkhaus zu finden.
                  </p>
                </div>

                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <div className="dx-field px-3">
                      <Autocomplete
                        id="carbrand-autocomplete"
                        options={carBrands}
                        fullWidth
                        autoFocus={false}
                        autoHighlight={false}
                        // disabled={isLoading}
                        onChange={(e, v) => {
                          console.log('AddCarModal - Brand selected:', v); // Debug log
                          if (v?.id) {
                            setCarBrandId(v.id);
                            setCarModelId(''); // Reset model selection when brand changes
                          }
                        }}
                        getOptionLabel={(option) => option.name}
                        getOptionKey={(option) => option.id}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            {option.name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Marke wählen"
                            inputProps={{
                              ...params.inputProps,
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="dx-field px-3">
                      <Autocomplete
                        id="carmodel-autocomplete"
                        options={carModels}
                        fullWidth
                        autoFocus={false}
                        autoHighlight={false}
                        onChange={(e, v) => {
                          if (v?.id) {
                            setCarModelId(v?.id!);
                          }
                        }}
                        getOptionLabel={(option) => option.name}
                        getOptionKey={(option) => option.id}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            {option.name}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Modell wählen"
                            inputProps={{
                              ...params.inputProps,
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="dx-field px-3">
                      <TextField
                        id="outlined-basic"
                        label="Kennzeichen"
                        fullWidth
                        placeholder="Bspw. AAA-BB1234"
                        value={licenseNumber}
                        variant="outlined"
                        onChange={(e) => {
                          setLicenseNumber(e.target.value);
                        }}
                      />
                    </div>

                    <div className="px-3 w-full">
                      <button
                        type="submit"
                        onClick={handleAddCar}
                        disabled={!isValid || isSaving}
                        className="block w-full bg-sky-600 mt-4 py-2 rounded-2xl disabled:bg-gray-600  text-white font-semibold mb-2 hover:bg-sky-700"
                      >
                        Auto hinzufügen
                      </button>
                    </div>
                    <div className="px-3 w-full">
                      <button
                        type="submit"
                        onClick={closeModal}
                        className="block w-full bg-red-700 mt-4 py-2 rounded-2xl disabled:bg-gray-600  text-white font-semibold mb-2 hover:bg-red-800"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
