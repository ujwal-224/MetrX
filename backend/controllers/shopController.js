import prisma from '../config/prisma.js';

// @desc    Get all shops (or filter by merchant)
// @route   GET /api/shops
export const getShops = async (req, res) => {
  try {
    const shops = await prisma.shop.findMany({
      include: {
        instruments: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, count: shops.length, data: shops });
  } catch (error) {
    console.error('[Get Shops Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single shop by ID with its instruments
// @route   GET /api/shops/:id
export const getShopById = async (req, res) => {
  try {
    const shop = await prisma.shop.findFirst({
      where: {
        OR: [
          { id: req.params.id },
          { shopCode: req.params.id }
        ]
      },
      include: {
        instruments: true,
        verifications: true,
        certificates: true
      }
    });

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    return res.json({
      success: true,
      data: shop
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new shop establishment
// @route   POST /api/shops
export const createShop = async (req, res) => {
  try {
    const {
      id: customId,
      name,
      ownerName,
      email,
      branchType,
      merchantUid,
      tradeLicense,
      gstin,
      shopActReg,
      zone,
      address,
      phone,
      registeredScalesCount,
      assignedInspector,
      inspectorBadge,
      complianceStatus,
      documentStatus,
      scaleModel,
      scaleType
    } = req.body;

    const id = customId || `shop-${Date.now().toString(36)}`;
    const uid = merchantUid || `#EST-${Math.floor(10000 + Math.random() * 90000)}`;

    const shop = await prisma.shop.create({
      data: {
        id,
        shopCode: id,
        name: name || 'Commercial Establishment',
        ownerName: ownerName || 'Proprietor',
        email: email || '',
        branchType: branchType || 'Main Commercial Branch',
        merchantUid: uid,
        tradeLicense: tradeLicense || `BBMP/TL/2025/${Math.floor(1000 + Math.random() * 9000)}`,
        gstin: gstin || '',
        shopActReg: shopActReg || '',
        zone: zone || 'Ward 4 (Commercial Circle)',
        address: address || 'Commercial Circle, Bengaluru',
        phone: phone || '+91 98000 00000',
        assignedInspector: assignedInspector || 'Pending Admin Allocation',
        inspectorBadge: inspectorBadge || 'LM-PENDING',
        status: 'Active Commercial Establishment',
        complianceStatus: complianceStatus || 'Pending Inspector Assignment',
        documentStatus: documentStatus || 'not_uploaded',
        registeredScalesCount: Number(registeredScalesCount) || 1
      }
    });

    // Automatically provision initial instrument scale in PostgreSQL
    const instId = `inst-${Date.now()}`;
    await prisma.instrument.create({
      data: {
        id: instId,
        shopId: shop.id,
        instrumentCode: instId,
        name: `${scaleType || 'Electronic Counter'} Scale`,
        model: scaleModel || 'Digital Metrology Model 2025',
        capacity: '30kg / 1g precision',
        serialNumber: `#KA-BLR-${Math.floor(10000 + Math.random() * 90000)}`,
        counter: 'Counter 1',
        status: 'Initial Verification Due',
        verificationStatusText: 'Stamping Pending Inspection',
        daysRemaining: 30,
        totalDaysCycle: 365,
        expiresOn: 'Within 30 Days',
        sealNumber: 'SEAL-PENDING',
        complianceRate: '100%',
        type: 'counter_scale',
        class: 'Class III Commercial'
      }
    }).catch((err) => console.warn('[Prisma Instrument Init Error]', err.message));

    return res.status(201).json({ success: true, data: shop });
  } catch (error) {
    console.error('[Create Shop Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin assigns / reassigns inspector to a shop
// @route   PATCH /api/shops/:id/assign-inspector
export const assignInspectorToShop = async (req, res) => {
  try {
    const { inspectorName, inspectorBadge } = req.body;

    if (!inspectorName) {
      return res.status(400).json({ success: false, message: 'Inspector name is required' });
    }

    const shop = await prisma.shop.update({
      where: { id: req.params.id },
      data: {
        assignedInspector: inspectorName,
        inspectorBadge: inspectorBadge || 'LM-BLR-402',
        complianceStatus: 'Inspector Assigned'
      }
    });

    return res.json({
      success: true,
      message: `Assigned ${inspectorName} to ${shop.name}`,
      data: shop
    });
  } catch (error) {
    console.error('[Assign Inspector Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Shop Owner uploads statutory compliance documents
// @route   POST /api/shops/:id/documents
export const uploadShopDocuments = async (req, res) => {
  try {
    const { docs, documentStatus, complianceStatus, remarks } = req.body;

    const shop = await prisma.shop.update({
      where: { id: req.params.id },
      data: {
        documentStatus: documentStatus || 'pending_review',
        complianceStatus: complianceStatus || 'Documents Submitted - Pending Review',
        documentSubmissionData: docs,
        documentsRemarks: remarks || 'All 5 statutory documents submitted by merchant. Awaiting physical inspection clearance by Inspector.'
      }
    });

    return res.json({
      success: true,
      message: 'Documents uploaded and queued for Inspector verification',
      data: shop
    });
  } catch (error) {
    console.error('[Upload Documents Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Inspector reviews & verifies shop statutory documents
// @route   PATCH /api/shops/:id/document-status
export const updateShopDocumentStatus = async (req, res) => {
  try {
    const { documentStatus, complianceStatus, remarks, reviewedBy } = req.body;

    const isApproved = documentStatus === 'verified';

    const shop = await prisma.shop.update({
      where: { id: req.params.id },
      data: {
        documentStatus: documentStatus || 'verified',
        complianceStatus: complianceStatus || (isApproved ? 'Documents Verified' : 'Flagged as Fraud / Counterfeit'),
        documentsRemarks: remarks || (isApproved ? 'All 5 statutory documents & instrument plate serial match standard specifications.' : 'Discrepancy detected in model plate/invoice. Flagged as Fraud under LM Act 2009.'),
        reviewedBy: reviewedBy || 'Insp. R. Deshmukh'
      }
    });

    return res.json({
      success: true,
      message: `Documents marked as ${documentStatus}`,
      data: shop
    });
  } catch (error) {
    console.error('[Update Doc Status Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
