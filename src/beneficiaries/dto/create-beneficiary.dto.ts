export class CreateBeneficiaryDto {
    id: number;
    name: string;
    logo: string;
    description: string;
    biography: string;
    numberDonation: number;
    totalAmountReceived: number;
    active: boolean;
};