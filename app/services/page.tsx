"use client";
import ServiceCard from "@/components/service/ServiceCard";
import ServiceService from "@/services/ServiceService";
import { Service } from "@prisma/client";
import React, { useEffect, useState } from "react";
import SiteTitleComponent from "@/components/SiteTitleComponent";

export default function Services() {
  const serviceService = new ServiceService();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>();

  useEffect(() => {
    serviceService.getAll().then((data) => {
      setServices(data);
      setIsLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className="py-6 px-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6">
        <SiteTitleComponent text="Unsere" coloredText="Dienstleistungen" />
        <div className="flex max-[400px]:flex-col min-[400px] gap-y-3 mb-5 flex-wrap justify-center gap-x-4 mt-6">
          {isLoaded ? (
            services?.map((service) => {
              return (
                <ServiceCard
                  id={service.id}
                  name={service.name}
                  description={service.description}
                  showDemoPrice={service.price}
                  imageBase64={service.imageBase64}
                  key={service.id}
                />
              );
            })
          ) : (
            <>
              <div className="flex max-[400px]:flex-col flex-row flex-wrap justify-center w-full gap-x-4">
                {Array.apply(0, Array(3)).map(function (x, i) {
                  return (
                    <>
                      <div className="flex flex-col pt-10 mb-5 items-center max-w-sm bg-slate-200 animate-pulse border-gray-500 rounded-lg shadow w-[400px] h-[600px]">
                        Ladevorgang...
                      </div>
                    </>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
