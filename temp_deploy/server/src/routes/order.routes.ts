import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create Order
router.post('/', async (req, res) => {
    try {
        const { id, customerName, customerEmail, totalAmount, currency, paymentMethod, status, date, items } = req.body;

        const order = await prisma.order.create({
            data: {
                id,
                customerName,
                customerEmail,
                totalAmount: parseFloat(totalAmount),
                currency,
                paymentMethod,
                status: status || 'Pending',
                date: new Date(date),
                items: JSON.stringify(items)
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Get All Orders
router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { date: 'desc' }
        });

        // Parse items JSON
        const parsedOrders = orders.map(order => ({
            ...order,
            items: JSON.parse(order.items)
        }));

        res.json(parsedOrders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Update Order Status
router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        });

        res.json(order);
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

export default router;
