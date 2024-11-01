import React from "react";

export default function LeftDivider() {
  return (
    <div className="relative overflow-hidden md:flex w-1/3 i justify-around items-center hidden">
      <div>
        <h1 className="text-blue-950 font-bold text-6xl font-sans">Carfully</h1>
        <h1 className="text-slate-500 font-bold text-4xl font-sans mt-4">
          Die <b className="">Nr. 1</b> wenn es
        </h1>{" "}
        <h1 className="text-slate-500 font-bold text-4xl font-sans mt-4">
          um dein <b className="">Auto</b> geht
        </h1>
      </div>
      <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-blue-950 border-t-10" />
      <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full  border-blue-800  border-opacity-60 border-t-8" />
      <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-blue-950 border-t-10" />
      <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-blue-800 border-opacity-60  border-t-8" />
    </div>
  );
}
