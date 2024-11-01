/*
  Warnings:

  - You are about to drop the `CarCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `length` to the `CarModel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "length" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CarCategory";

-- CreateTable
CREATE TABLE "PriceCategory" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "PriceCategory_pkey" PRIMARY KEY ("id")
);
