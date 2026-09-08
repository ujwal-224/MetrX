import prisma from '../config/prisma.js';
import {
  evaluateInspection as runRulesEngine,
  calculateValidity
} from '../services/rulesEngineService.js';
import { generateCertificateQR } from '../services/qrService.js';

// @desc    Get all verification rules
// @route   GET /api/verification-rules
export const getRules = async (req, res) => {
  try {
    const { activeOnly } = req.query;
    const where = activeOnly === 'true' ? { isActive: true } : {};

    const rules = await prisma.verificationRule.findMany({
      where,
      include: {
        checks: {
          include: {
            criteria: true
          },
          orderBy: { sortOrder: 'asc' }
        },
        _count: {
          select: {
            checks: true,
            inspections: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({
      success: true,
      count: rules.length,
      data: rules
    });
  } catch (error) {
    console.error('[Get Rules Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single verification rule by ID
// @route   GET /api/verification-rules/:id
export const getRuleById = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await prisma.verificationRule.findUnique({
      where: { id },
      include: {
        checks: {
          include: {
            criteria: true
          },
          orderBy: { sortOrder: 'asc' }
        },
        inspections: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!rule) {
      return res.status(404).json({ success: false, message: 'Verification Rule not found' });
    }

    return res.json({ success: true, data: rule });
  } catch (error) {
    console.error('[Get Rule By ID Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new verification rule with checks and measurement criteria
// @route   POST /api/verification-rules
export const createRule = async (req, res) => {
  try {
    const {
      name,
      instrumentType,
      instrumentClass,
      manufacturer,
      capacityMin = 0,
      capacityMax = 30,
      unit = 'kg',
      applicableStandard,
      verificationInterval = 12,
      isActive = true,
      description,
      checks = []
    } = req.body;

    if (!name || !instrumentType || !applicableStandard) {
      return res.status(400).json({
        success: false,
        message: 'Rule Name, Instrument Type, and Applicable Standard are required.'
      });
    }

    // Prepare nested creation structure
    const checksCreate = checks.map((chk, index) => ({
      name: chk.name,
      description: chk.description || '',
      checkType: chk.checkType || 'checklist',
      isMandatory: chk.isMandatory !== undefined ? Boolean(chk.isMandatory) : true,
      requiresPhoto: Boolean(chk.requiresPhoto),
      requiresDocument: Boolean(chk.requiresDocument),
      sortOrder: chk.sortOrder !== undefined ? Number(chk.sortOrder) : index,
      criteria: {
        create: (chk.criteria || []).map((crit) => ({
          parameter: crit.parameter || 'Test Parameter',
          referenceValue: Number(crit.referenceValue || 0),
          tolerance: Number(crit.tolerance || 0),
          unit: crit.unit || unit,
          comparisonType: crit.comparisonType || 'within_tolerance',
          isMandatory: crit.isMandatory !== undefined ? Boolean(crit.isMandatory) : true
        }))
      }
    }));

    const newRule = await prisma.verificationRule.create({
      data: {
        name,
        instrumentType,
        instrumentClass: instrumentClass || 'Class III Commercial',
        manufacturer: manufacturer || null,
        capacityMin: Number(capacityMin),
        capacityMax: Number(capacityMax),
        unit,
        applicableStandard,
        verificationInterval: Number(verificationInterval) || 12,
        isActive: Boolean(isActive),
        description: description || '',
        checks: {
          create: checksCreate
        }
      },
      include: {
        checks: {
          include: { criteria: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Verification Rule created successfully',
      data: newRule
    });
  } catch (error) {
    console.error('[Create Rule Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing verification rule
// @route   PUT /api/verification-rules/:id
export const updateRule = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      instrumentType,
      instrumentClass,
      manufacturer,
      capacityMin,
      capacityMax,
      unit,
      applicableStandard,
      verificationInterval,
      isActive,
      description,
      checks
    } = req.body;

    const existingRule = await prisma.verificationRule.findUnique({ where: { id } });
    if (!existingRule) {
      return res.status(404).json({ success: false, message: 'Verification Rule not found' });
    }

    // If checks array is provided, replace checks and criteria
    if (checks && Array.isArray(checks)) {
      // Delete existing checks (cascades criteria)
      await prisma.verificationRuleCheck.deleteMany({ where: { ruleId: id } });

      // Create new checks
      for (let i = 0; i < checks.length; i++) {
        const chk = checks[i];
        await prisma.verificationRuleCheck.create({
          data: {
            ruleId: id,
            name: chk.name,
            description: chk.description || '',
            checkType: chk.checkType || 'checklist',
            isMandatory: chk.isMandatory !== undefined ? Boolean(chk.isMandatory) : true,
            requiresPhoto: Boolean(chk.requiresPhoto),
            requiresDocument: Boolean(chk.requiresDocument),
            sortOrder: chk.sortOrder !== undefined ? Number(chk.sortOrder) : i,
            criteria: {
              create: (chk.criteria || []).map((crit) => ({
                parameter: crit.parameter || 'Test Parameter',
                referenceValue: Number(crit.referenceValue || 0),
                tolerance: Number(crit.tolerance || 0),
                unit: crit.unit || unit || existingRule.unit,
                comparisonType: crit.comparisonType || 'within_tolerance',
                isMandatory: crit.isMandatory !== undefined ? Boolean(crit.isMandatory) : true
              }))
            }
          }
        });
      }
    }

    const updated = await prisma.verificationRule.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(instrumentType !== undefined && { instrumentType }),
        ...(instrumentClass !== undefined && { instrumentClass }),
        ...(manufacturer !== undefined && { manufacturer }),
        ...(capacityMin !== undefined && { capacityMin: Number(capacityMin) }),
        ...(capacityMax !== undefined && { capacityMax: Number(capacityMax) }),
        ...(unit !== undefined && { unit }),
        ...(applicableStandard !== undefined && { applicableStandard }),
        ...(verificationInterval !== undefined && { verificationInterval: Number(verificationInterval) }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(description !== undefined && { description })
      },
      include: {
        checks: {
          include: { criteria: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    return res.json({
      success: true,
      message: 'Verification Rule updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('[Update Rule Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle rule active/inactive status
// @route   PATCH /api/verification-rules/:id/status
export const toggleRuleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await prisma.verificationRule.findUnique({ where: { id } });
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Verification Rule not found' });
    }

    const updated = await prisma.verificationRule.update({
      where: { id },
      data: { isActive: !rule.isActive }
    });

    return res.json({
      success: true,
      message: `Rule ${updated.isActive ? 'activated' : 'deactivated'} successfully`,
      data: updated
    });
  } catch (error) {
    console.error('[Toggle Rule Status Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a verification rule
// @route   DELETE /api/verification-rules/:id
export const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    const rule = await prisma.verificationRule.findUnique({ where: { id } });
    if (!rule) {
      return res.status(404).json({ success: false, message: 'Verification Rule not found' });
    }

    await prisma.verificationRule.delete({ where: { id } });

    return res.json({
      success: true,
      message: 'Verification Rule deleted successfully'
    });
  } catch (error) {
    console.error('[Delete Rule Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Find matching verification rule for an instrument
// @route   GET /api/verification-rules/match
export const matchRuleForInstrument = async (req, res) => {
  try {
    const { type, capacity, instrumentClass } = req.query;

    let numCap = 15;
    if (capacity) {
      const matchNum = String(capacity).match(/\d+(\.\d+)?/);
      if (matchNum) numCap = parseFloat(matchNum[0]);
    }

    // Try finding exact match on active rules
    const allActive = await prisma.verificationRule.findMany({
      where: { isActive: true },
      include: {
        checks: {
          include: { criteria: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (allActive.length === 0) {
      return res.status(404).json({ success: false, message: 'No active verification rules configured in system.' });
    }

    // Match priority:
    // 1. Matching instrumentType and capacity within min/max
    const typeLower = (type || '').toLowerCase();
    let matched = allActive.find((r) => {
      const rType = r.instrumentType.toLowerCase();
      const typeMatches = rType.includes(typeLower) || typeLower.includes(rType) ||
        (typeLower.includes('counter') && rType.includes('weighing')) ||
        (typeLower.includes('scale') && rType.includes('scale'));
      const capMatches = numCap >= r.capacityMin && numCap <= r.capacityMax;
      return typeMatches && capMatches;
    });

    // 2. Matching type only
    if (!matched) {
      matched = allActive.find((r) => {
        const rType = r.instrumentType.toLowerCase();
        return rType.includes(typeLower) || typeLower.includes(rType);
      });
    }

    // 3. Fallback to first active rule
    if (!matched) {
      matched = allActive[0];
    }

    return res.json({
      success: true,
      matched: true,
      data: matched
    });
  } catch (error) {
    console.error('[Match Rule Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Evaluate an inspection without submitting
// @route   POST /api/verification-rules/evaluate
export const evaluateInspectionTest = async (req, res) => {
  try {
    const { ruleId, inspectionInput } = req.body;

    let rule;
    if (ruleId) {
      rule = await prisma.verificationRule.findUnique({
        where: { id: ruleId },
        include: {
          checks: {
            include: { criteria: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });
    }

    if (!rule) {
      rule = await prisma.verificationRule.findFirst({
        where: { isActive: true },
        include: {
          checks: {
            include: { criteria: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });
    }

    if (!rule) {
      return res.status(400).json({ success: false, message: 'No active verification rule found to evaluate.' });
    }

    const evaluation = runRulesEngine(rule, inspectionInput);
    return res.json({ success: true, data: evaluation });
  } catch (error) {
    console.error('[Evaluate Inspection Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit full inspection, evaluate via rules engine, and issue certificate if passed
// @route   POST /api/verification-rules/submit-inspection
export const submitInspection = async (req, res) => {
  try {
    const {
      ruleId,
      shopId,
      instrumentId,
      verificationId,
      officerName = 'Insp. R. Deshmukh',
      officerBadge = 'LM-BLR-402',
      verificationMode = 'Field / In-Situ',
      isRepairedOrModified = false,
      gpsLocation = '',
      observations = '',
      checkResponses = {},
      testValues = {},
      photos = [],
      documents = []
    } = req.body;

    // 1. Fetch the applicable rule
    let rule;
    if (ruleId) {
      rule = await prisma.verificationRule.findUnique({
        where: { id: ruleId },
        include: {
          checks: {
            include: { criteria: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });
    }

    if (!rule) {
      rule = await prisma.verificationRule.findFirst({
        where: { isActive: true },
        include: {
          checks: {
            include: { criteria: true },
            orderBy: { sortOrder: 'asc' }
          }
        }
      });
    }

    if (!rule) {
      return res.status(400).json({ success: false, message: 'No active verification rule found to evaluate inspection.' });
    }

    // 2. Execute Rules Engine Evaluation
    const evaluation = runRulesEngine(rule, {
      checkResponses,
      testValues,
      photos,
      documents,
      gpsLocation,
      isRepairedOrModified,
      verificationMode
    });

    const overallResult = evaluation.overallResult; // 'PASS' | 'FAIL'
    const intervalMonths = rule.verificationInterval || 12;
    const validity = calculateValidity(intervalMonths);

    // 3. Resolve Target Shop & Instrument
    let targetShop = null;
    if (shopId) {
      targetShop = await prisma.shop.findFirst({
        where: { OR: [{ id: shopId }, { shopCode: shopId }] }
      });
    }
    if (!targetShop) {
      targetShop = await prisma.shop.findFirst();
    }

    let targetInstrument = null;
    if (instrumentId) {
      targetInstrument = await prisma.instrument.findFirst({
        where: { OR: [{ id: instrumentId }, { instrumentCode: instrumentId }] }
      });
    }
    if (!targetInstrument && targetShop) {
      targetInstrument = await prisma.instrument.findFirst({
        where: { shopId: targetShop.id }
      });
    }

    let issuedCertificate = null;

    // 4. If PASS: Generate Form XVII Certificate with QR code
    if (overallResult === 'PASS') {
      const generatedCertId = `CERT-KA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const inspectorSeal = `SEAL-LM-BLR-${Math.floor(1000 + Math.random() * 9000)}`;

      const qrCodeUrl = await generateCertificateQR(generatedCertId, {
        shopName: targetShop?.name || 'Commercial Establishment',
        serialNumber: targetInstrument?.serialNumber || '#KA-BLR-88412',
        validUntil: validity.validUntilStr
      });

      // Serialize calibration test points for certificate view
      const calibrationTests = [];
      for (const chk of evaluation.evaluatedChecks) {
        for (const crit of chk.criteria) {
          calibrationTests.push({
            point: crit.parameter,
            referenceLoad: `${crit.referenceValue} ${crit.unit}`,
            observedReading: `${crit.observedValue} ${crit.unit}`,
            calculatedError: `${crit.calculatedError > 0 ? '+' : ''}${crit.calculatedError} ${crit.unit}`,
            toleranceAllowed: `±${crit.tolerance} ${crit.unit}`,
            status: crit.passed ? 'PASS' : 'FAIL'
          });
        }
      }

      issuedCertificate = await prisma.certificate.create({
        data: {
          id: `cert-${Date.now()}`,
          certId: generatedCertId,
          ruleForm: 'Form XVII (Rule 14)',
          actYear: 'Legal Metrology Act, 2009',
          shopId: targetShop ? targetShop.id : 'shop-fallback',
          instrumentModel: targetInstrument ? `${targetInstrument.name} (${targetInstrument.model})` : 'Electronic Countertop Scale',
          serialNumber: targetInstrument ? targetInstrument.serialNumber : '#KA-BLR-88412',
          verifiedDate: validity.verifiedDateStr,
          validUntil: validity.validUntilStr,
          inspectorSeal,
          inspectorName: officerName,
          inspectorBadge: officerBadge,
          statusBadge: 'CERTIFIED & COMPLIANT',
          workingStandardRef: 'STD/KA/2025/0092 (Calibrated at NPL)',
          remarks: observations || `Verified under ${rule.applicableStandard}. Measured within configured tolerance limits.`,
          qrCodeUrl: qrCodeUrl || '',
          testObservationsRaw: JSON.stringify(calibrationTests),
          applicableStandard: rule.applicableStandard,
          ruleName: rule.name,
          verificationMode,
          status: 'VALID',
          validUntilTimestamp: validity.nextDueDate
        }
      });

      // Update Instrument state
      if (targetInstrument) {
        await prisma.instrument.update({
          where: { id: targetInstrument.id },
          data: {
            status: 'Verified & Compliant',
            verificationStatusText: 'Holo Seal Valid',
            daysRemaining: validity.daysRemaining,
            totalDaysCycle: validity.totalDaysCycle,
            expiresOn: validity.validUntilStr,
            sealNumber: inspectorSeal,
            complianceRate: '100%',
            verificationRuleId: rule.id,
            verificationMode,
            isRepairedOrModified: Boolean(isRepairedOrModified),
            verificationInterval: intervalMonths,
            lastVerifiedAt: new Date(),
            nextDueAt: validity.nextDueDate
          }
        }).catch((err) => console.warn('[Update Instrument Warning]', err.message));
      }

      // Update Shop compliance status
      if (targetShop) {
        await prisma.shop.update({
          where: { id: targetShop.id },
          data: {
            status: 'Active Commercial Establishment',
            complianceStatus: 'Certified & Compliant',
            documentStatus: 'verified'
          }
        }).catch((err) => console.warn('[Update Shop Warning]', err.message));
      }

      // Advance Verification request step
      if (verificationId) {
        await prisma.verification.updateMany({
          where: {
            OR: [{ id: verificationId }, { requestCode: verificationId }]
          },
          data: {
            step: 5,
            status: 'Verification Complete - Certified'
          }
        }).catch((err) => console.warn('[Update Verification Warning]', err.message));
      }
    } else {
      // FAIL scenario: Update Instrument and Shop to discrepancy status
      if (targetInstrument) {
        await prisma.instrument.update({
          where: { id: targetInstrument.id },
          data: {
            status: 'Discrepancy Flagged / Non-Compliant',
            verificationStatusText: 'Audit Failed',
            complianceRate: 'Failed (Non-compliant)',
            isRepairedOrModified: Boolean(isRepairedOrModified)
          }
        }).catch((err) => console.warn('[Update Instrument Fail Warning]', err.message));
      }

      if (targetShop) {
        await prisma.shop.update({
          where: { id: targetShop.id },
          data: {
            complianceStatus: 'Verification Discrepancy Flagged'
          }
        }).catch((err) => console.warn('[Update Shop Fail Warning]', err.message));
      }
    }

    // 5. Record Inspection in Audit Repository
    const inspectionRecord = await prisma.inspectionRecord.create({
      data: {
        verificationId: verificationId || null,
        instrumentId: targetInstrument ? targetInstrument.id : null,
        shopId: targetShop ? targetShop.id : null,
        ruleId: rule.id,
        officerName,
        officerBadge,
        verificationMode,
        isRepairedOrModified: Boolean(isRepairedOrModified),
        gpsLocation: gpsLocation || null,
        overallResult,
        failureReasons: evaluation.failureReasons,
        observations: observations || '',
        certificateId: issuedCertificate ? issuedCertificate.certId : null,
        evidencePhotos: photos,
        evidenceDocuments: documents,
        checkResults: {
          create: evaluation.evaluatedChecks.flatMap((chk) => {
            if (chk.criteria && chk.criteria.length > 0) {
              return chk.criteria.map((c) => ({
                checkId: chk.checkId,
                checkName: `${chk.checkName} - ${c.parameter}`,
                observedValue: c.observedValue,
                referenceValue: c.referenceValue,
                calculatedError: c.calculatedError,
                toleranceLimit: c.tolerance,
                result: c.passed ? 'PASS' : 'FAIL',
                remarks: c.message
              }));
            }
            return [{
              checkId: chk.checkId,
              checkName: chk.checkName,
              result: chk.passed ? 'PASS' : 'FAIL',
              remarks: chk.remarks || ''
            }];
          })
        }
      },
      include: {
        checkResults: true
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        evaluation,
        inspectionRecord,
        certificate: issuedCertificate,
        validity: overallResult === 'PASS' ? validity : null
      }
    });
  } catch (error) {
    console.error('[Submit Inspection Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
