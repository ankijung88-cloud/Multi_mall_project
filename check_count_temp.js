const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.product.count();
        console.log('Product Count:', count);

        // Also group by category to match user request "find by category"
        const grouped = await prisma.product.groupBy({
            by: ['category'],
            _count: {
                id: true
            }
        });
        console.log('By Category:', grouped);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
