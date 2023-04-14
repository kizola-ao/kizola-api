/*
  Warnings:

  - The primary key for the `beneficiary_social_causes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `beneficiary_social_causes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "beneficiary_social_causes" DROP CONSTRAINT "beneficiary_social_causes_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "beneficiary_social_causes_pkey" PRIMARY KEY ("beneficiaryId", "socialCauseId");
