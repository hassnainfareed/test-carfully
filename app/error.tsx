"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
        <div className="w-full xl:w-1/2 relative pb-12 lg:pb-0">
          <div className="">
            <div className="text-[130px] flex flex-row justify-center ">
              Fehler
            </div>
            <div className="">
              <div>
                <h1 className="my-2 flex flex-row justify-center font-bold text-2xl">
                  Da ist ein Fehler aufgetreten.
                </h1>
                <p className="my-2">
                  Bitte versuchen Sie es erneut. Ansonsten können Sie uns gerne
                  auch eine E-Mail an{" "}
                  <a className="text-sky-700" href="mailto:support@carfully.de">
                    support@carfully.de
                  </a>{" "}
                  senden.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
