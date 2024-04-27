export class ResponseReadBeneficiariesDto {
    beneficiaries: {
        id: string;
        name: string;
        logo: string;
        description: string;
        biography: string;
        numberDonations: number;
        totalAmountReceived: number;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        socialCauses: string[];
        phones: {
            id: string;
            number: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        emails: {
            id: string;
            email: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        address: {
            id: string;
            province: string;
            county: string;
            neighborhood: string;
            street: string;
            referencePoint: string;
        },
        socialNetworks: {
            socialNetwork: string;
            link: string;
        }[]
    }[];
    meta: {
        total: number;
        currentPage: number;
        lastPage: number;
        limit: number;
        prev: string;
        next: string;
    };
};