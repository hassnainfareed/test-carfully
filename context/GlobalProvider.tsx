"use client";
import React, { createContext, useState } from "react";

interface Props {
  children: React.ReactNode;
}

interface GlobalData {
  locationId: string | null;
}

interface GlobalContextValues {
  globalData: GlobalData;
  setGlobalData: (globalData: GlobalData) => void;
  //   setGlobalData: React.Dispatch<React.SetStateAction<GlobalData>>;
}

export const GlobalContext = createContext<undefined | GlobalContextValues>(
  undefined
);

export default function GlobalProvider({ children }: Props) {
  const [globalData, setGlobalData] = useState<GlobalData>({
    locationId: null,
  });

  let localLocationId: string | null = "init";

  function handleGlobalData(globalDataValue: GlobalData) {
    const data: GlobalData = { locationId: globalDataValue.locationId };
    setGlobalData(data);
    localLocationId = globalDataValue.locationId;
  }

  return (
    <GlobalContext.Provider
      value={{ globalData, setGlobalData: handleGlobalData }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = React.useContext(GlobalContext);

  if (context === undefined) {
    throw new Error("globalContext is undefined");
  }

  return context;
}
