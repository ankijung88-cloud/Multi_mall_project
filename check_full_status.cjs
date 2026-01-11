
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAll() {
    try {
        const counts = {
            Device: 'Remote Server (13.125.161.160)',
            Members: await prisma.member.count(),
            Admins: await prisma.admin.count(),
            Partners: await prisma.partner.count(),
            Agents: await prisma.agent.count(),
            PartnerRequests: await prisma.partnerRequest.count(),
            AgentRequests: await prisma.agentRequest.count(),
            ContentRequests: await prisma.contentRequest.count(),
            Orders: await prisma.order.count(),
        };
        console.log('--- DB STATUS ---');
        console.log(JSON.stringify(counts, null, 2));

        // List recent members to verify registration time
        const recentMembers = await prisma.member.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
            select: { email: true, name: true, createdAt: true, type: true }
        });
        console.log('--- RECENT MEMBERS ---');
        console.log(recentMembers);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAll();
