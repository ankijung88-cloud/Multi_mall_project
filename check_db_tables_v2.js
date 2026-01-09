
process.env.DATABASE_URL = "file:./prod_restore_test.db";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Attempt 1: Raw SQL for SQLite
        console.log('Attempting to list tables...');
        const result = await prisma.$queryRawUnsafe("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('TABLES FOUND:', JSON.stringify(result, null, 2));

    } catch (e) {
        console.error('ERROR LISTING TABLES:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
