
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    const partner = await prisma.partner.findUnique({
        where: { id: 1 }
    });
    console.log('Partner 1 Category:', partner ? partner.category : 'Not Found');

    const requests = await prisma.partnerRequest.findMany({
        where: { partnerId: 1 },
        orderBy: { timestamp: 'desc' },
        take: 5
    });
    console.log('Recent Requests for Partner 1:', JSON.stringify(requests, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
