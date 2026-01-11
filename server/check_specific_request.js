
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TARGET_SCHEDULE_ID = 'a690270d-4deb-4eb8-8a1f-ecbb94dc374f';

async function main() {
    console.log(`Searching for requests with Schedule ID: ${TARGET_SCHEDULE_ID}`);

    const requests = await prisma.partnerRequest.findMany({
        where: {
            scheduleId: TARGET_SCHEDULE_ID
        }
    });

    if (requests.length === 0) {
        console.log("No requests found for this schedule.");
    } else {
        console.log(`Found ${requests.length} requests:`);
        console.log(JSON.stringify(requests, null, 2));
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
