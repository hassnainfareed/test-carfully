/*
  Warnings:

  - You are about to drop the column `appointment` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "appointment",
ADD COLUMN     "appointmentDate" TIMESTAMP(3),
ADD COLUMN     "appointmentTime" TIME(0);
