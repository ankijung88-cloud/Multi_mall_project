
process.env.DATABASE_URL = "file:./prod_restore_test.db";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const members = await prisma.member.count();
        const agents = await prisma.agent.count();
        const partners = await prisma.partner.count();

        console.log('TEST DB COUNTS:');
        console.log('Members:', members);
        console.log('Agents:', agents);
        console.log('Partners:', partners);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
