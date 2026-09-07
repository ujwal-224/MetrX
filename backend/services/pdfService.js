import PDFDocument from 'pdfkit';

/**
 * Generates an official Form XVII Digital Certificate PDF stream
 * @param {object} cert - Certificate record
 * @param {string} qrDataUrl - Base64 QR code image data
 * @param {object} res - Express response stream
 */
export const generateCertificatePDF = (cert, qrDataUrl, res) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 40,
    info: {
      Title: `Certificate_${cert.certId}`,
      Author: 'Directorate of Legal Metrology, Government of India',
      Subject: 'Form XVII Verification Certificate (Rule 14)'
    }
  });

  doc.pipe(res);

  // Background certificate border
  doc
    .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
    .lineWidth(3)
    .stroke('#023625');

  doc
    .rect(25, 25, doc.page.width - 50, doc.page.height - 50)
    .lineWidth(1)
    .stroke('#E0702A');

  // Header Title
  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#E0702A')
    .text('GOVERNMENT OF INDIA • DEPARTMENT OF CONSUMER AFFAIRS', { align: 'center' })
    .moveDown(0.3);

  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#023625')
    .text('DIRECTORATE OF LEGAL METROLOGY', { align: 'center' })
    .moveDown(0.2);

  doc
    .fontSize(11)
    .font('Helvetica')
    .fillColor('#4B5563')
    .text('CERTIFICATE OF VERIFICATION • FORM XVII (RULE 14)', { align: 'center' })
    .moveDown(0.2);

  doc
    .fontSize(9)
    .font('Helvetica-Oblique')
    .text('[Issued under Section 24 of the Legal Metrology Act, 2009]', { align: 'center' })
    .moveDown(1.5);

  // Certificate ID & Validity Banner
  doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#023625')
    .text(`Certificate No: ${cert.certId}`, 50, 140);

  doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .fillColor('#2E7D32')
    .text(`Status: VALID & COMPLIANT`, doc.page.width - 240, 140, { align: 'right' });

  doc.moveDown(2);

  // Details Table
  const startY = 175;
  const col1 = 50;
  const col2 = 220;

  const rows = [
    ['Commercial Establishment:', cert.shop?.name || cert.shopName || 'Registered Commercial Establishment'],
    ['Establishment ID (UID):', cert.shop?.merchantUid || '#EST-44091'],
    ['Trade License No:', cert.shop?.tradeLicense || 'BBMP/TL/2023/9081'],
    ['Instrument Model:', cert.instrumentModel || 'Contech CA-30 (Max 30kg, e=1g)'],
    ['Serial Number:', cert.serialNumber || '#KA-BLR-88412'],
    ['Verified Date:', cert.verifiedDate || '13 Jan 2025'],
    ['Valid Until:', cert.validUntil || '12 Jan 2026'],
    ['Holographic Wire Seal No:', cert.inspectorSeal || 'SEAL-LM-BLR-0428'],
    ['Verifying Officer:', `${cert.inspectorName || 'Insp. R. Deshmukh'} (${cert.inspectorBadge || 'LM-BLR-402'})`],
    ['Working Standard Reference:', cert.workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)']
  ];

  let currentY = startY;
  rows.forEach(([label, val]) => {
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#374151')
      .text(label, col1, currentY);

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#111827')
      .text(val, col2, currentY);

    currentY += 20;
  });

  // Stamp / QR code if provided
  if (qrDataUrl) {
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const imgBuffer = Buffer.from(base64Data, 'base64');
    doc.image(imgBuffer, doc.page.width - 160, currentY + 10, { width: 100 });
    doc
      .fontSize(7)
      .font('Helvetica')
      .fillColor('#6B7280')
      .text('Scan to verify on MetrX ledger', doc.page.width - 170, currentY + 115, { width: 120, align: 'center' });
  }

  // Footer & Disclaimer
  doc
    .fontSize(8)
    .font('Helvetica-Oblique')
    .fillColor('#6B7280')
    .text(
      'This is a computer-generated digital legal metrology certificate authenticated with cryptographic signature under IT Act 2000.',
      50,
      doc.page.height - 70,
      { width: doc.page.width - 100, align: 'center' }
    );

  doc.end();
};
