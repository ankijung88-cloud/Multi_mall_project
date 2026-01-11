const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("--- FETCHING LATEST SCHEDULE ---");
        const schedules = await prisma.schedule.findMany({
            take: 1,
            orderBy: { id: 'desc' }
        });

        if (schedules.length > 0) {
            console.log("Keys in schedule object:", Object.keys(schedules[0]));
            console.log("Latest Schedule Data:", JSON.stringify(schedules[0], null, 2));
        } else {
            console.log("No schedules found.");
        }

    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
