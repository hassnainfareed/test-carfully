import React from "react";
import Image from "next/image";

export const Footer = () => {
  const today = new Date();

  return (
    <footer className="bg-blue-carfully text-gray-200 sticky top-[100vh]">
      <div className="flex flex-row gap-x-6 justify-between max-w-screen-xl mx-auto p-10 max-md:flex-wrap">
        <nav className="flex flex-col mb-8">
          <Image
            src="/img/CarfullyLogo.png"
            width={178}
            height={24}
            alt="Logo"
          />

          <p className="mt-2 text-md text-gray-300">
            WEIL DEIN AUTO DAS BESTE VERDIENT!
          </p>
        </nav>
        <nav className="flex flex-col gap-y-2 w-60 mb-6">
          <header className="text-sky-500 font-extrabold">Carfully</header>

          <a className="link link-hover" href="/aboutus">
            Über Uns
          </a>
          <a className="link link-hover" href="/jobs">
            Jobs
          </a>
        </nav>
        <nav className="flex flex-col gap-y-2 w-60 mb-6">
          <header className="text-sky-500 font-extrabold">Links</header>
          <a className="link link-hover" href="/impressum">
            Impressum
          </a>
          <a className="link link-hover" href="/datenschutz">
            Datenschutzrichtlinien
          </a>
          <a className="link link-hover" href="/agb">
            AGB
          </a>
        </nav>
        <nav className="flex flex-col gap-y-2 w-60 mb-6">
          <header className="text-sky-500 font-extrabold">Kontakt</header>
          <a
            href="mailto:kontakt@carfully.de"
            className="text-gray-200 cursor-pointer hover:text-gray-300"
          >
            kontakt@carfully.de
          </a>
          <a
            href="tel:+49211453276"
            className="text-gray-200 cursor-pointer hover:text-gray-300"
          >
            +49 211 453276
          </a>
        </nav>
      </div>
    </footer>
  );
};
