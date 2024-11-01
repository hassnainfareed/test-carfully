/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "DiscountType" ADD VALUE 'SERVICE';

-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "validForServiceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Discount_name_key" ON "Discount"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Discount_code_key" ON "Discount"("code");
