import { Module } from '@nestjs/common';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [BeneficiariesModule],
})
export class AppModule {}
