import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export interface PricingItemProps {
  title: string;
  description: string;
  duration: string;
  servicesIn: Array<string>;
  servicesOut?: Array<string>;
  formerPrice?: string;
  price: string;
}

export default function PricingItemComponent(props: PricingItemProps) {
  const mainStyle = props.formerPrice
    ? "bg-gradient-to-r from-sky-100 to-sky-200"
    : " bg-white";

  return (
    <div
      className={`${mainStyle} w-72 p-4 border border-gray-200 rounded-lg flex flex-col shadow sm:p-8`}
    >
      <p className="mb-4 text-2xl font-black text-gray-500 ">{props.title}</p>
      <div className="flex flex-row grow">
        <FontAwesomeIcon
          icon={faCarSide}
          className="w-6 h-6 mr-2 text-gray-500"
        />
        <p className="mb-4 text-md font-black text-gray-500 ">
          {props.description}
        </p>
      </div>
      <div className="flex flex-row justify-between">
        <strong>Services</strong>
        <div className="flex flex-row">
          <FontAwesomeIcon icon={faClock} className="w-6 h-6 mr-2" />
          <p>{props.duration}</p>
        </div>
      </div>
      <ul
        role="list"
        className="space-y-5 my-4 border-t-[1px] border-gray-400 pt-4"
      >
        {props.servicesIn.map((service) => (
          <li key={service} className="flex items-center">
            <svg
              className="flex-shrink-0 w-4 h-4 text-blue-600"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <span className="text-base font-normal leading-tight text-gray-500 ms-3">
              {service}
            </span>
          </li>
        ))}

        {props.servicesOut &&
          props.servicesOut.map((service) => (
            <li key={service} className="flex line-through decoration-gray-500">
              <svg
                className="flex-shrink-0 w-4 h-4 text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              <span className="text-base font-normal leading-tight text-gray-500 ms-3">
                {service}
              </span>
            </li>
          ))}
      </ul>
      <div className="flex items-baseline my-8 text-gray-900">
        <span className="text-3xl font-semibold mr-2">€</span>
        <span className="text-4xl font-extrabold tracking-tight">
          {props.price}
        </span>
        {props.formerPrice && (
          <span className="text-xl font-extrabold line-through line-throug decoration-red-500 tracking-tight grow text-right">
            € {props.formerPrice}
          </span>
        )}
      </div>
      <a
        href="/booking"
        className="bg-gradient-to-br text-center from-orange-700 to-orange-300 hover:from-orange-800 hover:to-orange-400 w-full px-2 py-3 font-bold text-xl rounded-xl text-gray-100 drop-shadow-lg"
      >
        <p className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">Jetzt Buchen</p>
      </a>
    </div>
  );
}
