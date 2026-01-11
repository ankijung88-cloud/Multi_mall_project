const { PrismaClient } = require('@prisma/client');

// Force use of dev.db
process.env.DATABASE_URL = 'file:./dev.db';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- CHECKING DEV.DB ---');
        const pCount = await prisma.product.count();
        console.log('Product Count:', pCount);

        const partnerCount = await prisma.partner.count();
        console.log('Partner Count:', partnerCount);

        if (pCount > 0) {
            const pGroup = await prisma.product.groupBy({ by: ['category'], _count: { id: true } });
            console.log('Products by Category:', pGroup);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
