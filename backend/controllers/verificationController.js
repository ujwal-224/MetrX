import { Verification } from '../models/Verification.js';
import { sendVerificationScheduledEmail } from '../services/mailService.js';

// @desc    Get all verification requests (optionally by shopId)
// @route   GET /api/verifications
export const getVerifications = async (req, res) => {
  try {
    const { shopId } = req.query;
    const filter = shopId ? { shopId } : {};
    const verifications = await Verification.find(filter).sort({ createdAt: -1 });
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
      requestedSlot
    } = req.body;

    const id = `VR-${Date.now().toString().slice(-6)}`;

    const verification = await Verification.create({
      id,
      shopId: shopId || 'shop-ganesh-1',
      shopName: shopName || 'Shree Ganesh General Store',
      ownerName: ownerName || 'Shree S. N. Ganesh',
      address: address || '14 Market Road, Commercial Circle, Bengaluru - 560001',
      phone: phone || '+91 98450 21980',
      instrumentId: instrumentId || 'inst-1',
      instrumentName: instrumentName || 'Electronic Countertop Scale',
      serialNumber: serialNumber || '#KA-BLR-88412',
      step: 2, // 2: Scheduled
      status: 'Verification Scheduled',
      requestedSlot: {
        date: requestedSlot?.date || 'Tomorrow',
        time: requestedSlot?.time || 'Morning (09:30 - 12:30)',
        bookingRef: `SLOT-LM-${Math.floor(1000 + Math.random() * 9000)}`
      }
    });

    // Send notification email asynchronously via Nodemailer
    sendVerificationScheduledEmail(phone ? 'merchant@store.com' : 'merchant@store.com', {
      shopName: verification.shopName,
      slotDate: verification.requestedSlot?.date,
      slotTime: verification.requestedSlot?.time,
      inspectorName: verification.assignedInspector,
      bookingRef: verification.requestedSlot?.bookingRef
    }).catch((err) => console.warn('[Email Notify Failed]', err.message));

    return res.status(201).json({ success: true, data: verification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update verification step (e.g., advancing through 5 steps)
// @route   PATCH /api/verifications/:id/step
export const updateVerificationStep = async (req, res) => {
  try {
    const { step, status } = req.body;
    const verification = await Verification.findOneAndUpdate(
      { id: req.params.id },
      { $set: { step, status } },
      { new: true }
    );

    if (!verification) {
      return res.status(404).json({ success: false, message: 'Verification request not found' });
    }

    return res.json({ success: true, data: verification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
