import prisma from '../config/prisma.js';
import { generateCertificateQR } from '../services/qrService.js';
import { generateCertificatePDF } from '../services/pdfService.js';
import { evaluateCertificateStatus } from '../services/rulesEngineService.js';

// @desc    Get all certificates
// @route   GET /api/certificates
export const getCertificates = async (req, res) => {
  try {
    const { shopId } = req.query;
    const where = shopId ? { shopId } : {};
    const certificates = await prisma.certificate.findMany({
      where,
      include: { shop: true },
      orderBy: { createdAt: 'desc' }
    });
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
    const cleanId = certId.trim();

    const certificate = await prisma.certificate.findFirst({
      where: {
        certId: {
          equals: cleanId,
          mode: 'insensitive'
        }
      },
      include: { shop: true }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        status: 'NOT_FOUND',
        statusBadge: '? NOT FOUND',
        message: 'Official Metrological Certificate not found in state register'
      });
    }

    // Determine real-time validity status based on certificate expiry
    const isExplicitlyRevoked = certificate.status === 'REVOKED';
    const statusEvaluation = evaluateCertificateStatus(
      certificate.validUntilTimestamp || certificate.validUntil,
      isExplicitlyRevoked
    );

    return res.json({
      success: true,
      data: {
        ...certificate,
        currentStatus: statusEvaluation.status,
        statusBadge: statusEvaluation.badge,
        statusColor: statusEvaluation.color,
        statusMessage: statusEvaluation.message,
        daysRemaining: statusEvaluation.daysLeft,
        isExpired: statusEvaluation.status === 'EXPIRED',
        isExpiringSoon: statusEvaluation.status === 'EXPIRING_SOON',
        isRevoked: statusEvaluation.status === 'REVOKED',
        shopName: certificate.shop?.name || 'Authorized Establishment',
        shopAddress: certificate.shop?.address || 'Commercial Circle, Bengaluru',
        tradeLicense: certificate.shop?.tradeLicense || 'BBMP/TL/2023/9081',
        applicableStandard: certificate.applicableStandard || 'Legal Metrology (General) Rules, 2011 - Seventh Schedule',
        ruleName: certificate.ruleName || 'Electronic Weighing Instrument Verification Scheme'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download Form XVII Certificate PDF with embedded QR Code
// @route   GET /api/certificates/:certId/download-pdf
export const downloadCertificatePDF = async (req, res) => {
  try {
    const { certId } = req.params;
    const cleanId = certId.trim();

    const cert = await prisma.certificate.findFirst({
      where: {
        certId: {
          equals: cleanId,
          mode: 'insensitive'
        }
      },
      include: { shop: true }
    });

    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate record not found' });
    }

    const certDetails = {
      ...cert,
      shopName: cert.shop?.name || 'Authorized Merchant',
      shopAddress: cert.shop?.address || 'Commercial Circle, Bengaluru',
      tradeLicense: cert.shop?.tradeLicense || 'BBMP/TL/2023/9081'
    };

    // Generate high-resolution QR code
    const qrDataUrl = await generateCertificateQR(cert.certId, {
      shopName: certDetails.shopName,
      serialNumber: certDetails.serialNumber,
      validUntil: certDetails.validUntil
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Certificate_${cert.certId}.pdf`);

    generateCertificatePDF(certDetails, qrDataUrl, res);
  } catch (error) {
    console.error('[Download PDF Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Issue new verification certificate (Post-Inspection)
// @route   POST /api/certificates/issue
export const issueCertificate = async (req, res) => {
  try {
    const {
      certId,
      ruleForm,
      actYear,
      shopId,
      instrumentModel,
      serialNumber,
      verifiedDate,
      validUntil,
      inspectorSeal,
      inspectorName,
      inspectorBadge,
      statusBadge,
      workingStandardRef,
      remarks,
      testObservationsRaw
    } = req.body;

    const generatedId = certId || `CERT-KA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let targetShopId = shopId;
    if (!targetShopId) {
      const anyShop = await prisma.shop.findFirst();
      targetShopId = anyShop?.id;
    }
    if (!targetShopId) {
      return res.status(400).json({ success: false, message: 'No registered shop found to associate certificate' });
    }

    const cert = await prisma.certificate.create({
      data: {
        id: `cert-${Date.now()}`,
        certId: generatedId,
        ruleForm: ruleForm || 'Form XVII (Rule 14)',
        actYear: actYear || 'Legal Metrology Act, 2009',
        shopId: targetShopId,
        instrumentModel: instrumentModel || 'Electronic Countertop Scale',
        serialNumber: serialNumber || '#KA-BLR-88412',
        verifiedDate: verifiedDate || new Date().toLocaleDateString('en-GB'),
        validUntil: validUntil || '1 Year from Stamping',
        inspectorSeal: inspectorSeal || `SEAL-LM-BLR-${Math.floor(1000 + Math.random() * 9000)}`,
        inspectorName: inspectorName || 'Insp. R. Deshmukh',
        inspectorBadge: inspectorBadge || 'LM-BLR-402',
        statusBadge: statusBadge || 'CERTIFIED & COMPLIANT',
        workingStandardRef: workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)',
        remarks: remarks || '4-Point MPE tested with Class M1 reference weights.',
        testObservationsRaw: testObservationsRaw || ''
      }
    });

    // Update shop compliance status in PostgreSQL
    await prisma.shop.update({
      where: { id: targetShopId },
      data: {
        status: 'Active Commercial Establishment',
        complianceStatus: 'Certified & Compliant',
        documentStatus: 'verified'
      }
    }).catch((err) => console.warn('[Update Shop on Issue Cert Warning]', err.message));

    return res.status(201).json({ success: true, data: cert });
  } catch (error) {
    console.error('[Issue Certificate Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
