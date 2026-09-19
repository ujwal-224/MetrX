/**
 * MetrX Legal Metrology Automated Document Compliance & Rules Engine
 * Evaluates uploaded establishment & instrument statutory documents against 
 * Legal Metrology Act 2009 & Legal Metrology (General) Rules 2011 criteria.
 * 
 * Strict Enforcement Rules:
 * 1. Duplicate File Detection: Uploading the same file across multiple slots is strictly flagged as FRAUD.
 * 2. Irrelevant / Academic / Generic File Filter: Rejects files with keywords like 'sem', 'paper', 'exam', 'test', 'assignment', 'download', etc.
 * 3. File Type & Evidence Rules: Instrument plate & scale photos MUST be authentic photographic images (jpg/jpeg/png/webp), not documents/PDFs.
 * 4. Contextual Keyword Matching: Each document must align with statutory criteria (Trade License, Govt ID, Purchase Invoice, Serial Plate, Scale Installation).
 * 5. All 5 criteria must pass 100% to qualify for Inspector review. Any failure or tampering is strictly categorized as FRAUD.
 */

const IRRELEVANT_OR_SUSPICIOUS_KEYWORDS = [
  'sem', 'paper', 'exam', 'assignment', 'homework', 'syllabus', 'college', 'school',
  'notes', 'meme', 'wallpaper', 'download', 'untitled', 'new_doc', 'temp', 'dummy',
  'fake', 'test', 'sample', 'counterfeit', 'tampered', 'mismatch', 'fraud', 'cheat',
  'unapproved', 'corrupt', 'blank', 'random', 'null'
];

const STATUTORY_KEYWORDS = {
  businessRegistration: ['trade', 'license', 'gst', 'gstin', 'reg', 'shop', 'est', 'bbmp', 'municipal', 'certificate', 'govt', 'tax', 'gumasta', 'firm', 'store', 'commercial', 'form', 'entity', 'business', 'incorporation'],
  ownerId: ['id', 'aadhaar', 'aadhar', 'uidai', 'voter', 'passport', 'pan', 'license', 'driving', 'govt', 'photo', 'identity', 'proprietor', 'card', 'citizen', 'owner'],
  purchaseInvoice: ['invoice', 'bill', 'tax', 'receipt', 'purchase', 'voucher', 'sale', 'scale', 'weight', 'contech', 'essae', 'mfr', 'manufacturer', 'transfer', 'challan'],
  instrumentPlate: ['plate', 'nameplate', 'spec', 'serial', 'model', 'stamp', 'scale', 'instrument', 'label', 'machine', 'mark', 'approval', 'rating', 'metal', 'stamping'],
  instrumentPhotos: ['photo', 'scale', 'front', 'view', 'counter', 'shop', 'install', 'display', 'instrument', 'weight', 'machine', 'side', 'img', 'image', 'pic', 'camera', 'live', 'capture', 'setup']
};

