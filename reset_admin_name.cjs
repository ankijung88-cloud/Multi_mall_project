
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetName() {
    try {
        await prisma.admin.update({
            where: { id: 'admin' },
            data: { name: 'Super Admin', password: 'admin' } // Revert to default
        });
        console.log('RESET COMPLETE');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetName();
