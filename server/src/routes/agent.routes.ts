import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Agents
router.get('/', async (req, res) => {
    try {
        const agents = await prisma.agent.findMany({
            include: { schedules: true }
        });
        res.json(agents);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch agents' });
    }
});

router.post('/', async (req, res) => {
    const { schedules, credentials, ...data } = req.body;

    // Spread credentials if they exist
    const agentData = {
        ...data,
        username: credentials?.username,
        password: credentials?.password
    };

    try {
        const agent = await prisma.agent.create({
            data: {
                ...agentData,
                schedules: { create: schedules || [] }
            },
            include: { schedules: true }
        });
        res.json(agent);
    } catch (error) {
        console.error("Create agent error:", error);
        res.status(500).json({ error: 'Failed to create agent' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { schedules, ...data } = req.body;
    try {
        const agent = await prisma.agent.update({
            where: { id: Number(id) },
            data: data
        });
        res.json(agent);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update agent' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.agent.delete({ where: { id: Number(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete agent' });
    }
});

// Agent Requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await prisma.agentRequest.findMany();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

router.post('/requests', async (req, res) => {
    try {
        const request = await prisma.agentRequest.create({
            data: req.body
        });
        res.json(request);
    } catch (error: any) {
        console.error("Agent Request Create Error:", error);
        // Write error to log file for debugging
        try {
            const fs = require('fs');
            const path = require('path');
            fs.writeFileSync(path.join(process.cwd(), 'server_error_log.txt'),
                JSON.stringify({
                    message: error.message,
                    code: error.code,
                    meta: error.meta,
                    stack: error.stack,
                    body: req.body // Log the payload too!
                }, null, 2)
            );
        } catch (e) {
            console.error("Failed to write error log:", e);
        }

        res.status(500).json({
            error: 'Failed to create request',
            details: error.message,
            code: error.code,
            meta: error.meta
        });
    }
});

router.put('/requests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await prisma.agentRequest.update({
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
        await prisma.agentRequest.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete request' });
    }
});

export default router;
