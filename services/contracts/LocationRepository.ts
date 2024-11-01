import { Location } from "@prisma/client";
import { Repository } from "./Repository";

export interface LocationModel {
  id: string;
  city: string;
  name: string;
  number: string;
  postalCode: number;
  street: string;
  disabled: boolean;
  disabledByDate?: boolean;
  disabledByHighBookings?: boolean;
  disabledByMaxBookings?: boolean;
  mondayStart?: Date | null;
  mondayEnd?: Date | null;
  tuesdayStart?: Date | null;
  tuesdayEnd?: Date | null;
  wednesdayStart?: Date | null;
  wednesdayEnd?: Date | null;
  thursdayStart?: Date | null;
  thursdayEnd?: Date | null;
  fridayStart?: Date | null;
  fridayEnd?: Date | null;
  saturdayStart?: Date | null;
  saturdayEnd?: Date | null;
  sundayStart?: Date | null;
  sundayEnd?: Date | null;
}

export interface LocationRepository extends Repository<Location> {
  getIncludeServices(locationId: string): Promise<Location | null>;

  insertServiceOnLocations(
    locationId: string,
    serviceId: string
  ): Promise<void>;

  removeServiceOnLocations(
    locationId: string,
    serviceId: string
  ): Promise<void>;

  getAllModels(): Promise<LocationModel[]>;
}
