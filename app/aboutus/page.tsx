"use client";
import React from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import styles from "@/app/styles/custom.module.css";
import SiteTitleComponent from "@/components/SiteTitleComponent";

export default function AboutUs() {
  const {
    ref: refCarImage,
    inView: inViewCarImage,
    entry,
  } = useInView({ triggerOnce: false, initialInView: false });
  return (
    <>
      <section>
        <div className="py-6 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6 bg-left-top bg-no-repeat max-h-full">
          <SiteTitleComponent text="Über Uns - " coloredText="Carfully" />
          <section className="bg-slate-10">
            <div className="flex flex-col max-w-screen-xl mx-auto">
              <div className=" mr-auto w-full flex-1">
                <div className="px-4 py-8 flex flex-col">
                  <p className="mb-6 font-light text-gray-700 lg:mb-8 text-xl">
                    Willkommen bei CARFULLY - Deinem ganzheitlichen
                    Autopflegepartner, der jedes Fahrzeug behandelt, als wäre es
                    unser eigenes. Wir verstehen, dass Dein Auto mehr als nur
                    ein Transportmittel ist; es ist ein Teil Deines Lebens, ein
                    treuer Begleiter auf all Deinen Wegen. Deshalb setzen wir
                    bei CARFULLY auf persönliche Betreuung und maßgeschneiderte
                    Services.
                    <br />
                    Unser Versprechen ist es, Dir nicht nur eine Dienstleistung
                    zu bieten, sondern eine Partnerschaft, bei der Du dich
                    rundum betreut fühlst. Von der professionellen Trockenwäsche
                    auf Parkhäusern, die nicht nur brillant Glanz verspricht,
                    sondern auch wertvolle Ressourcen schont, bis hin zu
                    akribischen Innenreinigung, die jeden Winkel Ihres
                    Fahrzeuginnenraums verjüngt - wir sind für Dich da.
                    <br />
                    Doch bei CARFULLY hört der Service nicht beim Pflegen auf.
                    Wir bieten Dir auch Unterstützung beim Autoankauf. Mit uns
                    hast Du nur einen Ansprechpartner für alle Anliegen rund um
                    Dein Fahrzeug - das spart Dir Zeit und Mühe. Unsere Hingabe
                    zum Detail, unser Engagement für Nachhaltigkeit und unser
                    umfassendes Leistungsangebot machen uns zum verlässlichen
                    Partner für alle, die Wert auf Qualität und Komfort legen.
                    Wähle CARFULLY, wo Dein Auto nicht nur eine Nummer ist,
                    sondern Teil der Familie.
                  </p>
                </div>
              </div>
              <div className="flex py-4 flex-1 ">
                <Image
                  ref={refCarImage}
                  src="/img/aboutUs.png"
                  alt="Auto"
                  className={`object-contain ${
                    inViewCarImage ? styles.animateServiceCar : ""
                  }`}
                  width={1280}
                  height={239}
                />
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
