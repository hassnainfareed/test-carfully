import React from "react";
import Image from "next/image";
import Checkbox from "@mui/material/Checkbox";

export interface ServiceCardProps {
  id: string;
  imageBase64: string | null;
  name: string;
  description: string;
  price?: number;
  selectService?: Function;
  showDemoPrice?: number;
}

export default function ServiceCard(props: ServiceCardProps) {
  return (
    <div
      key={props.id}
      className="flex flex-col w-80 bg-gray-100 border border-slate-300 rounded-lg shadow"
    >
      {props.imageBase64 && (
        <Image
          src={props.imageBase64}
          alt="photo"
          width={384}
          height={384}
          className="rounded-lg"
        />
      )}
      <div className="p-5 grow">
        <a href="#">
          <h5 className="mb-2 text-2xl font-extrabold tracking-tight">
            {props.name}
          </h5>
        </a>
        <p className="mb-3 font-normal">{props.description}</p>
      </div>
      {props.showDemoPrice ? (
        <>
          <label className="relative flex flex-row justify-end align-middle cursor-pointer mx-4 my-4">
            <span className="ml-3 text-md font-semibold">
              ab {props.showDemoPrice.toFixed(2)} €
            </span>
          </label>
          <a
            href="/booking"
            className="rounded-xl bg-sky-600 hover:bg-sky-700 text-xl text-center font-normal text-gray-200 mb-2 mx-2"
          >
            Buchen
          </a>
        </>
      ) : (
        <label className="relative inline-flex items-center cursor-pointer mx-4 my-4">
          {/* <CheckBox
            onValueChanged={(e) => {
              props.selectService && props.selectService(e, props.id);
            }}
          /> */}
          <Checkbox
            // onChange={(e) => setCheckTerms(e.target.checked)}
            onChange={(e) => {
              props.selectService &&
                props.selectService(e.target.checked, props.id);
            }}
          />
          <span className="ml-3 text-md font-semibold">
            {props.price!.toFixed(2)} €
          </span>
        </label>
      )}
    </div>
  );
}
