
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const requests = await prisma.partnerRequest.findMany({
        orderBy: { timestamp: 'desc' },
        take: 5
    });
    console.log('Most Recent Requests:', JSON.stringify(requests, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
