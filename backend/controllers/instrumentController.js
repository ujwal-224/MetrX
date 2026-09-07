import { Instrument } from '../models/Instrument.js';
import { Shop } from '../models/Shop.js';

// @desc    Get instruments (optionally filter by shopId)
// @route   GET /api/instruments
export const getInstruments = async (req, res) => {
  try {
    const { shopId } = req.query;
    const filter = shopId ? { shopId } : {};
    const instruments = await Instrument.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: instruments.length, data: instruments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new instrument/scale
// @route   POST /api/instruments
export const registerInstrument = async (req, res) => {
  try {
    const {
      shopId,
      name,
      model,
      capacity,
      serialNumber,
      counter,
      type,
      class: scaleClass,
      photoUrl
    } = req.body;

    if (!shopId || !serialNumber || !model) {
      return res.status(400).json({ success: false, message: 'Shop ID, model, and serial number are required' });
    }

    const id = `inst-${Date.now().toString(36)}`;
    const expiresDate = new Date();
    expiresDate.setFullYear(expiresDate.getFullYear() + 1);

    const instrument = await Instrument.create({
      id,
      shopId,
      name: name || 'Electronic Countertop Scale',
      model,
      capacity: capacity || '30kg / 1g precision',
      serialNumber,
      counter: counter || 'Billing Counter 1',
      status: 'Stamping Active',
      verificationStatusText: 'Holo Seal Valid',
      daysRemaining: 365,
      totalDaysCycle: 365,
      expiresOn: expiresDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      sealNumber: `SEAL-LM-BLR-${Math.floor(1000 + Math.random() * 9000)}`,
      complianceRate: '100%',
      type: type || 'counter_scale',
      class: scaleClass || 'Class III Commercial',
      photoUrl: photoUrl || ''
    });

    // Increment registered scales count for the shop
    await Shop.findOneAndUpdate({ id: shopId }, { $inc: { registeredScalesCount: 1 } });

    return res.status(201).json({ success: true, data: instrument });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
