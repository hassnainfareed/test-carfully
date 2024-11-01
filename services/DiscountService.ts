import { Discount } from "@prisma/client";
import BaseService from "./BaseService";
import { DiscountRepository } from "./contracts/DiscountRepository";
import axios from "axios";

export default class DiscountService
  extends BaseService<Discount>
  implements DiscountRepository
{
  constructor() {
    super("/api/discount/");
  }
  async checkCode(code: string): Promise<Discount | null> {
    var res = await axios.post(`${this.urlPath}check`, {
      code: code,
    });

    return res.data as Discount;
  }
}
