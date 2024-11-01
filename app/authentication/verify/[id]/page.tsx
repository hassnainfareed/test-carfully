"use client";

import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightToBracket,
  faCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { verifyEmailAddress } from "@/services/AuthenticationService";

export default function VerifyEmail({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isUserVerified, setIsUserVerified] = useState(false);

  useEffect(() => {
    if (isLoading) {
      verifyEmailAddress(params.id).then((data) => {
        setIsUserVerified(data);
        setIsLoading(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="mx-auto max-w-7xl p-4">
          <div className="shadow rounded-md p-4 grow">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-6 py-1">
                <div className="grid h-12 grid-cols-6 gap-4">
                  <div className="bg-slate-700 rounded col-span-5" />
                  <div className="bg-slate-700 rounded col-span-1" />
                </div>
                <div className="h-12 bg-slate-700 rounded" />
                <div className="h-12 bg-slate-700 rounded" />
              </div>
            </div>
          </div>
        </div>
      ) : !isUserVerified ? (
        <div className="mx-auto max-w-7xl p-8">
          <div className="flex flex-col text-gray-400">
            <div className="text-2xl sm:text-4xl  text-red-600 mb-4">
              <FontAwesomeIcon
                icon={faTriangleExclamation}
                className="w-10 h-10 mr-4"
              />
              Fehler bei der Verifikation
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl p-8">
          <div className="flex flex-col text-gray-400">
            <div className="text-2xl sm:text-4xl  text-sky-600 mb-4">
              <FontAwesomeIcon icon={faCheck} className="w-10 h-10 mr-4" />
              E-Mail Verifikation erfolgreich
            </div>

            <div className="text-lg text-gray-200 mb-12">
              <div className="flex flex-row justify-center gap-x-2">
                <div className="flex-row w-36 inline-flex justify-center rounded-xl bg-sky-600  hover:bg-sky-700 px-4 py-2 text-[16px] font-medium text-gray-200">
                  <a href="/authentication/login" className="flex flex-row">
                    <FontAwesomeIcon
                      icon={faArrowRightToBracket}
                      className="w-5 h-5 mr-2 mt-1"
                    />
                    Anmelden
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
