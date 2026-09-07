export const initialStoreInfo = {
  name: "Shree Ganesh General Store",
  regNumber: "KA-BLR-2023-9081",
  merchantUid: "#EST-44091",
  location: "Ward 4, Commercial Circle, 14 Market Road, Bengaluru",
  division: "Bengaluru Central Division (LM-BLR-C-04)",
  contactPerson: "Shree S. N. Ganesh",
  phone: "+91 98450 21980",
  zone: "Zone 4 (Central)",
  certificateId: "KA-2024-LM-9921"
};

export const initialInstruments = [
  {
    id: "inst-1",
    name: "Electronic Countertop Scale",
    model: "Contech CA-30",
    capacity: "30kg (e=1g / precision division)",
    serialNumber: "#KA-BLR-88412",
    counter: "Counter No. 1",
    status: "Verified & Active",
    verificationStatusText: "Annual Metrology Re-Verification Due in 28 Days",
    daysRemaining: 28,
    totalDaysCycle: 365,
    expiresOn: "12 Feb 2025",
    sealNumber: "SEAL-2024-819A",
    complianceRate: "100%",
    type: "counter_scale",
    class: "Class III Commercial"
  },
  {
    id: "inst-2",
    name: "Platform Weighing Machine",
    model: "Avery Weigh-Tronix 150kg",
    capacity: "150kg (e=50g)",
    serialNumber: "#KA-BLR-77219",
    counter: "Goods Receiving Bay",
    status: "Compliant",
    daysRemaining: 214,
    totalDaysCycle: 365,
    expiresOn: "18 Aug 2025",
    sealNumber: "SEAL-2024-331B",
    complianceRate: "100%",
    type: "platform_machine",
    class: "Class III Industrial"
  }
];

export const inspectorVisits = [
  {
    id: "visit-1",
    timeSlot: "10:00 AM – 11:30 AM",
    timeRelative: "NEXT UP • In 20 mins",
    isNextUp: true,
    shopName: "Shree Ganesh General Store",
    regNumber: "Reg #KA-BLR-2023-9081",
    address: "Ward 4, Commercial Circle, 14 Market Road",
    status: "Pending On-Site Inspection",
    statusType: "pending",
    instrumentName: "Electronic Countertop Scale",
    model: "Contech CA-30",
    specification: "Max 30kg (e=1g)",
    classBadge: "Class III",
    applicationRef: "METRA-BLR-2025-084-V",
    assignedOfficer: "Inspector R. Deshmukh",
    officerBadge: "Badge #LM-BLR-402"
  },
  {
    id: "visit-2",
    timeSlot: "12:00 PM – 1:00 PM",
    timeRelative: "Midday Slot",
    isNextUp: false,
    shopName: "Kaveri Provisions & Spices",
    regNumber: "Reg #KA-BLR-2021-4412",
    address: "Shop #42, APMC Yard Main Road, Ward 4",
    status: "Scheduled",
    statusType: "scheduled",
    instrumentName: "Platform Weighing Machine",
    model: "Avery 150kg Heavy Duty",
    specification: "Max 150kg (e=50g)",
    classBadge: "Class III Industrial",
    verificationType: "Annual Re-verification"
  },
  {
    id: "visit-3",
    timeSlot: "2:30 PM – 3:30 PM",
    timeRelative: "Afternoon Slot",
    isNextUp: false,
    shopName: "Annapurna Flour Mills",
    regNumber: "Reg #KA-BLR-2019-1020",
    address: "Plot 18, Commercial Ganj, Near Old City Depot",
    status: "Scheduled",
    statusType: "scheduled",
    instrumentName: "Beam Scale & Precision Conical Weights",
    model: "50kg iron weight set",
    specification: "Class M1 Verification",
    classBadge: "Class III Commercial",
    verificationType: "Physical Stamping & Sealing"
  },
  {
    id: "visit-4",
    timeSlot: "4:00 PM – 5:00 PM",
    timeRelative: "Final Field Slot",
    isNextUp: false,
    shopName: "Royal Gold & Silver Ornaments",
    regNumber: "Reg #KA-BLR-2024-0019",
    address: "96 Jewellers Lane, Commercial Circle",
    status: "Scheduled",
    statusType: "scheduled",
    instrumentName: "Class II High Precision Balance",
    model: "Mettler Toledo Precision",
    specification: "0.01g readability • Max 600g",
    classBadge: "Class II Bullion Grade",
    verificationType: "Calibration Certificate + Holographic Foil"
  }
];

