import React from "react";

export default function LegalInformation() {
  return (
    <section className="bg-white max-w-screen-xl mx-auto">
      <div className="p-6">
        <h1 className="text-xl mb-4 font-bold">Impressum</h1>
        <h1 className="text-md mb-4 font-bold">Carfully GmbH</h1>
        <p>Duesselweg 10 </p>
        <p className="mb-2">40670 Meerbusch</p>
        <p>
          E-Mail <a href="mailto:kontakt@carfully.de">kontakt@carfully.de</a>
        </p>
        <p className="mb-2">Telefon: 0176 61559387</p>
        <p className="mb-2">
          Vertretungsberechtigte Geschäftsführer: Furkan Celenk, Zohair Barkani
        </p>
        <p>Registergericht: Amtsgericht Neuss </p>
        <p>Registernummer: HRB 22479 </p>
        <p className="mb-2">Umsatzsteuer-ID-Nr.: DE358465827</p>
        <p>Inhaltlich Verantwortlicher:</p>
        <p className="mb-2">Furkan Celenk, Zohair Barkani</p>
        <p>Online Streitbeilegung der EU gemäß Art. 14 Abs. 1 ODR-VO:</p>
        <p className="mb-2">
          Die EU-Website zur Online Streitbeilegung verbraucherrechtlicher
          Streitigkeiten finden Sie unter folgendem Link{" "}
          <a href="https://ec.europa.eu/consumers/odr/">
            https://ec.europa.eu/consumers/odr/
          </a>
        </p>
        <p>Information nach dem Verbraucherstreitbeilegungsgesetz:</p>
        <p className="mb-2">
          Es besteht keine Verpflichtung und keine Bereitschaft zur Teilnahme an
          einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle.
        </p>
      </div>
    </section>
  );
}
