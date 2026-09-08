/**
 * MetrX Legal Metrology Verification Rules Engine
 * Evaluates instrument compliance, measurement tolerances, evidence completeness,
 * dynamic validity periods, and public verification status according to configured rules.
 */

/**
 * Evaluate an individual measurement test criterion
 * @param {object} criterion - Criterion configuration { comparisonType, referenceValue, tolerance, unit }
 * @param {number} observedValue - Value measured and entered by the officer
 * @returns {object} { passed, calculatedError, toleranceLimit, lowerLimit, upperLimit, message }
 */
export const evaluateCriterion = (criterion, observedValue) => {
  const ref = Number(criterion.referenceValue ?? 0);
  const tol = Number(criterion.tolerance ?? 0);
  const obs = Number(observedValue);

  if (isNaN(obs)) {
    return {
      passed: false,
      calculatedError: null,
      toleranceLimit: tol,
      lowerLimit: ref - tol,
      upperLimit: ref + tol,
      message: 'Observed value must be a valid number'
    };
  }

  const calculatedError = Number((obs - ref).toFixed(5));
  let passed = false;
  let lowerLimit = ref - tol;
  let upperLimit = ref + tol;
  let message = '';

  switch (criterion.comparisonType) {
    case 'within_tolerance':
    default:
      lowerLimit = Number((ref - tol).toFixed(5));
      upperLimit = Number((ref + tol).toFixed(5));
      passed = obs >= lowerLimit && obs <= upperLimit;
      message = passed
        ? `Within configured tolerance [${lowerLimit} ${criterion.unit || ''}, ${upperLimit} ${criterion.unit || ''}]`
        : `Observed ${obs} ${criterion.unit || ''} outside configured tolerance [${lowerLimit}, ${upperLimit}] (Error: ${calculatedError > 0 ? '+' : ''}${calculatedError} ${criterion.unit || ''})`;
      break;

    case 'greater_than_min':
      lowerLimit = ref;
      upperLimit = Infinity;
      passed = obs >= ref;
      message = passed
        ? `Meets minimum threshold (>= ${ref} ${criterion.unit || ''})`
        : `Below minimum threshold of ${ref} ${criterion.unit || ''}`;
      break;

    case 'less_than_max':
      lowerLimit = -Infinity;
      upperLimit = ref;
      passed = obs <= ref;
      message = passed
        ? `Within maximum permissible limit (<= ${ref} ${criterion.unit || ''})`
        : `Exceeds maximum limit of ${ref} ${criterion.unit || ''}`;
      break;

    case 'within_range':
      lowerLimit = ref;
      upperLimit = Number((ref + tol).toFixed(5));
      passed = obs >= lowerLimit && obs <= upperLimit;
      message = passed
        ? `Within configured range [${lowerLimit}, ${upperLimit}]`
        : `Outside configured range [${lowerLimit}, ${upperLimit}]`;
      break;

    case 'equal_to':
      lowerLimit = ref;
      upperLimit = ref;
      passed = Math.abs(obs - ref) <= 0.00001;
      message = passed
        ? `Matches reference value exactly (${ref} ${criterion.unit || ''})`
        : `Does not match reference value (${ref} ${criterion.unit || ''})`;
      break;
  }

  return {
    passed,
    calculatedError,
    toleranceLimit: tol,
    lowerLimit,
    upperLimit,
    message
  };
};

/**
 * Evaluates the full inspection against the configured Verification Rule
 * @param {object} rule - Full VerificationRule with checks and criteria
 * @param {object} inspectionInput - Officer inputs { checkResponses, testValues, photos, documents, gpsLocation, isRepairedOrModified, verificationMode }
 * @returns {object} Detailed evaluation report
 */
