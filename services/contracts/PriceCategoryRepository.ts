import { PriceCategory, ServicesOnPriceCategory } from "@prisma/client";
import { Repository } from "./Repository";

export interface PriceCategoryRepository extends Repository<PriceCategory> {
  getPriceCategoriesByServiceId(
    serviceId: string
  ): Promise<ServicesOnPriceCategory[]>;

  createPriceCategoryForService(
    servicesOnPriceCategory: ServicesOnPriceCategory
  ): Promise<void>;

  updatePriceCategoryForService(
    servicesOnPriceCategory: ServicesOnPriceCategory
  ): Promise<void>;

  deletePriceCategoryForService(
    serviceId: string,
    priceCategoryId: string
  ): Promise<void>;
}
