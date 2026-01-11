const { PrismaClient } = require('@prisma/client');

async function checkDB(dbName, url) {
    console.log(`--- CHECKING ${dbName} ---`);
    process.env.DATABASE_URL = url;
    const prisma = new PrismaClient();
    try {
        const pCount = await prisma.product.count();
        console.log('Product Count:', pCount);
        const partnerCount = await prisma.partner.count();
        console.log('Partner Count:', partnerCount);
        const reqCount = await prisma.partnerRequest.count();
        console.log('PartnerRequest Count:', reqCount);
    } catch (e) {
        console.log("Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

async function main() {
    await checkDB('PROD.DB', 'file:./prod.db');
    await checkDB('PROD_RESTORE_TEST.DB', 'file:./prod_restore_test.db');
}

main();
