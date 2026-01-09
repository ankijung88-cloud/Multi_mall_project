
process.env.DATABASE_URL = "file:./prod.db";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Searching for Glovi...');
        // Try to find the specific partner
        const glovi = await prisma.partner.findFirst({
            where: { name: { contains: '글로비' } }
        });
        console.log('GLOVI RESULT:', glovi);

        // Try to find ANY partner
        const anyPartner = await prisma.partner.findFirst();
        console.log('ANY PARTNER:', anyPartner);

    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
