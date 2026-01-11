const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- PRODUCTS ---');
        const pGroup = await prisma.product.groupBy({ by: ['category'], _count: { id: true } });
        console.log(pGroup);

        console.log('--- PARTNERS ---');
        // Check if Partner model has category
        // I can't check schema easily, so I'll try to just count all or inspect first one.
        const partners = await prisma.partner.findMany();
        console.log(`Total Partners: ${partners.length}`);
        partners.forEach(p => console.log(`- ${p.name} (Category: ${p.category})`));

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
