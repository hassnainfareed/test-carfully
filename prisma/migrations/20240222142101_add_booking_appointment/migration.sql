-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "appointment" TIMESTAMP(3),
ADD COLUMN     "isNow" BOOLEAN NOT NULL DEFAULT true;