export const evaluateInspection = (rule, inspectionInput = {}) => {
  const {
    checkResponses = {},    // Map of checkId -> { checked: boolean, status: 'pass'|'fail', remarks: string }
    testValues = {},        // Map of criterionId -> observedValue (number)
    photos = [],            // Array of uploaded photo objects or URLs
    documents = [],         // Array of uploaded doc objects or URLs
    gpsLocation = '',
    isRepairedOrModified = false,
    verificationMode = 'Field / In-Situ'
  } = inspectionInput;

  const checks = rule.checks || [];
  const evaluatedChecks = [];
  const failureReasons = [];
  const missingEvidence = [];

  let totalMandatory = 0;
  let passedMandatory = 0;
  let failedMandatory = 0;

  // Track Evidence Counts
  let requiredPhotosCount = 0;
  let requiredDocsCount = 0;

  for (const check of checks) {
    if (check.requiresPhoto) requiredPhotosCount += 1;
    if (check.requiresDocument) requiredDocsCount += 1;

    const isMandatory = Boolean(check.isMandatory);
    if (isMandatory) totalMandatory += 1;

    const response = checkResponses[check.id] || {};
    const criteria = check.criteria || [];
    const evaluatedCriteria = [];
    let checkPassed = true;
    const checkFailures = [];

    // 1. Checklist / Physical check response evaluation
    if (check.checkType === 'checklist' || check.checkType === 'physical' || criteria.length === 0) {
      const isChecked = response.checked !== undefined ? Boolean(response.checked) : response.status === 'pass';
      if (!isChecked) {
        checkPassed = false;
        checkFailures.push(`${check.name} was not confirmed satisfactory`);
      }
    }

    // 2. Evaluate Measurement Criteria for this check
    for (const crit of criteria) {
      const obsVal = testValues[crit.id];
      if (obsVal === undefined || obsVal === null || obsVal === '') {
        if (crit.isMandatory) {
          checkPassed = false;
          checkFailures.push(`Missing test value for measurement criterion: ${crit.parameter}`);
        }
        evaluatedCriteria.push({
          criterionId: crit.id,
          parameter: crit.parameter,
          observedValue: null,
          referenceValue: crit.referenceValue,
          tolerance: crit.tolerance,
          unit: crit.unit,
          comparisonType: crit.comparisonType,
          passed: false,
          message: 'Measurement not performed'
        });
      } else {
        const evalResult = evaluateCriterion(crit, obsVal);
        if (!evalResult.passed && crit.isMandatory) {
          checkPassed = false;
          checkFailures.push(`${crit.parameter}: ${evalResult.message}`);
        }
        evaluatedCriteria.push({
          criterionId: crit.id,
          parameter: crit.parameter,
          observedValue: Number(obsVal),
          referenceValue: crit.referenceValue,
          tolerance: crit.tolerance,
          unit: crit.unit,
          comparisonType: crit.comparisonType,
          ...evalResult
        });
      }
    }

    // 3. Evidence requirement for this specific check
    if (check.requiresPhoto) {
      // Check if photos has at least required amount or check-specific photo
      const hasSpecificPhoto = photos.some((p) => p.checkId === check.id || p.name?.toLowerCase().includes(check.name.toLowerCase()));
      const hasGeneralPhotos = photos.length >= requiredPhotosCount;
      if (!hasSpecificPhoto && !hasGeneralPhotos && photos.length === 0) {
        if (isMandatory) {
          checkPassed = false;
          const photoMsg = `Photograph required for "${check.name}"`;
          checkFailures.push(photoMsg);
          missingEvidence.push(photoMsg);
        }
      }
    }

    if (check.requiresDocument) {
      const hasDoc = documents.some((d) => d.checkId === check.id || d.name?.toLowerCase().includes(check.name.toLowerCase())) || documents.length > 0;
      if (!hasDoc && isMandatory) {
        checkPassed = false;
        const docMsg = `Supporting document required for "${check.name}"`;
        checkFailures.push(docMsg);
        missingEvidence.push(docMsg);
      }
    }

    // 4. GPS Check
    if (check.checkType === 'gps' || check.name.toLowerCase().includes('gps')) {
      if (!gpsLocation || !gpsLocation.trim()) {
        if (isMandatory) {
          checkPassed = false;
          checkFailures.push('GPS location capture is required');
        }
      }
    }

    if (isMandatory) {
      if (checkPassed) {
        passedMandatory += 1;
      } else {
        failedMandatory += 1;
        failureReasons.push(...checkFailures);
      }
    }

    evaluatedChecks.push({
      checkId: check.id,
      checkName: check.name,
      checkType: check.checkType,
      isMandatory,
      passed: checkPassed,
      remarks: response.remarks || '',
      failures: checkFailures,
      criteria: evaluatedCriteria
    });
  }

  // Check overall photo count if rule requires photos
  const uploadedPhotosCount = photos.length;
  if (uploadedPhotosCount < requiredPhotosCount) {
    const photoShortage = requiredPhotosCount - uploadedPhotosCount;
    const msg = `${photoShortage} mandatory audit photograph(s) missing (${uploadedPhotosCount} of ${requiredPhotosCount} uploaded)`;
    if (!missingEvidence.includes(msg)) missingEvidence.push(msg);
    if (!failureReasons.includes(msg)) failureReasons.push(msg);
  }

  // Flag repair / modification if applicable
  let reVerificationRequired = false;
  if (isRepairedOrModified) {
    reVerificationRequired = true;
  }

  const overallResult = (failedMandatory === 0 && missingEvidence.length === 0) ? 'PASS' : 'FAIL';

  return {
    overallResult,
    ruleId: rule.id,
    ruleName: rule.name,
    applicableStandard: rule.applicableStandard,
    verificationInterval: rule.verificationInterval,
    isRepairedOrModified,
    reVerificationRequired,
    verificationMode,
    totalMandatory,
    passedMandatory,
    failedMandatory,
    requiredPhotosCount,
    uploadedPhotosCount,
    requiredDocsCount,
    uploadedDocsCount: documents.length,
    missingEvidence,
    failureReasons,
    evaluatedChecks
  };
};

