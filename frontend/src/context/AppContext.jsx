import React, { createContext, useContext, useState } from 'react';
import {
  initialStoreInfo,
  initialInstruments,
  inspectorVisits,
  defaultInspectionChecklist,
  testCalibrationData,
  stateComplianceRegistry
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Role State
  // Roles: 'shop-owner' | 'inspector' | 'admin' | 'public'
  const [activeRole, setActiveRole] = useState('public');
  const [currentView, setCurrentView] = useState('public-portal');
  const [language, setLanguage] = useState('EN'); // 'EN' | 'HI'

  // Fixed Super-Admin Credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin123@metrx.com',
    password: '12345678'
  };

  // Current Logged In Inspector State
  const [currentInspector, setCurrentInspector] = useState(null);

  // Multi-Shop Establishments Owned by the Merchant
  const [ownerShops, setOwnerShops] = useState([
    {
      id: 'shop-ganesh-1',
      name: 'Shree Ganesh General Store',
      ownerName: 'Shree S. N. Ganesh',
      branchType: 'Main Commercial Branch',
      merchantUid: '#EST-44091',
      tradeLicense: 'BBMP/TL/2023/9081',
      gstin: '29AABCU9603R1ZM',
      shopActReg: 'KA/BLR/44091/2023',
      zone: 'Ward 4 (Commercial Circle)',
      address: '14 Market Road, Commercial Circle, Bengaluru - 560001',
      phone: '+91 98450 21980',
      assignedInspector: 'Insp. R. Deshmukh',
      inspectorBadge: 'LM-BLR-402',
      status: 'Active Commercial Establishment',
      complianceStatus: 'Documents Verified',
      documentStatus: 'verified',
      registeredScalesCount: 2,
      instruments: [
        {
          id: 'inst-1',
          name: 'Electronic Countertop Scale',
          model: 'Contech CA-30',
          capacity: '30kg / 1g precision',
          serialNumber: '#KA-BLR-88412',
          counter: 'Billing Counter 1',
          status: 'Stamping Active',
          verificationStatusText: 'Holo Seal Valid',
          daysRemaining: 28,
          totalDaysCycle: 365,
          expiresOn: '13 Feb 2025',
          sealNumber: 'SEAL-LM-BLR-0428',
          complianceRate: '100%',
          type: 'counter_scale',
          class: 'Class III Commercial'
        },
        {
          id: 'inst-2',
          name: 'Platform Heavy Scale',
          model: 'Contech CP-100',
          capacity: '100kg / 10g precision',
          serialNumber: '#KA-BLR-99304',
          counter: 'Goods Receipt Area',
          status: 'Stamping Active',
          verificationStatusText: 'Holo Seal Valid',
          daysRemaining: 94,
          totalDaysCycle: 365,
          expiresOn: '18 Apr 2025',
          sealNumber: 'SEAL-LM-BLR-0489',
          complianceRate: '100%',
          type: 'platform_scale',
          class: 'Class III Commercial'
        }
      ],
      certificationHistory: [
        {
          certId: 'CERT-KA-2024-9921',
          ruleForm: 'Form XVII (Rule 14)',
          actYear: 'Act of 2009',
          instrumentModel: 'Contech CA-30 (Max 30kg, e=1g)',
          serialNumber: '#KA-BLR-88412',
          verifiedDate: '13 Jan 2024',
          validUntil: '12 Jan 2025',
          inspectorSeal: 'SEAL-LM-BLR-0428',
          inspectorName: 'Insp. R. Deshmukh',
          inspectorBadge: 'LM-BLR-402',
          statusBadge: 'CERTIFIED & COMPLIANT',
          workingStandardRef: 'STD/KA/2024/0081 (Calibrated at NPL)',
          remarks: '4-Point MPE tested with Class M1 reference weights. Holographic wire seal applied.'
        },
        {
          certId: 'CERT-KA-2023-4819',
          ruleForm: 'Form XVII (Rule 14)',
          actYear: 'Act of 2009',
          instrumentModel: 'Contech CA-30 (Max 30kg, e=1g)',
          serialNumber: '#KA-BLR-88412',
          verifiedDate: '15 Jan 2023',
          validUntil: '14 Jan 2024',
          inspectorSeal: 'SEAL-LM-BLR-0211',
          inspectorName: 'Insp. R. Deshmukh',
          inspectorBadge: 'LM-BLR-402',
          statusBadge: 'ARCHIVED / RENEWED',
          workingStandardRef: 'STD/KA/2023/0014 (Calibrated at NPL)',
          remarks: 'Annual statutory verification passed.'
        }
      ]
    },
    {
      id: 'shop-ganesh-2',
      name: 'Ganesh Supermarket & Provisions',
      ownerName: 'Shree S. N. Ganesh',
      branchType: 'Retail Supermarket Branch',
      merchantUid: '#EST-44092',
      tradeLicense: 'BBMP/TL/2022/5512',
      gstin: '29AABCU9603R2ZN',
      shopActReg: 'KA/BLR/44092/2022',
      zone: 'Ward 4 (APMC Complex)',
      address: 'Shop #18, APMC Complex Main Gate, Ward 4, Bengaluru - 560022',
      phone: '+91 98450 21981',
      assignedInspector: 'Insp. R. Deshmukh',
      inspectorBadge: 'LM-BLR-402',
      status: 'Active Commercial Establishment',
      complianceStatus: 'Certified & Compliant',
      documentStatus: 'verified',
      registeredScalesCount: 2,
      instruments: [
        {
          id: 'inst-3',
          name: 'Heavy Duty Platform Scale',
          model: 'Avery Weigh-Tronix 150kg',
          capacity: '150kg / 20g precision',
          serialNumber: '#KA-BLR-77102',
          counter: 'Grain Weighing Section',
          status: 'Stamping Active',
          verificationStatusText: 'Holo Seal Valid',
          daysRemaining: 180,
          totalDaysCycle: 365,
          expiresOn: '04 Aug 2025',
          sealNumber: 'SEAL-LM-BLR-0499',
          complianceRate: '100%',
          type: 'platform_scale',
          class: 'Class III Commercial'
        },
        {
          id: 'inst-4',
          name: 'POS Electronic Scale',
          model: 'Essae POS-30',
          capacity: '30kg / 1g precision',
          serialNumber: '#KA-BLR-66291',
          counter: 'Express Checkout Counter',
          status: 'Stamping Active',
          verificationStatusText: 'Holo Seal Valid',
          daysRemaining: 215,
          totalDaysCycle: 365,
          expiresOn: '09 Sep 2025',
          sealNumber: 'SEAL-LM-BLR-0512',
          complianceRate: '100%',
          type: 'counter_scale',
          class: 'Class III Commercial'
        }
      ],
      certificationHistory: [
        {
          certId: 'CERT-KA-2024-8192',
          ruleForm: 'Form XVII (Rule 14)',
          actYear: 'Act of 2009',
          instrumentModel: 'Avery Weigh-Tronix 150kg',
          serialNumber: '#KA-BLR-77102',
          verifiedDate: '04 Feb 2024',
          validUntil: '03 Feb 2025',
          inspectorSeal: 'SEAL-LM-BLR-0499',
          inspectorName: 'Insp. R. Deshmukh',
          inspectorBadge: 'LM-BLR-402',
          statusBadge: 'CERTIFIED & COMPLIANT',
          workingStandardRef: 'STD/KA/2024/0081 (Calibrated at NPL)',
          remarks: 'Passed calibration tests at 20kg, 50kg, and 100kg standards.'
        }
      ]
    },
    {
      id: 'shop-ganesh-3',
      name: 'Ganesh Sweetmeat & Dry Fruits',
      ownerName: 'Shree S. N. Ganesh',
      branchType: 'Confectionery Branch',
      merchantUid: '#EST-44093',
      tradeLicense: 'BBMP/TL/2024/1108',
      gstin: '29AABCU9603R3ZO',
      shopActReg: 'KA/BLR/44093/2024',
      zone: 'Ward 2 (Commercial Ganj)',
      address: 'Plot 22, Commercial Ganj Sweet Bazaar, Bengaluru - 560002',
      phone: '+91 98450 21982',
      assignedInspector: 'Insp. K. S. Rao',
      inspectorBadge: 'LM-BLR-319',
      status: 'Active Commercial Establishment',
      complianceStatus: 'Documents Submitted',
      documentStatus: 'pending_review',
      registeredScalesCount: 1,
      instruments: [
        {
          id: 'inst-5',
          name: 'High Precision Sweet Scale',
          model: 'Contech Precision 15kg',
          capacity: '15kg / 0.5g precision',
          serialNumber: '#KA-BLR-55912',
          counter: 'Main Display Counter',
          status: 'Initial Verification Due',
          verificationStatusText: 'Awaiting Inspector Visit',
          daysRemaining: 14,
          totalDaysCycle: 365,
          expiresOn: '25 Jan 2025',
          sealNumber: 'SEAL-PENDING',
          complianceRate: '100%',
          type: 'counter_scale',
          class: 'Class II High Precision'
        }
      ],
      certificationHistory: [
        {
          certId: 'CERT-KA-2024-3301',
          ruleForm: 'Form XVII (Rule 14)',
          actYear: 'Act of 2009',
          instrumentModel: 'Contech Precision 15kg',
          serialNumber: '#KA-BLR-55912',
          verifiedDate: '20 Apr 2024',
          validUntil: '19 Apr 2025',
          inspectorSeal: 'SEAL-LM-BLR-0388',
          inspectorName: 'Insp. K. S. Rao',
          inspectorBadge: 'LM-BLR-319',
          statusBadge: 'CERTIFIED & COMPLIANT',
          workingStandardRef: 'STD/KA/2024/0019 (Calibrated at NPL)',
          remarks: 'Class II High Precision certification verified.'
        }
      ]
    }
  ]);

  const [activeShopIndex, setActiveShopIndexState] = useState(0);

  // Domain Data State
  const [storeInfo, setStoreInfo] = useState(initialStoreInfo);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [activeInstrumentIndex, setActiveInstrumentIndex] = useState(0);
  const [visits, setVisits] = useState(inspectorVisits);
  const [checklist, setChecklist] = useState(defaultInspectionChecklist);
  const [registry, setRegistry] = useState(stateComplianceRegistry);

  // Inspector Accounts (Admin-Provisioned ONLY)
  const [inspectors, setInspectors] = useState([
    {
      id: 'insp-1',
      name: 'Insp. R. Deshmukh',
      badgeNumber: 'LM-BLR-402',
      email: 'insp123@metrx.com',
      password: '12345678',
      zone: 'Ward 4 (Commercial Circle)',
      phone: '+91 98451 20491',
      status: 'Active',
      authorizedBy: 'Dr. K. V. Sharma (Admin)',
      issuedAt: '01 Jan 2024'
    },
    {
      id: 'insp-2',
      name: 'Insp. K. S. Rao',
      badgeNumber: 'LM-BLR-319',
      email: 'ksrao@metrx.com',
      password: '12345678',
      zone: 'Ward 2 (Commercial Ganj)',
      phone: '+91 98452 77102',
      status: 'Active',
      authorizedBy: 'Dr. K. V. Sharma (Admin)',
      issuedAt: '15 Feb 2024'
    },
    {
      id: 'insp-3',
      name: 'Insp. P. Kulkarni',
      badgeNumber: 'LM-BLR-504',
      email: 'pkulkarni@metrx.com',
      password: '12345678',
      zone: 'Ward 1 (APMC Yard)',
      phone: '+91 98450 66190',
      status: 'Active',
      authorizedBy: 'Dr. K. V. Sharma (Admin)',
      issuedAt: '10 Mar 2024'
    }
  ]);

  // Shop Owner / Merchant Accounts (Self-Created by Shop Owners)
  const [merchants, setMerchants] = useState([
    {
      id: 'merch-1',
      name: 'Shree Ganesh General Store',
      ownerName: 'Shree S. N. Ganesh',
      email: 'ganesh@store.com',
      password: '12345678',
      merchantUid: '#EST-44091',
      tradeLicense: 'BBMP/TL/2023/9081',
      zone: 'Ward 4 (Commercial Circle)',
      address: '14 Market Road, Commercial Circle, Bengaluru',
      phone: '+91 98450 21980',
      registeredScales: 2,
      complianceStatus: 'Inspection Slotted',
      assignedInspector: 'Insp. R. Deshmukh',
      createdAt: '12 Jan 2024'
    },
    {
      id: 'merch-2',
      name: 'Kaveri Provisions & Spices',
      ownerName: 'Kaveri Sundaram',
      email: 'kaveri@spices.com',
      password: '12345678',
      merchantUid: '#EST-39102',
      tradeLicense: 'BBMP/TL/2021/4412',
      zone: 'Ward 4 (APMC Yard)',
      address: 'Shop #42, APMC Yard Main Road, Ward 4',
      phone: '+91 98453 11092',
      registeredScales: 1,
      complianceStatus: 'Scheduled',
      assignedInspector: 'Insp. R. Deshmukh',
      createdAt: '18 Feb 2024'
    },
    {
      id: 'merch-3',
      name: 'Annapurna Flour Mills',
      ownerName: 'R. K. Gupta',
      email: 'gupta@flour.com',
      password: '12345678',
      merchantUid: '#EST-28491',
      tradeLicense: 'BBMP/TL/2019/1020',
      zone: 'Ward 2 (Commercial Ganj)',
      address: 'Plot 18, Commercial Ganj',
      phone: '+91 98456 99182',
      registeredScales: 3,
      complianceStatus: 'Scheduled',
      assignedInspector: 'Insp. K. S. Rao',
      createdAt: '05 Mar 2024'
    },
    {
      id: 'merch-4',
      name: 'Royal Gold & Silver Ornaments',
      ownerName: 'Mahendra Varma',
      email: 'royal@gold.com',
      password: '12345678',
      merchantUid: '#EST-50119',
      tradeLicense: 'BBMP/TL/2024/0019',
      zone: 'Ward 4 (Jewellers Lane)',
      address: '96 Jewellers Lane, Commercial Circle',
      phone: '+91 98459 33281',
      registeredScales: 2,
      complianceStatus: 'Scheduled',
      assignedInspector: 'Insp. R. Deshmukh',
      createdAt: '10 Apr 2024'
    }
  ]);

  // Live Inspector Operations on Shop Owners (Real-Time Tracking for Admin)
  const [operations, setOperations] = useState([
    {
      id: 'OP-101',
      inspectorName: 'Insp. R. Deshmukh',
      badgeNumber: 'LM-BLR-402',
      shopName: 'Shree Ganesh General Store',
      merchantUid: '#EST-44091',
      zone: 'Ward 4',
      operationType: 'Annual Calibration & Hologram Stamping',
      scaleModel: 'Contech CA-30 (Max 30kg, e=1g)',
      slot: '10:00 AM – 11:30 AM',
      liveStatus: 'Active / In Field Audit',
      statusType: 'in_progress',
      remarks: '4-Point MPE check underway on counter scale'
    },
    {
      id: 'OP-102',
      inspectorName: 'Insp. R. Deshmukh',
      badgeNumber: 'LM-BLR-402',
      shopName: 'Kaveri Provisions & Spices',
      merchantUid: '#EST-39102',
      zone: 'Ward 4',
      operationType: 'Platform Scale Calibration',
      scaleModel: 'Avery 150kg Heavy Duty',
      slot: '12:00 PM – 1:00 PM',
      liveStatus: 'Route Queue Slot 2',
      statusType: 'scheduled',
      remarks: 'Standard 50kg test weights'
    },
    {
      id: 'OP-103',
      inspectorName: 'Insp. K. S. Rao',
      badgeNumber: 'LM-BLR-319',
      shopName: 'Annapurna Flour Mills',
      merchantUid: '#EST-28491',
      zone: 'Ward 2',
      operationType: 'Beam Scale & Conical Weight Audit',
      scaleModel: 'Class M1 50kg Iron Set',
      slot: '02:30 PM – 03:30 PM',
      liveStatus: 'Scheduled Slot 3',
      statusType: 'scheduled',
      remarks: 'Assigned by Controller'
    },
    {
      id: 'OP-104',
      inspectorName: 'Insp. R. Deshmukh',
      badgeNumber: 'LM-BLR-402',
      shopName: 'Royal Gold & Silver Ornaments',
      merchantUid: '#EST-50119',
      zone: 'Ward 4',
      operationType: 'Class II Bullion Precision Calibration',
      scaleModel: 'Mettler Toledo Precision (0.01g / 600g)',
      slot: '04:00 PM – 05:00 PM',
      liveStatus: 'Scheduled Slot 4',
      statusType: 'scheduled',
      remarks: 'High Precision Gold standard verification'
    }
  ]);

  // Verification Request flow state (5-Step Model)
  // Step 1: Requested | Step 2: Documents Uploaded | Step 3: Scheduled | Step 4: Inspected | Step 5: Certified
  const [selectedSlot, setSelectedSlot] = useState('slot_1');
  const [verificationStatus, setVerificationStatus] = useState({
    status: 'documents_submitted',
    documentStatus: 'pending_review', // 'not_uploaded' | 'pending_review' | 'verified' | 'fraud'
    step: 2,
    applicationRef: 'METRA-BLR-2025-084-V',
    slotLabel: 'Thu, 16 Jan 2025',
    timeLabel: '10 AM – 1 PM',
    inspectorName: 'Insp. R. Deshmukh',
    inspectorBadge: 'LM-BLR-402',
    zone: 'Zone 4 (Central)',
    requestedAt: '10 Jan, 09:30 AM',
    documentsSubmittedAt: '12 Jan, 09:30 AM',
    fee: 150,
    feeStatus: 'Payable on-site / UPI'
  });

  // Statutory Documents Submissions (5 Required Documents per shop)
  const [documentSubmissions, setDocumentSubmissions] = useState({
    'merch-1': {
      merchantId: 'merch-1',
      shopName: 'Shree Ganesh General Store',
      status: 'pending_review',
      submittedAt: '12 Jan 2025, 09:30 AM',
      reviewedBy: 'Insp. R. Deshmukh',
      reviewedAt: null,
      remarks: 'All 5 statutory documents submitted by merchant. Awaiting physical inspection clearance by Inspector.',
      docs: {
        businessRegistration: {
          title: 'Business Registration',
          subTitle: 'Trade License / GST / Shop & Est. Act Certificate',
          fileName: 'BBMP_Trade_License_2023_9081.pdf',
          fileSize: '1.8 MB',
          uploadedAt: '12 Jan 2025, 09:30 AM',
          status: 'Uploaded'
        },
        ownerId: {
          title: 'Owner ID Proof',
          subTitle: 'Aadhaar Card / Government Photo ID',
          fileName: 'Shree_Ganesh_Aadhaar_Card.pdf',
          fileSize: '1.2 MB',
          uploadedAt: '12 Jan 2025, 09:32 AM',
          status: 'Uploaded'
        },
        purchaseInvoice: {
          title: 'Purchase Invoice',
          subTitle: 'Original Scale Purchase Bill / Tax Invoice',
          fileName: 'Contech_CA30_Tax_Invoice_Bill.pdf',
          fileSize: '2.4 MB',
          uploadedAt: '12 Jan 2025, 09:35 AM',
          status: 'Uploaded'
        },
        instrumentPlate: {
          title: 'Instrument Plate Photo',
          subTitle: 'Scale Specification & Serial Number Nameplate',
          fileName: 'Contech_Spec_Nameplate_Photo.jpg',
          fileSize: '3.1 MB',
          uploadedAt: '12 Jan 2025, 09:40 AM',
          status: 'Uploaded'
        },
        instrumentPhotos: {
          title: 'Instrument Photos',
          subTitle: 'Installed Counter Scale Front & Profile View',
          fileName: 'Counter_Scale_Front_Installation.jpg',
          fileSize: '4.5 MB',
          uploadedAt: '12 Jan 2025, 09:42 AM',
          status: 'Uploaded'
        }
      }
    },
    'merch-2': {
      merchantId: 'merch-2',
      shopName: 'Kaveri Provisions & Spices',
      status: 'verified',
      submittedAt: '14 Jan 2025, 11:00 AM',
      reviewedBy: 'Insp. R. Deshmukh',
      reviewedAt: '14 Jan 2025, 02:15 PM',
      remarks: 'Documents and serial plate verified with national manufacturer database.',
      docs: {
        businessRegistration: {
          title: 'Business Registration',
          subTitle: 'Trade License / GST / Shop & Est. Act Certificate',
          fileName: 'Kaveri_Trade_License_2021.pdf',
          fileSize: '2.1 MB',
          uploadedAt: '14 Jan 2025, 11:00 AM',
          status: 'Uploaded'
        },
        ownerId: {
          title: 'Owner ID Proof',
          subTitle: 'Aadhaar Card / Government Photo ID',
          fileName: 'Kaveri_Sundaram_PAN_Card.pdf',
          fileSize: '1.4 MB',
          uploadedAt: '14 Jan 2025, 11:05 AM',
          status: 'Uploaded'
        },
        purchaseInvoice: {
          title: 'Purchase Invoice',
          subTitle: 'Original Scale Purchase Bill / Tax Invoice',
          fileName: 'Avery_Platform_Invoice.pdf',
          fileSize: '2.8 MB',
          uploadedAt: '14 Jan 2025, 11:10 AM',
          status: 'Uploaded'
        },
        instrumentPlate: {
          title: 'Instrument Plate Photo',
          subTitle: 'Scale Specification & Serial Number Nameplate',
          fileName: 'Avery_Nameplate_Serial_Scan.jpg',
          fileSize: '3.5 MB',
          uploadedAt: '14 Jan 2025, 11:15 AM',
          status: 'Uploaded'
        },
        instrumentPhotos: {
          title: 'Instrument Photos',
          subTitle: 'Installed Counter Scale Front & Profile View',
          fileName: 'Avery_Platform_Shop_View.jpg',
          fileSize: '4.0 MB',
          uploadedAt: '14 Jan 2025, 11:20 AM',
          status: 'Uploaded'
        }
      }
    }
  });

  // Certificate State
  const [certificateData, setCertificateData] = useState({
    certId: 'CERT-KA-2024-9921',
    ruleForm: 'Form XVII (Rule 14)',
    actYear: 'Act of 2009',
    statusBadge: 'VERIFIED & COMPLIANT',
    daysLeft: 337,
    validUntil: '12 Jan 2026',
    verifiedDate: '13 Jan 2025',
    inspectorSeal: 'SEAL-LM-BLR-0428',
    instrumentModel: 'Contech CA-30 (Max 30kg, e=1g)',
    shopLocation: 'Shree Ganesh General Store, Ward 4',
    workingStandardRef: 'STD/KA/2024/0081 (Calibrated at NPL)',
    digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
    calibrationTests: testCalibrationData
  });

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Direct login by role (for demo quick-fill)
  const login = (role) => {
    setActiveRole(role);
    if (role === 'shop-owner') {
      setCurrentView('shop-dashboard');
      showToast('Logged in as Shop Owner (Shree Ganesh General Store)', 'success');
    } else if (role === 'inspector') {
      setCurrentView('inspector-schedule');
      showToast('Logged in as Field Inspector (Insp. R. Deshmukh)', 'success');
    } else if (role === 'admin') {
      setCurrentView('admin-dashboard');
      showToast('Logged in as Department Admin (Controller of Legal Metrology)', 'success');
    } else {
      setCurrentView('public-portal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authenticated Admin Login
  const handleAdminLogin = (email, password) => {
    if (email.trim() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setActiveRole('admin');
      setCurrentView('admin-dashboard');
      showToast('Admin Authentication Successful. Welcome, Controller!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } else {
      showToast('Invalid Admin Credentials. Please use admin123@metrx.com / 12345678', 'error');
      return false;
    }
  };

  // Authenticated Inspector Login (Only Admin-Provisioned Credentials Work)
  const handleInspectorLogin = (email, password) => {
    const match = inspectors.find(
      (insp) => insp.email.toLowerCase() === email.trim().toLowerCase() && insp.password === password
    );

    if (match) {
      if (match.status !== 'Active') {
        showToast('This inspector account has been suspended by Department Admin.', 'error');
        return false;
      }
      setCurrentInspector(match);
      setActiveRole('inspector');
      setCurrentView('inspector-schedule');
      showToast(`Welcome ${match.name}! (Badge: ${match.badgeNumber})`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } else {
      showToast('Access Denied: Inspector account not found. Accounts must be provisioned by Admin.', 'error');
      return false;
    }
  };

  // Dynamically get visits assigned specifically to the logged-in inspector
  const getInspectorVisits = () => {
    const activeInsp = currentInspector || inspectors[0];
    if (!activeInsp) return [];

    // Filter merchants assigned specifically to this inspector
    const assignedMerchants = merchants.filter(
      (m) => m.assignedInspector && m.assignedInspector.toLowerCase() === activeInsp.name.toLowerCase()
    );

    return assignedMerchants.map((m, idx) => {
      const existing = visits.find((v) => v.shopName === m.name);
      if (existing) {
        return {
          ...existing,
          assignedOfficer: activeInsp.name,
          officerBadge: `Badge #${activeInsp.badgeNumber}`
        };
      }
      return {
        id: `visit-dyn-${m.id}`,
        timeSlot: idx === 0 ? '10:00 AM – 11:30 AM' : idx === 1 ? '12:00 PM – 1:00 PM' : '02:30 PM – 03:30 PM',
        timeRelative: idx === 0 ? 'NEXT UP • Assigned by Admin' : `Slot ${idx + 1}`,
        isNextUp: idx === 0,
        shopName: m.name,
        regNumber: `Reg #${m.tradeLicense}`,
        address: `${m.zone}, ${m.address}`,
        status: m.complianceStatus === 'Audit Certified' ? 'Audit Completed & Certified' : 'Scheduled for Verification',
        statusType: m.complianceStatus === 'Audit Certified' ? 'completed' : idx === 0 ? 'pending' : 'scheduled',
        instrumentName: 'Commercial Electronic Weighing Instrument',
        model: 'Standard Calibration Model',
        specification: 'Max 30kg (e=1g)',
        classBadge: 'Class III Commercial',
        applicationRef: `METRA-${activeInsp.badgeNumber}-${m.merchantUid.replace('#', '')}`,
        assignedOfficer: activeInsp.name,
        officerBadge: `Badge #${activeInsp.badgeNumber}`
      };
    });
  };

  // Start Inspection for a specific shop on inspector route
  const handleStartInspection = (visit) => {
    setStoreInfo((prev) => ({
      ...prev,
      name: visit.shopName,
      regNumber: visit.regNumber,
      location: visit.address,
      zone: currentInspector?.zone || prev.zone,
      assignedInspector: currentInspector?.name || prev.assignedInspector
    }));
    setCurrentView('field-inspection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authenticated Shop Owner Login
  const handleMerchantLogin = (email, password) => {
    const match = merchants.find(
      (m) => m.email.toLowerCase() === email.trim().toLowerCase() && m.password === password
    );

    if (match) {
      setStoreInfo((prev) => ({
        ...prev,
        name: match.name,
        merchantUid: match.merchantUid,
        regNumber: match.tradeLicense,
        location: match.address,
        contactPerson: match.ownerName,
        phone: match.phone,
        zone: match.zone
      }));
      setActiveRole('shop-owner');
      setCurrentView('shop-dashboard');
      showToast(`Welcome back, ${match.ownerName} (${match.name})!`, 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return true;
    } else {
      showToast('Invalid merchant credentials. Please check your email or register a new store account.', 'error');
      return false;
    }
  };

  // Shop Owner Self-Registration (Creates account and becomes immediately visible in Admin)
  const handleRegisterMerchant = (data) => {
    const uid = `#EST-${Math.floor(10000 + Math.random() * 90000)}`;
    const newMerch = {
      id: `merch-${Date.now()}`,
      name: data.name || 'New Retail Store',
      ownerName: data.ownerName || 'Merchant Owner',
      email: data.email || `store${Math.floor(100 + Math.random() * 900)}@metrx.com`,
      password: data.password || '12345678',
      merchantUid: uid,
      tradeLicense: data.tradeLicense || `BBMP/TL/2025/${Math.floor(1000 + Math.random() * 9000)}`,
      zone: data.zone || 'Ward 4 (Commercial Circle)',
      address: data.address || 'Market Road, Bengaluru',
      phone: data.phone || '+91 98000 00000',
      registeredScales: Number(data.registeredScales) || 1,
      complianceStatus: 'Pending Inspector Assignment',
      assignedInspector: null,
      createdAt: 'Today'
    };

    setMerchants((prev) => [newMerch, ...prev]);

    // Also add an initial scale for this new shop
    const newScale = {
      id: `inst-${Date.now()}`,
      name: `${data.scaleType || 'Electronic Counter'} Scale`,
      model: data.scaleModel || 'Digital Metrology Model 2025',
      capacity: '30kg / 1g precision',
      serialNumber: `#KA-BLR-${Math.floor(10000 + Math.random() * 90000)}`,
      counter: 'Counter 1',
      status: 'Initial Verification Due',
      verificationStatusText: 'Stamping Pending Inspection',
      daysRemaining: 30,
      totalDaysCycle: 365,
      expiresOn: 'Within 30 Days',
      sealNumber: 'SEAL-PENDING',
      complianceRate: '100%',
      type: 'counter_scale',
      class: 'Class III Commercial'
    };
    setInstruments([newScale]);

    setStoreInfo({
      name: newMerch.name,
      regNumber: newMerch.tradeLicense,
      merchantUid: newMerch.merchantUid,
      location: newMerch.address,
      division: 'Bengaluru Central Division',
      contactPerson: newMerch.ownerName,
      phone: newMerch.phone,
      zone: newMerch.zone,
      assignedInspector: 'Pending Admin Allocation',
      certificateId: 'PENDING'
    });

    setActiveRole('shop-owner');
    setCurrentView('shop-dashboard');
    showToast(`Store registered successfully! Merchant UID: ${uid}. Account synced with Admin.`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return newMerch;
  };

  // Admin Assigns / Reassigns Inspector to a Merchant Store
  const handleAssignInspectorToMerchant = (merchantId, inspectorId) => {
    const selectedInspector = inspectors.find((insp) => insp.id === inspectorId);
    if (!selectedInspector) {
      showToast('Please select a valid inspector', 'error');
      return;
    }

    let targetMerchant = null;

    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === merchantId) {
          targetMerchant = m;
          return {
            ...m,
            assignedInspector: selectedInspector.name,
            assignedInspectorBadge: selectedInspector.badgeNumber,
            complianceStatus: 'Inspector Assigned'
          };
        }
        return m;
      })
    );

    // Sync with Operations Queue
    const merchantName = targetMerchant ? targetMerchant.name : 'Store';
    const merchantUid = targetMerchant ? targetMerchant.merchantUid : '#EST-NEW';
    const zoneName = targetMerchant ? targetMerchant.zone : 'Ward 4';

    setOperations((prev) => {
      const existingIdx = prev.findIndex((op) => op.shopName === merchantName);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          inspectorName: selectedInspector.name,
          badgeNumber: selectedInspector.badgeNumber,
          remarks: `Reassigned by Department Admin to ${selectedInspector.name}`
        };
        return updated;
      } else {
        const newOp = {
          id: `OP-${Date.now()}`,
          inspectorName: selectedInspector.name,
          badgeNumber: selectedInspector.badgeNumber,
          shopName: merchantName,
          merchantUid: merchantUid,
          zone: zoneName.split(' ')[0] || 'Ward 4',
          operationType: 'On-Site Stamping & Verification',
          scaleModel: 'Commercial Electronic Scale',
          slot: '11:30 AM – 01:00 PM (Assigned Slot)',
          liveStatus: 'Assigned / Route Slotted',
          statusType: 'scheduled',
          remarks: `Assigned by Controller to ${selectedInspector.name}`
        };
        return [newOp, ...prev];
      }
    });

    showToast(`Assigned ${selectedInspector.name} (${selectedInspector.badgeNumber}) to ${merchantName}!`, 'success');
  };

  // Admin Provisions a New Inspector Account
  const handleCreateInspector = (data) => {
    const badgeNum = data.badgeNumber || `LM-BLR-${Math.floor(100 + Math.random() * 900)}`;
    const newInsp = {
      id: `insp-${Date.now()}`,
      name: data.name,
      badgeNumber: badgeNum,
      email: data.email || `${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@metrx.com`,
      password: data.password || '12345678',
      zone: data.zone || 'Ward 4 (Commercial Circle)',
      phone: data.phone || '+91 98000 11223',
      status: 'Active',
      authorizedBy: 'Dr. K. V. Sharma (Admin)',
      issuedAt: 'Today'
    };

    setInspectors((prev) => [newInsp, ...prev]);
    showToast(`Inspector provisioned: ${newInsp.name} (${newInsp.badgeNumber}). Credentials are now live.`, 'success');
    return newInsp;
  };

  // Admin Toggles Inspector Credentials Status
  const handleToggleInspectorStatus = (id) => {
    setInspectors((prev) =>
      prev.map((insp) => {
        if (insp.id === id) {
          const nextStatus = insp.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Inspector ${insp.name} credentials set to ${nextStatus}.`, nextStatus === 'Active' ? 'success' : 'error');
          return { ...insp, status: nextStatus };
        }
        return insp;
      })
    );
  };

  const logout = () => {
    setActiveRole('public');
    setCurrentView('public-portal');
    showToast('Logged out successfully. Returned to Portal.', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    if (view === 'public-portal') {
      setActiveRole('public');
    } else if (view === 'inspector-schedule' || view === 'field-inspection') {
      setActiveRole('inspector');
    } else if (
      view === 'shop-dashboard' ||
      view === 'register-instrument' ||
      view === 'request-verification' ||
      view === 'track-status'
    ) {
      setActiveRole('shop-owner');
    } else if (view === 'admin-dashboard') {
      setActiveRole('admin');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleChecklistItem = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleRegisterInstrument = (instrumentData) => {
    const newInst = {
      id: `inst-${Date.now()}`,
      name: instrumentData.name || 'Electronic Counter Scale',
      model: instrumentData.model || 'Contech Digital Series',
      capacity: instrumentData.capacity || '30 kg / 1g precision',
      serialNumber: instrumentData.serialNumber || `#KA-BLR-${Math.floor(10000 + Math.random() * 90000)}`,
      counter: 'Counter No. 2',
      status: 'Pending Verification',
      verificationStatusText: 'Initial Stamping Schedule Pending',
      daysRemaining: 30,
      totalDaysCycle: 365,
      expiresOn: 'Physical Inspection within 30 Days',
      sealNumber: 'SEAL-PENDING',
      complianceRate: '100%',
      type: instrumentData.type || 'counter_scale',
      class: 'Class III Commercial',
      photoUrl: instrumentData.photoUrl || null
    };

    setInstruments((prev) => [newInst, ...prev]);
    setActiveInstrumentIndex(0);
    showToast(`Instrument ${newInst.serialNumber} registered successfully!`, 'success');
    navigateTo('shop-dashboard');
  };

  // Document Submission & Inspector Review Handlers
  const getDocumentSubmission = (merchantId) => {
    const id = merchantId || 'merch-1';
    return documentSubmissions[id] || {
      merchantId: id,
      shopName: storeInfo.name,
      status: 'not_uploaded',
      submittedAt: null,
      reviewedBy: null,
      reviewedAt: null,
      remarks: 'No statutory documents uploaded yet.',
      docs: {
        businessRegistration: { title: 'Business Registration', subTitle: 'Trade License / GST / Shop & Est. Act Certificate', fileName: null, fileSize: null, uploadedAt: null, status: 'Pending' },
        ownerId: { title: 'Owner ID Proof', subTitle: 'Aadhaar Card / Government Photo ID', fileName: null, fileSize: null, uploadedAt: null, status: 'Pending' },
        purchaseInvoice: { title: 'Purchase Invoice', subTitle: 'Original Scale Purchase Bill / Tax Invoice', fileName: null, fileSize: null, uploadedAt: null, status: 'Pending' },
        instrumentPlate: { title: 'Instrument Plate Photo', subTitle: 'Scale Specification & Serial Number Nameplate', fileName: null, fileSize: null, uploadedAt: null, status: 'Pending' },
        instrumentPhotos: { title: 'Instrument Photos', subTitle: 'Installed Counter Scale Front & Profile View', fileName: null, fileSize: null, uploadedAt: null, status: 'Pending' }
      }
    };
  };

  const handleUploadDocuments = (merchantId, customDocs = null) => {
    const targetId = merchantId || 'merch-1';
    const nowStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    setDocumentSubmissions((prev) => {
      const existing = prev[targetId] || {};
      return {
        ...prev,
        [targetId]: {
          merchantId: targetId,
          shopName: storeInfo.name,
          status: 'pending_review',
          submittedAt: nowStr,
          reviewedBy: currentInspector?.name || 'Insp. R. Deshmukh',
          reviewedAt: null,
          remarks: 'All 5 statutory documents submitted by merchant. Awaiting physical inspection clearance by Inspector.',
          docs: customDocs || {
            businessRegistration: { title: 'Business Registration', subTitle: 'Trade License / GST / Shop & Est. Act Certificate', fileName: 'BBMP_Trade_License_2023_9081.pdf', fileSize: '1.8 MB', uploadedAt: nowStr, status: 'Uploaded' },
            ownerId: { title: 'Owner ID Proof', subTitle: 'Aadhaar Card / Government Photo ID', fileName: 'Shree_Ganesh_Aadhaar_Card.pdf', fileSize: '1.2 MB', uploadedAt: nowStr, status: 'Uploaded' },
            purchaseInvoice: { title: 'Purchase Invoice', subTitle: 'Original Scale Purchase Bill / Tax Invoice', fileName: 'Contech_CA30_Tax_Invoice_Bill.pdf', fileSize: '2.4 MB', uploadedAt: nowStr, status: 'Uploaded' },
            instrumentPlate: { title: 'Instrument Plate Photo', subTitle: 'Scale Specification & Serial Number Nameplate', fileName: 'Contech_Spec_Nameplate_Photo.jpg', fileSize: '3.1 MB', uploadedAt: nowStr, status: 'Uploaded' },
            instrumentPhotos: { title: 'Instrument Photos', subTitle: 'Installed Counter Scale Front & Profile View', fileName: 'Counter_Scale_Front_Installation.jpg', fileSize: '4.5 MB', uploadedAt: nowStr, status: 'Uploaded' }
          }
        }
      };
    });

    setVerificationStatus((prev) => ({
      ...prev,
      documentStatus: 'pending_review',
      step: 2,
      documentsSubmittedAt: nowStr
    }));

    showToast('All 5 statutory documents submitted for Inspector verification!', 'success');
  };

  const handleInspectorReviewDocuments = (merchantId, decision, remarks = '') => {
    const targetId = merchantId || 'merch-1';
    const nowStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const inspector = currentInspector?.name || 'Insp. R. Deshmukh';

    setDocumentSubmissions((prev) => {
      const existing = prev[targetId] || getDocumentSubmission(targetId);
      return {
        ...prev,
        [targetId]: {
          ...existing,
          status: decision, // 'verified' | 'fraud'
          reviewedBy: inspector,
          reviewedAt: nowStr,
          remarks: remarks || (decision === 'verified' ? 'All 5 statutory documents & instrument plate serial match standard specifications.' : 'Discrepancy detected in model plate/invoice. Flagged as Fraud under LM Act 2009.')
        }
      };
    });

    // Update global verification status if on active merchant
    setVerificationStatus((prev) => ({
      ...prev,
      documentStatus: decision,
      step: decision === 'verified' ? 2 : 2
    }));

    // Update merchant compliance status
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === targetId || m.name === storeInfo.name) {
          return {
            ...m,
            complianceStatus: decision === 'verified' ? 'Documents Verified' : 'Flagged as Fraud / Counterfeit'
          };
        }
        return m;
      })
    );

    if (decision === 'verified') {
      showToast(`Verification Approved: Documents for ${targetId} marked VERIFIED. Merchant can now schedule inspection visit.`, 'success');
    } else {
      showToast(`ALERT: Application for ${targetId} flagged as FRAUD. Under LM Act Sec 30, visit scheduling is blocked.`, 'error');
    }
  };

  const handleConfirmVerification = (slotId) => {
    const targetId = 'merch-1';
    const currentDocState = documentSubmissions[targetId]?.status || verificationStatus.documentStatus;

    if (currentDocState === 'fraud') {
      showToast('Action Blocked: Legal Metrology Officer has flagged submitted documentation as Fraudulent. Visit scheduling is prohibited.', 'error');
      return;
    }

    if (currentDocState !== 'verified') {
      showToast('Action Blocked: You must upload the 5 statutory documents and obtain Inspector verification before choosing a visit slot.', 'error');
      navigateTo('upload-documents');
      return;
    }

    setSelectedSlot(slotId);
    let dateStr = 'Thu, 16 Jan 2025';
    let timeStr = '10 AM – 1 PM';
    if (slotId === 'slot_2') {
      dateStr = 'Fri, 17 Jan 2025';
      timeStr = '2 PM – 5 PM';
    } else if (slotId === 'slot_3') {
      dateStr = 'Mon, 20 Jan 2025';
      timeStr = '10 AM – 1 PM';
    }

    setVerificationStatus((prev) => ({
      ...prev,
      status: 'scheduled',
      documentStatus: 'verified',
      step: 3,
      slotLabel: dateStr,
      timeLabel: timeStr
    }));

    showToast(`Inspection slot booked for ${dateStr}! Track appointment below.`, 'success');
    navigateTo('track-status');
  };

  const handleCompleteInspection = (notes = '') => {
    // 1. Advance verification request status (Step 5: Certified)
    setVerificationStatus((prev) => ({
      ...prev,
      status: 'certified',
      step: 5
    }));

    // 2. Mark instrument as re-certified
    setInstruments((prev) => {
      const copy = [...prev];
      if (copy[0]) {
        copy[0] = {
          ...copy[0],
          status: 'Verified & Compliant',
          daysRemaining: 365,
          expiresOn: '16 Jan 2026',
          sealNumber: 'SEAL-LM-BLR-2025-0428'
        };
      }
      return copy;
    });

    // 3. Update certificate details
    const newCertId = `CERT-KA-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    setCertificateData((prev) => ({
      ...prev,
      certId: newCertId,
      daysLeft: 365,
      validUntil: '16 Jan 2026',
      verifiedDate: '16 Jan 2025',
      inspectorSeal: 'SEAL-LM-BLR-2025-0428'
    }));

    // 4. Update the inspector visits queue
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === 'visit-1' || v.isNextUp) {
          return {
            ...v,
            isNextUp: false,
            status: 'Inspection Completed & Certified',
            statusType: 'completed',
            timeRelative: 'Completed'
          };
        }
        if (v.id === 'visit-2') {
          return {
            ...v,
            isNextUp: true,
            timeRelative: 'NEXT UP • In 15 mins'
          };
        }
        return v;
      })
    );

    // 5. Update operations for admin view
    setOperations((prev) =>
      prev.map((op) =>
        op.id === 'OP-101'
          ? {
              ...op,
              liveStatus: 'Completed & Hologram Stamped',
              statusType: 'completed',
              remarks: `Verification Passed. Certificate ${newCertId} issued.`
            }
          : op
      )
    );

    // 6. Update state registry
    setRegistry((prev) => [
      {
        id: `reg-${Date.now()}`,
        certId: newCertId,
        shopName: storeInfo.name,
        merchantUid: storeInfo.merchantUid,
        zone: storeInfo.zone,
        instrument: 'Electronic Countertop Scale',
        serial: '#KA-BLR-88412',
        expiryDate: '16 Jan 2026',
        inspector: 'Insp. R. Deshmukh',
        status: 'Compliant'
      },
      ...prev.filter((r) => r.shopName !== storeInfo.name)
    ]);

    showToast(`Verification completed! Certificate ${newCertId} issued. Returning to Inspector Route.`, 'success');

    setActiveRole('inspector');
    setCurrentView('inspector-schedule');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Multi-Shop Management Handlers
  const handleSelectOwnerShop = (index) => {
    const targetShop = ownerShops[index];
    if (!targetShop) return;
    setActiveShopIndexState(index);

    setStoreInfo({
      name: targetShop.name,
      regNumber: targetShop.tradeLicense,
      merchantUid: targetShop.merchantUid,
      location: targetShop.address,
      division: 'Bengaluru Central Division',
      contactPerson: targetShop.ownerName,
      phone: targetShop.phone,
      zone: targetShop.zone,
      assignedInspector: targetShop.assignedInspector || 'Insp. R. Deshmukh',
      certificateId: targetShop.certificationHistory?.[0]?.certId || 'CERT-KA-2024-9921',
      gstin: targetShop.gstin,
      shopActReg: targetShop.shopActReg,
      branchType: targetShop.branchType
    });

    if (targetShop.instruments && targetShop.instruments.length > 0) {
      setInstruments(targetShop.instruments);
      setActiveInstrumentIndex(0);
    }

    setVerificationStatus((prev) => ({
      ...prev,
      documentStatus: targetShop.documentStatus || 'verified',
      step: targetShop.documentStatus === 'verified' ? 2 : 2,
      inspectorName: targetShop.assignedInspector || 'Insp. R. Deshmukh'
    }));

    showToast(`Switched active establishment to ${targetShop.name}`, 'info');
  };

  const handleAddOwnerShop = (newShopData) => {
    const uid = `#EST-${Math.floor(10000 + Math.random() * 90000)}`;
    const newShop = {
      id: `shop-ganesh-${Date.now()}`,
      name: newShopData.name || 'Ganesh Retail Branch',
      ownerName: storeInfo.contactPerson || 'Shree S. N. Ganesh',
      branchType: newShopData.branchType || 'Commercial Retail Branch',
      merchantUid: uid,
      tradeLicense: newShopData.tradeLicense || `BBMP/TL/2025/${Math.floor(1000 + Math.random() * 9000)}`,
      gstin: newShopData.gstin || `29AABCU9603R${Math.floor(4 + Math.random() * 5)}ZP`,
      shopActReg: `KA/BLR/${Math.floor(10000 + Math.random() * 90000)}/2025`,
      zone: newShopData.zone || 'Ward 4 (Commercial Circle)',
      address: newShopData.address || 'Commercial Road, Bengaluru',
      phone: newShopData.phone || storeInfo.phone || '+91 98450 21980',
      assignedInspector: 'Insp. R. Deshmukh',
      inspectorBadge: 'LM-BLR-402',
      status: 'Active Commercial Establishment',
      complianceStatus: 'Pending Inspector Verification',
      documentStatus: 'pending_review',
      registeredScalesCount: 1,
      instruments: [
        {
          id: `inst-${Date.now()}`,
          name: `${newShopData.scaleType || 'Electronic Counter'} Scale`,
          model: newShopData.scaleModel || 'Contech Digital Standard',
          capacity: '30kg / 1g precision',
          serialNumber: `#KA-BLR-${Math.floor(10000 + Math.random() * 90000)}`,
          counter: 'Counter 1',
          status: 'Initial Verification Due',
          verificationStatusText: 'Awaiting Inspector Stamping',
          daysRemaining: 30,
          totalDaysCycle: 365,
          expiresOn: 'Within 30 Days',
          sealNumber: 'SEAL-PENDING',
          complianceRate: '100%',
          type: 'counter_scale',
          class: 'Class III Commercial'
        }
      ],
      certificationHistory: []
    };

    setOwnerShops((prev) => [...prev, newShop]);
    setMerchants((prev) => [
      {
        id: newShop.id,
        name: newShop.name,
        ownerName: newShop.ownerName,
        email: storeInfo.email || 'ganesh@store.com',
        password: '12345678',
        merchantUid: newShop.merchantUid,
        tradeLicense: newShop.tradeLicense,
        zone: newShop.zone,
        address: newShop.address,
        phone: newShop.phone,
        registeredScales: 1,
        complianceStatus: 'Pending Inspector Assignment',
        assignedInspector: 'Insp. R. Deshmukh',
        createdAt: 'Today'
      },
      ...prev
    ]);

    showToast(`New shop branch "${newShop.name}" added successfully!`, 'success');
  };

  const handleViewHistoricalCertificate = (cert) => {
    setCertificateData({
      certId: cert.certId,
      ruleForm: cert.ruleForm || 'Form XVII (Rule 14)',
      actYear: cert.actYear || 'Act of 2009',
      statusBadge: cert.statusBadge || 'VERIFIED & COMPLIANT',
      daysLeft: 365,
      validUntil: cert.validUntil || '12 Jan 2026',
      verifiedDate: cert.verifiedDate || '13 Jan 2025',
      inspectorSeal: cert.inspectorSeal || 'SEAL-LM-BLR-0428',
      instrumentModel: cert.instrumentModel || 'Contech CA-30 (Max 30kg, e=1g)',
      shopLocation: `${storeInfo.name}, ${storeInfo.zone}`,
      workingStandardRef: cert.workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)',
      digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
      calibrationTests: testCalibrationData
    });
    navigateTo('certificate-view');
  };

  const handleSearchCertificate = (query) => {
    const q = (query || '').trim().toLowerCase();
    if (!q) {
      showToast('Please enter a certificate ID or shop name to search', 'error');
      return;
    }

    const match = registry.find(
      (r) =>
        r.certId.toLowerCase().includes(q) ||
        r.serial.toLowerCase().includes(q) ||
        r.merchantUid.toLowerCase().includes(q) ||
        r.shopName.toLowerCase().includes(q)
    );

    if (match) {
      showToast(`Verified record found for ${match.shopName}!`, 'success');
      setCertificateData((prev) => ({
        ...prev,
        certId: match.certId,
        shopLocation: `${match.shopName}, ${match.zone}`,
        instrumentModel: match.instrument,
        validUntil: match.expiryDate,
        inspectorSeal: match.stampSeal || 'SEAL-LM-BLR-0428'
      }));
      navigateTo('certificate-view');
    } else {
      showToast(`Verification query "${query}" found on National Registry.`, 'success');
      navigateTo('certificate-view');
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigateTo,
        activeRole,
        login,
        logout,
        handleAdminLogin,
        handleInspectorLogin,
        handleMerchantLogin,
        handleRegisterMerchant,
        handleAssignInspectorToMerchant,
        handleCreateInspector,
        handleToggleInspectorStatus,
        currentInspector,
        getInspectorVisits,
        handleStartInspection,
        inspectors,
        merchants,
        operations,
        ownerShops,
        activeShopIndex,
        handleSelectOwnerShop,
        handleAddOwnerShop,
        handleViewHistoricalCertificate,
        adminCredentials: ADMIN_CREDENTIALS,
        language,
        setLanguage,
        storeInfo,
        instruments,
        activeInstrument: instruments[activeInstrumentIndex] || instruments[0],
        activeInstrumentIndex,
        setActiveInstrumentIndex,
        visits,
        checklist,
        toggleChecklistItem,
        registry,
        selectedSlot,
        verificationStatus,
        documentSubmissions,
        handleUploadDocuments,
        handleInspectorReviewDocuments,
        getDocumentSubmission,
        certificateData,
        handleRegisterInstrument,
        handleConfirmVerification,
        handleCompleteInspection,
        handleSearchCertificate,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
