import { Discount } from "@prisma/client";
import { Repository } from "./Repository";

export interface DiscountRepository extends Repository<Discount> {
  checkCode(code: string): Promise<Discount | null>;
}
