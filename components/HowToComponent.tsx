"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import { faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HowToComponent() {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const howToRef = useRef<HTMLDivElement | null>(null);

  const toggleMoreInfo = () => {
    setShowMoreInfo(!showMoreInfo);
    if (!showMoreInfo) {
      howToRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <div className="py-10 bg-blue-carfully">
        <div className="max-w-screen-xl mx-auto  text-center">
          <p className="text-2xl font-extrabold text-blue-400">
            Wasserlos? Ja, richtig!
          </p>
          <p className="text-5xl lg:text-6xl mt-4 font-extrabold text-gray-200">
            Glanz ohne Wasser und Kratzer!
          </p>
          <div className="flex flex-row justify-center text-xl mt-4 w-full font-thin text-gray-200 text-center">
            <p className="w-[720px]">
              Unsere Trockenwäsche hebt mit nur einem Sprühvorgang den Schmutz
              effektiv an und ermöglicht eine mühelose Reinigung ohne Kratzer.
              Das Ergebnis ist ein auf Hochglanz poliertes Auto, das aussieht
              wie neu.
            </p>
          </div>
        </div>
      </div>
      <div
        id="howToContainer"
        ref={howToRef}
        className="max-w-screen-xl mt-4 mx-auto flex flex-col min-h-80 md:flex-row flex-wrap"
      >
        <div className="grow shrink min-h-80 mt-4">
          <div className="flex flex-col justify-end items-center">
            <div className="w-96 relative z-0 min-h-72">
              <p className="text-[15rem] absolute top-[-80px] text-sky-500 font-black">
                1
              </p>
              <div className="absolute pt-10 pl-14 inset-0 flex z-10">
                <Image
                  src="/img/HowTo1.jpg"
                  width={250}
                  height={24}
                  alt="Logo"
                  className="absolute rounded-xl border-gray-300 border-8"
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="self-center text-3xl font-extrabold">AUFTRAGEN</p>
              <p className="self-center m-[-12px] text-gray-300 ml-20 text-3xl font-extrabold">
                AUFTRAGEN
              </p>
              {showMoreInfo && (
                <div className="p-4 max-w-96 self-center text-center">
                  <strong>Auftragen des Trockenshampoos</strong>
                  <p>
                    Zuerst wird unser spezielles Trockenshampoogleichmäßig auf
                    Dein Fahrzeug aufgetragen. Unsere Formel wurde entwickelt,
                    um effektiv zu wirken, indem sie sich an Schmutz und Staub
                    bindet, ohne dabeidie Fahrzeugoberfläche zu beschädigen.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grow shrink min-h-80  mt-4">
          <div className="flex flex-col justify-center items-center">
            <div className="w-96 relative z-0 min-h-72">
              <p className="text-[15rem] absolute top-[-80px] text-sky-500 font-black">
                2
              </p>
              <div className="absolute pt-10 pl-14 inset-0 flex z-10">
                <Image
                  src="/img/HowTo2.jpg"
                  width={250}
                  height={24}
                  alt="Logo"
                  className="absolute rounded-xl border-gray-300 border-8"
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="self-center text-3xl font-extrabold">ABWISCHEN</p>
              <p className="self-center m-[-12px] text-gray-300 ml-20 text-3xl font-extrabold">
                ABWISCHEN
              </p>
              {showMoreInfo && (
                <div className="p-4 max-w-96 self-center text-center">
                  <strong>Entfernen von Schmutz mit Mikrofasertuch</strong>
                  <p>
                    Nach einer kurzen Einwirkzeit desShampoos nutzen wir ein
                    hochwertiges Mikrofasertuch, um den Schmutz sanftvon der
                    Oberfläche zu lösen. Unser Shampoo wirkt wie ein
                    Staubmagnet, derSchmutzpartikel anzieht und festhält, was
                    eine gründliche und schonendeReinigung ermöglicht.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="grow shrink min-h-80  mt-4">
          <div className="flex flex-col justify-center items-center">
            <div className="w-96 relative z-0 min-h-72">
              <p className="text-[15rem] absolute top-[-80px]  text-sky-500 font-black">
                3
              </p>
              <div className="absolute pt-10 pl-14 inset-0 flex z-10">
                <Image
                  src="/img/HowTo3.jpg"
                  width={250}
                  height={24}
                  alt="Logo"
                  className="absolute rounded-xl border-gray-300 border-8"
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <p className="self-center text-3xl font-extrabold">POLIEREN</p>
              <p className="self-center m-[-12px] text-gray-300 ml-20 text-3xl font-extrabold">
                POLIEREN
              </p>
              {showMoreInfo && (
                <div className="p-4 max-w-96 self-center text-center">
                  <strong>Polieren für strahlenden Glanz</strong>
                  <p>
                    Abschließend wird die Oberfläche mit einemanderen, sauberen
                    Mikrofasertuch poliert. Dieser Schritt verleiht Deinem
                    Autonicht nur einen beeindruckenden Glanz, sondern sorgt
                    auch dafür, dass dieOberfläche ohne Kratzer oder Rückstände
                    sauber und glänzend bleibt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-xl mx-auto flex flex-row justify-center mt-8">
        <button
          className="bg-gradient-to-r flex flex-row justify-center p-3 mb-4 rounded-xl text-lg text-gray-100 font-black from-blue-400 to-blue-700"
          onClick={toggleMoreInfo}
        >
          {showMoreInfo ? (
            <FontAwesomeIcon icon={faSortUp} className="w-5 h-5 mt-2 mr-1" />
          ) : (
            <FontAwesomeIcon icon={faSortDown} className="w-5 h-5 mr-1" />
          )}
          {showMoreInfo ? "Details zuklappen" : "Erfahre mehr"}
        </button>
      </div>
    </>
  );
}
