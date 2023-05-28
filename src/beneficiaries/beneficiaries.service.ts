import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Beneficiary, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeneficiaryDto } from './dto/create/create-beneficiary.dto';
import { RequestUpdateBeneficiaryDto } from './dto/update/request-update-beneficiary.dto';
import { RequestReadBeneficiaryDto } from './dto/read/request-read-beneficiary.dto ';
import { ResponseUpdateBeneficiaryDto } from './dto/update/response-update-beneficiary.dto';
import { ResponseReadBeneficiaryDto } from './dto/read/response-read-beneficiary.dto ';

@Injectable()
export class BeneficiariesService {
    constructor(private prisma: PrismaService) { }

    async createBeneficiary(beneficiary: CreateBeneficiaryDto): Promise<Beneficiary> {

        if (!beneficiary.neighborhoodId && !beneficiary.neighborhoodName) {
            throw new BadRequestException('Missing fields: neighborhoodId or neighborhoodName');
        }

        if (beneficiary.neighborhoodId && beneficiary.neighborhoodName) {
            throw new BadRequestException('Pass neighborhoodId or neighborhoodName, not both');
        }

        return await this.prisma.$transaction(async (prisma) => {
            const createBeneficiary = await this.prisma.beneficiary.create({
                data: {
                    name: beneficiary.name,
                    logo: beneficiary.logo,
                    description: beneficiary.description,
                    biography: beneficiary.biography,
                    BeneficiarySocialCauses: {
                        create: beneficiary.socialCausesId.map((socialCauseId) => ({
                            socialCauseId,
                        })),
                    },
                    BeneficiaryPhones: {
                        create: beneficiary.phoneNumbers.map((phoneNumber) => ({
                            number: phoneNumber,
                        })),
                    },
                    BeneficiaryEmails: {
                        create: beneficiary.emails.map((email) => ({
                            email,
                        })),
                    },
                    address: {
                        create: {
                            province: {
                                connect: {
                                    id: beneficiary.provinceId,
                                },
                            },
                            street: beneficiary.street,
                            county: {
                                connect: {
                                    id: beneficiary.countyId,
                                },
                            },
                            referencePoint: beneficiary.referencePoint,
                        },
                    },
                },
            });

            if (beneficiary.neighborhoodId) {
                await prisma.address.update({
                    where: {
                        id: createBeneficiary.addressId,
                    },
                    data: {
                        neighborhood: {
                            connect: {
                                id: beneficiary.neighborhoodId,
                            },
                        },
                    },
                });
            } else if (beneficiary.neighborhoodName) {
                await prisma.address.update({
                    where: {
                        id: createBeneficiary.addressId,
                    },
                    data: {
                        neighborhood: {
                            create: {
                                name: beneficiary.neighborhoodName,
                                county: {
                                    connect: {
                                        id: beneficiary.countyId,
                                    },
                                },
                            },
                        },
                    },
                });
            }

            return createBeneficiary;
        });
    }

    async readBeneficiaries(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.BeneficiaryWhereUniqueInput;
        where?: Prisma.BeneficiaryWhereInput;
        orderBy?: Prisma.BeneficiaryOrderByWithRelationInput;
    }): Promise<ResponseReadBeneficiaryDto> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.beneficiary.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
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

    async readBeneficiary(beneficiary: RequestReadBeneficiaryDto): Promise<ResponseReadBeneficiaryDto | null> {
        return this.prisma.beneficiary.findUnique({
            where: {
                id: beneficiary.id,
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

    async updateBeneficiary(id: string, beneficiary: RequestUpdateBeneficiaryDto): Promise<ResponseUpdateBeneficiaryDto> {
        return await this.prisma.$transaction(async (prisma) => {

            let updateBeneficiary: Beneficiary;

            if (beneficiary.name || beneficiary.logo || beneficiary.description || beneficiary.biography) {
                updateBeneficiary = await prisma.beneficiary.update({
                    where: {
                        id,
                    },
                    data: {
                        name: beneficiary.name,
                        logo: beneficiary.logo,
                        description: beneficiary.description,
                        biography: beneficiary.biography,
                    },
                });
            }

            if (beneficiary.provinceId && beneficiary.countyId && (beneficiary.neighborhoodId || beneficiary.neighborhoodName) && beneficiary.street) {

                if (beneficiary.neighborhoodId && beneficiary.neighborhoodName) {
                    throw new BadRequestException('Provide neighborhoodId or neighborhoodName, not both')
                }

                await prisma.address.update({
                    where: {
                        id: updateBeneficiary.addressId,
                    },
                    data: {
                        province: {
                            connect: {
                                id: beneficiary.provinceId,
                            },
                        },
                        county: {
                            connect: {
                                id: beneficiary.countyId,
                            },
                        },
                        street: beneficiary.street,
                    },
                });

                if (beneficiary.neighborhoodId) {
                    await prisma.address.update({
                        where: {
                            id: updateBeneficiary.addressId,
                        },
                        data: {
                            neighborhood: {
                                connect: {
                                    id: beneficiary.neighborhoodId,
                                },
                            },
                        },
                    });
                } else if (beneficiary.neighborhoodName) {
                    await prisma.address.update({
                        where: {
                            id: updateBeneficiary.addressId,
                        },
                        data: {
                            neighborhood: {
                                create: {
                                    name: beneficiary.neighborhoodName,
                                    county: {
                                        connect: {
                                            id: beneficiary.countyId,
                                        },
                                    },
                                },
                            },
                        },
                    });
                }

            } else {
                const mandatoryFields = ['provinceId', 'countyId', 'street'];

                const missingFields = mandatoryFields.filter((field) => !beneficiary[field]);

                if (!beneficiary.neighborhoodId && !beneficiary.neighborhoodName) {
                    throw new BadRequestException('Provide neighborhoodId or neighborhoodName')
                }

                if (missingFields.length > 0) {
                    throw new BadRequestException(`Missing fields: ${missingFields.join(', ')}`);
                }
            }

            if (beneficiary.referencePoint) {
                await prisma.address.update({
                    where: {
                        id: updateBeneficiary.addressId,
                    },
                    data: {
                        referencePoint: beneficiary.referencePoint,
                    },
                });
            }

            if (beneficiary.socialCausesId) {
                await prisma.beneficiarySocialCauses.deleteMany({
                    where: {
                        beneficiaryId: id,
                    },
                });

                await prisma.beneficiarySocialCauses.createMany({
                    data: beneficiary.socialCausesId.map((socialCauseId) => ({
                        socialCauseId,
                        beneficiaryId: id,
                    })),
                });
            }

            if (beneficiary.phoneNumbers) {
                await prisma.beneficiaryPhones.deleteMany({
                    where: {
                        beneficiaryId: id,
                    },
                });

                await prisma.beneficiaryPhones.createMany({
                    data: beneficiary.phoneNumbers.map((phoneNumber) => ({
                        number: phoneNumber,
                        beneficiaryId: id,
                    })),
                });
            }

            if (beneficiary.emails) {
                await prisma.beneficiaryEmails.deleteMany({
                    where: {
                        beneficiaryId: id,
                    },
                });

                await prisma.beneficiaryEmails.createMany({
                    data: beneficiary.emails.map((email) => ({
                        email,
                        beneficiaryId: id,
                    })),
                });
            }

            return beneficiary;
        });
    };

    async deleteBeneficiary(where: Prisma.BeneficiaryWhereUniqueInput): Promise<Beneficiary> {
        return this.prisma.beneficiary.delete({
            where,
        });
    }
}
