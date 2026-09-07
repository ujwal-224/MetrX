import { Certificate } from '../models/Certificate.js';
import { Instrument } from '../models/Instrument.js';

// @desc    Get all certificates (or filter by shopId)
// @route   GET /api/certificates
export const getCertificates = async (req, res) => {
  try {
    const { shopId } = req.query;
    const filter = shopId ? { shopId } : {};
    const certificates = await Certificate.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, count: certificates.length, data: certificates });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Lookup certificate by Cert ID (Public Verification QR code check)
// @route   GET /api/certificates/lookup/:certId
export const lookupCertificate = async (req, res) => {
  try {
    const { certId } = req.params;
    const certificate = await Certificate.findOne({
      certId: { $regex: new RegExp(`^${certId.trim()}$`, 'i') }
    });

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Official Metrological Certificate not found in state register' });
    }

    return res.json({ success: true, data: certificate });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Issue a new official Form XVII certificate (Inspector Inspection Completion)
// @route   POST /api/certificates/issue
export const issueCertificate = async (req, res) => {
  try {
    const {
      shopId,
      shopName,
      instrumentModel,
      serialNumber,
      inspectorName,
      inspectorBadge,
      remarks,
      testObservations
    } = req.body;

    const certId = `CERT-KA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const verifiedDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const expiryDateObj = new Date();
    expiryDateObj.setFullYear(expiryDateObj.getFullYear() + 1);
    const validUntil = expiryDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const inspectorSeal = `SEAL-LM-BLR-${Math.floor(1000 + Math.random() * 9000)}`;

    const certificate = await Certificate.create({
      certId,
      ruleForm: 'Form XVII (Rule 14)',
      actYear: 'Legal Metrology Act, 2009',
      shopId: shopId || 'shop-ganesh-1',
      shopName: shopName || 'Shree Ganesh General Store',
      instrumentModel: instrumentModel || 'Contech CA-30 (Max 30kg, e=1g)',
      serialNumber: serialNumber || '#KA-BLR-88412',
      verifiedDate,
      validUntil,
      inspectorSeal,
      inspectorName: inspectorName || 'Insp. R. Deshmukh',
      inspectorBadge: inspectorBadge || 'LM-BLR-402',
      statusBadge: 'CERTIFIED & COMPLIANT',
      workingStandardRef: 'STD/KA/2025/0081 (Calibrated at NPL)',
      remarks: remarks || '4-Point MPE tested with Class M1 reference weights. Holographic wire seal applied.',
      testObservations: testObservations || []
    });

    // Update the corresponding instrument to 365 days and new seal
    await Instrument.findOneAndUpdate(
      { serialNumber },
      {
        $set: {
          daysRemaining: 365,
          expiresOn: validUntil,
          sealNumber: inspectorSeal,
          status: 'Stamping Active',
          verificationStatusText: 'Holo Seal Valid'
        }
      }
    );

    return res.status(201).json({ success: true, data: certificate });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
