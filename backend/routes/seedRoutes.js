import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

const router = express.Router();

export const seedDatabase = async () => {
  // Check if shops already exist
  const existingShops = await prisma.shop.count();
  if (existingShops > 0) {
    return { alreadySeeded: true };
  }

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Users
  const merchantUser = await prisma.user.upsert({
    where: { email: 'ganesh@store.com' },
    update: {},
    create: {
      id: 'usr-ganesh-1',
      name: 'Shree S. N. Ganesh',
      email: 'ganesh@store.com',
      password: hashedPassword,
      role: 'SHOP_OWNER',
      phone: '+91 98450 21980',
      assignedZone: 'Ward 4 (Commercial Circle)'
    }
  });

  const inspectorUser = await prisma.user.upsert({
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

  // 2. Create Initial Shop (Shree Ganesh General Store)
  const shop = await prisma.shop.upsert({
    where: { merchantUid: '#EST-44091' },
    update: {},
    create: {
      id: 'shop-ganesh-1',
      shopCode: 'shop-ganesh-1',
      ownerId: merchantUser.id,
      name: 'Shree Ganesh General Store',
      ownerName: 'Shree S. N. Ganesh',
      email: 'ganesh@store.com',
      branchType: 'Main Commercial Branch',
      merchantUid: '#EST-44091',
      tradeLicense: 'BBMP/TL/2023/9081',
      gstin: '29AABCU9603R1ZM',
      shopActReg: 'KA/BLR/44091/2023',
      zone: 'Ward 4 (Commercial Circle)',
      address: '14 Market Road, Commercial Circle, Bengaluru - 560001',
      phone: '+91 98450 21980',
      assignedInspector: 'Insp. R. Deshmukh',
      inspectorBadge: 'LM-BLR-402',
      status: 'Active Commercial Establishment',
      complianceStatus: 'Documents Verified',
      documentStatus: 'verified',
      registeredScalesCount: 2,
      documentsRemarks: 'All 5 statutory documents verified.',
      reviewedBy: 'Insp. R. Deshmukh',
      documentSubmissionData: {
        businessRegistration: { title: 'Business Registration', fileName: 'BBMP_Trade_License_2023_9081.pdf', fileSize: '1.8 MB', status: 'Approved' },
        ownerId: { title: 'Owner ID Proof', fileName: 'Shree_Ganesh_Aadhaar_Card.pdf', fileSize: '1.2 MB', status: 'Approved' },
        purchaseInvoice: { title: 'Purchase Invoice', fileName: 'Contech_CA30_Tax_Invoice_Bill.pdf', fileSize: '2.4 MB', status: 'Approved' },
        instrumentPlate: { title: 'Instrument Plate Photo', fileName: 'Contech_Spec_Nameplate_Photo.jpg', fileSize: '3.1 MB', status: 'Approved' },
        instrumentPhotos: { title: 'Instrument Photos', fileName: 'Counter_Scale_Front_Installation.jpg', fileSize: '4.5 MB', status: 'Approved' }
      }
    }
  });

  // 3. Create Instruments
  const inst1 = await prisma.instrument.upsert({
    where: { serialNumber: '#KA-BLR-88412' },
    update: {},
    create: {
      id: 'inst-1',
      shopId: shop.id,
      instrumentCode: 'inst-1',
      name: 'Electronic Countertop Scale',
      model: 'Contech CA-30',
      capacity: '30kg / 1g precision',
      serialNumber: '#KA-BLR-88412',
      counter: 'Billing Counter 1',
      status: 'Stamping Active',
      verificationStatusText: 'Holo Seal Valid',
      daysRemaining: 28,
      totalDaysCycle: 365,
      expiresOn: '13 Feb 2025',
      sealNumber: 'SEAL-LM-BLR-0428',
      complianceRate: '100%',
      type: 'counter_scale',
      class: 'Class III Commercial'
    }
  });

  await prisma.instrument.upsert({
    where: { serialNumber: '#KA-BLR-99304' },
    update: {},
    create: {
      id: 'inst-2',
      shopId: shop.id,
      instrumentCode: 'inst-2',
      name: 'Platform Heavy Scale',
      model: 'Contech CP-100',
      capacity: '100kg / 10g precision',
      serialNumber: '#KA-BLR-99304',
      counter: 'Goods Receipt Area',
      status: 'Stamping Active',
      verificationStatusText: 'Holo Seal Valid',
      daysRemaining: 94,
      totalDaysCycle: 365,
      expiresOn: '18 Apr 2025',
      sealNumber: 'SEAL-LM-BLR-0489',
      complianceRate: '100%',
      type: 'platform_scale',
      class: 'Class III Commercial'
    }
  });

  // 4. Create Initial Certificate
  await prisma.certificate.upsert({
    where: { certId: 'CERT-KA-2024-9921' },
    update: {},
    create: {
      id: 'cert-1',
      certId: 'CERT-KA-2024-9921',
      ruleForm: 'Form XVII (Rule 14)',
      actYear: 'Legal Metrology Act, 2009',
      shopId: shop.id,
      instrumentModel: 'Contech CA-30 (Max 30kg, e=1g)',
      serialNumber: '#KA-BLR-88412',
      verifiedDate: '13 Jan 2024',
      validUntil: '12 Jan 2025',
      inspectorSeal: 'SEAL-LM-BLR-0428',
      inspectorName: 'Insp. R. Deshmukh',
      inspectorBadge: 'LM-BLR-402',
      statusBadge: 'CERTIFIED & COMPLIANT',
      workingStandardRef: 'STD/KA/2024/0081 (Calibrated at NPL)',
      remarks: '4-Point MPE tested with Class M1 reference weights. Holographic wire seal applied.'
    }
  });

  return { success: true, message: 'Seeded demo data into PostgreSQL' };
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
