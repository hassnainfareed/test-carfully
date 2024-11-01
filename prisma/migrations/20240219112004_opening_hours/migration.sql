/*
  Warnings:

  - You are about to drop the `OpeningHours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OpeningHours" DROP CONSTRAINT "OpeningHours_locationId_fkey";

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "fridayEnd" TIME(0),
ADD COLUMN     "fridayStart" TIME(0),
ADD COLUMN     "mondayEnd" TIME(0),
ADD COLUMN     "mondayStart" TIME(0),
ADD COLUMN     "saturdayEnd" TIME(0),
ADD COLUMN     "saturdayStart" TIME(0),
ADD COLUMN     "sundayEnd" TIME(0),
ADD COLUMN     "sundayStart" TIME(0),
ADD COLUMN     "thursdayEnd" TIME(0),
ADD COLUMN     "thursdayStart" TIME(0),
ADD COLUMN     "tuesdayEnd" TIME(0),
ADD COLUMN     "tuesdayStart" TIME(0),
ADD COLUMN     "wednesdayEnd" TIME(0),
ADD COLUMN     "wednesdayStart" TIME(0);

-- DropTable
DROP TABLE "OpeningHours";

-- DropEnum
DROP TYPE "Day";
