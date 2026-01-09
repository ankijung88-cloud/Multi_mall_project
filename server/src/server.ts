import express from 'express';
import cors from 'cors';
import prisma from './db';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import partnerRoutes from './routes/partner.routes';
import agentRoutes from './routes/agent.routes';
import freelancerRoutes from './routes/freelancer.routes';

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/freelancers', freelancerRoutes);

// Basic health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper to resolve path relative to current module (shim for dirname in commonjs/module mix if needed, but here simple path is fine)
import path from 'path';

// Serve static files from the React frontend app
const clientBuildPath = path.join(__dirname, '../../dist');
app.use(express.static(clientBuildPath));

// Anything that doesn't match the above, send back index.html
app.get(/(.*)/, (req, res) => {
    // Check if it's an API call or health check that fell through
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    const indexPath = path.join(clientBuildPath, 'index.html');
    if (require('fs').existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('Frontend build not found. Please run npm run build in the client directory.');
    }
});



// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { app, prisma };
