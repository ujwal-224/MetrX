import prisma from '../config/prisma.js';
import { sendVerificationScheduledEmail } from '../services/mailService.js';

// @desc    Get all verification requests (optionally by shopId)
// @route   GET /api/verifications
export const getVerifications = async (req, res) => {
  try {
    const { shopId } = req.query;
    const where = shopId ? { shopId } : {};
    const verifications = await prisma.verification.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ success: true, count: verifications.length, data: verifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new verification request / schedule visit
// @route   POST /api/verifications
export const createVerification = async (req, res) => {
  try {
    const {
      shopId,
      shopName,
      ownerName,
      address,
      phone,
      instrumentId,
      instrumentName,
      serialNumber,
      requestedSlot,
      assignedInspector,
      inspectorBadge
    } = req.body;

    const id = `VR-${Date.now().toString().slice(-6)}`;
    const slotBookingRef = requestedSlot?.bookingRef || `SLOT-LM-${Math.floor(1000 + Math.random() * 9000)}`;

    // Ensure target shop exists in PostgreSQL
    let targetShop = await prisma.shop.findFirst({
      where: {
        OR: [
          { id: shopId },
          { shopCode: shopId },
          { name: shopName }
        ]
      }
    });

    if (!targetShop) {
      // Create fallback shop if not found
      targetShop = await prisma.shop.create({
        data: {
          id: shopId || `shop-${Date.now()}`,
          name: shopName || 'Commercial Establishment',
          ownerName: ownerName || 'Proprietor',
          tradeLicense: `BBMP/TL/2025/${Math.floor(1000 + Math.random() * 9000)}`,
          merchantUid: `#EST-${Math.floor(10000 + Math.random() * 90000)}`,
          address: address || 'Commercial Circle, Bengaluru',
          phone: phone || '+91 98000 00000',
          assignedInspector: assignedInspector || 'Insp. R. Deshmukh',
          inspectorBadge: inspectorBadge || 'LM-BLR-402'
        }
      });
    }

    const verification = await prisma.verification.create({
      data: {
        id,
        requestCode: id,
        shopId: targetShop.id,
        shopName: shopName || targetShop.name,
        ownerName: ownerName || targetShop.ownerName,
        address: address || targetShop.address,
        phone: phone || targetShop.phone,
        instrumentId: null, // set optional to avoid foreign key errors on unlinked instruments
        instrumentName: instrumentName || 'Electronic Countertop Scale',
        serialNumber: serialNumber || '#KA-BLR-88412',
        assignedInspector: assignedInspector || targetShop.assignedInspector || 'Insp. R. Deshmukh',
        inspectorBadge: inspectorBadge || targetShop.inspectorBadge || 'LM-BLR-402',
        step: 2, // 2: Scheduled
        status: 'Verification Scheduled',
        slotDate: requestedSlot?.date || 'Tomorrow',
        slotTime: requestedSlot?.time || 'Morning (09:30 - 12:30)',
        bookingRef: slotBookingRef,
        isPaid: true,
        feeAmount: 850.0,
        paymentMethod: 'UPI'
      }
    });

    // Update shop compliance status in PostgreSQL
    await prisma.shop.update({
      where: { id: targetShop.id },
      data: {
        complianceStatus: 'Verification Visit Scheduled'
      }
    }).catch((err) => console.warn('[Shop Compliance Status Update Error]', err.message));

    // Send notification email asynchronously via Nodemailer
    sendVerificationScheduledEmail(phone ? 'merchant@store.com' : 'merchant@store.com', {
      shopName: verification.shopName,
      slotDate: verification.slotDate,
      slotTime: verification.slotTime,
      inspectorName: verification.assignedInspector,
      bookingRef: verification.bookingRef
    }).catch((err) => console.warn('[Email Notify Failed]', err.message));

    return res.status(201).json({
      success: true,
      data: {
        ...verification,
        requestedSlot: {
          date: verification.slotDate,
          time: verification.slotTime,
          bookingRef: verification.bookingRef
        }
      }
    });
  } catch (error) {
    console.error('[Create Verification Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update verification step (e.g., advancing through 5 steps)
// @route   PATCH /api/verifications/:id/step
export const updateVerificationStep = async (req, res) => {
  try {
    const { step, status } = req.body;
    const verification = await prisma.verification.update({
      where: { id: req.params.id },
      data: {
        step: Number(step),
        status: status || 'In Progress'
      }
    });

    return res.json({ success: true, data: verification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
