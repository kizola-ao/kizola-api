import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { Beneficiary as BeneficiaryModel } from '@prisma/client';

@Controller('beneficiaries')
export class BeneficiariesController {
    constructor(private beneficiaresService: BeneficiariesService) { }


    //get all beneficiaries with params filter and pagination 
    @Get()
    async getAllBeneficiaries(@Param() params): Promise<BeneficiaryModel[]> {
        return this.beneficiaresService.beneficiaries(params);
    }

    @Get('/:id')
    async getBeneficiaryById(@Param('id') id: string): Promise<BeneficiaryModel> {
        return this.beneficiaresService.beneficiary({ id: String(id) });
    }

    //filter by name
    @Get('/search/:q')
    async getBeneficiaryByName(@Param('q') q: string): Promise<BeneficiaryModel[]> {
        return this.beneficiaresService.beneficiaries({
            where: {
                name: {
                    contains: q,
                    mode: 'insensitive'
                }
            }
        });
    }

    //create beneficiary
    @Post()
    async createBeneficiary(@Body() data: CreateBeneficiaryDto): Promise<BeneficiaryModel> {
        return this.beneficiaresService.createBeneficiary(data);
    }

    //update beneficiary
    @Put('/:id')
    async updateBeneficiary(@Param('id') id: string, @Body() data: CreateBeneficiaryDto): Promise<BeneficiaryModel> {
        return this.beneficiaresService.updateBeneficiary({
            where: { id: String(id) },
            data,
        });
    }
}
