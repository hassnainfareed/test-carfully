import { PriceCategory, ServicesOnPriceCategory } from "@prisma/client";
import BaseService from "./BaseService";
import { ServiceRepository } from "./contracts/ServiceRepository";
import axios from "axios";
import { PriceCategoryRepository } from "./contracts/PriceCategoryRepository";

export default class PriceCategoryService
  extends BaseService<PriceCategory>
  implements PriceCategoryRepository
{
  constructor() {
    super("/api/priceCategory/");
  }

  async getPriceCategoriesByServiceId(
    serviceId: string
  ): Promise<ServicesOnPriceCategory[]> {
    var res = await axios.get(
      `${this.urlPath}byServiceId?serviceId=${serviceId}`
    );
    return res.data as ServicesOnPriceCategory[];
  }

  async createPriceCategoryForService(
    servicesOnPriceCategory: ServicesOnPriceCategory
  ): Promise<void> {
    var res = await axios.post(
      `${this.urlPath}byServiceId`,
      servicesOnPriceCategory
    );
    return res.data;
  }

  async updatePriceCategoryForService(
    servicesOnPriceCategory: ServicesOnPriceCategory
  ): Promise<void> {
    var res = await axios.put(
      `${this.urlPath}byServiceId`,
      servicesOnPriceCategory
    );
    return res.data;
  }

  async deletePriceCategoryForService(
    serviceId: string,
    priceCategoryId: string
  ): Promise<void> {
    var res = await axios.delete(
      `${this.urlPath}byServiceId?serviceId=${serviceId}&priceCategoryId=${priceCategoryId}`
    );
    return res.data;
  }
}
