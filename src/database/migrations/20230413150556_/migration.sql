-- CreateTable
CREATE TABLE "social_causes" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_causes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "beneficiary_social_causes" (
    "id" TEXT NOT NULL,
    "beneficiaryId" TEXT NOT NULL,
    "socialCauseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "beneficiary_social_causes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "beneficiary_social_causes" ADD CONSTRAINT "beneficiary_social_causes_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "beneficiary_social_causes" ADD CONSTRAINT "beneficiary_social_causes_socialCauseId_fkey" FOREIGN KEY ("socialCauseId") REFERENCES "social_causes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
