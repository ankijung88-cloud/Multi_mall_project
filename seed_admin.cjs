
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedAdmin() {
    try {
        const adminId = 'admin';
        const password = 'admin'; // Simple password for initial setup
        const name = 'Super Admin';

        const admin = await prisma.admin.upsert({
            where: { id: adminId },
            update: { password, name },
            create: { id: adminId, password, name },
        });

        console.log('Admin seeded successfully:', admin);
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
