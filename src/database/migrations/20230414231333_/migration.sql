-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_neighborhoodId_fkey";

-- AlterTable
ALTER TABLE "addresses" ALTER COLUMN "neighborhoodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_neighborhoodId_fkey" FOREIGN KEY ("neighborhoodId") REFERENCES "neighborhoods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
