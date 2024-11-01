import { Address } from "@prisma/client";
import BaseService from "./BaseService";
import { AddressRepository } from "./contracts/AddressRepository";

export default class AddressService
  extends BaseService<Address>
  implements AddressRepository
{
  constructor() {
    super("/api/user/address/");
  }
}
