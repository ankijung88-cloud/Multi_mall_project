
process.env.DATABASE_URL = "file:./prisma/dev.db";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const partners = await prisma.partner.count();
        console.log('PARTNERS COUNT IN DEV.DB:', partners);

        if (partners > 0) {
            const sample = await prisma.partner.findFirst({ select: { name: true, image: true } });
            console.log('SAMPLE:', JSON.stringify(sample, null, 2));
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
