import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

const router = express.Router();

export const seedDatabase = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Official Super-Admin Account ONLY
  await prisma.user.upsert({
    where: { email: 'admin123@metrx.com' },
    update: {},
    create: {
      id: 'usr-admin-1',
      name: 'Admin',
      email: 'admin123@metrx.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 80 2234 5678',
      assignedZone: 'Karnataka Metrology HQ'
    }
  });

  return { success: true, message: 'Super-Admin account initialized' };
};

// @desc    Seed demo database data
// @route   POST /api/seed
router.post('/', async (req, res) => {
  try {
    const result = await seedDatabase();
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Seed Database Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
