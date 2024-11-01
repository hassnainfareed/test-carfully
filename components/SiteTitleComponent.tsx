import React from "react";

export interface SiteTitleProps {
  text: string;
  coloredText?: string;
}

export default function SiteTitleComponent({
  text,
  coloredText,
}: SiteTitleProps) {
  return (
    <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
      <h1 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
        {text}{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-sky-600 ">
          {coloredText}
        </span>
      </h1>
    </div>
  );
}
