export const initialStoreInfo = {
  name: "",
  regNumber: "",
  merchantUid: "",
  location: "",
  division: "Karnataka Legal Metrology Division",
  contactPerson: "",
  phone: "",
  zone: "Ward 4 (Commercial Circle)",
  certificateId: ""
};

export const initialInstruments = [];

export const inspectorVisits = [];

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
    desc: "Affix tamper-evident tamper-proof iridescent foil stamp onto the joint of scale casing.",
    checked: false
  }
];

export const testCalibrationData = [
  { load: "5.000 kg", observed: "5.000 kg", mpe: "± 1.0 g", status: "Passed" },
  { load: "15.000 kg", observed: "15.001 kg", mpe: "± 1.5 g", status: "Passed" },
  { load: "30.000 kg (Full)", observed: "30.000 kg", mpe: "± 2.0 g", status: "Passed" }
];

export const initialInspectors = [
  {
    id: "insp-1",
    name: "Insp. R. Deshmukh",
    badgeNumber: "LM-BLR-402",
    email: "deshmukh.insp@metrx.com",
    password: "password123",
    zone: "Ward 4 (Commercial Circle)",
    phone: "+91 98450 11223",
    status: "Active",
    authorizedBy: "Controller of Legal Metrology",
    issuedAt: "Bengaluru Central HQ"
  },
  {
    id: "insp-2",
    name: "Insp. S. Patil",
    badgeNumber: "LM-BLR-108",
    email: "patil.insp@metrx.com",
    password: "password123",
    zone: "Ward 7 (Industrial Hub)",
    phone: "+91 98450 44556",
    status: "Active",
    authorizedBy: "Controller of Legal Metrology",
    issuedAt: "Bengaluru South HQ"
  },
  {
    id: "insp-3",
    name: "Insp. V. Joshi",
    badgeNumber: "LM-BLR-315",
    email: "joshi.insp@metrx.com",
    password: "password123",
    zone: "Ward 2 (Market Yard)",
    phone: "+91 98450 77889",
    status: "Active",
    authorizedBy: "Controller of Legal Metrology",
    issuedAt: "Bengaluru West HQ"
  }
];

export const initialEstablishments = [
  {
    id: "shop-1",
    name: "Sri Lakshmi Provision & Grain Store",
    ownerName: "K. Ramesh Rao",
    email: "ramesh.store@gmail.com",
    branchType: "Commercial Retail Store",
    merchantUid: "#EST-9921",
    tradeLicense: "BBMP/TL/2025/4410",
    gstin: "29AABCS1429B1ZB",
    shopActReg: "KA/BLR/44102/2024",
    zone: "Ward 4 (Commercial Circle)",
    address: "Shop #14, Gandhi Bazaar Main Road, Basavanagudi, Bengaluru - 560004",
    phone: "+91 98450 99210",
    assignedInspector: "Insp. R. Deshmukh",
    inspectorBadge: "LM-BLR-402",
    status: "Active Commercial Establishment",
    complianceStatus: "Certified & Compliant",
    documentStatus: "verified",
    registeredScalesCount: 1,
    instruments: [
      {
        id: "inst-1",
        name: "Essae Electronic Countertop Scale",
        model: "Essae DS-252 (Max 30kg, e=1g)",
        category: "Electronic Weighing Instrument",
        accuracyClass: "Class III Commercial Medium Accuracy",
        serialNumber: "#KA-BLR-88412",
        sealNumber: "SEAL-LM-BLR-0428",
        capacity: "30 kg",
        verificationStatus: "VALID",
        expiryDate: "13 Jan 2026",
        lastVerificationDate: "13 Jan 2025"
      }
    ],
    certificateId: "CERT-KA-2025-9921",
    createdAt: "10 Jan 2025"
  },
  {
    id: "shop-2",
    name: "Bharat Petroleum Dispensing Station",
    ownerName: "Anil S. Mehta",
    email: "mehta.fuels@gmail.com",
    branchType: "Retail Fuel Dispensing Station",
    merchantUid: "#EST-4402",
    tradeLicense: "BBMP/TL/2025/7782",
    gstin: "29AABCU9912M1Z4",
    shopActReg: "KA/BLR/99120/2024",
    zone: "Ward 4 (Commercial Circle)",
    address: "Plot 88, Outer Ring Road, Commercial Circle, Bengaluru - 560037",
    phone: "+91 98451 44020",
    assignedInspector: "Insp. R. Deshmukh",
    inspectorBadge: "LM-BLR-402",
    status: "Active Commercial Establishment",
    complianceStatus: "Documents Verified",
    documentStatus: "verified",
    registeredScalesCount: 1,
    instruments: [
      {
        id: "inst-2",
        name: "Gilbarco Automated Fuel Dispenser",
        model: "Gilbarco Horizon Flow Meter",
        category: "Liquid Fuel Dispenser",
        accuracyClass: "Schedule VIII Accuracy Class 0.5",
        serialNumber: "#KA-BLR-33211",
        sealNumber: "SEAL-LM-BLR-0912",
        capacity: "100 L/min",
        verificationStatus: "PENDING_AUDIT",
        expiryDate: "Pending Verification",
        lastVerificationDate: "Pending"
      }
    ],
    certificateId: "PENDING-AUDIT",
    createdAt: "18 Jan 2025"
  },
  {
    id: "shop-3",
    name: "Shree Navratna Jewellers",
    ownerName: "Deepak S. Verma",
    email: "deepak.jewels@gmail.com",
    branchType: "Precious Metals & Gems Retail",
    merchantUid: "#EST-7715",
    tradeLicense: "BBMP/TL/2025/2290",
    gstin: "29AADCP8841F1ZV",
    shopActReg: "KA/BLR/22901/2024",
    zone: "Ward 4 (Commercial Circle)",
    address: "Shop #03, Commercial Plaza, MG Road, Bengaluru - 560001",
    phone: "+91 98452 77150",
    assignedInspector: "Pending Admin Allocation",
    inspectorBadge: "LM-PENDING",
    status: "Active Commercial Establishment",
    complianceStatus: "Pending Inspector Assignment",
    documentStatus: "not_uploaded",
    registeredScalesCount: 1,
    instruments: [
      {
        id: "inst-3",
        name: "Mettler Toledo Precision Gold Balance",
        model: "Mettler Toledo ME-204 (Max 220g, e=0.1mg)",
        category: "Precision Laboratory Balance",
        accuracyClass: "Class II High Precision",
        serialNumber: "#KA-BLR-11984",
        sealNumber: "SEAL-PENDING",
        capacity: "220 g",
        verificationStatus: "PENDING",
        expiryDate: "Pending Audit",
        lastVerificationDate: "Pending"
      }
    ],
    certificateId: "PENDING",
    createdAt: "Today"
  }
];

export const stateComplianceRegistry = [];
