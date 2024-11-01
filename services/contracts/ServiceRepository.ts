import { Service } from "@prisma/client";
import { Repository } from "./Repository";
import { ServiceUpdateImageProps } from "../ServiceService";

export interface ServiceRepository extends Repository<Service> {
  getServicesByLocation(
    locationId: string,
    carId: string
  ): Promise<Service[] | null>;

  getServicesByBooking(bookingId: string): Promise<Service[] | null>;

  updateImage(
    serviceUpdateImageProps: ServiceUpdateImageProps
  ): Promise<Service>;
}
