import React from "react";
import PricingItemComponent from "./PricingItemComponent";

export default function PricingComponent() {
  return (
    <div
      id="pricingContainer"
      className="max-w-screen-xl mx-auto flex flex-row flex-wrap justify-center gap-3 my-4"
    >
      <PricingItemComponent
        title="Außenwäsche"
        description="Klein- und Mittelklasse Fahrzeug"
        duration="30 min"
        price="24,99"
        servicesIn={["Handwäsche", "Polieren", "Versiegeln"]}
        servicesOut={["Innenreinigung"]}
      />
      <PricingItemComponent
        title="Außenwäsche"
        description="Großklasse Fahrzeug SUV"
        duration="30 min"
        price="32,99"
        servicesIn={["Handwäsche", "Polieren", "Versiegeln"]}
        servicesOut={["Innenreinigung"]}
      />
      <PricingItemComponent
        title="Mit Innenreinigung"
        description="Klein- und Mittelklasse Fahrzeug"
        duration="45 min"
        price="39,98"
        formerPrice="49,98"
        servicesIn={["Handwäsche", "Polieren", "Versiegeln", "Innenreinigung"]}
      />
      <PricingItemComponent
        title="Mit Innenreinigung"
        description="Großklasse Fahrzeug SUV"
        duration="45 min"
        price="47,98"
        formerPrice="57,98"
        servicesIn={["Handwäsche", "Polieren", "Versiegeln", "Innenreinigung"]}
      />
    </div>
  );
}
