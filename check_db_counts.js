const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const members = await prisma.member.count();
        const agents = await prisma.agent.count();
        const partners = await prisma.partner.count();
        const freelancers = await prisma.freelancer.count();

        console.log('COUNTS:');
        console.log('Members:', members);
        console.log('Agents:', agents);
        console.log('Partners:', partners);
        console.log('Freelancers:', freelancers);

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
