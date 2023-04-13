import { Injectable } from '@nestjs/common';
import { Beneficiary, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';

@Injectable()
export class BeneficiariesService {
    constructor(private prisma: PrismaService) { }

    async beneficiary( beneficiaryWhereUniqueInput: Prisma.BeneficiaryWhereUniqueInput): Promise<Beneficiary | null> {
        return this.prisma.beneficiary.findUnique({
            where: beneficiaryWhereUniqueInput,
        });
    }

    async beneficiaries(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.BeneficiaryWhereUniqueInput;
        where?: Prisma.BeneficiaryWhereInput;
        orderBy?: Prisma.BeneficiaryOrderByWithRelationInput;
    }): Promise<Beneficiary[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.beneficiary.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createBeneficiary(data: CreateBeneficiaryDto): Promise<Beneficiary> {

        return this.prisma.beneficiary.create({
            data: {
                name: data.name,
                logo: data.logo,
                description: data.description,
                biography: data.biography,
                BeneficiarySocialCauses: {
                    create: data.socialCausesId.map((socialCauseId) => ({
                        socialCauseId,
                    })),
                },
                BeneficiaryPhones: {
                    create: data.phoneNumbers.map((phoneNumber) => ({
                        number: phoneNumber,
                    })),
                },
                BeneficiaryEmails: {
                    create: data.emails.map((email) => ({
                        email,
                    })),
                },
                address: {
                    create: {
                        province: {
                            connect: {
                                id: data.provinceId,
                            },
                        },
                        street: data.street,
                        county: {
                            connect: {
                                id: data.countyId,
                            },
                        },
                        neighborhood: {
                            create: {
                                name: data.neighborhoodName,
                                county: {
                                    connect: {
                                        id: data.countyId,
                                    },
                                },
                            },
                        },
                        referencePoint: data.referencePoint,
                    },
                },
            },
        });
    }

    async updateBeneficiary(params: {
        where: Prisma.BeneficiaryWhereUniqueInput;
        data: Prisma.BeneficiaryUpdateInput;
    }): Promise<Beneficiary> {
        const { where, data } = params;
        return this.prisma.beneficiary.update({
            data,
            where,
        });
    }

    async deleteBeneficiary(where: Prisma.BeneficiaryWhereUniqueInput): Promise<Beneficiary> {
        return this.prisma.beneficiary.delete({
            where,
        });
    }
}
