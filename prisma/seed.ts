import { PrismaClient, PriceCategory } from "@prisma/client";
import { carModels } from "./data/carModels";

const prisma = new PrismaClient();

// COMMAND: npx prisma db seed

async function main() {
  await prisma.servicesOnBookings.deleteMany({});
  await prisma.servicesOnLocations.deleteMany({});
  await prisma.servicesOnPriceCategory.deleteMany({});

  await prisma.invoice.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.car.deleteMany({});
  await prisma.carModel.deleteMany({});
  await prisma.priceCategory.deleteMany({});
  await prisma.carBrand.deleteMany({});

  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.priceCategory.deleteMany({});

  const admin1 = await prisma.user.create({
    data: {
      id: "a58cd915-bae4-4cdd-b2e6-dae9d36868cc",
      email: "admin@test.de",
      password: "$2b$10$CWHrX4mg2vd8vCoLhPc2P.HqqyQlGg8t/F6OrMwXtuw98OYrxUMLS",
      role: "admin",
      emailVerified: "2023-11-12T18:37:12.248Z",
    },
  });

  const empl1 = await prisma.user.create({
    data: {
      id: "b12cd915-bae4-4cdd-b2e6-dae9d36868cc",
      email: "empl1@test.de",
      password: "$2b$10$CWHrX4mg2vd8vCoLhPc2P.HqqyQlGg8t/F6OrMwXtuw98OYrxUMLS",
      role: "employee",
      emailVerified: "2023-11-12T18:37:12.248Z",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      id: "c13cd915-bae4-4cdd-b2e6-dae9d36868cc",
      email: "user1@test.de",
      password: "$2b$10$CWHrX4mg2vd8vCoLhPc2P.HqqyQlGg8t/F6OrMwXtuw98OYrxUMLS",
      role: "user",
      emailVerified: "2023-11-12T18:37:12.248Z",
    },
  });

  const ibrahimson = await prisma.user.create({
    data: {
      id: "04307d75-1add-4c0b-9107-2db207f37c28",
      email: "ibrahim.son@gmx.de",
      password: "$2b$10$CWHrX4mg2vd8vCoLhPc2P.HqqyQlGg8t/F6OrMwXtuw98OYrxUMLS",
      role: "admin",
      emailVerified: "2023-11-12T18:37:12.248Z",
    },
  });

  const location1 = await prisma.location.create({
    data: {
      id: "b0c16e72-a440-4c83-9682-0f74d57fa14d",
      name: "Bodasi Park GmbH Crown",
      street: "Berliner Allee",
      number: "52",
      postalCode: 40212,
      city: "Düsseldorf",
      highBookings: 10,
      maxBookings: 30,
    },
  });

  // const location2 = await prisma.location.create({
  //   data: {
  //     id: "b1d16e72-a440-4c83-9682-0f74d57fa14d",
  //     name: "Parkhaus Am Gürzenich APCOA",
  //     street: "Quatermarkt",
  //     number: "5",
  //     postalCode: 50667,
  //     city: "Köln",
  //     highBookings: 1,
  //     maxBookings: 3,
  //   },
  // });

  // const location3 = await prisma.location.create({
  //   data: {
  //     id: "b2e16e72-a440-4c83-9682-0f74d57fa14d",
  //     name: "Parkhaus Medical Center",
  //     street: "Viersener Str.",
  //     number: "",
  //     postalCode: 41061,
  //     city: "Mönchengladbach",
  //     highBookings: 1,
  //     maxBookings: 3,
  //   },
  // });

  const service1 = await prisma.service.create({
    data: {
      id: "bed3d71f-1a10-43da-86d1-9e010dbea99b",
      name: "Premium-Aussenreinigung",
      description:
        "Unsere Trockenwäsche bietet zahlreiche Vorteile für Ihr Fahrzeug. Sie spart nicht nur Wasser, sondern schont auch die Lackoberfläche und trägt zur Erhaltung des Glanzes bei. Zudem hinterlässt sie keine Wasserflecken und ist umweltfreundlich.",
      price: 39.99,
      averageHandlingTime: 30,
    },
  });

  const service2 = await prisma.service.create({
    data: {
      id: "250ea408-5e1d-4f86-b592-756112e65fa0",
      name: "Premium-Innenreinigung",
      description:
        "Verleihen Sie Ihrem Auto exklusiven Glanz mit unserer Premium-Innenreinigung. Hochwertige Pflege für jedes Detail, von der Polsterreinigung bis zur Lederaufbereitung – lassen Sie Ihr Fahrzeug in neuem Glanz erstrahlen.",
      price: 47.99,
      averageHandlingTime: 45,
    },
  });

  const service3 = await prisma.service.create({
    data: {
      id: "76b94b05-4536-4c7f-9d42-5dc749133179",
      name: "Paket Aussen- und Innenreinigung",
      description: "Unsere Innen und Aussenreinigung im Paket",
      price: 89.99,
      averageHandlingTime: 75,
    },
  });

  const serviceOnLocation1 = await prisma.servicesOnLocations.createMany({
    data: [
      {
        locationId: location1.id,
        serviceId: service1.id,
      },
      {
        locationId: location1.id,
        serviceId: service2.id,
      },
      {
        locationId: location1.id,
        serviceId: service3.id,
      },
    ],
  });

  // const serviceOnLocation2 = await prisma.servicesOnLocations.createMany({
  //   data: [
  //     {
  //       locationId: location2.id,
  //       serviceId: service1.id,
  //     },
  //     {
  //       locationId: location2.id,
  //       serviceId: service2.id,
  //     },
  //     {
  //       locationId: location2.id,
  //       serviceId: service3.id,
  //     },
  //   ],
  // });

  // const serviceOnLocation3 = await prisma.servicesOnLocations.createMany({
  //   data: [
  //     {
  //       locationId: location3.id,
  //       serviceId: service1.id,
  //     },
  //     {
  //       locationId: location3.id,
  //       serviceId: service2.id,
  //     },
  //     {
  //       locationId: location3.id,
  //       serviceId: service3.id,
  //     },
  //   ],
  // });

  const priceCategoryS = {
    id: "17ac844b-cf23-42a8-9e98-fe6b9d149d4d",
    name: "S",
  };

  await prisma.priceCategory.create({
    data: {
      id: priceCategoryS.id,
      name: priceCategoryS.name,
    },
  });

  const priceCategoryM = {
    id: "b45bb9a4-5e1f-465f-a238-aa9ab764e5ff",
    name: "M",
  };

  await prisma.priceCategory.create({
    data: {
      id: priceCategoryM.id,
      name: priceCategoryM.name,
    },
  });

  const priceCategoryL = {
    id: "8ce4f844-b460-489f-9abe-105823ef6d90",
    name: "L",
  };

  await prisma.priceCategory.create({
    data: {
      id: priceCategoryL.id,
      name: priceCategoryL.name,
    },
  });

  const priceCategoryXL = {
    id: "e364888e-c3e1-456b-8ca8-02831b72a625",
    name: "XL",
  };

  await prisma.priceCategory.create({
    data: {
      id: priceCategoryXL.id,
      name: priceCategoryXL.name,
    },
  });

  const priceCategoryXXL = {
    id: "04e4570b-ab25-4f09-a14f-f5d712ddd039",
    name: "XXL",
  };

  await prisma.priceCategory.create({
    data: {
      id: priceCategoryXXL.id,
      name: priceCategoryXXL.name,
    },
  });

  const priceCategorySonder = {
    id: "3e8bedbb-8202-4501-a539-908f26ac190f",
    name: "Sonder",
  };

  await prisma.priceCategory.create({
    data: {
      id: priceCategorySonder.id,
      name: priceCategorySonder.name,
    },
  });

  await prisma.servicesOnPriceCategory.createMany({
    data: [
      {
        serviceId: service1.id,
        priceCategoryId: priceCategoryS.id,
        price: 19.99,
      },
      {
        serviceId: service1.id,
        priceCategoryId: priceCategoryM.id,
        price: 29.99,
      },
      {
        serviceId: service1.id,
        priceCategoryId: priceCategoryL.id,
        price: 33.99,
      },
      {
        serviceId: service1.id,
        priceCategoryId: priceCategoryXL.id,
        price: 37.99,
      },
      {
        serviceId: service1.id,
        priceCategoryId: priceCategoryXXL.id,
        price: 39.99,
      },
      {
        serviceId: service1.id,
        priceCategoryId: priceCategorySonder.id,
        price: 39.99,
      },
    ],
  });

  await prisma.servicesOnPriceCategory.createMany({
    data: [
      {
        serviceId: service2.id,
        priceCategoryId: priceCategoryS.id,
        price: 25.99,
      },
      {
        serviceId: service2.id,
        priceCategoryId: priceCategoryM.id,
        price: 33.99,
      },
      {
        serviceId: service2.id,
        priceCategoryId: priceCategoryL.id,
        price: 37.99,
      },
      {
        serviceId: service2.id,
        priceCategoryId: priceCategoryXL.id,
        price: 43.99,
      },
      {
        serviceId: service2.id,
        priceCategoryId: priceCategoryXXL.id,
        price: 47.99,
      },
      {
        serviceId: service2.id,
        priceCategoryId: priceCategorySonder.id,
        price: 47.99,
      },
    ],
  });

  await prisma.servicesOnPriceCategory.createMany({
    data: [
      {
        serviceId: service3.id,
        priceCategoryId: priceCategoryS.id,
        price: 43.99,
      },
      {
        serviceId: service3.id,
        priceCategoryId: priceCategoryM.id,
        price: 61.99,
      },
      {
        serviceId: service3.id,
        priceCategoryId: priceCategoryL.id,
        price: 69.99,
      },
      {
        serviceId: service3.id,
        priceCategoryId: priceCategoryXL.id,
        price: 79.99,
      },
      {
        serviceId: service3.id,
        priceCategoryId: priceCategoryXXL.id,
        price: 89.99,
      },
      {
        serviceId: service3.id,
        priceCategoryId: priceCategorySonder.id,
        price: 89.99,
      },
    ],
  });

  await prisma.carBrand.createMany({
    data: [
      { id: "5049b096-0d47-4247-b1bd-2723a25ce895", name: "Alfa-Romeo" },
      { id: "220f93af-324a-48b3-bce7-0dca97daa574", name: "Alpine" },
      { id: "2c52f08f-21aa-43a8-b122-8aafb8296e05", name: "Aston-Martin" },
      { id: "b97e3ade-afb7-4bdf-b2de-fa2d20cfc8a4", name: "Audi" },
      { id: "65df317a-16fd-4980-a348-66e42bee7e29", name: "Bentley" },
      { id: "47cdd70e-bf72-4f4f-b366-5cc7dbbf77e8", name: "BMW" },
      { id: "f69b5e73-ce0d-4e22-b642-4e9693ab363e", name: "Chevrolet" },
      { id: "1058d117-c98b-41d9-8777-eecad7ee1ec7", name: "Citroen" },
      { id: "d14c6db4-162b-4a82-93aa-26649d05caed", name: "CUPRA" },
      { id: "0f4f0d12-a6e0-4935-a91f-092bebac861f", name: "Dacia" },
      { id: "dc10ec0f-7e70-405e-86a6-ee783eb6e98a", name: "DS" },
      { id: "07d4f3e3-5ba2-4a27-b654-529286107ab1", name: "Ferrari" },
      { id: "60d838d5-b9df-4f41-a601-7f8e8a48cf49", name: "Fiat" },
      { id: "722af2dd-497f-4562-90ba-3212bb8bea36", name: "Ford" },
      { id: "cd6cd861-986d-4fac-8c24-fc43a8bb55f2", name: "Honda" },
      { id: "cfa18d09-3ffa-4182-b4cb-8a43ff248d4e", name: "Hyundai" },
      { id: "676325e9-33b2-49dd-9401-7c6c90673a75", name: "Isuzu" },
      { id: "045c5fab-c974-4b9d-8b11-6e6b1e0a3259", name: "Jaguar" },
      { id: "08a9d78b-6329-4059-b478-5e36e621653a", name: "Jeep" },
      { id: "dcddcfbd-4250-4bd4-9d33-7544f4be0036", name: "Kia" },
      { id: "0eb06700-7e07-4731-871a-0d98596240c1", name: "Lamborghini" },
      { id: "1a723dc3-d6ca-47f7-aacc-80418e61b142", name: "Lancia" },
      { id: "22016804-04b4-4f58-847e-bbe599ac0187", name: "Land-Rover" },
      { id: "582e421c-5133-4b72-aae7-994eb315b130", name: "Lexus" },
      { id: "b3071c4b-0c6b-4c39-a9b9-a6f15d178e44", name: "LynkCo" },
      { id: "e604355a-a8d4-4943-b19a-5b3fb27df480", name: "Maserati" },
      { id: "1b5b3510-59b3-41af-b2ca-69bd50e56639", name: "Mazda" },
      { id: "af0c284f-dc1d-4b7f-9143-d93907f8c088", name: "McLaren" },
      { id: "defa47cd-cd3f-4460-a5e9-b1d9ee464889", name: "Mercedes-Benz" },
      { id: "991fd0f6-1dc0-4fad-bb4a-2eb76ee9abc4", name: "MG" },
      { id: "d5813f0e-e3d5-48b5-a29e-7e3933c422bf", name: "MINI" },
      { id: "a4623395-1144-4469-9cfa-edff7e316092", name: "Mitsubishi" },
      { id: "5882c83b-cc3b-4ded-8962-6d90a07b7b99", name: "Mobilize" },
      { id: "1af9d3d7-9353-4e15-ab57-c947f6764b82", name: "Nissan" },
      { id: "2198f6a0-ad88-4c84-9fa3-a97c789da9d4", name: "Opel" },
      { id: "e609e1c6-b4ee-4dc8-aca8-b1d03cddc2ea", name: "Peugeot" },
      { id: "b1bc1acc-456a-4ed7-beea-73ce3c788776", name: "Polestar" },
      { id: "b4b9b4c3-4f1c-4f84-8e8c-46ba64de3cbe", name: "Porsche" },
      { id: "e8c7ca23-cacb-45f6-bdc2-7b0fcc901f8c", name: "Renault" },
      { id: "2287e96f-e43d-4e34-a460-57098c7f42aa", name: "Rolls-Royce" },
      { id: "a9817eec-5ff3-49c0-8f36-2cd7862716f4", name: "Seat" },
      { id: "a4a86ae5-cfdc-409d-a397-6e7e6ae2dae7", name: "Skoda" },
      { id: "2f2194ba-5888-48ff-9058-202f2c47e36f", name: "Smart" },
      { id: "afd52065-39eb-4bc8-92ea-9916579c0e0e", name: "SsangYong" },
      { id: "9964447a-28db-4b15-b4d9-bb0e2b0d0383", name: "Subaru" },
      { id: "80e38afa-275f-4d2e-9ccf-662873936f95", name: "Suzuki" },
      { id: "b5ccc64c-b3f4-4747-91c7-f5403be41610", name: "Tesla" },
      { id: "f8cc45e2-b3d4-4ce1-9504-a64dc3cbcce2", name: "Toyota" },
      { id: "4cc6017a-5b60-44c6-a24b-f86367d72b30", name: "Volkswagen" },
      { id: "4522ce64-fb50-4567-b9bd-f486e55db7ac", name: "Volvo" },
    ],
  });

  carModels.forEach(async (element) => {
    const carBrand = await prisma.carBrand.findFirst({
      where: {
        name: element.brand,
      },
    });

    await prisma.carModel.create({
      data: {
        name: element.model,
        length: element.length,
        priceCategoryId: element.priceCategoryId,
        carBrandId: carBrand?.id!,
      },
    });
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    // process.exit(1);
  });
