import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Freelancers
router.get('/', async (req, res) => {
    try {
        const freelancers = await prisma.freelancer.findMany();
        const parsed = freelancers.map(f => ({
            ...f,
            portfolioImages: JSON.parse(f.portfolioImages || '[]')
        }));
        res.json(parsed);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch freelancers' });
    }
});

router.post('/', async (req, res) => {
    const { portfolioImages, credentials, ...data } = req.body;

    const freelancerData = {
        ...data,
        username: credentials?.username,
        password: credentials?.password
    };

    try {
        const freelancer = await prisma.freelancer.create({
            data: {
                ...freelancerData,
                portfolioImages: JSON.stringify(portfolioImages || [])
            }
        });
        res.json(freelancer);
    } catch (error) {
        console.error("Create freelancer error:", error);
        res.status(500).json({ error: 'Failed to create freelancer' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { portfolioImages, ...data } = req.body;
    try {
        const freelancer = await prisma.freelancer.update({
            where: { id },
            data: {
                ...data,
                portfolioImages: portfolioImages ? JSON.stringify(portfolioImages) : undefined
            }
        });
        res.json(freelancer);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update freelancer' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.freelancer.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete freelancer' });
    }
});

// Content Requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await prisma.contentRequest.findMany();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

router.post('/requests', async (req, res) => {
    try {
        const request = await prisma.contentRequest.create({
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
        const request = await prisma.contentRequest.update({
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
        await prisma.contentRequest.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete request' });
    }
});

// Favorites
router.get('/favorites/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const favorites = await prisma.contentFavorite.findMany({
            where: { userId }
        });
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch favorites' });
    }
});

router.post('/favorites', async (req, res) => {
    const { userId, contentId } = req.body;
    try {
        const favorite = await prisma.contentFavorite.create({
            data: { userId, contentId }
        });
        res.json(favorite);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add favorite' });
    }
});

router.delete('/favorites', async (req, res) => {
    const { userId, contentId } = req.body;
    try {
        await prisma.contentFavorite.deleteMany({
            where: { userId, contentId }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove favorite' });
    }
});

export default router;
