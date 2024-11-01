import { Address } from "@prisma/client";
import { Repository } from "./Repository";

export interface AddressRepository extends Repository<Address> {}
