import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { Beneficiary as BeneficiaryModel } from '@prisma/client';

@Controller('beneficiaries')
export class BeneficiariesController {
    constructor(private beneficiaresService: BeneficiariesService) { }

    // @Post()
    // async create(@Body() createBeneficiaryDto: CreateBeneficiaryDto) {
    //     this.beneficiaresService.create(createBeneficiaryDto);
    // } 

    @Get('/:id')
    async getUserById(@Param('id') id: string): Promise<BeneficiaryModel> {
        return this.beneficiaresService.beneficiary({ id: String(id) });
    }
}
