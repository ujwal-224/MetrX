import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

const router = express.Router();

export const seedDatabase = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Official Administrative Accounts (Admin & Inspectors)
  await prisma.user.upsert({
    where: { email: 'admin123@metrx.com' },
    update: {},
    create: {
      id: 'usr-admin-1',
      name: 'Dr. K. V. Sharma (Admin)',
      email: 'admin123@metrx.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 80 2234 5678',
      assignedZone: 'Karnataka Metrology HQ'
    }
  });

  await prisma.user.upsert({
    where: { email: 'deshmukh@metrology.gov.in' },
    update: {},
    create: {
      id: 'usr-deshmukh-1',
      name: 'Insp. R. Deshmukh',
      email: 'deshmukh@metrology.gov.in',
      password: hashedPassword,
      role: 'INSPECTOR',
      phone: '+91 94480 33120',
      inspectorBadgeId: 'LM-BLR-402',
      assignedZone: 'Ward 4 (Commercial Circle)'
    }
  });

  await prisma.user.upsert({
    where: { email: 'ksrao@metrx.com' },
    update: {},
    create: {
      id: 'usr-ksrao-1',
      name: 'Insp. K. S. Rao',
      email: 'ksrao@metrx.com',
      password: hashedPassword,
      role: 'INSPECTOR',
      phone: '+91 98452 77102',
      inspectorBadgeId: 'LM-BLR-319',
      assignedZone: 'Ward 2 (Commercial Ganj)'
    }
  });

  return { success: true, message: 'System administrative accounts initialized' };
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
