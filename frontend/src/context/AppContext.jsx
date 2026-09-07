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
  // Roles: 'shop-owner' | 'inspector' | 'public'
  const [activeRole, setActiveRole] = useState('shop-owner');
  const [currentView, setCurrentView] = useState('shop-dashboard');
  const [language, setLanguage] = useState('EN'); // 'EN' | 'HI'
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  // Interactive Tour Guided Step (1: Scale Due, 2: Book Visit, 3: Track Visit, 4: Inspector Audit, 5: Certificate Issued)
  const [tourStep, setTourStep] = useState(1);
  const [isTourBannerVisible, setIsTourBannerVisible] = useState(true);

  // Domain Data State
  const [storeInfo, setStoreInfo] = useState(initialStoreInfo);
  const [instruments, setInstruments] = useState(initialInstruments);
  const [activeInstrumentIndex, setActiveInstrumentIndex] = useState(0);
  const [visits, setVisits] = useState(inspectorVisits);
  const [checklist, setChecklist] = useState(defaultInspectionChecklist);
  const [registry, setRegistry] = useState(stateComplianceRegistry);

  // Verification Request flow state
  const [selectedSlot, setSelectedSlot] = useState('slot_1');
  const [verificationStatus, setVerificationStatus] = useState({
    status: 'scheduled', // 'requested' | 'scheduled' | 'inspected' | 'certified'
    step: 2, // 1 to 4
    applicationRef: 'METRA-BLR-2025-084-V',
    slotLabel: 'Thu, 16 Jan 2025',
    timeLabel: '10 AM – 1 PM',
    inspectorName: 'Mr. R. Deshmukh',
    inspectorBadge: 'LM-BLR-402',
    zone: 'Zone 4 (Central)',
    requestedAt: '10 Jan, 09:30 AM',
    fee: 150,
    feeStatus: 'Payable on-site / UPI'
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

  // Global search input
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const switchRole = (newRole) => {
    setActiveRole(newRole);
    if (newRole === 'shop-owner') {
      setCurrentView('shop-dashboard');
    } else if (newRole === 'inspector') {
      setCurrentView('inspector-schedule');
    } else if (newRole === 'public') {
      setCurrentView('public-portal');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    // Align role with target view
    if (view === 'public-portal') {
      setActiveRole('public');
    } else if (view === 'inspector-schedule' || view === 'field-inspection' || view === 'state-registry') {
      setActiveRole('inspector');
    } else if (
      view === 'shop-dashboard' ||
      view === 'register-instrument' ||
      view === 'request-verification' ||
      view === 'track-status' ||
      view === 'certificate-view'
    ) {
      setActiveRole('shop-owner');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const jumpToTourStep = (stepNumber) => {
    setTourStep(stepNumber);
    if (stepNumber === 1) {
      setActiveRole('shop-owner');
      setCurrentView('shop-dashboard');
      showToast('Step 1: Notice your shop scale has 28 days before annual expiry.', 'info');
    } else if (stepNumber === 2) {
      setActiveRole('shop-owner');
      setCurrentView('request-verification');
      showToast('Step 2: Select a convenient time window for the inspector to visit your shop.', 'info');
    } else if (stepNumber === 3) {
      setActiveRole('shop-owner');
      setCurrentView('track-status');
      showToast('Step 3: Track your appointment. Assigned inspector: Mr. R. Deshmukh.', 'info');
    } else if (stepNumber === 4) {
      setActiveRole('inspector');
      setCurrentView('field-inspection');
      showToast('Step 4 (Inspector View): Test calibration weights and apply the tamper seal.', 'info');
    } else if (stepNumber === 5) {
      setActiveRole('shop-owner');
      setCurrentView('certificate-view');
      showToast('Step 5: Scale certified! View, print or download your official digital certificate.', 'success');
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

  const handleConfirmVerification = (slotId) => {
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
      step: 2,
      slotLabel: dateStr,
      timeLabel: timeStr
    }));

    setTourStep(3);
    showToast(`Inspection slot booked for ${dateStr}! Track appointment below.`, 'success');
    navigateTo('track-status');
  };

  const handleCompleteInspection = (notes = '') => {
    // 1. Advance verification request status
    setVerificationStatus((prev) => ({
      ...prev,
      status: 'certified',
      step: 4
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

    setTourStep(5);
    showToast(`Verification completed! Certificate ${newCertId} issued.`, 'success');
    navigateTo('certificate-view');
  };

  const handleSearchCertificate = (query) => {
    const q = (query || searchQuery).trim().toLowerCase();
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
        inspectorSeal: match.stampSeal
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
        switchRole,
        isRoleModalOpen,
        setIsRoleModalOpen,
        language,
        setLanguage,
        tourStep,
        jumpToTourStep,
        isTourBannerVisible,
        setIsTourBannerVisible,
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
        certificateData,
        handleRegisterInstrument,
        handleConfirmVerification,
        handleCompleteInspection,
        handleSearchCertificate,
        searchQuery,
        setSearchQuery,
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
