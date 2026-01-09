const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const agents = await prisma.agent.findMany({
            take: 5,
            select: { id: true, name: true, image: true }
        });
        const shortened = agents.map(a => ({
            id: a.id,
            name: a.name,
            imagePrefix: a.image ? a.image.substring(0, 50) : 'null'
        }));
        console.log(JSON.stringify(shortened, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
