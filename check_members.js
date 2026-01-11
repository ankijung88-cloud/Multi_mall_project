
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const count = await prisma.member.count();
        console.log(`Member Count: ${count}`);
        if (count > 0) {
            const members = await prisma.member.findMany();
            console.log('Members:', JSON.stringify(members, null, 2));
        }
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
