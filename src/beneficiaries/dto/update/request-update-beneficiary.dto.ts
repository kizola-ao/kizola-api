import { ArrayNotEmpty, ArrayUnique, IsArray, IsEmail, IsInt, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from "class-validator"

export class RequestUpdateBeneficiaryDto {
    
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name: string | null

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    logo: string | null

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description: string | null

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    biography: string | null

    @IsOptional()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsUUID('4', { each: true })
    socialCausesId: [] | null

    @IsOptional()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsString({ each: true })
    phoneNumbers: [] | null

    @IsOptional()
    @ArrayNotEmpty()
    @ArrayUnique()
    @IsEmail({}, { each: true })
    emails: [] | null

    @IsOptional()
    @IsInt()
    provinceId: number | null

    @IsOptional()
    @IsInt()
    countyId: number | null

    @IsOptional()
    @IsInt()
    neighborhoodId: number | null

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    neighborhoodName: string | null

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    street: string | null

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    referencePoint: string | null

    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    socialNetworks: {
        id: string,
        link: string,
        socialNetworkId: string
    }[]
};