const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const partners = await prisma.partner.findMany({
            take: 5,
            select: { id: true, name: true, image: true }
        });
        const shortened = partners.map(p => ({
            id: p.id,
            name: p.name,
            imagePrefix: p.image ? p.image.substring(0, 50) : 'null'
        }));
        console.log('PARTNERS:', JSON.stringify(shortened, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
