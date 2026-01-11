
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
    try {
        const admins = await prisma.admin.findMany();
        console.log('Admins Count:', admins.length);
        console.log('Admins:', JSON.stringify(admins, null, 2));
    } catch (error) {
        console.error('Error checking admins:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAdmin();
