export const DEFAULT_STATUTORY_RULES = [
  {
    id: 'rule-counter-scale-class3',
    name: 'Electronic Non-Automatic Weighing Instruments (Countertop Scale)',
    instrumentType: 'Electronic Weighing Instrument',
    instrumentClass: 'Class III Commercial Medium Accuracy',
    manufacturer: 'Contech / Essae / Avery / Citizen / Eagle',
    capacityMin: 0,
    capacityMax: 30,
    unit: 'kg',
    applicableStandard: 'Legal Metrology (General) Rules, 2011 - Seventh Schedule (Non-Automatic Weighing Instruments)',
    verificationInterval: 12,
    isActive: true,
    description: 'Standard statutory periodic verification procedure for retail countertop electronic weighing instruments up to 30 kg.',
    checks: [
      {
        id: 'chk-cs-1',
        name: 'Instrument Identification & Maker Plate Verification',
        description: 'Verify model approval certificate, serial number plate, maker markings and accuracy class designation.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 1,
        criteria: []
      },
      {
        id: 'chk-cs-2',
        name: 'Physical Condition & Leveling Indicator Check',
        description: 'Inspect spirit level indicator bubble, adjustable feet, platform cleanliness, and absence of damage.',
        checkType: 'physical',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 2,
        criteria: []
      },
      {
        id: 'chk-cs-3',
        name: 'Zero Indication & Dual-Customer Display Functionality',
        description: 'Check zero-tracking mechanism, center-of-zero indicator, and brightness of weight and price displays.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 3,
        criteria: []
      },
      {
        id: 'chk-cs-4',
        name: 'Measurement Accuracy & Permissible Error Test',
        description: 'Apply calibrated Class M1 working standard weights and verify observed reading within configured tolerance.',
        checkType: 'measurement',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 4,
        criteria: [
          {
            id: 'crit-cs-1',
            parameter: 'Nominal Half-Load Accuracy (10.000 kg)',
            referenceValue: 10.0,
            tolerance: 0.005,
            unit: 'kg',
            comparisonType: 'within_tolerance',
            isMandatory: true
          },
          {
            id: 'crit-cs-2',
            parameter: 'Full Capacity Accuracy (30.000 kg)',
            referenceValue: 30.0,
            tolerance: 0.01,
            unit: 'kg',
            comparisonType: 'within_tolerance',
            isMandatory: true
          }
        ]
      },
      {
        id: 'chk-cs-5',
        name: 'Holographic Stamping & Tamper-Evident Wire Seal Inspection',
        description: 'Affix tamper-evident holographic wire seal through security aperture to prevent unauthorized calibration changes.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 5,
        criteria: []
      },
      {
        id: 'chk-cs-6',
        name: 'GPS On-Site Establishment Location Capture',
        description: 'Record authenticated geographical coordinates of the commercial establishment.',
        checkType: 'gps',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 6,
        criteria: []
      }
    ],
    _count: {
      checks: 6,
      inspections: 142
    }
  },
  {
    id: 'rule-platform-scale-class3',
    name: 'Heavy Industrial Platform Scale & Floor Machine',
    instrumentType: 'Platform Weighing Machine',
    instrumentClass: 'Class III Heavy Commercial',
    manufacturer: 'Avery Weigh-Tronix / Essae / Eagle / Tulaman',
    capacityMin: 50,
    capacityMax: 1000,
    unit: 'kg',
    applicableStandard: 'Legal Metrology (General) Rules, 2011 - Part II (Platform & Steelyard Machines)',
    verificationInterval: 12,
    isActive: true,
    description: 'Statutory verification standards for heavy duty platform scales, floor weighbridges, and warehouse loading docks.',
    checks: [
      {
        id: 'chk-ps-1',
        name: 'Structure & Load Cell Mounting Inspection',
        description: 'Inspect platform understructure, junction box seal, and load cell mounting hardware.',
        checkType: 'physical',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 1,
        criteria: []
      },
      {
        id: 'chk-ps-2',
        name: 'Eccentricity & Corner Loading Test (250.0 kg)',
        description: 'Apply one-quarter load across 4 corner quadrants and verify consistency.',
        checkType: 'measurement',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 2,
        criteria: [
          {
            id: 'crit-ps-1',
            parameter: 'Corner Load Quadrant Test (250.0 kg)',
            referenceValue: 250.0,
            tolerance: 0.1,
            unit: 'kg',
            comparisonType: 'within_tolerance',
            isMandatory: true
          }
        ]
      },
      {
        id: 'chk-ps-3',
        name: 'Span Load Accuracy Test (500.0 kg)',
        description: 'Verify accuracy at nominal half-capacity with standard calibrated test weights.',
        checkType: 'measurement',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 3,
        criteria: [
          {
            id: 'crit-ps-2',
            parameter: 'Span Load Verification (500.0 kg)',
            referenceValue: 500.0,
            tolerance: 0.2,
            unit: 'kg',
            comparisonType: 'within_tolerance',
            isMandatory: true
          }
        ]
      },
      {
        id: 'chk-ps-4',
        name: 'Digital Indicator & Calibration Lock Switch Verification',
        description: 'Confirm physical jumper / dip-switch calibration lock is engaged and protected by official lead seal.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 4,
        criteria: []
      }
    ],
    _count: {
      checks: 4,
      inspections: 89
    }
  },
  {
    id: 'rule-precision-lab-class2',
    name: 'Precision Laboratory & Jewelry Balance (Class II)',
    instrumentType: 'Precision Laboratory Balance',
    instrumentClass: 'Class II High Precision',
    manufacturer: 'Mettler Toledo / Sartorius / Shimadzu / Wensar',
    capacityMin: 0,
    capacityMax: 5000,
    unit: 'g',
    applicableStandard: 'Legal Metrology Act, 2009 & OIML R-76 Class II Precision Scheme',
    verificationInterval: 24,
    isActive: true,
    description: 'High precision statutory verification criteria for gold & diamond jewelry stores, chemical laboratories and bullion merchants.',
    checks: [
      {
        id: 'chk-pl-1',
        name: 'Draft Shield & Thermal Balance Stability Check',
        description: 'Verify glass draft enclosure, anti-vibration stone table, and ambient temperature stability.',
        checkType: 'physical',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 1,
        criteria: []
      },
      {
        id: 'chk-pl-2',
        name: 'Precision Measurement Test at 1000.00 g Load',
        description: 'Apply calibrated Class F1 precision working weights and verify error within ±0.02 g.',
        checkType: 'measurement',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 2,
        criteria: [
          {
            id: 'crit-pl-1',
            parameter: 'Accuracy Test at 1000.00 g Reference Load',
            referenceValue: 1000.0,
            tolerance: 0.02,
            unit: 'g',
            comparisonType: 'within_tolerance',
            isMandatory: true
          },
          {
            id: 'crit-pl-2',
            parameter: 'Repeatability Test at 200.00 g Load',
            referenceValue: 200.0,
            tolerance: 0.01,
            unit: 'g',
            comparisonType: 'within_tolerance',
            isMandatory: true
          }
        ]
      },
      {
        id: 'chk-pl-3',
        name: 'Anti-Vibration & Spirit Bubble Level Verification',
        description: 'Ensure accurate center alignment of internal leveling bubble and magnetic dampening function.',
        checkType: 'physical',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 3,
        criteria: []
      }
    ],
    _count: {
      checks: 3,
      inspections: 64
    }
  },
  {
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
    checks: [
      {
        id: 'chk-bs-1',
        name: 'Knife Edge & Agate Bearing Friction Inspection',
        description: 'Verify knife edge sharpness, cleanliness of agate bearings, and free oscillation of fulcrum assembly.',
        checkType: 'physical',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 1,
        criteria: []
      },
      {
        id: 'chk-bs-2',
        name: 'Beam Balance & Pointer Center Alignment',
        description: 'Inspect unloaded resting equilibrium and indicator tongue alignment with zero index marking.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 2,
        criteria: []
      },
      {
        id: 'chk-bs-3',
        name: 'Sensibility Reciprocal (SR) Test at 10.0 kg Load',
        description: 'Verify pointer displacement when adding extra weight equal to maximum permissible SR limit.',
        checkType: 'measurement',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 3,
        criteria: [
          {
            id: 'crit-bs-1',
            parameter: 'Sensibility Reciprocal Load (10.000 kg)',
            referenceValue: 10.0,
            tolerance: 0.01,
            unit: 'kg',
            comparisonType: 'within_tolerance',
            isMandatory: true
          }
        ]
      },
      {
        id: 'chk-bs-4',
        name: 'Lead Stamping Plug & Inspector Punch Mark',
        description: 'Ensure official inspector stamp punch is clearly indented into lead balancing plug of beam arms.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 4,
        criteria: []
      }
    ],
    _count: {
      checks: 4,
      inspections: 38
    }
  },
  {
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
    checks: [
      {
        id: 'chk-fd-1',
        name: 'Totalizer Electronic Display & Pulse Interface Check',
        description: 'Verify electro-mechanical and non-resettable electronic totalizer digits, backlight, and rate calculation.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 1,
        criteria: []
      },
      {
        id: 'chk-fd-2',
        name: '5.000 Liter Standard Volumetric Proving Test',
        description: 'Dispense 5.000 L into certified conical standard capacity measure and verify delivery level at eye height.',
        checkType: 'measurement',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 2,
        criteria: [
          {
            id: 'crit-fd-1',
            parameter: '5.000 L Delivery Standard Accuracy',
            referenceValue: 5.0,
            tolerance: 0.025,
            unit: 'L',
            comparisonType: 'within_tolerance',
            isMandatory: true
          }
        ]
      },
      {
        id: 'chk-fd-3',
        name: '20.000 Liter Full Flow Volumetric Proving Test',
        description: 'Perform full flow delivery rate test at 30 L/min using calibrated 20-liter proving measure.',
        checkType: 'measurement',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 3,
        criteria: [
          {
            id: 'crit-fd-2',
            parameter: '20.000 L High Flow Delivery Standard',
            referenceValue: 20.0,
            tolerance: 0.05,
            unit: 'L',
            comparisonType: 'within_tolerance',
            isMandatory: true
          }
        ]
      },
      {
        id: 'chk-fd-4',
        name: 'Meter Calibration Unit Physical Lead Wire Seal',
        description: 'Inspect physical lead wire seal through piston meter adjustment gear to prevent unauthorized fuel delivery tampering.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 4,
        criteria: []
      }
    ],
    _count: {
      checks: 4,
      inspections: 52
    }
  }
];