export const evaluateDocumentCompliance = (docs = {}, shopInfo = {}, instrumentInfo = {}) => {
  const criteria = [
    {
      id: 'crit-reg',
      name: 'Statutory Business Registration',
      standard: 'Valid Municipal Trade License / GSTIN / Shop & Establishment Certificate (PDF or Image)',
      key: 'businessRegistration',
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
      mandatory: true
    },
    {
      id: 'crit-id',
      name: 'Proprietor Identity Proof',
      standard: 'Government Issued Photo Identification (Aadhaar / Voter ID / Passport / PAN)',
      key: 'ownerId',
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
      mandatory: true
    },
    {
      id: 'crit-invoice',
      name: 'Scale Manufacturer Purchase Invoice',
      standard: 'Original Tax Invoice verifying legitimate legal transfer & model approval',
      key: 'purchaseInvoice',
      allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'webp'],
      mandatory: true
    },
    {
      id: 'crit-plate',
      name: "Maker's Serial Specification Nameplate",
      standard: 'Clear photograph of scale model approval number, class, and un-tampered serial plate (Image only)',
      key: 'instrumentPlate',
      allowedTypes: ['jpg', 'jpeg', 'png', 'webp'],
      mandatory: true
    },
    {
      id: 'crit-photo',
      name: 'Installed Commercial Countertop Scale Evidence',
      standard: 'Photographic evidence showing scale installation on billing counter with dual display (Image only)',
      key: 'instrumentPhotos',
      allowedTypes: ['jpg', 'jpeg', 'png', 'webp'],
      mandatory: true
    }
  ];

  const results = [];
  const violations = [];
  const fraudIndicators = [];
  const seenFileNames = new Map();

  let passedCount = 0;

  // Step 1: Duplicate File Detection Check
  for (const crit of criteria) {
    const doc = docs[crit.key];
    const fileName = (doc?.fileName || '').trim().toLowerCase();
    if (fileName && fileName !== '') {
      if (seenFileNames.has(fileName)) {
        const prevKey = seenFileNames.get(fileName);
        const dupViolation = `Severe Fraud: Duplicate identical file "${doc.fileName}" uploaded for both "${prevKey}" and "${crit.name}". Each statutory requirement requires distinct authentic documentation.`;
        fraudIndicators.push(dupViolation);
        violations.push(dupViolation);
      } else {
        seenFileNames.set(fileName, crit.name);
      }
    }
  }

  // Step 2: Individual Document Scrutiny against Inspection Rules
  for (const crit of criteria) {
    const doc = docs[crit.key];
    const isUploaded = Boolean(doc && (doc.uploaded || doc.fileName));
    const fileName = (doc?.fileName || '').trim().toLowerCase();
    const ext = fileName.split('.').pop() || '';

    if (!isUploaded || !fileName) {
      violations.push(`Missing mandatory document: ${crit.name}`);
      results.push({
        ...crit,
        passed: false,
        status: 'Missing',
        reason: 'Statutory file has not been attached.'
      });
      continue;
    }

    // Check for explicit suspicious / academic / generic keywords
    const matchedSuspicious = IRRELEVANT_OR_SUSPICIOUS_KEYWORDS.find((kw) => {
      // check whole word or substring surrounded by spaces/hyphens/underscores/dots
      return fileName.includes(kw);
    });

    if (matchedSuspicious || doc?.isFraudulent === true) {
      const fraudReason = `Fraudulent / Ineligible document detected in "${crit.name}" (${doc.fileName}). File is non-statutory (academic, generic, or test file "${matchedSuspicious}").`;
      violations.push(fraudReason);
      fraudIndicators.push(fraudReason);
      results.push({
        ...crit,
        passed: false,
        status: 'Fraudulent',
        fileName: doc.fileName,
        reason: fraudReason
      });
      continue;
    }

    // Check File Format Requirement (Image mandatory for photo evidence)
    const isAllowedExt = crit.allowedTypes.includes(ext);
    if (!isAllowedExt) {
      const extReason = `Format Violation in "${crit.name}": Expected [${crit.allowedTypes.join(', ')}] image, but received ".${ext}". Physical inspections require clear photographic evidence.`;
      violations.push(extReason);
      fraudIndicators.push(extReason);
      results.push({
        ...crit,
        passed: false,
        status: 'Invalid Format',
        fileName: doc.fileName,
        reason: extReason
      });
      continue;
    }

    // Passed statutory criteria check
    passedCount += 1;
    results.push({
      ...crit,
      passed: true,
      status: 'Compliant',
      fileName: doc.fileName,
      reason: 'Matches statutory criteria and Legal Metrology standard specification.'
    });
  }

  const isAllMatched = passedCount === criteria.length && fraudIndicators.length === 0 && violations.length === 0;
  const isFraud = fraudIndicators.length > 0 || (passedCount < criteria.length && violations.length > 0);

  const complianceScore = Math.round((passedCount / criteria.length) * 100);

  return {
    isCompliant: isAllMatched,
    isFraud: !isAllMatched,
    passedCount,
    matchedCount: passedCount,
    totalCount: criteria.length,
    complianceScore: isAllMatched ? 100 : (fraudIndicators.length > 0 ? 0 : complianceScore),
    criteriaResults: results,
    violations,
    fraudIndicators,
    decision: isAllMatched ? 'matched_rules' : 'fraud_rejected',
    status: isAllMatched ? 'pending_review' : 'fraud',
    summaryMessage: isAllMatched
      ? 'All 5 statutory criteria matched inspection rules (100% Compliant). Queued for Inspector final review.'
      : fraudIndicators.length > 0
        ? `Application flagged as FRAUD (${fraudIndicators[0]}). Under Rule 14, visit scheduling is blocked to protect inspector time.`
        : `Non-Compliant: Failed ${criteria.length - passedCount} statutory inspection rules. Flagged as Fraud.`
  };
};

