import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        // Parse detailImages JSON string back to array if needed, 
        // but passing string is fine if frontend expects to parse it or we parse here.
        // Frontend likely expects array.
        const parsedProducts = products.map(p => ({
            ...p,
            detailImages: JSON.parse(p.detailImages || '[]')
        }));
        res.json(parsedProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Add product
router.post('/', async (req, res) => {
    try {
        const { detailImages, ...rest } = req.body;
        const product = await prisma.product.create({
            data: {
                ...rest,
                detailImages: JSON.stringify(detailImages || [])
            }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { detailImages, ...rest } = req.body;
    try {
        const product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                ...rest,
                detailImages: detailImages ? JSON.stringify(detailImages) : undefined
            }
        });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
            where: { id: Number(id) }
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

export default router;
