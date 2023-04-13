import { Module } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { BeneficiariesController } from './beneficiaries.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [
    BeneficiariesService,
    PrismaService
  ],
  controllers: [BeneficiariesController],
})
export class BeneficiariesModule {}
