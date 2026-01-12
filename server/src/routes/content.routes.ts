import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const prisma = new PrismaClient();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        const uploadPath = path.join(__dirname, '../../uploads/contents');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req: any, file: any, cb: any) => {
        // Enforce safe filename, but keep extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Upload Endpoint (Single)
router.post('/upload', upload.single('file'), (req: any, res: any) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/contents/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// Upload Endpoint (Multiple)
router.post('/upload-multiple', upload.array('files', 10), (req: any, res: any) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
    }
    const fileUrls = req.files.map((file: any) => `/uploads/contents/${file.filename}`);
    res.json({ urls: fileUrls });
});

// Get all contents (Newest first)
router.get('/', async (req, res) => {
    try {
        const contents = await prisma.content.findMany({
            orderBy: { createdAt: 'desc' },
            include: { purchases: true } // Include to check purchase status frontend-side if needed
        });
        res.json(contents);
    } catch (error) {
        console.error("Failed to fetch contents:", error);
        res.status(500).json({ error: "Failed to fetch contents" });
    }
});

// Get single content
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const content = await prisma.content.findUnique({
            where: { id },
            include: { purchases: true }
        });
        if (!content) {
            return res.status(404).json({ error: "Content not found" });
        }
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch content" });
    }
});

// Create content
router.post('/', async (req, res) => {
    try {
        const { userId, userName, title, description, thumbnailUrl, contentUrl, price, detailImages } = req.body;
        const newContent = await prisma.content.create({
            data: {
                userId,
                userName,
                title,
                description,
                thumbnailUrl,
                contentUrl,
                detailImages: typeof detailImages === 'object' ? JSON.stringify(detailImages) : (detailImages || "[]"),
                price: Number(price)
            }
        });
        res.json(newContent);
    } catch (error) {
        console.error("Failed to create content:", error);
        res.status(500).json({ error: "Failed to create content" });
    }
});

// Purchase content
router.post('/:id/purchase', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, amount } = req.body;

        // Create new purchase record (Always allow repurchase)
        const purchase = await prisma.contentPurchase.create({
            data: {
                contentId: id,
                userId,
                amount: Number(amount)
            }
        });

        // Create ContentRequest for Admin visibility
        const content = await prisma.content.findUnique({ where: { id } });
        let buyerName = 'Unknown';
        let buyerContact = '';
        let buyerType = 'personal';

        // Try to fetch buyer details (assuming Member)
        try {
            const member = await prisma.member.findUnique({ where: { id: Number(userId) } });
            if (member) {
                buyerName = member.name;
                buyerContact = member.email;
                buyerType = member.type.toLowerCase();
            }
        } catch (e) {
            console.log("Could not fetch member details for request creation", e);
        }

        console.log(`[Purchase] Creating request for user ${userId}, content ${id}`);

        if (content) {
            try {
                // Always create a new request for every purchase
                const newRequest = await prisma.contentRequest.create({
                    data: {
                        freelancerId: content.userId,
                        freelancerName: content.userName,
                        userId: userId,
                        userName: buyerName,
                        contactInfo: buyerContact,
                        message: `Paid Content Purchase: ${content.title}`,
                        requesterType: buyerType,
                        status: 'Paid',
                        date: new Date().toISOString()
                    }
                });
                console.log(`[Purchase] Request created: ${newRequest.id}`);
            } catch (createError) {
                console.error("[Purchase] Failed to create ContentRequest:", createError);
            }
        } else {
            console.error("[Purchase] Content not found for request creation");
        }

        res.json(purchase);
    } catch (error) {
        console.error("Purchase failed:", error);
        res.status(500).json({ error: "Purchase failed" });
    }
});

// Update content
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, thumbnailUrl, contentUrl, detailImages, price } = req.body;

        const updatedContent = await prisma.content.update({
            where: { id },
            data: {
                title,
                description,
                thumbnailUrl,
                contentUrl,
                detailImages: typeof detailImages === 'object' ? JSON.stringify(detailImages) : (detailImages || "[]"),
                price: Number(price)
            }
        });
        res.json(updatedContent);
    } catch (error) {
        console.error("Failed to update content:", error);
        res.status(500).json({ error: "Failed to update content" });
    }
});

// Delete content
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.content.delete({
            where: { id }
        });
        res.json({ message: "Content deleted successfully" });
    } catch (error) {
        console.error("Failed to delete content:", error);
        res.status(500).json({ error: "Failed to delete content" });
    }
});

// Get user likes
router.get('/user/:userId/likes', async (req, res) => {
    try {
        const { userId } = req.params;
        const favorites = await prisma.contentFavorite.findMany({
            where: { userId },
            select: { contentId: true }
        });
        res.json(favorites.map(f => f.contentId));
    } catch (error) {
        console.error("Failed to fetch likes:", error);
        res.status(500).json({ error: "Failed to fetch likes" });
    }
});

// Toggle Like (easier to handle toggle in one or separate)
// Let's do separate for clarity or toggle if requested. 
// User asked for "click interest button", implies toggle.
router.post('/:id/like', async (req, res) => {
    try {
        const { id } = req.params; // contentId
        const { userId } = req.body;

        const existing = await prisma.contentFavorite.findUnique({
            where: {
                userId_contentId: {
                    userId,
                    contentId: id
                }
            }
        });

        if (existing) {
            // Unlike
            await prisma.contentFavorite.delete({
                where: {
                    userId_contentId: {
                        userId,
                        contentId: id
                    }
                }
            });
            res.json({ liked: false });
        } else {
            // Like
            await prisma.contentFavorite.create({
                data: {
                    userId,
                    contentId: id
                }
            });
            res.json({ liked: true });
        }
    } catch (error) {
        console.error("Like failed:", error);
        res.status(500).json({ error: "Like failed" });
    }
});

// Delete Purchase
router.delete('/purchases/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.contentPurchase.delete({
            where: { id }
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Delete purchase failed:", error);
        res.status(500).json({ error: "Failed to delete purchase" });
    }
});

export default router;
