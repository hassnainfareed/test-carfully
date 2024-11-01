"use client";

import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, useState, useEffect } from "react";
import { BookingStatus, CarBrand, CarModel } from "@prisma/client";
import { TextArea } from "devextreme-react";
import { updateStatus } from "@/services/BookingService";

export const AddBookingComment = (props: {
  isOpen: boolean;
  bookingId: string;
  bookingStatus: BookingStatus;
  setIsOpen: Function;
}) => {
  const [comment, setComment] = useState<string>();
  const [isHandleButtonDisabled, setIsHandleButtonDisabled] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  function closeModal() {
    props.setIsOpen(false);
  }

  useEffect(() => {
    if (props.bookingStatus === BookingStatus.CANCELED) {
      if (comment) {
        setIsHandleButtonDisabled(comment.length <= 3);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment]);

  useEffect(() => {
    if (props.bookingStatus === BookingStatus.CANCELED) {
      if (comment) {
        setIsHandleButtonDisabled(comment.length <= 3);
      }
    } else {
      setIsHandleButtonDisabled(false);
    }
  }, []);

  async function handleAddComment() {
    setIsSaving(true);
    await updateStatus({
      bookingId: props.bookingId,
      bookingStatus: props.bookingStatus,
      remarkEmployee: comment!,
    });

    props.setIsOpen(false);
  }
  return (
    <Transition appear show={props.isOpen} as={Fragment}>
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
          <div className="fixed inset-0" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-300 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-800"
                >
                  Buchungsstatus ändern
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <div className="dx-field px-3">
                      <TextArea
                        mode="text"
                        label="Kommentar hinzufügen"
                        labelMode="floating"
                        valueChangeEvent="input"
                        // height={52}
                        value={comment}
                        onValueChanged={(e: any) => setComment(e.value)}
                        className="flex-1"
                      />
                    </div>

                    <div className="px-3 w-full">
                      <button
                        type="submit"
                        disabled={isHandleButtonDisabled || isSaving}
                        onClick={handleAddComment}
                        className="block w-full bg-sky-600 mt-4 py-2 rounded-2xl disabled:bg-gray-600  text-white font-semibold mb-2 hover:bg-sky-700"
                      >
                        Bestätigen
                      </button>
                    </div>
                    <div className="px-3 w-full">
                      <button
                        type="submit"
                        disabled={isSaving}
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
