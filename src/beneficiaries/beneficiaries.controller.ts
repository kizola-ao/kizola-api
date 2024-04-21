import { Body, Controller, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto } from './dto/create/create-beneficiary.dto';
import { RequestUpdateBeneficiaryDto } from './dto/update/request-update-beneficiary.dto';
import { ResponseUpdateBeneficiaryDto } from './dto/update/response-update-beneficiary.dto';
import { ResponseCreateBeneficiaryDto } from './dto/create/response-create-beneficiary-dto';
import { ResponseReadBeneficiariesDto } from './dto/read/response-read-beneficiaries.dto';
import { ResponseReadBeneficiaryDto } from './dto/read/response-read-beneficiary.dto';

@Controller('beneficiaries')
export class BeneficiariesController {
    constructor(private beneficiaresService: BeneficiariesService) { }

    @Post()
    async createBeneficiary(
        @Body() data: CreateBeneficiaryDto,
        @Res() response: FastifyReply
    ): Promise<ResponseCreateBeneficiaryDto> {
        try {
            const beneficiary: ResponseCreateBeneficiaryDto = await this.beneficiaresService.createBeneficiary(data);
            response.status(201)
                .header('Content-Type', 'application/json')
                .header('Location', `/beneficiaries/${beneficiary.id}`).send(beneficiary);
            return beneficiary;
        } catch (error) {
            response.status(400).send({ message: error.message });
            throw error;
        }
    }

    @Get()
    async readAllBeneficiaries(
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('orderBy') orderBy: string,
        @Query('orderByAscOrDesc') orderByAscOrDesc: string,
    ): Promise<ResponseReadBeneficiariesDto> {
        const params = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            orderBy: orderBy ? orderBy : 'createdAt',
        };

        return this.beneficiaresService.readBeneficiaries({
            page: params.page,
            limit: params.limit,
            orderBy: {
                [params.orderBy]: orderByAscOrDesc === 'asc' ? 'asc' : 'desc'
            }
        });
    }

    @Get('/:id')
    async readBeneficiaryById(@Param('id') id: string): Promise<ResponseReadBeneficiaryDto | null | string> {
        return this.beneficiaresService.readBeneficiary({ id: String(id) });
    }

    @Get('/search/:q')
    async ReadBeneficiaryByString(
        @Query('q') q: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
        @Query('orderBy') orderBy: string,
        @Query('orderByAscOrDesc') orderByAscOrDesc: string
    ): Promise<ResponseReadBeneficiariesDto> {
        const params = {
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
            orderBy: orderBy ? orderBy : 'createdAt',
        };

        return this.beneficiaresService.readBeneficiaries({
            page: params.page,
            limit: params.limit,
            orderBy: {
                [params.orderBy]: orderByAscOrDesc === 'asc' ? 'asc' : 'desc'
            },
            where: {
                name: {
                    contains: q,
                    mode: 'insensitive'
                }
            }
        });
    }

    @Patch('/:id')
    async updateBeneficiary(@Param('id') id: string, @Body() data: RequestUpdateBeneficiaryDto): Promise<ResponseUpdateBeneficiaryDto> {
        return this.beneficiaresService.updateBeneficiary(id, data);
    }

    @Patch('/:id/soft-delete')
    async softDeleteBeneficiary(@Param('id') id: string): Promise<ResponseUpdateBeneficiaryDto> {
        return this.beneficiaresService.softDeleteBeneficiary(id);
    }
}
