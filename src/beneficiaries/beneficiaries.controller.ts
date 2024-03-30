import { Body, Controller, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto } from './dto/create/create-beneficiary.dto';
import { RequestUpdateBeneficiaryDto } from './dto/update/request-update-beneficiary.dto';
import { Beneficiary as BeneficiaryModel } from '@prisma/client';
import { ResponseReadBeneficiaryDto } from './dto/read/response-read-beneficiary.dto ';
import { ResponseUpdateBeneficiaryDto } from './dto/update/response-update-beneficiary.dto';

@Controller('beneficiaries')
export class BeneficiariesController {
    constructor(private beneficiaresService: BeneficiariesService) { }

    @Post()
    async createBeneficiary(@Body() data: CreateBeneficiaryDto): Promise<BeneficiaryModel> {
        return this.beneficiaresService.createBeneficiary(data);
    }

    @Get()
    async readAllBeneficiaries(@Param() params): Promise<ResponseReadBeneficiaryDto> {
        return this.beneficiaresService.readBeneficiaries(params);
    }

    @Get('/:id')
    async readBeneficiaryById(@Param('id') id: string): Promise<ResponseReadBeneficiaryDto> {
        return this.beneficiaresService.readBeneficiary({ id: String(id) });
    }

    @Get('/search/:q')
    async ReadBeneficiaryByString(@Query('q') q: string): Promise<ResponseReadBeneficiaryDto> {
        return this.beneficiaresService.readBeneficiaries({
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
