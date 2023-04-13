/*
  Warnings:

  - You are about to drop the column `donationId` on the `addresses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_donationId_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "donationId";
