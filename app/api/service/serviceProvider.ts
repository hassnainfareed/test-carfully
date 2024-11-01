import prisma from "@/db";

export const getServicesByLocationIdAndCarId = async (
  locationId: string,
  carId: string
) => {
  const servicesOnLocations = await prisma.servicesOnLocations.findMany({
    where: {
      locationId: locationId!,
    },
  });

  const services = await prisma.service.findMany({
    where: {
      id: { in: servicesOnLocations.map((x) => x.serviceId) },
    },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      imageBase64: true,
      averageHandlingTime: true,
      image: true,
      createdAt: true,
      updatedAt: true,
      ServicesOnPriceCategory: {
        select: {
          serviceId: true,
          priceCategoryId: true,
          price: true,
        },
      },
    },
  });

  const car = await prisma.car.findFirst({
    where: {
      id: carId,
    },
    include: {
      CarModel: true,
    },
  });

  const priceCategoryId = car?.CarModel.priceCategoryId;

  services.forEach((element) => {
    const category = element.ServicesOnPriceCategory.find(
      (x) => x.priceCategoryId === priceCategoryId
    );

    if (category) {
      element.price = category?.price!;
    }
  });

  return services;
};
