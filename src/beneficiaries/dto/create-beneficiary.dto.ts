export class CreateBeneficiaryDto {
    name: string
    logo: string
    description: string
    socialCausesId: []
    phoneNumbers: []
    emails: []
    provinceId: number
    street: string
    countyId: number
    neighborhoodName: string
    referencePoint: string
    biography: string | null
};