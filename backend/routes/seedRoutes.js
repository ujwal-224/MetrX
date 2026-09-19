import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma.js';

const router = express.Router();

export const seedDatabase = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Official Super-Admin Account ONLY
  await prisma.user.upsert({
    where: { email: 'admin123@metrx.com' },
    update: {},
    create: {
      id: 'usr-admin-1',
      name: 'Admin',
      email: 'admin123@metrx.com',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 80 2234 5678',
      assignedZone: 'Karnataka Metrology HQ'
    }
  });

  // 2. Seed Realistic Demo Verification Rules if empty
  const rulesCount = await prisma.verificationRule.count();
  if (rulesCount === 0) {
    // Rule 1: Commercial Countertop Scale (Class III)
    await prisma.verificationRule.create({
      data: {
        id: 'rule-counter-scale-class3',
        name: 'Electronic Non-Automatic Weighing Instruments (Countertop Scale)',
        instrumentType: 'Electronic Weighing Instrument',
        instrumentClass: 'Class III Commercial Medium Accuracy',
        manufacturer: 'Contech / Essae / Avery / Citizen',
        capacityMin: 0,
        capacityMax: 30,
        unit: 'kg',
        applicableStandard: 'Legal Metrology (General) Rules, 2011 - Seventh Schedule (Non-Automatic Weighing Instruments)',
        verificationInterval: 12,
        isActive: true,
        description: 'Standard periodic verification procedure for retail countertop electronic weighing instruments up to 30 kg.',
        checks: {
          create: [
            {
              name: 'Instrument Identification & Maker Plate Verification',
              description: 'Verify model approval certificate, serial number plate, maker markings and accuracy class designation.',
              checkType: 'checklist',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 1
            },
            {
              name: 'Physical Condition & Leveling Indicator Check',
              description: 'Inspect spirit level indicator bubble, adjustable feet, platform cleanliness, and absence of damage.',
              checkType: 'physical',
              isMandatory: true,
              requiresPhoto: false,
              requiresDocument: false,
              sortOrder: 2
            },
            {
              name: 'Zero Indication & Display Functionality',
              description: 'Check zero-tracking mechanism, center-of-zero indicator, and brightness of weight and price displays.',
              checkType: 'checklist',
              isMandatory: true,
              requiresPhoto: false,
              requiresDocument: false,
              sortOrder: 3
            },
            {
              name: 'Measurement Accuracy & Permissible Error Test',
              description: 'Apply calibrated Class M1 working standard weights and verify observed reading within configured tolerance.',
              checkType: 'measurement',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 4,
              criteria: {
                create: [
                  {
                    parameter: 'Nominal Load Accuracy (10.000 kg)',
                    referenceValue: 10.000,
                    tolerance: 0.005,
                    unit: 'kg',
                    comparisonType: 'within_tolerance',
                    isMandatory: true
                  },
                  {
                    parameter: 'Full Capacity Accuracy (30.000 kg)',
                    referenceValue: 30.000,
                    tolerance: 0.010,
                    unit: 'kg',
                    comparisonType: 'within_tolerance',
                    isMandatory: true
                  }
                ]
              }
            },
            {
              name: 'Holographic Stamping & Wire Seal Inspection',
              description: 'Affix tamper-evident holographic wire seal through security aperture to prevent unauthorized calibration changes.',
              checkType: 'checklist',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 5
            },
            {
              name: 'GPS On-Site Location Capture',
              description: 'Record authenticated geographical coordinates of the commercial establishment.',
              checkType: 'gps',
              isMandatory: true,
              requiresPhoto: false,
              requiresDocument: false,
              sortOrder: 6
            }
          ]
        }
      }
    });

    // Rule 2: Heavy Industrial Platform Scale
    await prisma.verificationRule.create({
      data: {
        id: 'rule-platform-scale-class3',
        name: 'Heavy Industrial Platform Scale & Floor Machine',
        instrumentType: 'Platform Weighing Machine',
        instrumentClass: 'Class III Heavy Commercial',
        manufacturer: 'Avery Weigh-Tronix / Essae / Eagle',
        capacityMin: 50,
        capacityMax: 1000,
        unit: 'kg',
        applicableStandard: 'Legal Metrology (General) Rules, 2011 - Part II (Platform & Steelyard Machines)',
        verificationInterval: 12,
        isActive: true,
        description: 'Verification standards for heavy duty platform scales and warehouse loading docks.',
        checks: {
          create: [
            {
              name: 'Structure & Load Cell Mounting Inspection',
              description: 'Inspect platform understructure, junction box seal, and load cell mounting hardware.',
              checkType: 'physical',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 1
            },
            {
              name: 'Eccentricity & Corner Loading Test',
              description: 'Apply one-quarter load across 4 corner quadrants and verify consistency.',
              checkType: 'measurement',
              isMandatory: true,
              requiresPhoto: false,
              requiresDocument: false,
              sortOrder: 2,
              criteria: {
                create: [
                  {
                    parameter: 'Corner Load Test (250.0 kg)',
                    referenceValue: 250.0,
                    tolerance: 0.1,
                    unit: 'kg',
                    comparisonType: 'within_tolerance',
                    isMandatory: true
                  }
                ]
              }
            },
            {
              name: 'Span Load Accuracy Test (500.0 kg)',
              description: 'Verify accuracy at nominal half-capacity with standard test weights.',
              checkType: 'measurement',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 3,
              criteria: {
                create: [
                  {
                    parameter: 'Span Load Test (500.0 kg)',
                    referenceValue: 500.0,
                    tolerance: 0.2,
                    unit: 'kg',
                    comparisonType: 'within_tolerance',
                    isMandatory: true
                  }
                ]
              }
            }
          ]
        }
      }
    });

    // Rule 3: Precision Laboratory Balance
    await prisma.verificationRule.create({
      data: {
        id: 'rule-precision-lab-class2',
        name: 'Precision Laboratory & Jewelry Balance (Class II)',
        instrumentType: 'Precision Laboratory Balance',
        instrumentClass: 'Class II High Precision',
        manufacturer: 'Mettler Toledo / Sartorius / Shimadzu',
        capacityMin: 0,
        capacityMax: 5000,
        unit: 'g',
        applicableStandard: 'Legal Metrology Act, 2009 & OIML R-76 Class II Precision Scheme',
        verificationInterval: 24,
        isActive: true,
        description: 'Verification criteria for jewelry stores, chemical laboratories and gold merchants.',
        checks: {
          create: [
            {
              name: 'Draft Shield & Thermal Balance Stability Check',
              description: 'Verify glass draft enclosure, vibration dampening table, and ambient temperature stability.',
              checkType: 'physical',
              isMandatory: true,
              requiresPhoto: false,
              requiresDocument: false,
              sortOrder: 1
            },
            {
              name: 'Precision Measurement Test at 1000.00 g Load',
              description: 'Apply calibrated Class F1 precision weights and verify error within ±0.02 g.',
              checkType: 'measurement',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 2,
              criteria: {
                create: [
                  {
                    parameter: 'Accuracy Test at 1000.00 g Reference Load',
                    referenceValue: 1000.0,
                    tolerance: 0.02,
                    unit: 'g',
                    comparisonType: 'within_tolerance',
                    isMandatory: true
                  }
                ]
              }
            }
          ]
        }
      }
    });

    // Rule 4: Commercial Beam Scale & Counter Machine
    await prisma.verificationRule.create({
      data: {
        id: 'rule-beam-scale-class4',
        name: 'Commercial Beam Scale & Counter Machine',
        instrumentType: 'Mechanical Beam Scale / Counter Machine',
        instrumentClass: 'Class III / Class IV Commercial General',
        manufacturer: 'BIS / Directorate Approved Indian Manufacturers',
        capacityMin: 0,
        capacityMax: 50,
        unit: 'kg',
        applicableStandard: 'Legal Metrology (General) Rules, 2011 - Sixth Schedule (Beam Scales & Counter Machines)',
        verificationInterval: 12,
        isActive: true,
        description: 'Statutory verification specifications for commercial class beam balances, pans, suspension linkages and counter machines.',
        checks: {
          create: [
            {
              name: 'Knife Edge & Agate Bearing Friction Inspection',
              description: 'Verify knife edge sharpness, cleanliness of agate bearings, and free oscillation of fulcrum assembly.',
              checkType: 'physical',
              isMandatory: true,
              requiresPhoto: false,
              requiresDocument: false,
              sortOrder: 1
            },
            {
              name: 'Beam Balance & Pointer Center Alignment',
              description: 'Inspect unloaded resting equilibrium and indicator tongue alignment with zero index marking.',
              checkType: 'checklist',
              isMandatory: true,
              requiresPhoto: false,
              requiresDocument: false,
              sortOrder: 2
            },
            {
              name: 'Sensibility Reciprocal (SR) Test at 10.0 kg Load',
              description: 'Verify pointer displacement when adding extra weight equal to maximum permissible SR limit.',
              checkType: 'measurement',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 3,
              criteria: {
                create: [
                  {
                    parameter: 'Sensibility Reciprocal Load (10.000 kg)',
                    referenceValue: 10.0,
                    tolerance: 0.01,
                    unit: 'kg',
                    comparisonType: 'within_tolerance',
                    isMandatory: true
                  }
                ]
              }
            },
            {
              name: 'Lead Stamping Plug & Inspector Punch Mark',
              description: 'Ensure official inspector stamp punch is clearly indented into lead balancing plug of beam arms.',
              checkType: 'checklist',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 4
            }
          ]
        }
      }
    });

    // Rule 5: Automated Liquid Fuel Dispensing Unit
    await prisma.verificationRule.create({
      data: {
        id: 'rule-fuel-dispenser-sch8',
        name: 'Automated Liquid Fuel Dispensing Unit (Petrol/Diesel)',
        instrumentType: 'Liquid Fuel Dispenser',
        instrumentClass: 'Schedule VIII Accuracy Class 0.5',
        manufacturer: 'Gilbarco Veeder-Root / Tokheim / Midco / Wayne',
        capacityMin: 0,
        capacityMax: 100,
        unit: 'L',
        applicableStandard: 'Legal Metrology (General) Rules, 2011 - Schedule VIII (Measuring Systems for Liquids)',
        verificationInterval: 12,
        isActive: true,
        description: 'Statutory verification rules and volumetric delivery testing for retail petrol & diesel dispensing stations.',
        checks: {
          create: [
            {
              name: 'Totalizer Electronic Display & Pulse Interface Check',
              description: 'Verify electro-mechanical and non-resettable electronic totalizer digits, backlight, and rate calculation.',
              checkType: 'checklist',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 1
            },
            {
              name: '5.000 Liter Standard Volumetric Proving Test',
              description: 'Dispense 5.000 L into certified conical standard capacity measure and verify delivery level at eye height.',
              checkType: 'measurement',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 2,
              criteria: {
                create: [
                  {
                    parameter: '5.000 L Delivery Standard Accuracy',
                    referenceValue: 5.0,
                    tolerance: 0.025,
                    unit: 'L',
                    comparisonType: 'within_tolerance',
                    isMandatory: true
                  }
                ]
              }
            },
            {
              name: '20.000 Liter Full Flow Volumetric Proving Test',
              description: 'Perform full flow delivery rate test at 30 L/min using calibrated 20-liter proving measure.',
              checkType: 'measurement',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 3,
              criteria: {
                create: [
                  {
                    parameter: '20.000 L High Flow Delivery Standard',
                    referenceValue: 20.0,
                    tolerance: 0.05,
                    unit: 'L',
                    comparisonType: 'within_tolerance',
                    isMandatory: true
                  }
                ]
              }
            },
            {
              name: 'Meter Calibration Unit Physical Lead Wire Seal',
              description: 'Inspect physical lead wire seal through piston meter adjustment gear to prevent unauthorized fuel delivery tampering.',
              checkType: 'checklist',
              isMandatory: true,
              requiresPhoto: true,
              requiresDocument: false,
              sortOrder: 4
            }
          ]
        }
      }
    });
  }

  // 3. Seed Demo Certificates (1 Valid, 1 Expired) for Public Verification if a shop exists
  try {
    const shop = await prisma.shop.findFirst();
    if (shop) {
      const validCert = await prisma.certificate.findFirst({
        where: { certId: 'CERT-KA-2025-9921' }
      });
      if (!validCert) {
        const futureDate = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);
        await prisma.certificate.create({
          data: {
            id: 'cert-demo-valid-9921',
            certId: 'CERT-KA-2025-9921',
            ruleForm: 'Form XVII (Rule 14)',
            actYear: 'Legal Metrology Act, 2009',
            shopId: shop.id,
            instrumentModel: 'Contech CA-30 (Max 30kg, e=1g)',
            serialNumber: '#KA-BLR-88412',
            verifiedDate: '13 Jan 2025',
            validUntil: futureDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            validUntilTimestamp: futureDate,
            inspectorSeal: 'SEAL-LM-BLR-0428',
            inspectorName: 'Insp. R. Deshmukh',
            inspectorBadge: 'LM-BLR-402',
            statusBadge: 'CERTIFIED & COMPLIANT',
            workingStandardRef: 'STD/KA/2025/0092 (Calibrated at NPL)',
            applicableStandard: 'Legal Metrology (General) Rules, 2011 - Seventh Schedule (Non-Automatic Weighing Instruments)',
            ruleName: 'Electronic Non-Automatic Weighing Instruments (Countertop Scale)',
            verificationMode: 'Field / In-Situ',
            status: 'VALID',
            remarks: 'Physical verification passed. Holographic seal affixed.'
          }
        });
      }

      const expiredCert = await prisma.certificate.findFirst({
        where: { certId: 'CERT-KA-2024-DEMO-EXPIRED' }
      });
      if (!expiredCert) {
        const pastDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        await prisma.certificate.create({
          data: {
            id: 'cert-demo-expired-2024',
            certId: 'CERT-KA-2024-DEMO-EXPIRED',
            ruleForm: 'Form XVII (Rule 14)',
            actYear: 'Legal Metrology Act, 2009',
            shopId: shop.id,
            instrumentModel: 'Essae DS-252 Counter Scale (Max 15kg)',
            serialNumber: '#KA-BLR-44102',
            verifiedDate: '15 Jan 2024',
            validUntil: pastDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            validUntilTimestamp: pastDate,
            inspectorSeal: 'SEAL-LM-BLR-0199',
            inspectorName: 'Insp. R. Deshmukh',
            inspectorBadge: 'LM-BLR-402',
            statusBadge: '✕ EXPIRED',
            workingStandardRef: 'STD/KA/2024/0081 (Calibrated at NPL)',
            applicableStandard: 'Legal Metrology (General) Rules, 2011 - Seventh Schedule',
            ruleName: 'Electronic Non-Automatic Weighing Instruments (Countertop Scale)',
            verificationMode: 'Field / In-Situ',
            status: 'EXPIRED',
            remarks: 'Annual statutory verification term has concluded. Re-verification required under Section 24.'
          }
        });
      }
    }
  } catch (err) {
    console.warn('[Seed Demo Certs Error]', err.message);
  }

  return { success: true, message: 'Super-Admin account, Demo Verification Rules and Demo Certificates initialized' };
};

// @desc    Seed demo database data
// @route   POST /api/seed
router.post('/', async (req, res) => {
  try {
    const result = await seedDatabase();
    return res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Seed Database Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
