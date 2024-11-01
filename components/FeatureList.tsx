import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTags,
  faHandsHolding,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";

export const FeatureList = () => {
  return (
    <section className="">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
        <div className="max-w-screen mb-8 lg:mb-6">
          <h2 className="mb-4 text-4xl text-center tracking-tight font-extrabold text-blue-950">
            Warum Carfully
          </h2>
          {/* <p className="text-gray-500 sm:text-xl dark:text-gray-400">
            Here at Flowbite we focus on markets where technology, innovation,
            and capital can unlock long-term value and drive economic growth.
          </p> */}
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          <div>
            <div className="flex justify-center items-center mb-4 rounded-full bg-primary-900 ">
              <FontAwesomeIcon icon={faTags} className="w-12 h-12" />
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">
              Best-Preis-Garantie
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Unsere Produkte bieten Ihnen ein unschlagbares
              Preis-Leistungs-Verhältnis. Qualität und Erschwinglichkeit
              vereint, um Ihre Bedürfnisse zu erfüllen. Überzeugen Sie sich
              selbst von unserer unschlagbaren Kombination.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 rounded-full bg-primary-900 ">
              <FontAwesomeIcon icon={faHandsHolding} className="w-12 h-12" />
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">
              Alles aus einer Hand
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Unsere umfassende Auto-Serviceplattform bietet alles, was Sie
              brauchen, von Reparaturen bis zur Autowäsche. Verlassen Sie sich
              auf uns für kompletten Alles aus einer Hand Service rund um Ihr
              Auto.
            </p>
          </div>
          <div>
            <div className="flex justify-center items-center mb-4 rounded-full bg-primary-900 ">
              <FontAwesomeIcon icon={faShieldHalved} className="w-12 h-12" />
            </div>
            <h3 className="mb-2 text-xl font-bold dark:text-white">
              Sichere Bezahlung
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Unser Online-Bezahlsystem gewährleistet eine sichere Transaktion.
              Ihre Daten sind geschützt, und wir garantieren einen
              reibungslosen, zuverlässigen Bezahlprozess. Vertrauen Sie uns für
              eine sichere und bequeme Zahlungserfahrung.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
