import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    await prisma.province.createMany({
        data: [
            { name: "Luanda" },
            { name: "Benguela" },
            { name: "Huíla" },
        ]
    });

    await prisma.county.createMany({
        data: [
            { name: "Kilamba Kiaxi", provinceId: 1 },
            { name: "Talatona", provinceId: 1 },
            { name: "Mainga", provinceId: 1 },

            { name: "Lobito", provinceId: 2 },

            { name: "Lubango", provinceId: 3 },
        ]
    });

    await prisma.socialCause.createMany({
        data: [
            { name: "Covid-19" },
            { name: "Fome" },
            { name: "Desemprego" },
        ]
    });
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });