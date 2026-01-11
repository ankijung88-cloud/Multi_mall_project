
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugAdmin() {
    try {
        const admins = await prisma.admin.findMany();
        console.log('--- ADMIN DEBUG ---');
        console.log(JSON.stringify(admins, null, 2));

        // Simulate finding the admin
        const id = 'admin';
        const pass = 'admin';
        const found = await prisma.admin.findFirst({
            where: { id, password: pass }
        });
        console.log('--- AUTH TEST (admin/admin) ---');
        console.log(found ? 'SUCCESS: Found user' : 'FAILURE: User not found');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugAdmin();
