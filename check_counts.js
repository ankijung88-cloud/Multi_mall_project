const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const models = [
        'product', 'partner', 'agent', 'freelancer', 'content', 'member', 'order', 'schedule', 'partnerRequest', 'agentSchedule', 'agentRequest', 'contentRequest', 'contentPurchase'
    ];

    console.log('--- Row Counts ---');
    for (const model of models) {
        try {
            if (prisma[model]) {
                const count = await prisma[model].count();
                console.log(`${model}: ${count}`);
            } else {
                console.log(`${model}: Model not found in client`);
            }
        } catch (e) {
            console.log(`${model}: ${e.message.split('\n')[0]}`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
