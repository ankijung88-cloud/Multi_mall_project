const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const agents = await prisma.agent.findMany({
            take: 5,
            select: { id: true, name: true, image: true, detailImage: true }
        });
        console.log(JSON.stringify(agents, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
