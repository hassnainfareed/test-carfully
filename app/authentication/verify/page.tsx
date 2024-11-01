import LeftDivider from "@/components/LeftDivider";
import React from "react";

export default function Verify() {
  return (
    <div className="h-screen md:flex">
      <LeftDivider />
      <div className="flex md:w-2/3 p-4 justify-center py-10 items-center ">
        <section className="">
          <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
            <div className="max-w-screen mb-8 lg:mb-6">
              <h1 className="mb-4 text-4xl text-center tracking-tight font-extrabold text-sky-600">
                E-Mail verifizieren
              </h1>
              <h1 className="mb-4 text-2xl text-center tracking-tight text-gray-600">
                Wir haben eine E-Mail zur Verifizierung an die von Ihnen
                <br />
                angegebene Adresse zugeschickt.
              </h1>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
