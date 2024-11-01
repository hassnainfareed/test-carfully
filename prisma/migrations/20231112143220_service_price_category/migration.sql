/*
  Warnings:

  - You are about to drop the column `brand` on the `Car` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `Car` table. All the data in the column will be lost.
  - Added the required column `carBrandId` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carModelId` to the `Car` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceCategoryId` to the `CarModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Car" DROP COLUMN "brand",
DROP COLUMN "model",
ADD COLUMN     "carBrandId" TEXT NOT NULL,
ADD COLUMN     "carModelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "priceCategoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ServicesOnPriceCategory" (
    "serviceId" TEXT NOT NULL,
    "priceCategoryId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ServicesOnPriceCategory_pkey" PRIMARY KEY ("serviceId","priceCategoryId")
);

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carBrandId_fkey" FOREIGN KEY ("carBrandId") REFERENCES "CarBrand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Car" ADD CONSTRAINT "Car_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarModel" ADD CONSTRAINT "CarModel_priceCategoryId_fkey" FOREIGN KEY ("priceCategoryId") REFERENCES "PriceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesOnPriceCategory" ADD CONSTRAINT "ServicesOnPriceCategory_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ServicesOnPriceCategory" ADD CONSTRAINT "ServicesOnPriceCategory_priceCategoryId_fkey" FOREIGN KEY ("priceCategoryId") REFERENCES "PriceCategory"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
