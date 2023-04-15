import { Module, ValidationPipe } from '@nestjs/common';
import { BeneficiariesModule } from './beneficiaries/beneficiaries.module';
import { PrismaService } from './database/prisma.service';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [BeneficiariesModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    }
  ]
})
export class AppModule {}
