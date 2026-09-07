import QRCode from 'qrcode';

/**
 * Generates an authenticity QR code for the Form XVII Verification Certificate
 * @param {string} certId - Official Certificate ID
 * @param {object} metadata - Details such as shopName, serialNumber, validUntil
 * @returns {Promise<string>} Data URL / Base64 image
 */
export const generateCertificateQR = async (certId, metadata = {}) => {
  try {
    const payload = JSON.stringify({
      system: 'METRA_LEGAL_METROLOGY_INDIA',
      act: 'Legal Metrology Act, 2009 (Rule 14)',
      certId,
      shop: metadata.shopName || 'Commercial Establishment',
      serial: metadata.serialNumber || 'N/A',
      validUntil: metadata.validUntil || '2026',
      verifyUrl: `http://127.0.0.1:5173/?cert=${encodeURIComponent(certId)}`
    });

    const qrDataUrl = await QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      margin: 1,
      color: {
        dark: '#023625', // MetrX Evergreen brand color
        light: '#FFFFFF'
      }
    });

    return qrDataUrl;
  } catch (error) {
    console.error('[QR Generation Error]', error.message);
    return null;
  }
};
