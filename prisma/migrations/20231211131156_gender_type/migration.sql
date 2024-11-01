-- CreateEnum
CREATE TYPE "GenderType" AS ENUM ('NOT_SPECIFIED', 'MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "genderType" "GenderType" NOT NULL DEFAULT 'NOT_SPECIFIED';
