import { Shop } from '../models/Shop.js';
import { Instrument } from '../models/Instrument.js';

// @desc    Get all shops (or filter by merchant)
// @route   GET /api/shops
export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find({}).sort({ createdAt: -1 });
    return res.json({ success: true, count: shops.length, data: shops });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single shop by ID with its instruments
// @route   GET /api/shops/:id
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findOne({ id: req.params.id });
    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }
    const instruments = await Instrument.find({ shopId: shop.id });
    return res.json({
      success: true,
      data: {
        ...shop.toObject(),
        instruments
      }
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
      name,
      ownerName,
      branchType,
      merchantUid,
      tradeLicense,
      gstin,
      shopActReg,
      zone,
      address,
      phone
    } = req.body;

    const id = `shop-${Date.now().toString(36)}`;

    const shop = await Shop.create({
      id,
      name,
      ownerName,
      branchType: branchType || 'Main Commercial Branch',
      merchantUid: merchantUid || `#EST-${Math.floor(10000 + Math.random() * 90000)}`,
      tradeLicense,
      gstin,
      shopActReg,
      zone: zone || 'Ward 4 (Commercial Circle)',
      address,
      phone,
      documentStatus: 'pending'
    });

    return res.status(201).json({ success: true, data: shop });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update shop compliance & document status
// @route   PATCH /api/shops/:id/document-status
export const updateShopDocumentStatus = async (req, res) => {
  try {
    const { documentStatus, complianceStatus } = req.body;
    const shop = await Shop.findOneAndUpdate(
      { id: req.params.id },
      {
        $set: {
          documentStatus: documentStatus || 'verified',
          complianceStatus: complianceStatus || 'Documents Verified'
        }
      },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ success: false, message: 'Shop not found' });
    }

    return res.json({ success: true, data: shop });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
