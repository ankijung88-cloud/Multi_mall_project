import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Get partners with schedules
router.get('/', async (req, res) => {
    try {
        const partners = await prisma.partner.findMany({
            include: { schedules: true }
        });
        res.json(partners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch partners' });
    }
});

router.post('/', async (req, res) => {
    const { schedules, credentials, ...data } = req.body;

    // Spread credentials if they exist
    const partnerData = {
        ...data,
        username: credentials?.username,
        password: credentials?.password
    };

    try {
        const partner = await prisma.partner.create({
            data: {
                ...partnerData,
                schedules: {
                    create: schedules || []
                }
            },
            include: { schedules: true }
        });
        res.json(partner);
    } catch (error) {
        console.error("Create partner error:", error);
        res.status(500).json({ error: 'Failed to create partner' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { schedules, credentials, ...data } = req.body;
    console.log("UPDATE PARTNER: Received Body:", JSON.stringify(req.body, null, 2));
    console.log("UPDATE PARTNER: Schedules:", JSON.stringify(schedules, null, 2));

    const partnerData = {
        ...data,
        ...(credentials ? { username: credentials.username, password: credentials.password } : {})
    };

    try {
        const partner = await prisma.partner.update({
            where: { id: Number(id) },
            data: {
                ...partnerData,
                schedules: {
                    deleteMany: {}, // Remove old schedules
                    create: schedules || [] // create new ones
                }
            },
            include: { schedules: true }
        });

        res.json(partner);
    } catch (error) {
        console.error("Update partner error:", error);
        res.status(500).json({ error: 'Failed to update partner' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.partner.delete({ where: { id: Number(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete partner' });
    }
});

// Partner Requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await prisma.partnerRequest.findMany();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

router.post('/requests', async (req, res) => {
    try {
        const request = await prisma.partnerRequest.create({
            data: req.body
        });
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create request' });
    }
});

router.put('/requests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await prisma.partnerRequest.update({
            where: { id },
            data: req.body
        });
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update request' });
    }
});

router.delete('/requests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.partnerRequest.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete request' });
    }
});

export default router;
