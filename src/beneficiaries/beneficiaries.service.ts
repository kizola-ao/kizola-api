import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Beneficiary, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBeneficiaryDto } from './dto/create/create-beneficiary.dto';
import { RequestUpdateBeneficiaryDto } from './dto/update/request-update-beneficiary.dto';
import { RequestReadBeneficiaryDto } from './dto/read/request-read-beneficiary.dto';
import { ResponseUpdateBeneficiaryDto } from './dto/update/response-update-beneficiary.dto';
import { ResponseReadBeneficiariesDto } from './dto/read/response-read-beneficiaries.dto';
import { ResponseCreateBeneficiaryDto } from './dto/create/response-create-beneficiary-dto';
import { ResponseReadBeneficiaryDto } from './dto/read/response-read-beneficiary.dto';

@Injectable()
export class BeneficiariesService {
    constructor(private prisma: PrismaService) { }

    async createBeneficiary(beneficiary: 
        CreateBeneficiaryDto): Promise<ResponseCreateBeneficiaryDto> {

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
                    linkSocialNetwork: {
                        create: beneficiary.socialNetworks.map((socialNetwork) => ({
                            link: socialNetwork.link,
                            socialNetwork: {
                                connect: {
                                    id: socialNetwork.socialNetworkId,
                                },
                            },
                        })),
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

            return {
                id: createBeneficiary.id,
                name: createBeneficiary.name,
                active: createBeneficiary.active,
                createdAt: createBeneficiary.createdAt,
                updatedAt: createBeneficiary.updatedAt,
            };
        });
    }

    async readBeneficiaries(params: {
        page?: number;
        limit?: number;
        where?: Prisma.BeneficiaryWhereInput;
        orderBy?: Prisma.BeneficiaryOrderByWithRelationInput;
    }): Promise<ResponseReadBeneficiariesDto> {
        const { page, limit, where, orderBy } = params;

        if (page < 1 || limit < 1) {
            throw new BadRequestException('Invalid page or limit');
        }

        if (orderBy && !['id', 'name', 'createdAt', 'updatedAt'].includes(Object.keys(orderBy)[0])) {
            throw new BadRequestException('Invalid value to orderBy');
        }

        const skip = (page - 1) * limit;
        const take = limit;
        const total = await this.prisma.beneficiary.count({ where });
        const lastPage = Math.ceil(total / limit);

        const beneficiaries = this.prisma.beneficiary.findMany({
            skip,
            take,
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
                linkSocialNetwork: {
                    select: {
                        link: true,
                        socialNetwork: {
                            select: {
                                name: true,
                            },
                        },
                    },
                }
            }
        });

        return {
            beneficiaries: (await beneficiaries).map((beneficiary) => ({
                id: beneficiary.id,
                name: beneficiary.name,
                logo: beneficiary.logo,
                description: beneficiary.description,
                biography: beneficiary.biography,
                numberDonations: beneficiary.numberDonations,
                totalAmountReceived: Number(beneficiary.totalAmountReceived), //Convert Decimal to number
                active: beneficiary.active,
                createdAt: beneficiary.createdAt,
                updatedAt: beneficiary.updatedAt,
                socialCauses: beneficiary.BeneficiarySocialCauses
                    .map((beneficiarySocialCause) => beneficiarySocialCause.socialCause.name),
                phones: beneficiary.BeneficiaryPhones.map((beneficiaryPhone) => ({
                    id: beneficiaryPhone.id,
                    number: beneficiaryPhone.number,
                    active: beneficiaryPhone.active,
                    createdAt: beneficiaryPhone.createdAt,
                    updatedAt: beneficiaryPhone.updatedAt,
                })),
                emails: beneficiary.BeneficiaryEmails.map((beneficiaryEmail) => ({
                    id: beneficiaryEmail.id,
                    email: beneficiaryEmail.email,
                    active: beneficiaryEmail.active,
                    createdAt: beneficiaryEmail.createdAt,
                    updatedAt: beneficiaryEmail.updatedAt,
                })),
                address: {
                    id: beneficiary.address.id,
                    province: beneficiary.address.province.name,
                    county: beneficiary.address.county.name,
                    neighborhood: beneficiary.address.neighborhood.name,
                    street: beneficiary.address.street,
                    referencePoint: beneficiary.address.referencePoint,
                },
                socialNetworks: beneficiary.linkSocialNetwork.map((socialNetwork) => ({
                    socialNetwork: socialNetwork.socialNetwork.name,
                    link: socialNetwork.link,
                })),
            })),
            meta: {
                total,
                currentPage: page,
                lastPage,
                limit,
                prev: page > 1 ? `/beneficiaries?page=${page - 1}&limit=${limit}` : null,
                next: page < lastPage ? `/beneficiaries?page=${page + 1}&limit=${limit}` : null,
            },
        };
    }

    async readBeneficiary(beneficiary: RequestReadBeneficiaryDto): Promise< ResponseReadBeneficiaryDto | string | null > {
        const beneficiaryFounded = await this.prisma.beneficiary.findUnique({
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
                linkSocialNetwork: {
                    select: {
                        link: true,
                        socialNetwork: {
                            select: {
                                name: true,
                            },
                        },
                    },
                
                }
            }
        });

        if (beneficiaryFounded === null) {
            return `Beneficiary with id ${beneficiary.id} not found`;
        }

        return {
            id: beneficiaryFounded.id,
            name: beneficiaryFounded.name,
            logo: beneficiaryFounded.logo,
            description: beneficiaryFounded.description,
            biography: beneficiaryFounded.biography,
            numberDonations: beneficiaryFounded.numberDonations,
            totalAmountReceived: Number(beneficiaryFounded.totalAmountReceived), //Convert Decimal to number
            active: beneficiaryFounded.active,
            createdAt: beneficiaryFounded.createdAt,
            updatedAt: beneficiaryFounded.updatedAt,
            socialCauses: beneficiaryFounded.BeneficiarySocialCauses
                .map((beneficiarySocialCause) => beneficiarySocialCause.socialCause.name),
            phones: beneficiaryFounded.BeneficiaryPhones.map((beneficiaryPhone) => ({
                id: beneficiaryPhone.id,
                number: beneficiaryPhone.number,
                active: beneficiaryPhone.active,
                createdAt: beneficiaryPhone.createdAt,
                updatedAt: beneficiaryPhone.updatedAt,
            })),
            emails: beneficiaryFounded.BeneficiaryEmails.map((beneficiaryEmail) => ({
                id: beneficiaryEmail.id,
                email: beneficiaryEmail.email,
                active: beneficiaryEmail.active,
                createdAt: beneficiaryEmail.createdAt,
                updatedAt: beneficiaryEmail.updatedAt,
            })),
            address: {
                id: beneficiaryFounded.address.id,
                province: beneficiaryFounded.address.province.name,
                county: beneficiaryFounded.address.county.name,
                neighborhood: beneficiaryFounded.address.neighborhood.name,
                street: beneficiaryFounded.address.street,
                referencePoint: beneficiaryFounded.address.referencePoint,
            },
            socialNetworks: beneficiaryFounded.linkSocialNetwork.map((socialNetwork) => ({
                socialNetwork: socialNetwork.socialNetwork.name,
                link: socialNetwork.link,
            })),
        };
    }

    async updateBeneficiary(id: string, beneficiary: RequestUpdateBeneficiaryDto): Promise<ResponseUpdateBeneficiaryDto> {
        return await this.prisma.$transaction(async (prisma) => {

            let updateBeneficiary: Beneficiary;

            if (beneficiary.neighborhoodId && beneficiary.neighborhoodName) {
                throw new BadRequestException('Provide neighborhoodId or neighborhoodName, not both')
            }

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

            if (beneficiary.provinceId) {
                await prisma.beneficiary.update({
                    where: {
                        id,
                    },
                    data: {
                        address: {
                            update: {
                                province: {
                                    connect: {
                                        id: beneficiary.provinceId,
                                    },
                                },
                            },
                        },
                    },
                })
            }

            if (beneficiary.countyId) {
                await prisma.beneficiary.update({
                    where: {
                        id,
                    },
                    data: {
                        address: {
                            update: {
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

            if (beneficiary.neighborhoodId) {
                await prisma.beneficiary.update({
                    where: {
                        id,
                    },
                    data: {
                        address: {
                            update: {
                                neighborhood: {
                                    connect: {
                                        id: beneficiary.neighborhoodId,
                                    },
                                },
                            },
                        },
                    }
                });
            } else if (beneficiary.neighborhoodName) {

                if (!beneficiary.countyId) {
                    throw new BadRequestException('Provide countyId');
                }

                await prisma.beneficiary.update({
                    where: {
                        id,
                    },
                    data: {
                        address: {
                            update: {
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
                        },
                    }
                });
            }

            if (beneficiary.street) {
                await prisma.beneficiary.update({
                    where: {
                        id,
                    },
                    data: {
                        address: {
                            update: {
                                street: beneficiary.street,
                            },
                        },
                    },
                });
            }

            if (beneficiary.referencePoint) {
                await prisma.beneficiary.update({
                    where: {
                        id,
                    },
                    data: {
                        address: {
                            update: {
                                referencePoint: beneficiary.referencePoint,
                            },
                        },
                    },
                });
            }

            if (beneficiary.socialNetworks) {
                for (const socialNetwork of beneficiary.socialNetworks) {

                    if (!socialNetwork.link && !socialNetwork.socialNetworkId) {
                        throw new BadRequestException('Missing fields: link or socialNetworkId');
                    }

                    if (socialNetwork.id) {
                        await prisma.linkSocialNetwork.update({
                            where: {
                                id: socialNetwork.id,
                                beneficiaryId: id, 
                            },
                            data: {
                                link: socialNetwork.link,
                                socialNetworkId: socialNetwork.socialNetworkId,
                            },
                        });
                    } else if (!socialNetwork.id) {
                        if (!socialNetwork.link || !socialNetwork.socialNetworkId) {
                            throw new BadRequestException('Missing fields: link or socialNetworkId');
                        }

                        await prisma.linkSocialNetwork.create({
                            data: {
                                link: socialNetwork.link,
                                socialNetworkId: socialNetwork.socialNetworkId,
                                beneficiaryId: id,
                            },
                        });
                    }
                }
            }

            return beneficiary;
        });
    };

    async softDeleteBeneficiary(id: string): Promise<Beneficiary> {
        return await this.prisma.beneficiary.update({
            where: {
                id,
            },
            data: {
                active: false,
            },
        });
    }
}
