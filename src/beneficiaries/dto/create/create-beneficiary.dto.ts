import { ArrayNotEmpty, ArrayUnique, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator"

export class CreateBeneficiaryDto {
    @IsNotEmpty()
    @IsString()
    name: string

    @IsNotEmpty()
    @IsString()
    logo: string

    @IsNotEmpty()
    @IsString()
    description: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    biography: string | null
    
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUUID('4', { each: true })
    socialCausesId: []

    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    phoneNumbers: []

    @ArrayNotEmpty()
    @ArrayUnique()
    @IsEmail({}, { each: true })
    emails: []

    @IsNotEmpty()
    @IsInt()
    provinceId: number

    @IsNotEmpty()
    @IsInt()
    countyId: number

    @IsOptional()
    @IsInt()
    neighborhoodId: number | null

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    neighborhoodName: string | null

    @IsNotEmpty()
    @IsString()
    street: string

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    referencePoint: string | null
};