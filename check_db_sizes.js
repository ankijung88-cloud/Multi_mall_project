
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- AGENTS ---');
        const agents = await prisma.agent.findMany();
        agents.forEach(a => {
            console.log(`ID: ${a.id}, Name: ${a.name}, ImageLength: ${a.image ? a.image.length : 0}, DetailImageLength: ${a.detailImage ? a.detailImage.length : 'null'}`);
        });

        console.log('\n--- PARTNERS ---');
        const partners = await prisma.partner.findMany({ take: 10 });
        partners.forEach(p => {
            console.log(`ID: ${p.id}, Name: ${p.name}, ImageLength: ${p.image ? p.image.length : 0}`);
        });

    } catch (e) {
        console.error('ERROR:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
