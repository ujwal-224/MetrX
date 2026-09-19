import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { execSync } from 'child_process';
import prisma from './config/prisma.js';
import { seedDatabase } from './routes/seedRoutes.js';

import authRoutes from './routes/authRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import instrumentRoutes from './routes/instrumentRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import seedRoutes from './routes/seedRoutes.js';
import ruleRoutes from './routes/ruleRoutes.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static uploads directory for documents/photos
app.use('/uploads', express.static('uploads'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'MetrX Legal Metrology Verification Engine API',
    version: '1.0.0',
    documentation: {
      health: '/api/health',
      auth: '/api/auth',
      shops: '/api/shops',
      instruments: '/api/instruments',
      verifications: '/api/verifications',
      certificates: '/api/certificates',
      rules: '/api/verification-rules',
      seed: '/api/seed'
    }
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'online',
      system: 'MetrX Legal Metrology Verification Engine',
      database: 'PostgreSQL (Prisma ORM)',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      status: 'database_unavailable',
      system: 'MetrX Legal Metrology Verification Engine',
      error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/instruments', instrumentRoutes);
app.use('/api/verifications', verificationRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/verification-rules', ruleRoutes);
app.use('/api/seed', seedRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

// Connect to PostgreSQL and start HTTP server
async function startServer() {
  try {
    // Ensure database tables exist by pushing Prisma schema
    try {
      console.log('[MetrX Backend] Synchronizing PostgreSQL database schema...');
      execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
      console.log('[MetrX Backend] Schema synchronized successfully.');
    } catch (pushErr) {
      console.warn('[Prisma Push Notice]', pushErr.message);
    }

    await prisma.$connect();
    console.log('[MetrX Backend] Connected to PostgreSQL via Prisma');

    // Auto-seed demo data if database is fresh
    await seedDatabase().catch((err) =>
      console.warn('[Auto-seed Notice]', err.message)
    );

    const server = app.listen(PORT, () => {
      console.log(`[MetrX Backend] Server running on http://127.0.0.1:${PORT}`);
      console.log(`[MetrX Backend] Database: PostgreSQL (Prisma ORM)`);
      console.log(`[MetrX Backend] Health check: http://127.0.0.1:${PORT}/api/health`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[MetrX Backend] Port ${PORT} is already in use.`);
      } else {
        console.error('[MetrX Backend] Server Error:', err);
      }
    });

    const shutdown = async () => {
      console.log('[MetrX Backend] Shutting down gracefully...');
      server.close();
      await prisma.$disconnect();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('[MetrX Backend] Startup Failed:', error.message);
    process.exit(1);
  }
}

startServer();