export const defaultInspectionChecklist = [
  {
    id: "chk-1",
    title: "Physical Maker's Plate & Embossed Lead Wire Seal intact",
    desc: "Verified model approval markings, serial plate rivets, and unbroken municipal wire seal intact from previous audit.",
    checked: true
  },
  {
    id: "chk-2",
    title: "Standard Reference Weights Test passed (Zero error at 5kg, 10kg, 20kg calibration tests)",
    desc: "Executed corner eccentricity and linearity assessments using Class M1 calibrated reference working standards.",
    checked: true
  },
  {
    id: "chk-3",
    title: "Digital Display and Dual-Customer View operating clearly without flicker",
    desc: "Consumer-facing bright segment display is unobstructed, tare indicator triggers accurately, zero lock functions properly.",
    checked: true
  },
  {
    id: "chk-4",
    title: "Security Stamping Applied: 2025 State Metrology Holographic Stamp affixed to chassis",
    desc: "Affix tamper-evident tamper-proof iridescent foil stamp #SLM-2025-99182 onto the joint of scale casing.",
    checked: false
  }
];

export const testCalibrationData = [
  { load: "5.000 kg", observed: "5.000 kg", mpe: "± 1.0 g", status: "Passed" },
  { load: "15.000 kg", observed: "15.001 kg", mpe: "± 1.5 g", status: "Passed" },
  { load: "30.000 kg (Full)", observed: "30.000 kg", mpe: "± 2.0 g", status: "Passed" }
];

export const stateComplianceRegistry = [
  {
    id: "REG-01",
    shopName: "Shree Ganesh General Store",
    merchantUid: "#EST-44091",
    certId: "CERT-KA-2024-9921",
    instrument: "Electronic Countertop Scale (30kg)",
    serial: "#KA-BLR-88412",
    zone: "Ward 4, Commercial Circle",
    status: "Renewal Scheduled",
    expiryDate: "12 Feb 2025",
    inspector: "Inspector R. Deshmukh",
    stampSeal: "SEAL-2024-819A"
  },
  {
    id: "REG-02",
    shopName: "Kaveri Provisions & Spices",
    merchantUid: "#EST-39102",
    certId: "CERT-KA-2024-7714",
    instrument: "Platform Weighing Machine (150kg)",
    serial: "#KA-BLR-77219",
    zone: "Ward 4, APMC Yard",
    status: "Valid & Active",
    expiryDate: "18 Aug 2025",
    inspector: "Inspector R. Deshmukh",
    stampSeal: "SEAL-2024-331B"
  },
  {
    id: "REG-03",
    shopName: "Annapurna Flour Mills",
    merchantUid: "#EST-28491",
    certId: "CERT-KA-2023-5590",
    instrument: "Beam Scale & Conical Weights (50kg)",
    serial: "#KA-BLR-55410",
    zone: "Ward 2, Commercial Ganj",
    status: "Inspection Slotted",
    expiryDate: "20 Jan 2025",
    inspector: "Inspector K. S. Rao",
    stampSeal: "SEAL-2024-098C"
  },
  {
    id: "REG-04",
    shopName: "Royal Gold & Silver Ornaments",
    merchantUid: "#EST-50119",
    certId: "CERT-KA-2024-8842",
    instrument: "Class II Precision Balance (600g)",
    serial: "#KA-BLR-99014",
    zone: "Ward 4, Jewellers Lane",
    status: "Valid & Active",
    expiryDate: "14 Nov 2025",
    inspector: "Inspector R. Deshmukh",
    stampSeal: "SEAL-2024-889D"
  },
  {
    id: "REG-05",
    shopName: "Sri Lakshmi Petroleum Outlet",
    merchantUid: "#EST-11044",
    certId: "CERT-KA-2024-0044",
    instrument: "Fuel Dispensing Unit (Flow Rate 45L/min)",
    serial: "#KA-BLR-11002",
    zone: "Outer Ring Road Junction",
    status: "Valid & Active",
    expiryDate: "29 Sep 2025",
    inspector: "Senior Controller V. Hegde",
    stampSeal: "SEAL-2024-019E"
  }
];
