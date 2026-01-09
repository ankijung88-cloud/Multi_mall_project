
process.env.DATABASE_URL = "file:./prod_restore_test.db";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.$queryRaw`SELECT name FROM sqlite_master WHERE type='table'`;
        console.log('TABLES:', result);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
