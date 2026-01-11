import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.post('/login', async (req, res) => {
    const { type, username, password } = req.body;

    try {
        if (type === 'admin') {
            // Check Super Admin
            const admin = await prisma.admin.findFirst({
                where: { id: username, password: password }
            });
            if (admin) {
                return res.json({ success: true, user: admin, role: 'super' });
            }
            return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
        }
        else if (type === 'personal' || type === 'company') {
            // Check Member (Personal or Company)
            // Note: Login page sends 'email' as 'username' usually, but let's check field usage.
            // Frontend sends { type, username: email, password }.
            const member = await prisma.member.findFirst({
                where: {
                    email: username,
                    password: password,
                    type: type // Optional: strictly check type? Yes, safer.
                }
            });

            if (member) {
                return res.json({ success: true, user: member, role: 'member' });
            }
        }
        else if (type === 'partner') {
            const partner = await prisma.partner.findFirst({
                where: { username, password }
            });
            if (partner) {
                return res.json({ success: true, user: partner, role: 'partner' });
            }
        }
        else if (type === 'agent') {
            const agent = await prisma.agent.findFirst({
                where: { username, password }
            });
            if (agent) {
                return res.json({ success: true, user: agent, role: 'agent' });
            }
        }
        else if (type === 'freelancer') {
            const freelancer = await prisma.freelancer.findFirst({
                where: { username, password }
            });
            if (freelancer) {
                return res.json({ success: true, user: freelancer, role: 'freelancer' });
            }
        }

        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password, type, companyName, businessNumber } = req.body;
    try {
        // Check existing
        const existing = await prisma.member.findUnique({ where: { email } });
        if (existing) {
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        const member = await prisma.member.create({
            data: {
                name,
                email,
                password,
                type,
                companyName,
                businessNumber
            }
        });
        res.json({ success: true, user: member });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
});

// Admin management endpoints (Create/Update Admin)
router.post('/admin/setup', async (req, res) => {
    // Only for initial setup or authorized calls
    const { id, name, password } = req.body;
    try {
        const admin = await prisma.admin.upsert({
            where: { id },
            update: { name, password },
            create: { id, name, password }
        });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ error: 'Setup failed' });
    }
});

router.get('/admin/members', async (req, res) => {
    try {
        const members = await prisma.member.findMany({
            orderBy: { createdAt: 'desc' }
        });

        // Map to match frontend expectations (date field)
        const formatted = members.map(m => ({
            ...m,
            date: m.createdAt, // Pass Date object or use .toISOString() if needed. Express handles Date serialization.
            status: 'Active' // Default status since schema doesn't have it yet, or map if added later.
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Fetch members error:", error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
});

export default router;