/**
 * Calculate next verification due date from verification interval (in months)
 * @param {number} intervalMonths - Verification interval in months (e.g. 12, 24)
 * @param {Date} fromDate - Optional start date, defaults to now
 * @returns {object} { validUntilStr, nextDueDate, daysCycle }
 */
export const calculateValidity = (intervalMonths = 12, fromDate = new Date()) => {
  const start = new Date(fromDate);
  const nextDueDate = new Date(start);
  nextDueDate.setMonth(nextDueDate.getMonth() + Number(intervalMonths));

  const validUntilStr = nextDueDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const daysRemaining = Math.max(0, Math.ceil((nextDueDate - new Date()) / (1000 * 60 * 60 * 24)));
  const totalDaysCycle = Math.round((nextDueDate - start) / (1000 * 60 * 60 * 24));

  return {
    verifiedDateStr: start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    validUntilStr,
    nextDueDate,
    daysRemaining,
    totalDaysCycle: totalDaysCycle > 0 ? totalDaysCycle : 365
  };
};

/**
 * Determine dynamic current certificate status based on expiration date
 * @param {string|Date} validUntil - Date string or Date object
 * @param {boolean} isRevoked - Explicit revocation flag
 * @returns {object} { status: 'VALID'|'EXPIRING_SOON'|'EXPIRED'|'REVOKED', badge: string, daysLeft: number }
 */
export const evaluateCertificateStatus = (validUntil, isRevoked = false) => {
  if (isRevoked) {
    return {
      status: 'REVOKED',
      badge: '✕ REVOKED',
      color: 'rose',
      daysLeft: 0,
      message: 'Certificate has been revoked by Legal Metrology Directorate'
    };
  }

  if (!validUntil) {
    return {
      status: 'EXPIRED',
      badge: '✕ EXPIRED',
      color: 'rose',
      daysLeft: 0,
      message: 'No valid validity period found'
    };
  }

  const expiryDate = new Date(validUntil);
  const now = new Date();

  // If date string couldn't be parsed directly (e.g. '12 Jan 2026'), try standard parsing
  const timeDiff = expiryDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (isNaN(daysLeft) || daysLeft <= 0) {
    return {
      status: 'EXPIRED',
      badge: '✕ EXPIRED',
      color: 'rose',
      daysLeft: 0,
      message: 'Verification validity has expired. RE-VERIFICATION REQUIRED.'
    };
  }

  if (daysLeft <= 30) {
    return {
      status: 'EXPIRING_SOON',
      badge: '⚠ EXPIRING SOON',
      color: 'amber',
      daysLeft,
      message: `Expires in ${daysLeft} days. Re-verification due soon.`
    };
  }

  return {
    status: 'VALID',
    badge: '✓ VALID',
    color: 'emerald',
    daysLeft,
    message: 'Official Legal Metrology Certificate is active and valid.'
  };
};
