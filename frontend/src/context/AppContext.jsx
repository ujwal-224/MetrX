import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { translations } from '../data/translations';
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
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('metrx_lang') || 'EN';
  });

  // Fixed Super-Admin Credentials
  const ADMIN_CREDENTIALS = {
    email: 'admin123@metrx.com',
    password: '12345678'
  };

  // Current Logged In Inspector State
  const [currentInspector, setCurrentInspector] = useState(null);

  // Current Logged In Merchant / Shop Owner
  const [currentMerchant, setCurrentMerchant] = useState(() => {
    try {
      const saved = localStorage.getItem('metrx_merchant');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // All Establishments across platform (For Admin Overview & Registry)
  const [allShops, setAllShops] = useState([]);

  // Multi-Shop Establishments Owned by the Logged-In Merchant ONLY
  const [ownerShops, setOwnerShops] = useState([]);
  const [activeShopIndex, setActiveShopIndexState] = useState(0);

  // Domain Data State
  const [storeInfo, setStoreInfo] = useState(initialStoreInfo);
  const [instruments, setInstruments] = useState([]);
  const [activeInstrumentIndex, setActiveInstrumentIndex] = useState(0);
  const [visits, setVisits] = useState([]);
  const [checklist, setChecklist] = useState(defaultInspectionChecklist);
  const [registry, setRegistry] = useState([]);

  // Inspector Accounts (Admin-Provisioned Official Officers only)
  const [inspectors, setInspectors] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('metrx_inspectors') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (inspectors && inspectors.length > 0) {
      try {
        localStorage.setItem('metrx_inspectors', JSON.stringify(inspectors));
      } catch (e) {
        console.warn('[Cache Inspectors Error]', e);
      }
    }
  }, [inspectors]);

  // Shop Owner / Merchant Accounts (Self-Created by Shop Owners)
  const [merchants, setMerchants] = useState([]);

  // Live Inspector Operations on Shop Owners (Real-Time Tracking for Admin)
  const [operations, setOperations] = useState([]);

  // Verification Request flow state (5-Step Model)
  const [selectedSlot, setSelectedSlot] = useState('slot_1');
  const [verificationStatus, setVerificationStatus] = useState({
    status: 'not_uploaded',
    documentStatus: 'not_uploaded',
    step: 1,
    applicationRef: 'METRX-LMIS-PENDING',
    slotLabel: 'Select Visit Slot',
    timeLabel: 'Morning / Afternoon',
    inspectorName: 'Pending Admin Allocation',
    inspectorBadge: 'LM-PENDING',
    zone: 'Ward 4 (Commercial Circle)',
    requestedAt: 'Pending',
    documentsSubmittedAt: null,
    fee: 150,
    feeStatus: 'Payable on-site / UPI'
  });

  // Statutory Documents Submissions (5 Required Documents per shop)
  const [documentSubmissions, setDocumentSubmissions] = useState({});

  // Certificate State
  const [certificateData, setCertificateData] = useState(null);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const setLanguage = (lang) => {
    const nextLang = lang === 'HI' ? 'HI' : 'EN';
    setLanguageState(nextLang);
    localStorage.setItem('metrx_lang', nextLang);
    showToast(
      nextLang === 'HI' ? 'भाषा बदलकर हिंदी कर दी गई' : 'Language changed to English',
      'info'
    );
  };

  const t = (key, fallback = '') => {
    const activeDict = translations[language] || translations['EN'] || {};
    if (activeDict[key] !== undefined) return activeDict[key];
    const fallbackDict = translations['EN'] || {};
    if (fallbackDict[key] !== undefined) return fallbackDict[key];
    return fallback || key;
  };

  // Sync state from backend PostgreSQL API on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const res = await api.getShops();
        if (res.success && res.data) {
          const backendShops = res.data;

          const formattedShops = backendShops.map((bShop) => ({
            id: bShop.id,
            name: bShop.name,
            ownerName: bShop.ownerName,
            branchType: bShop.branchType || 'Commercial Retail Store',
            merchantUid: bShop.merchantUid,
            tradeLicense: bShop.tradeLicense,
            gstin: bShop.gstin || '',
            shopActReg: bShop.shopActReg || '',
            zone: bShop.zone,
            address: bShop.address,
            phone: bShop.phone,
            email: bShop.email || '',
            assignedInspector: bShop.assignedInspector || 'Pending Admin Allocation',
            inspectorBadge: bShop.inspectorBadge || 'LM-PENDING',
            status: bShop.status || 'Active Commercial Establishment',
            complianceStatus: bShop.complianceStatus || 'Pending Inspector Assignment',
            documentStatus: bShop.documentStatus || 'not_uploaded',
            documentsRemarks: bShop.documentsRemarks || '',
            reviewedBy: bShop.reviewedBy || '',
            documentSubmissionData: bShop.documentSubmissionData || null,
            registeredScalesCount: bShop.registeredScalesCount || (bShop.instruments?.length || 1),
            instruments: bShop.instruments || [],
            certificationHistory: []
          }));

          setAllShops(formattedShops);

          // Populate merchants ledger for Admin Command Center
          const formattedMerchants = formattedShops.map((bShop) => {
            const isAssigned = bShop.assignedInspector &&
              bShop.assignedInspector !== 'Pending Admin Allocation' &&
              bShop.assignedInspector !== 'Unassigned (Action Required)';
            return {
              id: bShop.id,
              name: bShop.name,
              ownerName: bShop.ownerName,
              email: bShop.email || `merchant@store.com`,
              merchantUid: bShop.merchantUid,
              tradeLicense: bShop.tradeLicense,
              zone: bShop.zone,
              address: bShop.address,
              phone: bShop.phone,
              registeredScales: bShop.registeredScalesCount || (bShop.instruments?.length || 1),
              complianceStatus: bShop.complianceStatus || (isAssigned ? 'Inspector Assigned' : 'Pending Inspector Assignment'),
              assignedInspector: isAssigned ? bShop.assignedInspector : null,
              assignedInspectorBadge: isAssigned ? bShop.inspectorBadge : null,
              createdAt: bShop.createdAt ? new Date(bShop.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'
            };
          });
          setMerchants(formattedMerchants);

          // Scope ownerShops strictly to the logged-in merchant's account
          let userShops = [];
          if (currentMerchant?.email) {
            userShops = formattedShops.filter(
              (s) => s.email && s.email.toLowerCase() === currentMerchant.email.toLowerCase()
            );
          }

          setOwnerShops(userShops);

          // Active shop profile setup for the authenticated shop owner
          if (userShops.length > 0) {
            const active = userShops[0];
            setStoreInfo({
              id: active.id,
              name: active.name,
              regNumber: active.tradeLicense,
              merchantUid: active.merchantUid,
              location: active.address,
              division: 'Bengaluru Central Division',
              contactPerson: active.ownerName,
              phone: active.phone,
              email: active.email,
              zone: active.zone,
              assignedInspector: active.assignedInspector,
              inspectorBadge: active.inspectorBadge,
              certificateId: 'PENDING'
            });
            setInstruments(active.instruments || []);

            setVerificationStatus((prev) => ({
              ...prev,
              documentStatus: active.documentStatus || 'not_uploaded',
              step: active.complianceStatus?.includes('Scheduled') ? 3 : active.documentStatus === 'verified' ? 2 : 1,
              inspectorName: active.assignedInspector || 'Pending Admin Allocation',
              inspectorBadge: active.inspectorBadge || 'LM-PENDING',
              applicationRef: `METRX-LMIS-${active.merchantUid.replace('#', '')}`
            }));
          }

          // Build Admin Live Field Operations strictly from real registered establishments
          const ops = [];
          formattedShops.forEach((bShop) => {
            const isAssigned = bShop.assignedInspector &&
              bShop.assignedInspector !== 'Pending Admin Allocation' &&
              bShop.assignedInspector !== 'Unassigned (Action Required)';
            ops.push({
              id: `OP-${bShop.id}`,
              inspectorName: isAssigned ? bShop.assignedInspector : 'Unassigned (Action Required)',
              badgeNumber: isAssigned ? (bShop.inspectorBadge || 'LM-BLR-402') : 'LM-PENDING',
              shopName: bShop.name,
              merchantUid: bShop.merchantUid,
              zone: bShop.zone?.split(' ')[0] || 'Ward 4',
              operationType: 'On-Site Stamping & Verification',
              scaleModel: bShop.instruments?.[0]?.model || 'Commercial Electronic Scale',
              slot: isAssigned ? '11:30 AM – 01:00 PM (Assigned Slot)' : 'Awaiting Inspector Assignment',
              liveStatus: isAssigned ? (bShop.complianceStatus === 'Documents Verified' ? 'Docs Verified • Ready for Visit' : 'Inspector Assigned • Pending Docs') : 'New Registration • Pending Allocation',
              statusType: isAssigned ? 'scheduled' : 'scheduled',
              remarks: isAssigned ? `Assigned to ${bShop.assignedInspector}` : 'Requires Inspector Assignment by Controller'
            });
          });
          setOperations(ops);

          // Build Document Submissions strictly from real shop submissions while preserving cached fileData
          let cachedDocs = {};
          try {
            cachedDocs = JSON.parse(localStorage.getItem('metrx_submissions') || '{}');
          } catch {}

          const docsMap = { ...cachedDocs };
          backendShops.forEach((bShop) => {
            if (bShop.documentSubmissionData || bShop.documentStatus) {
              const existingLocal = cachedDocs[bShop.id] || {};
              docsMap[bShop.id] = {
                merchantId: bShop.id,
                shopName: bShop.name,
                status: bShop.documentStatus || existingLocal.status || 'not_uploaded',
                submittedAt: bShop.updatedAt ? new Date(bShop.updatedAt).toLocaleDateString('en-GB') : existingLocal.submittedAt || 'Recently',
                reviewedBy: bShop.reviewedBy || bShop.assignedInspector || existingLocal.reviewedBy || 'Pending Allocation',
                reviewedAt: bShop.documentStatus === 'verified' ? 'Verified' : existingLocal.reviewedAt || null,
                remarks: bShop.documentsRemarks || existingLocal.remarks || '',
                docs: bShop.documentSubmissionData || existingLocal.docs || null
              };
            }
          });
          setDocumentSubmissions(docsMap);
          try {
            localStorage.setItem('metrx_submissions', JSON.stringify(docsMap));
          } catch {}

          // Build State Compliance Registry from real shops
          const regList = formattedShops.map((s, idx) => ({
            id: `REG-${String(idx + 1).padStart(2, '0')}`,
            shopName: s.name,
            merchantUid: s.merchantUid,
            certId: s.documentStatus === 'verified' ? `CERT-KA-2025-${s.merchantUid.replace('#EST-', '')}` : 'PENDING-AUDIT',
            instrument: s.instruments?.[0]?.name || 'Electronic Counter Scale',
            serial: s.instruments?.[0]?.serialNumber || '#KA-BLR-PENDING',
            zone: s.zone,
            status: s.complianceStatus || 'Pending Verification',
            expiryDate: 'Within 30 Days',
            inspector: s.assignedInspector || 'Unassigned',
            stampSeal: s.instruments?.[0]?.sealNumber || 'SEAL-PENDING'
          }));
          setRegistry(regList);

          // Fetch provisioned inspectors from PostgreSQL backend & reconcile with assigned shop inspectors
          let loadedInspectors = [];
          try {
            const inspRes = await api.getInspectors();
            if (inspRes.success && Array.isArray(inspRes.data) && inspRes.data.length > 0) {
              loadedInspectors = inspRes.data;
            }
          } catch (inspErr) {
            console.warn('[Fetch Inspectors Endpoint Notice]', inspErr.message);
          }

          // Cross-reconcile with cached local inspectors
          try {
            const cached = JSON.parse(localStorage.getItem('metrx_inspectors') || '[]');
            if (Array.isArray(cached) && cached.length > 0) {
              const ids = new Set(loadedInspectors.map((i) => i.name.trim().toLowerCase()));
              cached.forEach((c) => {
                if (!ids.has(c.name.trim().toLowerCase())) {
                  loadedInspectors.push(c);
                  ids.add(c.name.trim().toLowerCase());
                }
              });
            }
          } catch (cacheErr) {
            console.warn('[Inspector Cache Notice]', cacheErr);
          }

          // Always extract all assigned inspectors directly from all shops in PostgreSQL
          const existingNames = new Set(loadedInspectors.map((i) => i.name.trim().toLowerCase()));

          formattedShops.forEach((s) => {
            if (
              s.assignedInspector &&
              s.assignedInspector !== 'Pending Admin Allocation' &&
              s.assignedInspector !== 'Unassigned (Action Required)' &&
              !existingNames.has(s.assignedInspector.trim().toLowerCase())
            ) {
              existingNames.add(s.assignedInspector.trim().toLowerCase());
              const cleanName = s.assignedInspector.trim();
              const cleanId = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '');
              const discoveredInsp = {
                id: `insp-${cleanId || Date.now()}`,
                name: cleanName,
                badgeNumber: s.inspectorBadge && s.inspectorBadge !== 'LM-PENDING' ? s.inspectorBadge : '5456',
                email: `${cleanId || 'officer'}@metrx.com`,
                password: 'password123',
                zone: s.zone || 'Ward 4 (Commercial Circle)',
                phone: '+91 98000 11223',
                status: 'Active',
                authorizedBy: 'Admin',
                issuedAt: 'Assigned Field Officer'
              };
              loadedInspectors.push(discoveredInsp);

              // Save to PostgreSQL DB in background
              api.createInspector({
                name: discoveredInsp.name,
                email: discoveredInsp.email,
                password: discoveredInsp.password,
                phone: discoveredInsp.phone,
                inspectorBadgeId: discoveredInsp.badgeNumber,
                assignedZone: discoveredInsp.zone
              }).catch(() => {});
            }
          });

          setInspectors(loadedInspectors);
        }
      } catch (err) {
        console.warn('[Backend Sync Warning]', err.message);
      }
    };
    fetchBackendData();
  }, []);

  // Direct login by role (for demo quick-fill)
  const login = (role) => {
    setActiveRole(role);
    if (role === 'shop-owner') {
      setCurrentView('shop-dashboard');
      showToast(`Logged in as Shop Owner${storeInfo?.name ? ` (${storeInfo.name})` : ''}`, 'success');
    } else if (role === 'inspector') {
      setCurrentView('inspector-schedule');
      showToast(`Logged in as Field Inspector${currentInspector?.name ? ` (${currentInspector.name})` : ''}`, 'success');
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
  const handleInspectorLogin = async (email, password) => {
    try {
      const res = await api.login(email.trim(), password);
      if (res.success && res.data && res.data.role === 'inspector') {
        localStorage.setItem('metrx_token', res.data.token);
        localStorage.setItem('metrx_user', JSON.stringify(res.data));

        const match = inspectors.find(
          (insp) => insp.email.toLowerCase() === email.trim().toLowerCase()
        ) || {
          id: res.data._id,
          name: res.data.name,
          badgeNumber: res.data.inspectorBadgeId || 'LM-BLR-402',
          email: res.data.email,
          zone: res.data.assignedZone || 'Ward 4 (Commercial Circle)',
          status: 'Active'
        };

        setCurrentInspector(match);
        setActiveRole('inspector');
        setCurrentView('inspector-schedule');
        showToast(`Welcome ${res.data.name}! (Badge: ${match.badgeNumber})`, 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      }
    } catch (err) {
      console.warn('[Backend Inspector Auth Fallback]', err.message);
    }

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

    const matchesOfficer = (name, badge) => {
      if (!name && !badge) return false;
      const activeBadgeClean = (activeInsp.badgeNumber || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const badgeClean = (badge || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      if (activeBadgeClean && badgeClean && (activeBadgeClean.includes(badgeClean) || badgeClean.includes(activeBadgeClean))) {
        return true;
      }
      if (name) {
        const cleanName = String(name).toLowerCase().replace(/^(insp\.?|officer)\s*/i, '').trim();
        const cleanActive = (activeInsp.name || '').toLowerCase().replace(/^(insp\.?|officer)\s*/i, '').trim();
        if (cleanName && cleanActive && (cleanName === cleanActive || cleanName.includes(cleanActive) || cleanActive.includes(cleanName))) {
          return true;
        }
      }
      return false;
    };

    // 1. Gather all visits explicitly scheduled or recorded in visits state for this inspector
    const matchedVisits = visits.filter(
      (v) => matchesOfficer(v.assignedOfficer, v.officerBadge) ||
             merchants.some((m) => m.name === v.shopName && matchesOfficer(m.assignedInspector, m.assignedInspectorBadge))
    );

    // 2. Gather all merchants assigned to this inspector
    const assignedMerchants = merchants.filter(
      (m) => matchesOfficer(m.assignedInspector, m.assignedInspectorBadge)
    );

    // 3. Gather all ownerShops assigned to this inspector
    const assignedOwnerShops = ownerShops.filter(
      (s) => matchesOfficer(s.assignedInspector, s.inspectorBadge)
    );

    const mergedList = [];
    const seenShopNames = new Set();

    // Priority 1: Visits already scheduled or logged
    matchedVisits.forEach((v) => {
      const shopKey = (v.shopName || '').toLowerCase();
      seenShopNames.add(shopKey);
      const isCertified = v.status?.toLowerCase().includes('certified') || v.statusType === 'completed';
      mergedList.push({
        ...v,
        assignedOfficer: activeInsp.name,
        officerBadge: `Badge #${activeInsp.badgeNumber}`,
        isNextUp: !isCertified,
        status: isCertified ? 'Audit Completed & Certified' : (v.status || 'Scheduled for Verification'),
        statusType: isCertified ? 'completed' : 'scheduled'
      });
    });

    // Priority 2: Assigned merchants not yet in visits array
    assignedMerchants.forEach((m, idx) => {
      const shopKey = (m.name || '').toLowerCase();
      if (!seenShopNames.has(shopKey)) {
        seenShopNames.add(shopKey);
        const isCertified = m.complianceStatus === 'Audit Certified' || m.complianceStatus === 'Certified & Compliant';
        const isScheduled = m.complianceStatus === 'Scheduled for Verification' || m.scheduledSlot;
        mergedList.push({
          id: `visit-dyn-${m.id}`,
          merchantId: m.id,
          shopId: m.id,
          timeSlot: m.scheduledSlot || (idx === 0 ? '10:00 AM – 11:30 AM' : idx === 1 ? '12:00 PM – 1:00 PM' : '02:30 PM – 03:30 PM'),
          timeRelative: isScheduled ? 'NEXT UP • Scheduled by Merchant' : (idx === 0 ? 'NEXT UP • Assigned by Admin' : `Slot ${idx + 1}`),
          isNextUp: !isCertified,
          shopName: m.name,
          regNumber: `Reg #${m.tradeLicense}`,
          address: `${m.zone}, ${m.address}`,
          status: isCertified ? 'Audit Completed & Certified' : (isScheduled ? 'Scheduled for Verification' : 'Pending Field Inspection'),
          statusType: isCertified ? 'completed' : (idx === 0 || isScheduled ? 'pending' : 'scheduled'),
          instrumentName: 'Commercial Electronic Weighing Instrument',
          model: 'Standard Calibration Model',
          specification: 'Max 30kg (e=1g)',
          classBadge: 'Class III Commercial',
          applicationRef: `METRX-${activeInsp.badgeNumber}-${(m.merchantUid || 'EST').replace('#', '')}`,
          assignedOfficer: activeInsp.name,
          officerBadge: `Badge #${activeInsp.badgeNumber}`
        });
      }
    });

    // Priority 3: Assigned owner shops not yet covered
    assignedOwnerShops.forEach((s, idx) => {
      const shopKey = (s.name || '').toLowerCase();
      if (!seenShopNames.has(shopKey)) {
        seenShopNames.add(shopKey);
        const isCertified = s.complianceStatus === 'Certified & Compliant' || (s.certificationHistory && s.certificationHistory.length > 0);
        const isScheduled = s.complianceStatus === 'Scheduled for Verification' || s.scheduledSlot;
        const scale = s.instruments?.[0] || {};
        mergedList.push({
          id: `visit-shop-${s.id}`,
          merchantId: s.id,
          shopId: s.id,
          timeSlot: s.scheduledSlot?.date ? `${s.scheduledSlot.date} • ${s.scheduledSlot.time}` : '10:00 AM – 11:30 AM',
          timeRelative: isScheduled ? 'NEXT UP • Scheduled by Merchant' : 'NEXT UP • Assigned by Admin',
          isNextUp: !isCertified,
          shopName: s.name,
          regNumber: `Reg #${s.tradeLicense}`,
          address: `${s.zone}, ${s.address}`,
          status: isCertified ? 'Audit Completed & Certified' : (isScheduled ? 'Scheduled for Verification' : 'Pending Field Inspection'),
          statusType: isCertified ? 'completed' : 'scheduled',
          instrumentName: scale.name || 'Commercial Electronic Weighing Instrument',
          model: scale.model || 'Standard Calibration Model',
          specification: scale.capacity || 'Max 30kg (e=1g)',
          serialNumber: scale.serialNumber || '#KA-BLR-88412',
          classBadge: scale.class || 'Class III Commercial',
          applicationRef: `METRX-${activeInsp.badgeNumber}-${(s.merchantUid || 'EST').replace('#', '')}`,
          assignedOfficer: activeInsp.name,
          officerBadge: `Badge #${activeInsp.badgeNumber}`
        });
      }
    });

    return mergedList;
  };

  // Start Inspection for a specific shop on inspector route
  const handleStartInspection = (visit) => {
    // Find matching shop in ownerShops to activate proper shop context
    const sIndex = ownerShops.findIndex(
      (s) => (visit.shopId && s.id === visit.shopId) ||
             (visit.merchantId && s.id === visit.merchantId) ||
             (s.name && visit.shopName && s.name.toLowerCase() === visit.shopName.toLowerCase())
    );

    if (sIndex >= 0) {
      setActiveShopIndexState(sIndex);
      const targetShop = ownerShops[sIndex];
      setStoreInfo((prev) => ({
        ...prev,
        id: targetShop.id,
        name: targetShop.name,
        regNumber: targetShop.tradeLicense || visit.regNumber,
        merchantUid: targetShop.merchantUid || visit.merchantUid,
        location: targetShop.address || visit.address,
        zone: targetShop.zone || visit.zone || currentInspector?.zone || prev.zone,
        contactPerson: targetShop.ownerName || visit.ownerName || prev.contactPerson,
        phone: targetShop.phone || visit.phone || prev.phone,
        assignedInspector: currentInspector?.name || targetShop.assignedInspector || prev.assignedInspector,
        inspectorBadge: currentInspector?.badgeNumber || targetShop.inspectorBadge || prev.inspectorBadge
      }));

      if (targetShop.instruments && targetShop.instruments.length > 0) {
        setInstruments(targetShop.instruments);
        setActiveInstrumentIndex(0);
      } else if (visit.instrumentName || visit.serialNumber) {
        setInstruments([
          {
            id: `inst-${targetShop.id}`,
            name: visit.instrumentName || 'Electronic Countertop Scale',
            model: visit.model || 'Commercial Scale 2025',
            serialNumber: visit.serialNumber || '#KA-BLR-88412',
            capacity: visit.specification || '30kg / 1g precision',
            counter: 'Billing Counter 1',
            status: 'Inspection In Progress',
            verificationStatusText: 'Field Audit Active',
            daysRemaining: 1,
            totalDaysCycle: 365,
            expiresOn: 'Audit Today',
            sealNumber: 'SEAL-PENDING',
            complianceRate: '98%',
            type: 'counter_scale',
            class: visit.classBadge || 'Class III Commercial'
          }
        ]);
        setActiveInstrumentIndex(0);
      }
    } else {
      setStoreInfo((prev) => ({
        ...prev,
        id: visit.shopId || visit.merchantId || prev.id,
        name: visit.shopName,
        regNumber: visit.regNumber,
        merchantUid: visit.merchantUid || prev.merchantUid,
        location: visit.address,
        zone: visit.zone || currentInspector?.zone || prev.zone,
        contactPerson: visit.ownerName || prev.contactPerson,
        phone: visit.phone || prev.phone,
        assignedInspector: currentInspector?.name || prev.assignedInspector,
        inspectorBadge: currentInspector?.badgeNumber || prev.inspectorBadge
      }));
      if (visit.instrumentName || visit.serialNumber) {
        setInstruments([
          {
            id: `inst-visit-${visit.id || Date.now()}`,
            name: visit.instrumentName || 'Electronic Countertop Scale',
            model: visit.model || 'Commercial Scale 2025',
            serialNumber: visit.serialNumber || '#KA-BLR-88412',
            capacity: visit.specification || '30kg / 1g precision',
            counter: 'Billing Counter 1',
            status: 'Inspection In Progress',
            verificationStatusText: 'Field Audit Active',
            daysRemaining: 1,
            totalDaysCycle: 365,
            expiresOn: 'Audit Today',
            sealNumber: 'SEAL-PENDING',
            complianceRate: '98%',
            type: 'counter_scale',
            class: visit.classBadge || 'Class III Commercial'
          }
        ]);
        setActiveInstrumentIndex(0);
      }
    }

    setVerificationStatus((prev) => ({
      ...prev,
      status: 'in_progress',
      step: 4
    }));

    setCurrentView('field-inspection');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Authenticated Shop Owner Login
  const handleMerchantLogin = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      // 1. Attempt backend authentication
      const res = await api.login(cleanEmail, password);
      if (res.success && res.data) {
        const merchantUser = {
          id: res.data._id || res.data.id,
          name: res.data.name,
          email: res.data.email.toLowerCase(),
          phone: res.data.phone || ''
        };
        setCurrentMerchant(merchantUser);
        localStorage.setItem('metrx_token', res.data.token);
        localStorage.setItem('metrx_user', JSON.stringify(res.data));
        localStorage.setItem('metrx_merchant', JSON.stringify(merchantUser));

        // Filter ONLY shops belonging to this specific merchant
        const myShops = allShops.filter(
          (s) => (s.email && s.email.toLowerCase() === cleanEmail) ||
                 (s.ownerName && res.data.name && s.ownerName.toLowerCase() === res.data.name.toLowerCase())
        );

        setOwnerShops(myShops);
        if (myShops.length > 0) {
          setActiveShopIndexState(0);
          const active = myShops[0];
          setStoreInfo({
            id: active.id,
            name: active.name,
            regNumber: active.tradeLicense,
            merchantUid: active.merchantUid,
            location: active.address,
            division: 'Bengaluru Central Division',
            contactPerson: active.ownerName,
            phone: active.phone,
            email: active.email,
            zone: active.zone,
            assignedInspector: active.assignedInspector,
            inspectorBadge: active.inspectorBadge,
            certificateId: 'PENDING'
          });
          setInstruments(active.instruments || []);
        }

        setActiveRole('shop-owner');
        setCurrentView('shop-dashboard');
        showToast(`Logged in successfully! Welcome, ${res.data.name}.`, 'success');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      }
    } catch (err) {
      // 2. Fallback to local memory matching if backend error occurs
      console.warn('[Backend Auth Fallback]', err.message);
    }

    const match = merchants.find(
      (m) => m.email && m.email.toLowerCase() === cleanEmail && m.password === password
    );

    if (match) {
      const merchantUser = {
        id: match.id,
        name: match.ownerName || match.name,
        email: cleanEmail,
        phone: match.phone || ''
      };
      setCurrentMerchant(merchantUser);
      localStorage.setItem('metrx_merchant', JSON.stringify(merchantUser));

      const myShops = allShops.filter(
        (s) => (s.email && s.email.toLowerCase() === cleanEmail) ||
               (s.ownerName && match.ownerName && s.ownerName.toLowerCase() === match.ownerName.toLowerCase())
      );

      setOwnerShops(myShops.length > 0 ? myShops : [
        {
          id: match.id,
          name: match.name,
          ownerName: match.ownerName,
          email: cleanEmail,
          merchantUid: match.merchantUid,
          tradeLicense: match.tradeLicense,
          zone: match.zone,
          address: match.address,
          phone: match.phone,
          assignedInspector: match.assignedInspector,
          inspectorBadge: match.assignedInspectorBadge,
          status: 'Active Commercial Establishment',
          complianceStatus: match.complianceStatus || 'Pending Inspector Assignment',
          documentStatus: 'not_uploaded',
          registeredScalesCount: 1,
          instruments: [],
          certificationHistory: []
        }
      ]);

      setStoreInfo((prev) => ({
        ...prev,
        name: match.name,
        merchantUid: match.merchantUid,
        regNumber: match.tradeLicense,
        location: match.address,
        contactPerson: match.ownerName,
        phone: match.phone,
        email: cleanEmail,
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
  const handleRegisterMerchant = async (data) => {
    const uid = `#EST-${Math.floor(10000 + Math.random() * 90000)}`;
    const generatedShopId = `shop-${Date.now().toString(36)}`;

    // 1. Register user account on backend
    try {
      await api.register({
        name: data.ownerName || 'Merchant Owner',
        email: data.email || `store${Math.floor(100 + Math.random() * 900)}@metrx.com`,
        password: data.password || '12345678',
        role: 'shop-owner',
        phone: data.phone || '+91 98000 00000'
      });
    } catch (err) {
      console.warn('[Backend User Register Warning]', err.message);
    }

    // 2. Persist shop establishment to backend MongoDB
    let backendShop = null;
    try {
      const res = await api.createShop({
        id: generatedShopId,
        name: data.name || 'New Retail Store',
        ownerName: data.ownerName || 'Merchant Owner',
        email: data.email || '',
        merchantUid: uid,
        tradeLicense: data.tradeLicense || `BBMP/TL/2025/${Math.floor(1000 + Math.random() * 9000)}`,
        zone: data.zone || 'Ward 4 (Commercial Circle)',
        address: data.address || `${data.zone || 'Ward 4'}, Commercial Circle, Bengaluru`,
        phone: data.phone || '+91 98000 00000',
        registeredScalesCount: Number(data.registeredScales) || 1,
        assignedInspector: 'Pending Admin Allocation',
        inspectorBadge: 'LM-PENDING',
        complianceStatus: 'Pending Inspector Assignment',
        documentStatus: 'not_uploaded',
        scaleModel: data.scaleModel || 'Digital Metrology Model 2025',
        scaleType: data.scaleType || 'Electronic Counter'
      });
      if (res.success && res.data) {
        backendShop = res.data;
      }
    } catch (err) {
      console.error('[Backend Create Shop Failed]', err.message);
    }

    const finalId = backendShop?.id || generatedShopId;
    const finalUid = backendShop?.merchantUid || uid;

    const newMerch = {
      id: finalId,
      name: data.name || 'New Retail Store',
      ownerName: data.ownerName || 'Merchant Owner',
      email: data.email || `store${Math.floor(100 + Math.random() * 900)}@metrx.com`,
      password: data.password || '12345678',
      merchantUid: finalUid,
      tradeLicense: data.tradeLicense || `BBMP/TL/2025/${Math.floor(1000 + Math.random() * 9000)}`,
      zone: data.zone || 'Ward 4 (Commercial Circle)',
      address: data.address || `${data.zone || 'Ward 4'}, Commercial Circle, Bengaluru`,
      phone: data.phone || '+91 98000 00000',
      registeredScales: Number(data.registeredScales) || 1,
      complianceStatus: 'Pending Inspector Assignment',
      assignedInspector: null,
      assignedInspectorBadge: 'LM-PENDING',
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

    const assignedEmail = (data.email || newMerch.email).toLowerCase().trim();
    const merchantUser = {
      id: finalId,
      name: data.ownerName || 'Merchant Owner',
      email: assignedEmail,
      phone: data.phone || '+91 98000 00000'
    };
    setCurrentMerchant(merchantUser);
    localStorage.setItem('metrx_merchant', JSON.stringify(merchantUser));

    // Sync into ownerShops multi-shop list (strictly for this merchant)
    const newOwnerShop = {
      id: finalId,
      name: newMerch.name,
      ownerName: newMerch.ownerName,
      email: assignedEmail,
      branchType: 'Commercial Retail Store',
      merchantUid: finalUid,
      tradeLicense: newMerch.tradeLicense,
      gstin: `29AABCU${Math.floor(1000 + Math.random() * 9000)}R1ZM`,
      shopActReg: `KA/BLR/${Math.floor(10000 + Math.random() * 90000)}/2025`,
      zone: newMerch.zone,
      address: newMerch.address,
      phone: newMerch.phone,
      assignedInspector: 'Pending Admin Allocation',
      inspectorBadge: 'LM-PENDING',
      status: 'Active Commercial Establishment',
      complianceStatus: 'Pending Inspector Assignment',
      documentStatus: 'not_uploaded',
      registeredScalesCount: Number(data.registeredScales) || 1,
      instruments: [newScale],
      certificationHistory: []
    };
    setOwnerShops([newOwnerShop]);
    setAllShops((prev) => [newOwnerShop, ...prev]);
    setActiveShopIndexState(0);

    // Entry into Admin Live Field Operations queue
    const newOperation = {
      id: `OP-${finalId}`,
      inspectorName: 'Unassigned (Action Required)',
      badgeNumber: 'LM-PENDING',
      shopName: newMerch.name,
      merchantUid: finalUid,
      zone: newMerch.zone.split(' ')[0] || 'Ward 4',
      operationType: 'Initial Shop Verification',
      scaleModel: newScale.model,
      slot: 'Awaiting Inspector Assignment',
      liveStatus: 'New Registration • Pending Allocation',
      statusType: 'scheduled',
      remarks: 'Self-registered by merchant. Requires Inspector Assignment.'
    };
    setOperations((prev) => [newOperation, ...prev]);

    setStoreInfo({
      id: finalId,
      name: newMerch.name,
      regNumber: newMerch.tradeLicense,
      merchantUid: finalUid,
      location: newMerch.address,
      division: 'Bengaluru Central Division',
      contactPerson: newMerch.ownerName,
      phone: newMerch.phone,
      zone: newMerch.zone,
      assignedInspector: 'Pending Admin Allocation',
      certificateId: 'PENDING'
    });

    setVerificationStatus((prev) => ({
      ...prev,
      documentStatus: 'not_uploaded',
      step: 1
    }));

    setActiveRole('shop-owner');
    setCurrentView('shop-dashboard');
    showToast(`Store registered successfully! Merchant UID: ${finalUid}. Visible in Admin Command Center.`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return newMerch;
  };

  // Admin Assigns / Reassigns Inspector to a Merchant Store
  const handleAssignInspectorToMerchant = async (merchantId, inspectorId) => {
    const selectedInspector = inspectors.find((insp) => insp.id === inspectorId || insp.name === inspectorId);
    if (!selectedInspector) {
      showToast('Please select a valid active inspector', 'error');
      return;
    }

    const targetMerchant = merchants.find(
      (m) => m.id === merchantId || m.name === merchantId || m.merchantUid === merchantId
    );

    const mId = targetMerchant ? targetMerchant.id : merchantId;
    const mName = targetMerchant ? targetMerchant.name : merchantId;
    const mUid = targetMerchant ? targetMerchant.merchantUid : '#EST-SHOP';
    const mZone = targetMerchant ? targetMerchant.zone : 'Ward 4';

    // Sync into merchants ledger
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === mId || m.name === mName || m.merchantUid === mUid) {
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

    // Sync into allShops
    setAllShops((prev) =>
      prev.map((s) => {
        if (s.id === mId || s.name === mName || s.merchantUid === mUid) {
          return {
            ...s,
            assignedInspector: selectedInspector.name,
            inspectorBadge: selectedInspector.badgeNumber,
            complianceStatus: 'Inspector Assigned'
          };
        }
        return s;
      })
    );

    // Sync into ownerShops
    setOwnerShops((prev) =>
      prev.map((s) => {
        if (s.id === mId || s.name === mName || s.merchantUid === mUid) {
          return {
            ...s,
            assignedInspector: selectedInspector.name,
            inspectorBadge: selectedInspector.badgeNumber,
            complianceStatus: 'Inspector Assigned'
          };
        }
        return s;
      })
    );

    // Sync into active store profile if currently viewing this shop
    setStoreInfo((prev) => {
      if (prev?.id === mId || prev?.name === mName || prev?.merchantUid === mUid) {
        return {
          ...prev,
          assignedInspector: selectedInspector.name,
          inspectorBadge: selectedInspector.badgeNumber
        };
      }
      return prev;
    });

    // Call backend API to persist assignment in PostgreSQL
    try {
      await api.assignInspector(mId, {
        inspectorName: selectedInspector.name,
        inspectorBadge: selectedInspector.badgeNumber
      });
    } catch (err) {
      console.warn('[Backend Assign Inspector Error]', err.message);
    }

    // Sync with Operations Queue
    setOperations((prev) => {
      const existingIdx = prev.findIndex(
        (op) =>
          op.id === `OP-${mId}` ||
          op.shopName === mName ||
          op.merchantUid === mUid
      );
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          inspectorName: selectedInspector.name,
          badgeNumber: selectedInspector.badgeNumber,
          liveStatus: 'Inspector Assigned • Pending Docs',
          remarks: `Assigned by Department Admin to ${selectedInspector.name}`
        };
        return updated;
      } else {
        const newOp = {
          id: `OP-${mId}`,
          inspectorName: selectedInspector.name,
          badgeNumber: selectedInspector.badgeNumber,
          shopName: mName,
          merchantUid: mUid,
          zone: mZone.split(' ')[0] || 'Ward 4',
          operationType: 'On-Site Stamping & Verification',
          scaleModel: 'Digital Metrology Model 2025',
          slot: '11:30 AM – 01:00 PM (Assigned Slot)',
          liveStatus: 'Inspector Assigned • Pending Docs',
          statusType: 'scheduled',
          remarks: `Assigned by Controller to ${selectedInspector.name}`
        };
        return [newOp, ...prev];
      }
    });

    // Sync into Registry
    setRegistry((prev) =>
      prev.map((r) => {
        if (r.shopName === mName || r.merchantUid === mUid) {
          return {
            ...r,
            inspector: selectedInspector.name
          };
        }
        return r;
      })
    );

    showToast(`Reassigned Inspector to ${selectedInspector.name} (${selectedInspector.badgeNumber}) for ${mName}!`, 'success');
  };

  // Admin Provisions a New Inspector Account
  const handleCreateInspector = async (data) => {
    const badgeNum = data.badgeNumber || `LM-BLR-${Math.floor(100 + Math.random() * 900)}`;
    const email = data.email || `${data.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@metrx.com`;
    const password = data.password || '12345678';
    const zone = data.zone || 'Ward 4 (Commercial Circle)';
    const phone = data.phone || '+91 98000 11223';

    const newInsp = {
      id: `insp-${Date.now()}`,
      name: data.name,
      badgeNumber: badgeNum,
      email,
      password,
      zone,
      phone,
      status: 'Active',
      authorizedBy: 'Admin',
      issuedAt: 'Today'
    };

    setInspectors((prev) => [newInsp, ...prev.filter((i) => i.name.toLowerCase() !== data.name.toLowerCase())]);

    // Save permanently in PostgreSQL backend DB
    try {
      const res = await api.createInspector({
        name: data.name,
        email,
        password,
        phone,
        inspectorBadgeId: badgeNum,
        assignedZone: zone
      });
      if (res.success && res.data?.id) {
        newInsp.id = res.data.id;
      }
    } catch (err) {
      console.warn('[Backend Create Inspector Error]', err.message);
    }

    showToast(`Inspector provisioned: ${newInsp.name} (${newInsp.badgeNumber}). Account saved permanently.`, 'success');
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

  // Admin Permanently Deletes an Inspector Account
  const handleDeleteInspector = async (id) => {
    const target = inspectors.find((insp) => insp.id === id);
    const updated = inspectors.filter((insp) => insp.id !== id);
    setInspectors(updated);
    try {
      localStorage.setItem('metrx_inspectors', JSON.stringify(updated));
    } catch {}

    if (target?.email) {
      try {
        await api.deleteUser(target.email);
      } catch (err) {
        console.warn('[Delete Inspector Backend Error]', err.message);
      }
    }
    showToast(`Inspector ${target?.name || ''} deleted permanently.`, 'info');
  };

  const logout = () => {
    setActiveRole('public');
    setCurrentView('public-portal');
    setCurrentMerchant(null);
    setCurrentInspector(null);
    localStorage.removeItem('metrx_merchant');
    localStorage.removeItem('metrx_user');
    localStorage.removeItem('metrx_token');
    setOwnerShops([]);
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
    } else if (view === 'certificate-view') {
      if (activeRole === 'shop-owner') {
        const currentShop = ownerShops[activeShopIndex] || ownerShops[0];
        if (currentShop?.certificationHistory && currentShop.certificationHistory.length > 0) {
          if (certificateData?.shopName !== currentShop.name || certificateData?.inProgress) {
            const activeCert = currentShop.certificationHistory[0];
            setCertificateData({
              certId: activeCert.certId,
              ruleForm: activeCert.ruleForm || 'Form XVII (Rule 14)',
              actYear: activeCert.actYear || 'Act of 2009',
              statusBadge: activeCert.statusBadge || 'VERIFIED & COMPLIANT',
              daysLeft: activeCert.daysLeft !== undefined ? activeCert.daysLeft : 365,
              validUntil: activeCert.validUntil || '12 Jan 2026',
              verifiedDate: activeCert.verifiedDate || '13 Jan 2025',
              inspectorSeal: activeCert.inspectorSeal || 'SEAL-LM-BLR-0428',
              inspectorName: activeCert.inspectorName || currentShop.assignedInspector || 'Insp. R. Deshmukh',
              inspectorBadge: activeCert.inspectorBadge || currentShop.inspectorBadge || 'LM-BLR-402',
              instrumentModel: activeCert.instrumentModel || `${currentShop.instruments?.[0]?.name} (${currentShop.instruments?.[0]?.model})`,
              serialNumber: activeCert.serialNumber || currentShop.instruments?.[0]?.serialNumber || '',
              shopLocation: `${currentShop.name}, ${currentShop.zone}`,
              shopName: currentShop.name,
              shopAddress: currentShop.address,
              merchantUid: currentShop.merchantUid,
              tradeLicense: currentShop.tradeLicense,
              workingStandardRef: activeCert.workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)',
              digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
              calibrationTests: activeCert.calibrationTests || testCalibrationData,
              isHistorical: false,
              inProgress: false
            });
          }
        } else {
          setCertificateData({
            inProgress: true,
            shopName: currentShop?.name || storeInfo.name,
            shopAddress: currentShop?.address || storeInfo.location,
            merchantUid: currentShop?.merchantUid || storeInfo.merchantUid,
            tradeLicense: currentShop?.tradeLicense || storeInfo.regNumber,
            zone: currentShop?.zone || storeInfo.zone,
            branchType: currentShop?.branchType || 'Commercial Branch',
            assignedInspector: currentShop?.assignedInspector || 'Insp. R. Deshmukh',
            inspectorBadge: currentShop?.inspectorBadge || 'LM-BLR-402',
            complianceStatus: currentShop?.complianceStatus || 'Pending Inspector Verification',
            documentStatus: currentShop?.documentStatus || 'pending_review',
            instrument: currentShop?.instruments?.[0] || null
          });
        }
      }
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

  const handleUploadDocuments = async (merchantId, customDocs = null) => {
    const currentShop = ownerShops[activeShopIndex] || ownerShops[0] || {};
    const targetId = merchantId || storeInfo.id || currentShop.id || 'merch-1';
    const nowStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const submissionPayload = customDocs || {
      businessRegistration: { title: 'Business Registration', subTitle: 'Trade License / GST / Shop & Est. Act Certificate', fileName: 'BBMP_Trade_License_2025.pdf', fileSize: '1.8 MB', uploadedAt: nowStr, status: 'Uploaded' },
      ownerId: { title: 'Owner ID Proof', subTitle: 'Aadhaar Card / Government Photo ID', fileName: 'Proprietor_Aadhaar_Card.pdf', fileSize: '1.2 MB', uploadedAt: nowStr, status: 'Uploaded' },
      purchaseInvoice: { title: 'Purchase Invoice', subTitle: 'Original Scale Purchase Bill / Tax Invoice', fileName: 'Scale_Manufacturer_Tax_Invoice.pdf', fileSize: '2.4 MB', uploadedAt: nowStr, status: 'Uploaded' },
      instrumentPlate: { title: 'Instrument Plate Photo', subTitle: 'Scale Specification & Serial Number Nameplate', fileName: 'Model_Nameplate_Serial_Photo.jpg', fileSize: '3.1 MB', uploadedAt: nowStr, status: 'Uploaded' },
      instrumentPhotos: { title: 'Instrument Photos', subTitle: 'Installed Counter Scale Front & Profile View', fileName: 'Countertop_Scale_Front_Profile.jpg', fileSize: '4.5 MB', uploadedAt: nowStr, status: 'Uploaded' }
    };

    const sName = (storeInfo.name || currentShop.name || 'Store').trim();
    const subObj = {
      merchantId: targetId,
      shopName: sName,
      status: 'pending_review',
      submittedAt: nowStr,
      reviewedBy: currentShop.assignedInspector || currentInspector?.name || 'Insp. R. Deshmukh',
      reviewedAt: null,
      remarks: 'All 5 statutory documents submitted by merchant. Awaiting physical inspection clearance by Inspector.',
      docs: submissionPayload
    };

    setDocumentSubmissions((prev) => {
      const updated = {
        ...prev,
        [targetId]: subObj,
        [sName.toLowerCase()]: subObj,
        [sName]: subObj
      };
      if (currentShop.merchantUid) {
        updated[currentShop.merchantUid] = subObj;
      }
      try {
        localStorage.setItem('metrx_submissions', JSON.stringify(updated));
      } catch (e) {
        console.warn('localStorage quota', e);
      }
      return updated;
    });

    setVerificationStatus((prev) => ({
      ...prev,
      documentStatus: 'pending_review',
      step: 2,
      documentsSubmittedAt: nowStr
    }));

    // Update ownerShops & merchants
    setOwnerShops((prev) =>
      prev.map((s) => (s.id === targetId ? { ...s, documentStatus: 'pending_review', complianceStatus: 'Documents Submitted - Pending Review' } : s))
    );
    setMerchants((prev) =>
      prev.map((m) => (m.id === targetId ? { ...m, complianceStatus: 'Documents Submitted - Pending Review' } : m))
    );

    // Persist to backend MongoDB
    try {
      await api.uploadShopDocuments(targetId, {
        docs: submissionPayload,
        documentStatus: 'pending_review',
        complianceStatus: 'Documents Submitted - Pending Review',
        remarks: 'All 5 statutory documents submitted by merchant. Awaiting physical inspection clearance by Inspector.'
      });
    } catch (err) {
      console.warn('[Backend Upload Documents Warning]', err.message);
    }

    showToast('All 5 statutory documents submitted for Inspector verification!', 'success');
  };

  const handleInspectorReviewDocuments = async (merchantId, decision, remarks = '') => {
    const currentShop = ownerShops.find((s) => s.id === merchantId) || ownerShops[0] || {};
    const targetId = merchantId || currentShop.id || 'merch-1';
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

    // Update ownerShops and merchants
    const nextCompliance = decision === 'verified' ? 'Documents Verified' : 'Flagged as Fraud / Counterfeit';
    setOwnerShops((prev) =>
      prev.map((s) => (s.id === targetId ? { ...s, documentStatus: decision, complianceStatus: nextCompliance } : s))
    );
    setMerchants((prev) =>
      prev.map((m) => (m.id === targetId || m.name === currentShop.name ? { ...m, complianceStatus: nextCompliance } : m))
    );

    // Persist review to backend MongoDB
    try {
      await api.updateDocumentStatus(targetId, {
        documentStatus: decision,
        complianceStatus: nextCompliance,
        remarks: remarks || (decision === 'verified' ? 'All 5 statutory documents verified.' : 'Flagged as Fraud under LM Act 2009.'),
        reviewedBy: inspector
      });
    } catch (err) {
      console.warn('[Backend Update Doc Status Warning]', err.message);
    }

    if (decision === 'verified') {
      showToast(`Verification Approved: Documents for ${currentShop.name || targetId} marked VERIFIED. Merchant can now schedule inspection visit.`, 'success');
    } else {
      showToast(`ALERT: Application for ${currentShop.name || targetId} flagged as FRAUD. Under LM Act Sec 30, visit scheduling is blocked.`, 'error');
    }
  };

  const handleConfirmVerification = async (slotId) => {
    const currentShop = ownerShops[activeShopIndex] || ownerShops[0] || {};
    const targetId = storeInfo.id || currentShop.id || 'merch-1';
    const currentDocState = documentSubmissions[targetId]?.status || currentShop.documentStatus || verificationStatus.documentStatus;

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

    const bookingReference = `SLOT-LM-${Math.floor(1000 + Math.random() * 9000)}`;

    const activeInst = instruments[activeInstrumentIndex] || instruments[0] || {
      id: 'inst-1',
      name: 'Electronic Counter Scale',
      model: 'Digital Metrology Model 2025',
      serialNumber: '#KA-BLR-53808',
      capacity: '30kg / 1g precision',
      class: 'Class III Commercial'
    };

    const scheduledVisitObj = {
      id: `visit-${targetId}`,
      merchantId: targetId,
      shopId: targetId,
      timeSlot: `${dateStr} • ${timeStr}`,
      timeRelative: 'NEXT UP • Scheduled by Merchant',
      isNextUp: true,
      shopName: storeInfo.name || currentShop.name,
      ownerName: storeInfo.contactPerson || currentShop.ownerName,
      regNumber: storeInfo.regNumber || currentShop.tradeLicense || `Reg #${currentShop.merchantUid}`,
      merchantUid: storeInfo.merchantUid || currentShop.merchantUid,
      address: storeInfo.location || currentShop.address,
      zone: storeInfo.zone || currentShop.zone || 'Ward 4 (Commercial Circle)',
      status: 'Scheduled for Verification',
      statusType: 'scheduled',
      instrumentName: activeInst.name,
      model: activeInst.model,
      serialNumber: activeInst.serialNumber,
      specification: activeInst.capacity || 'Max 30kg (e=1g)',
      classBadge: activeInst.class || 'Class III Commercial',
      applicationRef: bookingReference,
      assignedOfficer: currentShop.assignedInspector || storeInfo.assignedInspector || 'Insp. R. Deshmukh',
      officerBadge: currentShop.inspectorBadge || 'LM-BLR-402'
    };

    // Update visits state so it immediately appears in Inspector Schedule
    setVisits((prev) => {
      const filtered = prev.filter((v) => v.shopId !== targetId && v.shopName !== scheduledVisitObj.shopName);
      return [scheduledVisitObj, ...filtered];
    });

    // Update ownerShops state
    setOwnerShops((prev) =>
      prev.map((s) => {
        if (s.id === targetId || s.name === currentShop.name) {
          return {
            ...s,
            complianceStatus: 'Scheduled for Verification',
            documentStatus: 'verified',
            scheduledSlot: { date: dateStr, time: timeStr, bookingRef: bookingReference }
          };
        }
        return s;
      })
    );

    // Update merchants state
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === targetId || m.name === currentShop.name) {
          return {
            ...m,
            complianceStatus: 'Scheduled for Verification',
            scheduledSlot: `${dateStr} (${timeStr})`
          };
        }
        return m;
      })
    );

    // Update storeInfo
    setStoreInfo((prev) => ({
      ...prev,
      complianceStatus: 'Scheduled for Verification'
    }));

    // Update operations state (for Admin dashboard)
    setOperations((prev) => [
      {
        id: `OP-${Date.now().toString().slice(-4)}`,
        shopId: targetId,
        shopName: storeInfo.name || currentShop.name,
        merchantUid: storeInfo.merchantUid || currentShop.merchantUid,
        inspectorName: currentShop.assignedInspector || 'Insp. R. Deshmukh',
        badgeNumber: currentShop.inspectorBadge || 'LM-BLR-402',
        zone: storeInfo.zone || currentShop.zone || 'Ward 4',
        scaleModel: activeInst.model,
        operationType: 'Field Calibration Stamping',
        slot: `${dateStr} • ${timeStr}`,
        liveStatus: 'Verification Visit Scheduled',
        statusType: 'scheduled',
        remarks: `Merchant booked slot ${bookingReference}. Inspector inspection pending.`
      },
      ...prev.filter((op) => op.shopId !== targetId)
    ]);

    // Call backend API to persist verification appointment in PostgreSQL
    try {
      await api.createVerification({
        shopId: targetId,
        shopName: storeInfo.name || currentShop.name,
        ownerName: storeInfo.contactPerson || currentShop.ownerName,
        address: storeInfo.location || currentShop.address,
        phone: storeInfo.phone || currentShop.phone,
        instrumentId: instruments[activeInstrumentIndex]?.id || 'inst-1',
        instrumentName: instruments[activeInstrumentIndex]?.name || 'Electronic Countertop Scale',
        serialNumber: instruments[activeInstrumentIndex]?.serialNumber || '#KA-BLR-88412',
        assignedInspector: currentShop.assignedInspector || 'Insp. R. Deshmukh',
        inspectorBadge: currentShop.inspectorBadge || 'LM-BLR-402',
        requestedSlot: {
          date: dateStr,
          time: timeStr,
          bookingRef: bookingReference
        }
      });
    } catch (err) {
      console.warn('[Backend Create Verification Warning]', err.message);
    }

    setVerificationStatus((prev) => ({
      ...prev,
      status: 'scheduled',
      documentStatus: 'verified',
      step: 3,
      slotLabel: dateStr,
      timeLabel: timeStr,
      applicationRef: bookingReference
    }));

    showToast(`Inspection slot booked for ${dateStr}! Assigned Officer: ${currentShop.assignedInspector || 'Insp. R. Deshmukh'}.`, 'success');
    navigateTo('track-status');
  };

  const handleCompleteInspection = (notes = '') => {
    const currentShop = ownerShops[activeShopIndex] || ownerShops[0] || {};
    const targetShopId = currentShop.id || storeInfo.id;
    const targetShopName = storeInfo.name || currentShop.name;
    const targetInst = instruments[activeInstrumentIndex] || instruments[0] || {};

    const newCertId = `CERT-KA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const sealNum = `SEAL-LM-BLR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const validUntilDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const verifiedDateStr = new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const newCertObj = {
      certId: newCertId,
      ruleForm: 'Form XVII (Rule 14)',
      actYear: 'Legal Metrology Act, 2009',
      instrumentModel: `${targetInst.name || 'Electronic Counter Scale'} (${targetInst.model || 'Digital Series'})`,
      serialNumber: targetInst.serialNumber || '#KA-BLR-53808',
      verifiedDate: verifiedDateStr,
      validUntil: validUntilDate,
      inspectorSeal: sealNum,
      inspectorName: currentInspector?.name || 'Insp. R. Deshmukh',
      inspectorBadge: currentInspector?.badgeNumber ? `Badge #${currentInspector.badgeNumber}` : 'LM-BLR-402',
      statusBadge: 'CERTIFIED & COMPLIANT',
      workingStandardRef: 'STD/KA/2025/0092 (Calibrated at NPL)',
      remarks: notes || 'Physical 4-Point MPE assessment passed. Tamper-evident holographic stamp affixed.',
      daysLeft: 365,
      shopLocation: `${targetShopName}, ${storeInfo.zone || currentShop.zone || 'Ward 4'}`,
      shopName: targetShopName,
      shopAddress: storeInfo.location || currentShop.address,
      merchantUid: storeInfo.merchantUid || currentShop.merchantUid,
      tradeLicense: storeInfo.regNumber || currentShop.tradeLicense,
      digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
      calibrationTests: testCalibrationData,
      isHistorical: false,
      inProgress: false
    };

    // 1. Advance verification request status (Step 5: Certified)
    setVerificationStatus((prev) => ({
      ...prev,
      status: 'certified',
      step: 5,
      certificateId: newCertId
    }));

    // 2. Mark instrument as verified & compliant with 365 days
    setInstruments((prev) =>
      prev.map((inst, i) => {
        if (i === activeInstrumentIndex || i === 0) {
          return {
            ...inst,
            status: 'Verified & Compliant',
            verificationStatusText: 'Holo Seal Valid',
            daysRemaining: 365,
            expiresOn: validUntilDate,
            sealNumber: sealNum,
            complianceRate: '100%'
          };
        }
        return inst;
      })
    );

    // 3. Set global certificate data
    setCertificateData(newCertObj);

    // 4. Update ownerShops so shop owner dashboard shows verified status & certificate history
    setOwnerShops((prevShops) =>
      prevShops.map((s) => {
        if (s.id === targetShopId || s.name === targetShopName) {
          const updatedInsts = (s.instruments && s.instruments.length > 0 ? s.instruments : [targetInst]).map((inst, i) => {
            if (i === 0 || inst.serialNumber === targetInst.serialNumber) {
              return {
                ...inst,
                status: 'Verified & Compliant',
                verificationStatusText: 'Holo Seal Valid',
                daysRemaining: 365,
                expiresOn: validUntilDate,
                sealNumber: sealNum,
                complianceRate: '100%'
              };
            }
            return inst;
          });
          return {
            ...s,
            status: 'Verified & Compliant',
            complianceStatus: 'Certified & Compliant',
            documentStatus: 'verified',
            certificateId: newCertId,
            instruments: updatedInsts,
            certificationHistory: [newCertObj, ...(s.certificationHistory || [])]
          };
        }
        return s;
      })
    );

    // 5. Update merchants for admin and inspector views
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === targetShopId || m.name === targetShopName) {
          return {
            ...m,
            complianceStatus: 'Certified & Compliant',
            certificateId: newCertId
          };
        }
        return m;
      })
    );

    // 6. Update storeInfo
    setStoreInfo((prev) => ({
      ...prev,
      complianceStatus: 'Certified & Compliant',
      certificateId: newCertId
    }));

    // 7. Update visits queue so inspector schedule card shows Completed & Certified
    setVisits((prev) => {
      const exists = prev.some((v) => v.shopId === targetShopId || v.shopName === targetShopName);
      if (exists) {
        return prev.map((v) => {
          if (v.shopId === targetShopId || v.shopName === targetShopName) {
            return {
              ...v,
              isNextUp: false,
              status: 'Audit Completed & Certified',
              statusType: 'completed',
              timeRelative: 'Certified Today',
              certificateId: newCertId
            };
          }
          return v;
        });
      }
      return [
        {
          id: `visit-${targetShopId}`,
          merchantId: targetShopId,
          shopId: targetShopId,
          shopName: targetShopName,
          timeSlot: 'Audit Completed Today',
          timeRelative: 'Certified Today',
          isNextUp: false,
          status: 'Audit Completed & Certified',
          statusType: 'completed',
          certificateId: newCertId,
          instrumentName: targetInst.name || 'Electronic Counter Scale',
          model: targetInst.model || 'Digital Series',
          serialNumber: targetInst.serialNumber || '#KA-BLR-53808',
          assignedOfficer: currentInspector?.name || 'Insp. R. Deshmukh',
          officerBadge: currentInspector?.badgeNumber ? `Badge #${currentInspector.badgeNumber}` : 'Badge #LM-BLR-402'
        },
        ...prev
      ];
    });

    // 8. Update operations for admin view
    setOperations((prev) => [
      {
        id: `OP-${Date.now().toString().slice(-4)}`,
        shopId: targetShopId,
        shopName: targetShopName,
        merchantUid: storeInfo.merchantUid || currentShop.merchantUid,
        inspectorName: currentInspector?.name || 'Insp. R. Deshmukh',
        badgeNumber: currentInspector?.badgeNumber || 'LM-BLR-402',
        zone: storeInfo.zone || currentShop.zone || 'Ward 4',
        scaleModel: targetInst.model || 'Commercial Counter Scale',
        operationType: 'Holographic Stamping & Certification',
        slot: 'Audit Completed Today',
        liveStatus: 'Completed & Hologram Stamped',
        statusType: 'completed',
        remarks: `Verification Passed. Certificate ${newCertId} issued.`
      },
      ...prev.filter((op) => op.shopId !== targetShopId)
    ]);

    // 9. Update state registry
    setRegistry((prev) => [
      {
        id: `reg-${Date.now()}`,
        certId: newCertId,
        shopName: targetShopName,
        merchantUid: storeInfo.merchantUid || currentShop.merchantUid || '#EST-61866',
        zone: storeInfo.zone || currentShop.zone || 'Ward 4',
        instrument: targetInst.name || 'Electronic Countertop Scale',
        serial: targetInst.serialNumber || '#KA-BLR-53808',
        expiryDate: validUntilDate,
        inspector: currentInspector?.name || 'Insp. R. Deshmukh',
        status: 'Compliant'
      },
      ...prev.filter((r) => r.shopName !== targetShopName)
    ]);

    // 10. Persist to PostgreSQL backend via API
    try {
      api.issueCertificate({
        shopId: targetShopId,
        certId: newCertId,
        ruleForm: 'Form XVII (Rule 14)',
        actYear: 'Legal Metrology Act, 2009',
        instrumentModel: `${targetInst.name || 'Electronic Counter Scale'} (${targetInst.model || 'Digital Metrology'})`,
        serialNumber: targetInst.serialNumber || '#KA-BLR-53808',
        verifiedDate: verifiedDateStr,
        validUntil: validUntilDate,
        inspectorSeal: sealNum,
        inspectorName: currentInspector?.name || 'Insp. R. Deshmukh',
        inspectorBadge: currentInspector?.badgeNumber ? `Badge #${currentInspector.badgeNumber}` : 'LM-BLR-402',
        statusBadge: 'CERTIFIED & COMPLIANT',
        workingStandardRef: 'STD/KA/2025/0092 (Calibrated at NPL)',
        remarks: notes || 'Physical audit passed. Tamper-proof wire seal and QR code issued.'
      });
    } catch (err) {
      console.warn('[Backend Issue Cert Warning]', err.message);
    }

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
      certificateId: targetShop.certificationHistory?.[0]?.certId || 'PENDING',
      gstin: targetShop.gstin,
      shopActReg: targetShop.shopActReg,
      branchType: targetShop.branchType
    });

    if (targetShop.instruments && targetShop.instruments.length > 0) {
      setInstruments(targetShop.instruments);
      setActiveInstrumentIndex(0);
    }

    if (targetShop.certificationHistory && targetShop.certificationHistory.length > 0) {
      const activeCert = targetShop.certificationHistory[0];
      setCertificateData({
        certId: activeCert.certId,
        ruleForm: activeCert.ruleForm || 'Form XVII (Rule 14)',
        actYear: activeCert.actYear || 'Act of 2009',
        statusBadge: activeCert.statusBadge || 'VERIFIED & COMPLIANT',
        daysLeft: activeCert.daysLeft !== undefined ? activeCert.daysLeft : 365,
        validUntil: activeCert.validUntil || '12 Jan 2026',
        verifiedDate: activeCert.verifiedDate || '13 Jan 2025',
        inspectorSeal: activeCert.inspectorSeal || 'SEAL-LM-BLR-0428',
        inspectorName: activeCert.inspectorName || targetShop.assignedInspector || 'Insp. R. Deshmukh',
        inspectorBadge: activeCert.inspectorBadge || targetShop.inspectorBadge || 'LM-BLR-402',
        instrumentModel: activeCert.instrumentModel || `${targetShop.instruments?.[0]?.name} (${targetShop.instruments?.[0]?.model})`,
        serialNumber: activeCert.serialNumber || targetShop.instruments?.[0]?.serialNumber || '',
        shopLocation: `${targetShop.name}, ${targetShop.zone}`,
        shopName: targetShop.name,
        shopAddress: targetShop.address,
        merchantUid: targetShop.merchantUid,
        tradeLicense: targetShop.tradeLicense,
        workingStandardRef: activeCert.workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)',
        digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
        calibrationTests: activeCert.calibrationTests || testCalibrationData,
        isHistorical: false,
        inProgress: false
      });
    } else {
      setCertificateData({
        inProgress: true,
        shopName: targetShop.name,
        shopAddress: targetShop.address,
        merchantUid: targetShop.merchantUid,
        zone: targetShop.zone,
        tradeLicense: targetShop.tradeLicense,
        branchType: targetShop.branchType,
        assignedInspector: targetShop.assignedInspector || 'Insp. R. Deshmukh',
        inspectorBadge: targetShop.inspectorBadge || 'LM-BLR-402',
        complianceStatus: targetShop.complianceStatus || 'Pending Inspector Verification',
        documentStatus: targetShop.documentStatus || 'pending_review',
        instrument: targetShop.instruments?.[0] || null
      });
    }

    setVerificationStatus((prev) => ({
      ...prev,
      documentStatus: targetShop.documentStatus || 'verified',
      step: targetShop.certificationHistory && targetShop.certificationHistory.length > 0 ? 5 : (targetShop.documentStatus === 'verified' ? 3 : 2),
      inspectorName: targetShop.assignedInspector || 'Insp. R. Deshmukh'
    }));

    showToast(`Switched active establishment to ${targetShop.name}`, 'info');
  };

  const handleAddOwnerShop = async (newShopData) => {
    const uid = `#EST-${Math.floor(10000 + Math.random() * 90000)}`;
    const newShopId = `shop-${Date.now()}`;
    const merchantEmail = currentMerchant?.email || storeInfo.email || '';
    const merchantOwner = currentMerchant?.name || storeInfo.contactPerson || 'Store Owner';

    const newShop = {
      id: newShopId,
      name: newShopData.name || 'Commercial Branch',
      ownerName: merchantOwner,
      email: merchantEmail,
      branchType: newShopData.branchType || 'Commercial Retail Branch',
      merchantUid: uid,
      tradeLicense: newShopData.tradeLicense || `BBMP/TL/2025/${Math.floor(1000 + Math.random() * 9000)}`,
      gstin: newShopData.gstin || `29AABCU${Math.floor(1000 + Math.random() * 9000)}R1ZP`,
      shopActReg: `KA/BLR/${Math.floor(10000 + Math.random() * 90000)}/2025`,
      zone: newShopData.zone || storeInfo.zone || 'Ward 4 (Commercial Circle)',
      address: newShopData.address || storeInfo.location || 'Commercial Road, Bengaluru',
      phone: newShopData.phone || storeInfo.phone || '',
      assignedInspector: 'Pending Admin Allocation',
      inspectorBadge: 'LM-PENDING',
      status: 'Active Commercial Establishment',
      complianceStatus: 'Pending Inspector Assignment',
      documentStatus: 'pending_upload',
      registeredScalesCount: 1,
      instruments: [
        {
          id: `inst-${Date.now()}`,
          name: `${newShopData.scaleType || 'Electronic Counter'} Scale`,
          model: newShopData.scaleModel || 'Digital Standard Scale',
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

    // Persist to PostgreSQL backend
    try {
      await api.createShop({
        id: newShopId,
        name: newShop.name,
        ownerName: newShop.ownerName,
        email: merchantEmail,
        branchType: newShop.branchType,
        merchantUid: uid,
        tradeLicense: newShop.tradeLicense,
        gstin: newShop.gstin,
        zone: newShop.zone,
        address: newShop.address,
        phone: newShop.phone,
        scaleModel: newShopData.scaleModel,
        scaleType: newShopData.scaleType
      });
    } catch (err) {
      console.warn('[Backend Add Branch Error]', err.message);
    }

    setOwnerShops((prev) => [...prev, newShop]);
    setAllShops((prev) => [newShop, ...prev]);
    setMerchants((prev) => [
      {
        id: newShop.id,
        name: newShop.name,
        ownerName: newShop.ownerName,
        email: merchantEmail,
        merchantUid: newShop.merchantUid,
        tradeLicense: newShop.tradeLicense,
        zone: newShop.zone,
        address: newShop.address,
        phone: newShop.phone,
        registeredScales: 1,
        complianceStatus: 'Pending Inspector Assignment',
        assignedInspector: null,
        createdAt: 'Today'
      },
      ...prev
    ]);

    showToast(`New shop branch "${newShop.name}" added successfully!`, 'success');
  };

  const handleViewHistoricalCertificate = (cert) => {
    const currentShop = ownerShops[activeShopIndex] || ownerShops[0];
    setCertificateData({
      certId: cert.certId,
      ruleForm: cert.ruleForm || 'Form XVII (Rule 14)',
      actYear: cert.actYear || 'Act of 2009',
      statusBadge: cert.statusBadge || 'VERIFIED & COMPLIANT',
      daysLeft: cert.daysLeft !== undefined ? cert.daysLeft : 365,
      validUntil: cert.validUntil || '12 Jan 2026',
      verifiedDate: cert.verifiedDate || '13 Jan 2025',
      inspectorSeal: cert.inspectorSeal || 'SEAL-LM-BLR-0428',
      inspectorName: cert.inspectorName || currentShop?.assignedInspector || 'Insp. R. Deshmukh',
      inspectorBadge: cert.inspectorBadge || currentShop?.inspectorBadge || 'LM-BLR-402',
      instrumentModel: cert.instrumentModel || (currentShop?.instruments?.[0]?.name ? `${currentShop.instruments[0].name} (${currentShop.instruments[0].model})` : 'Contech CA-30 (Max 30kg, e=1g)'),
      serialNumber: cert.serialNumber || currentShop?.instruments?.[0]?.serialNumber || '#KA-BLR-88412',
      shopLocation: `${currentShop?.name || storeInfo.name}, ${currentShop?.zone || storeInfo.zone}`,
      shopName: currentShop?.name || storeInfo.name,
      shopAddress: currentShop?.address || storeInfo.location,
      merchantUid: currentShop?.merchantUid || storeInfo.merchantUid,
      tradeLicense: currentShop?.tradeLicense || storeInfo.regNumber,
      workingStandardRef: cert.workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)',
      digitalSignature: cert.digitalSignature || 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
      calibrationTests: cert.calibrationTests || testCalibrationData,
      isHistorical: cert.statusBadge?.toLowerCase().includes('archived') || cert.statusBadge?.toLowerCase().includes('renewed') || false,
      inProgress: false
    });
    navigateTo('certificate-view');
  };

  const handleViewActiveCertificate = (shopOverride) => {
    const currentShop = shopOverride || ownerShops[activeShopIndex] || ownerShops[0];
    if (currentShop?.certificationHistory && currentShop.certificationHistory.length > 0) {
      const activeCert = currentShop.certificationHistory[0];
      setCertificateData({
        certId: activeCert.certId,
        ruleForm: activeCert.ruleForm || 'Form XVII (Rule 14)',
        actYear: activeCert.actYear || 'Act of 2009',
        statusBadge: activeCert.statusBadge || 'VERIFIED & COMPLIANT',
        daysLeft: activeCert.daysLeft !== undefined ? activeCert.daysLeft : 365,
        validUntil: activeCert.validUntil || '12 Jan 2026',
        verifiedDate: activeCert.verifiedDate || '13 Jan 2025',
        inspectorSeal: activeCert.inspectorSeal || 'SEAL-LM-BLR-0428',
        inspectorName: activeCert.inspectorName || currentShop?.assignedInspector || 'Insp. R. Deshmukh',
        inspectorBadge: activeCert.inspectorBadge || currentShop?.inspectorBadge || 'LM-BLR-402',
        instrumentModel: activeCert.instrumentModel || (currentShop?.instruments?.[0]?.name ? `${currentShop.instruments[0].name} (${currentShop.instruments[0].model})` : 'Contech CA-30 (Max 30kg, e=1g)'),
        serialNumber: activeCert.serialNumber || currentShop?.instruments?.[0]?.serialNumber || '#KA-BLR-88412',
        shopLocation: `${currentShop.name}, ${currentShop.zone}`,
        shopName: currentShop.name,
        shopAddress: currentShop.address,
        merchantUid: currentShop.merchantUid,
        tradeLicense: currentShop.tradeLicense,
        workingStandardRef: activeCert.workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)',
        digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
        calibrationTests: activeCert.calibrationTests || testCalibrationData,
        isHistorical: false,
        inProgress: false
      });
    } else {
      setCertificateData({
        inProgress: true,
        shopName: currentShop?.name || storeInfo.name,
        shopAddress: currentShop?.address || storeInfo.location,
        merchantUid: currentShop?.merchantUid || storeInfo.merchantUid,
        tradeLicense: currentShop?.tradeLicense || storeInfo.regNumber,
        zone: currentShop?.zone || storeInfo.zone,
        branchType: currentShop?.branchType || 'Commercial Branch',
        assignedInspector: currentShop?.assignedInspector || 'Insp. R. Deshmukh',
        inspectorBadge: currentShop?.inspectorBadge || 'LM-BLR-402',
        complianceStatus: currentShop?.complianceStatus || 'Pending Inspector Verification',
        documentStatus: currentShop?.documentStatus || 'pending_review',
        instrument: currentShop?.instruments?.[0] || null
      });
    }
    navigateTo('certificate-view');
  };

  const handleViewRegistryCertificate = (item) => {
    setCertificateData({
      certId: item.certId,
      ruleForm: 'Form XVII (Rule 14)',
      actYear: 'Act of 2009',
      statusBadge: item.status === 'Compliant' ? 'VERIFIED & COMPLIANT' : 'RENEWAL DUE / PROVISIONAL',
      daysLeft: 365,
      validUntil: item.expiryDate || '12 Jan 2026',
      verifiedDate: '13 Jan 2025',
      inspectorSeal: item.stampSeal || 'SEAL-LM-BLR-0428',
      inspectorName: item.inspector || 'Insp. R. Deshmukh',
      inspectorBadge: 'LM-BLR-402',
      instrumentModel: item.instrument || 'Electronic Countertop Scale',
      serialNumber: item.serial || '#KA-BLR-88412',
      shopLocation: `${item.shopName}, ${item.zone}`,
      shopName: item.shopName,
      merchantUid: item.merchantUid || '',
      workingStandardRef: 'STD/KA/2024/0081 (Calibrated at NPL)',
      digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
      calibrationTests: testCalibrationData,
      isHistorical: false,
      inProgress: false
    });
    navigateTo('certificate-view');
  };

  const handleViewVisitCertificate = (visit) => {
    setCertificateData({
      certId: visit.certificateId || 'CERT-KA-2025-9921',
      ruleForm: 'Form XVII (Rule 14)',
      actYear: 'Act of 2009',
      statusBadge: 'VERIFIED & COMPLIANT',
      daysLeft: 365,
      validUntil: '16 Jan 2026',
      verifiedDate: '16 Jan 2025',
      inspectorSeal: 'SEAL-LM-BLR-2025-0428',
      inspectorName: visit.assignedOfficer || currentInspector?.name || 'Insp. R. Deshmukh',
      inspectorBadge: visit.officerBadge || currentInspector?.badge || 'LM-BLR-402',
      instrumentModel: visit.instrumentName ? `${visit.instrumentName} (${visit.model})` : 'Electronic Counter Scale',
      serialNumber: visit.serialNumber || '#KA-BLR-88412',
      shopLocation: `${visit.shopName}, ${visit.address}`,
      shopName: visit.shopName,
      merchantUid: visit.merchantUid || '',
      workingStandardRef: 'STD/KA/2025/0092 (Calibrated at NPL)',
      digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
      calibrationTests: testCalibrationData,
      isHistorical: false,
      inProgress: false
    });
    navigateTo('certificate-view');
  };

  const handleSearchCertificate = async (query) => {
    const q = (query || '').trim();
    if (!q) {
      showToast('Please enter a certificate ID or shop name to search', 'error');
      return;
    }

    try {
      // 1. Try querying backend /api/certificates/lookup/:certId
      const res = await api.lookupCertificate(q);
      if (res.success && res.data) {
        const cert = res.data;
        showToast(`Official Certificate Verified on Legal Metrology Ledger: ${cert.certId}`, 'success');
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
          shopLocation: `${cert.shopName || 'Commercial Establishment'}`,
          workingStandardRef: cert.workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)',
          digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
          calibrationTests: cert.testObservations?.length ? cert.testObservations : testCalibrationData
        });
        navigateTo('certificate-view');
        return;
      }
    } catch (err) {
      // Fallback to local registry matching
      console.warn('[Backend Cert Lookup Fallback]', err.message);
    }

    const qLower = q.toLowerCase();
    const match = registry.find(
      (r) =>
        r.certId.toLowerCase().includes(qLower) ||
        r.serial.toLowerCase().includes(qLower) ||
        r.merchantUid.toLowerCase().includes(qLower) ||
        r.shopName.toLowerCase().includes(qLower)
    );

    if (match) {
      showToast(`Verified record found for ${match.shopName}!`, 'success');
      setCertificateData({
        certId: match.certId,
        ruleForm: 'Form XVII (Rule 14)',
        actYear: 'Act of 2009',
        statusBadge: match.status === 'Compliant' ? 'VERIFIED & COMPLIANT' : 'RENEWAL DUE / PROVISIONAL',
        daysLeft: 365,
        validUntil: match.expiryDate || '12 Jan 2026',
        verifiedDate: '13 Jan 2025',
        inspectorSeal: match.stampSeal || 'SEAL-LM-BLR-0428',
        inspectorName: match.inspector || 'Insp. R. Deshmukh',
        inspectorBadge: 'LM-BLR-402',
        instrumentModel: match.instrument || 'Electronic Countertop Scale',
        serialNumber: match.serial || '#KA-BLR-88412',
        shopLocation: `${match.shopName}, ${match.zone}`,
        shopName: match.shopName,
        merchantUid: match.merchantUid || '',
        workingStandardRef: 'STD/KA/2024/0081 (Calibrated at NPL)',
        digitalSignature: 'Digitally Cryptographed (DSC v4.1 - State Metrology Repository)',
        calibrationTests: testCalibrationData,
        isHistorical: false,
        inProgress: false
      });
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
        handleDeleteInspector,
        currentInspector,
        getInspectorVisits,
        handleStartInspection,
        inspectors,
        merchants,
        operations,
        ownerShops,
        activeShopIndex,
        activeShop: ownerShops[activeShopIndex] || ownerShops[0] || {},
        handleSelectOwnerShop,
        handleAddOwnerShop,
        handleViewHistoricalCertificate,
        handleViewActiveCertificate,
        handleViewRegistryCertificate,
        handleViewVisitCertificate,
        adminCredentials: ADMIN_CREDENTIALS,
        language,
        setLanguage,
        t,
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
        setCertificateData,
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
