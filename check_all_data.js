
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- DB CHECK START ---');
    try {
        const members = await prisma.member.findMany();
        console.log(`Members Count: ${members.length}`);
        console.log('Members:', JSON.stringify(members, null, 2));

        const partners = await prisma.partner.findMany();
        console.log(`Partners Count: ${partners.length}`);
    } catch (e) {
        console.error('Check Error:', e);
    } finally {
        await prisma.$disconnect();
        console.log('--- DB CHECK END ---');
    }
}

main();
