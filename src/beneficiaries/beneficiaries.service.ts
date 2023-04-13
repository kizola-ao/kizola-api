import { Injectable } from '@nestjs/common';
import { Beneficiary, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class BeneficiariesService {
    constructor(private prisma: PrismaService) { }

    async beneficiary(
        beneficiaryWhereUniqueInput: Prisma.BeneficiaryWhereUniqueInput,
    ): Promise<Beneficiary | null> {
        return this.prisma.beneficiary.findUnique({
            where: beneficiaryWhereUniqueInput,
        });
    }
}
