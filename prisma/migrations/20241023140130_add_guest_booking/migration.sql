/*
  Warnings:

  - A unique constraint covering the columns `[bookingAccessToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bookingAccessToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_bookingAccessToken_key" ON "User"("bookingAccessToken");
