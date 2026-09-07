import express from 'express';
import { User } from '../models/User.js';
import { Shop } from '../models/Shop.js';
import { Instrument } from '../models/Instrument.js';
import { Verification } from '../models/Verification.js';
import { Certificate } from '../models/Certificate.js';

const router = express.Router();

// @desc    Seed demo database data
// @route   POST /api/seed
router.post('/', async (req, res) => {
  try {
    // 1. Clear existing collections
    await User.deleteMany({});
    await Shop.deleteMany({});
    await Instrument.deleteMany({});
    await Verification.deleteMany({});
    await Certificate.deleteMany({});

    // 2. Create Users
    const merchantUser = await User.create({
      name: 'Shree S. N. Ganesh',
      email: 'ganesh@store.com',
      password: 'password123',
      role: 'shop-owner',
      phone: '+91 98450 21980',
      assignedZone: 'Ward 4 (Commercial Circle)'
    });

    const inspectorUser = await User.create({
      name: 'Insp. R. Deshmukh',
      email: 'deshmukh@metrology.gov.in',
      password: 'password123',
      role: 'inspector',
      phone: '+91 94480 33120',
      inspectorBadgeId: 'LM-BLR-402',
      assignedZone: 'Ward 4 (Commercial Circle)'
    });

    const adminUser = await User.create({
      name: 'State Metrology Director',
      email: 'admin123@metrx.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 80 2234 5678',
      assignedZone: 'Karnataka Metrology HQ'
    });

    // 3. Create Shop
    const shop = await Shop.create({
      owner: merchantUser._id,
      id: 'shop-ganesh-1',
      name: 'Shree Ganesh General Store',
      ownerName: 'Shree S. N. Ganesh',
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
      documents: [
        { docType: 'Trade License (BBMP)', fileName: 'BBMP_Trade_License_2023.pdf', fileUrl: '/uploads/trade_license.pdf', status: 'Approved' },
        { docType: 'Shop & Establishment Act', fileName: 'Shop_Act_KA_44091.pdf', fileUrl: '/uploads/shop_act.pdf', status: 'Approved' },
        { docType: 'GSTIN Certificate', fileName: 'GST_29AABCU9603.pdf', fileUrl: '/uploads/gst.pdf', status: 'Approved' }
      ]
    });

    // 4. Create Instruments
    const inst1 = await Instrument.create({
      shopId: 'shop-ganesh-1',
      id: 'inst-1',
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
    });

    const inst2 = await Instrument.create({
      shopId: 'shop-ganesh-1',
      id: 'inst-2',
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
    });

    // 5. Create Verification Request
    const verification = await Verification.create({
      id: 'VR-88412',
      shopId: 'shop-ganesh-1',
      shopName: 'Shree Ganesh General Store',
      ownerName: 'Shree S. N. Ganesh',
      address: '14 Market Road, Commercial Circle, Bengaluru - 560001',
      phone: '+91 98450 21980',
      instrumentId: 'inst-1',
      instrumentName: 'Electronic Countertop Scale (Contech CA-30)',
      serialNumber: '#KA-BLR-88412',
      assignedInspector: 'Insp. R. Deshmukh',
      inspectorBadge: 'LM-BLR-402',
      step: 2,
      status: 'Verification Scheduled',
      requestedSlot: {
        date: 'Tomorrow, 14 Jan 2025',
        time: 'Morning (09:30 - 12:30)',
        bookingRef: 'SLOT-LM-44091'
      },
      payment: {
        isPaid: true,
        amount: 850,
        method: 'UPI',
        reference: 'UPI/2025/METRA/99042'
      }
    });

    // 6. Create Certificate
    const certificate = await Certificate.create({
      certId: 'CERT-KA-2024-9921',
      ruleForm: 'Form XVII (Rule 14)',
      actYear: 'Legal Metrology Act, 2009',
      shopId: 'shop-ganesh-1',
      shopName: 'Shree Ganesh General Store',
      instrumentModel: 'Contech CA-30 (Max 30kg, e=1g)',
      serialNumber: '#KA-BLR-88412',
      verifiedDate: '13 Jan 2024',
      validUntil: '12 Jan 2025',
      inspectorSeal: 'SEAL-LM-BLR-0428',
      inspectorName: 'Insp. R. Deshmukh',
      inspectorBadge: 'LM-BLR-402',
      statusBadge: 'CERTIFIED & COMPLIANT',
      workingStandardRef: 'STD/KA/2024/0081 (Calibrated at NPL)',
      remarks: '4-Point MPE tested with Class M1 reference weights. Holographic wire seal applied.',
      testObservations: [
        { load: '0.000 kg', indication: '0.000 kg', error: '0.0 g', mpe: '± 1.0 g', pass: true },
        { load: '5.000 kg', indication: '5.000 kg', error: '0.0 g', mpe: '± 1.0 g', pass: true },
        { load: '15.000 kg', indication: '15.001 kg', error: '+1.0 g', mpe: '± 2.0 g', pass: true },
        { load: '30.000 kg', indication: '30.000 kg', error: '0.0 g', mpe: '± 2.0 g', pass: true }
      ]
    });

    return res.json({
      success: true,
      message: 'MetrX database successfully seeded with initial accounts and records!',
      data: {
        users: 3,
        shops: 1,
        instruments: 2,
        verifications: 1,
        certificates: 1,
        demoAccounts: [
          { role: 'shop-owner', email: 'ganesh@store.com', password: 'password123' },
          { role: 'inspector', email: 'deshmukh@metrology.gov.in', password: 'password123' },
          { role: 'admin', email: 'admin123@metrx.com', password: 'password123' }
        ]
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
