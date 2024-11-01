import React from "react";

export default function FlexComponent() {
  return (
    <>
      <div className="flex flex-row items-center h-60 bg-gray-300 flex-wrap justify-between">
        <div className="bg-red-500 self-end">Item 1</div>
        <div className="bg-blue-500 self-start">Item 2</div>
        <div className="bg-yellow-500 justify-self-center">Item 3</div>
        <div className="bg-orange-500">Item 4</div>
        <div className="bg-sky-500">Item 5</div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="flex flex-col bg-orange-400 p-4 rounded-md">
          <h1 className="text-2xl">Title</h1>
          <p className="py-3">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam
            ea exercitationem provident, animi ut dolore impedit inventore
            maiores voluptas tempore ullam ipsum perferendis, earum harum,
            cupiditate quod voluptate! Sed, doloribus!
          </p>
          <strong>39,99 €</strong>
        </div>
        <div className="flex flex-col bg-orange-500 rounded-xl">
          <h1 className="text-2xl p-4 text-center underline">Title2</h1>
          <p className="px-4">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam
            ea exercitationem provident, animi ut dolore impedit inventore
            maiores voluptas tempore ullam ipsum perferendis, earum harum,
            cupiditate quod voluptate! Sed, doloribus!
          </p>
          <div className="flex flex-row justify-between bg-sky-600 mt-3 p-4 border-transparent rounded-xl">
            <strong>39,99 €</strong>
            <button className="bg-sky-200 rounded-xl p-1 shadow-xl border-sky-400 border-2 hover:bg-sky-800 hover:text-gray-200">
              Add to card
            </button>
          </div>
        </div>
        <div className="flex flex-col bg-orange-600 p-4">
          <h1 className="text-2xl">Title2</h1>
          <p className="py-3">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quibusdam
            ea exercitationem provident, animi ut dolore impedit inventore
            maiores voluptas tempore ullam ipsum perferendis, earum harum,
            cupiditate quod voluptate! Sed, doloribus!
          </p>
          <strong>39,99 €</strong>
        </div>
      </div>
    </>
  );
}
