import { Injectable } from '@nestjs/common';
import { Beneficiary, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { RequestUpdateBeneficiaryDto } from './dto/update/request-update-beneficiary.dto';
import { ReadBeneficiaryDto } from './dto/read-beneficiary.dto ';
import { ResponseUpdateBeneficiaryDto } from './dto/update/response-update-beneficiary.dto';

@Injectable()
export class BeneficiariesService {
    constructor(private prisma: PrismaService) { }

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

    async updateBeneficiary(id: string, data: RequestUpdateBeneficiaryDto): Promise<ResponseUpdateBeneficiaryDto> {
        return await this.prisma.$transaction(async (prisma) => {

            let beneficiary: Beneficiary;

            if (data.name || data.logo || data.description || data.biography) {
                beneficiary = await prisma.beneficiary.update({
                    where: {
                        id,
                    },
                    data: {
                        name: data.name,
                        logo: data.logo,
                        description: data.description,
                        biography: data.biography,
                    },
                });
            }

            if (data.provinceId && data.countyId && (data.neighborhoodName || data.neighborhoodId) && data.street) {
                await prisma.address.update({
                    where: {
                        id: beneficiary.addressId,
                    },
                    data: {
                        province: {
                            connect: {
                                id: data.provinceId,
                            },
                        },
                    },
                });

                await prisma.address.update({
                    where: {
                        id: beneficiary.addressId,
                    },
                    data: {
                        county: {
                            connect: {
                                id: data.countyId,
                            },
                        },
                    },
                });

                /* 
                    API RULE: 
                        - if neighborhoodId is provided, neighborhoodName is ignored
                        - if neighborhoodId is not provided, neighborhoodName is required to create a new neighborhood
                */
                if (data.neighborhoodId) {
                    await prisma.address.update({
                        where: {
                            id: beneficiary.addressId,
                        },
                        data: {
                            neighborhood: {
                                connect: {
                                    id: data.neighborhoodId,
                                },
                            },
                        },
                    });
                } else if (data.neighborhoodName) {
                    await prisma.address.update({
                        where: {
                            id: beneficiary.addressId,
                        },
                        data: {
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
                        },
                    });
                }

                await prisma.address.update({
                    where: {
                        id: beneficiary.addressId,
                    },
                    data: {
                        street: data.street,
                    },
                });
            }

            if (data.referencePoint) {
                await prisma.address.update({
                    where: {
                        id: beneficiary.addressId,
                    },
                    data: {
                        referencePoint: data.referencePoint,
                    },
                });
            }

            if (data.socialCausesId) {
                await prisma.beneficiarySocialCauses.deleteMany({
                    where: {
                        beneficiaryId: id,
                    },
                });

                await prisma.beneficiarySocialCauses.createMany({
                    data: data.socialCausesId.map((socialCauseId) => ({
                        socialCauseId,
                        beneficiaryId: id,
                    })),
                });
            }

            if (data.phoneNumbers) {
                await prisma.beneficiaryPhones.deleteMany({
                    where: {
                        beneficiaryId: id,
                    },
                });

                await prisma.beneficiaryPhones.createMany({
                    data: data.phoneNumbers.map((phoneNumber) => ({
                        number: phoneNumber,
                        beneficiaryId: id,
                    })),
                });
            }

            if (data.emails) {
                await prisma.beneficiaryEmails.deleteMany({
                    where: {
                        beneficiaryId: id,
                    },
                });

                await prisma.beneficiaryEmails.createMany({
                    data: data.emails.map((email) => ({
                        email,
                        beneficiaryId: id,
                    })),
                });
            }

            return beneficiary;
        });
    };

    async beneficiary(data: ReadBeneficiaryDto): Promise<ReadBeneficiaryDto | null> {
        return this.prisma.beneficiary.findUnique({
            where: {
                id: data.id,
            },
            select: {
                id: true,
                name: true,
                logo: true,
                description: true,
                biography: true,
                numberDonations: true,
                totalAmountReceived: true,
                active: true,
                createdAt: true,
                updatedAt: true,
                BeneficiarySocialCauses: {
                    select: {
                        socialCause: {
                            select: {
                                name: true,
                            },
                        },
                    },
                },
                BeneficiaryPhones: {
                    select: {
                        id: true,
                        number: true,
                        active: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                BeneficiaryEmails: {
                    select: {
                        id: true,
                        email: true,
                        active: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                address: {
                    select: {
                        id: true,
                        street: true,
                        referencePoint: true,
                        province: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        county: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                        neighborhood: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            }
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

    async deleteBeneficiary(where: Prisma.BeneficiaryWhereUniqueInput): Promise<Beneficiary> {
        return this.prisma.beneficiary.delete({
            where,
        });
    }
}
