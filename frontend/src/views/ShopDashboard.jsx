import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ShopDashboard = () => {
  const {
    navigateTo,
    activeInstrument,
    instruments,
    setActiveInstrumentIndex,
    activeInstrumentIndex,
    verificationStatus,
    documentSubmissions,
    storeInfo,
    ownerShops,
    activeShopIndex,
    handleSelectOwnerShop,
    handleAddOwnerShop,
    handleDeleteOwnerShop,
    handleDeleteShopOwnerAccount,
    handleViewHistoricalCertificate,
    handleViewActiveCertificate,
    showToast
  } = useApp();

  const [showAddShopModal, setShowAddShopModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showDeleteShopModal, setShowDeleteShopModal] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const [newShopForm, setNewShopForm] = useState({
    name: '',
    branchType: 'Retail Branch',
    tradeLicense: '',
    gstin: '',
    zone: 'Ward 4 (Commercial Circle)',
    address: '',
    phone: '',
    scaleType: 'Electronic Countertop',
    scaleModel: 'Contech CA-30 Series'
  });

  const activeShop = ownerShops?.[activeShopIndex] || ownerShops?.[0] || {
    name: storeInfo.name || 'Commercial Establishment',
    branchType: 'Main Commercial Branch',
    tradeLicense: storeInfo.regNumber || 'Pending Statutory Filing',
    gstin: storeInfo.gstin || 'Pending Registration',
    shopActReg: storeInfo.shopActReg || 'Pending Registration',
    zone: storeInfo.zone || 'Ward 4 (Commercial Circle)',
    address: storeInfo.location || 'Bengaluru, Karnataka',
    phone: storeInfo.phone || '',
    assignedInspector: storeInfo.assignedInspector || null,
    inspectorBadge: storeInfo.inspectorBadge || null,
    status: 'Active Commercial Establishment',
    complianceStatus: 'Pending Inspector Assignment',
    documentStatus: 'pending_upload',
    registeredScalesCount: instruments.length || 0,
    certificationHistory: []
  };

  const currentDocData = documentSubmissions[activeShop.id] || activeShop.documentSubmissionData || {};
  const currentDocStatus = currentDocData.status || activeShop.documentStatus || verificationStatus.documentStatus || 'not_uploaded';
  const isDocVerified = currentDocStatus === 'verified';
  const isDocFraud = currentDocStatus === 'fraud';

  const shopInstruments = (activeShop?.instruments && activeShop.instruments.length > 0)
    ? activeShop.instruments
    : (instruments && instruments.length > 0)
    ? instruments
    : [];
  const hasRegisteredScales = Boolean(shopInstruments && shopInstruments.length > 0 && shopInstruments[0]?.serialNumber);

  const isCertified =
    activeShop.complianceStatus === 'Certified & Compliant' ||
    activeShop.status === 'Verified & Compliant' ||
    (activeShop.certificationHistory && activeShop.certificationHistory.length > 0) ||
    verificationStatus.status === 'certified';

  const isVisitScheduled =
    activeShop.complianceStatus === 'Scheduled for Verification' ||
    activeShop.complianceStatus?.includes('Scheduled') ||
    verificationStatus.status === 'scheduled';

  const daysLeft = isCertified ? (activeInstrument?.daysRemaining || 365) : (activeInstrument?.daysRemaining ?? 28);
  const circumference = 590.6;
  const strokeOffset = Math.max(0, circumference - (circumference * (daysLeft / 365)));

  const assignedInspectorName = activeShop?.assignedInspector || storeInfo?.assignedInspector;
  const isInspectorAssigned = assignedInspectorName &&
    assignedInspectorName !== 'Pending Admin Allocation' &&
    assignedInspectorName !== 'Unassigned (Action Required)' &&
    assignedInspectorName !== 'PENDING' &&
    assignedInspectorName !== '';

  const handleBookVisitClick = () => {
    if (isCertified) {
      handleViewActiveCertificate();
      return;
    }
    if (isVisitScheduled) {
      navigateTo('track-status');
      return;
    }
    if (!isInspectorAssigned) {
      showToast('Inspector Allocation Pending: Department Admin is assigning an Inspector to your store.', 'info');
      navigateTo('upload-documents');
      return;
    }
    if (isDocFraud) {
      showToast('Action Blocked: Legal Metrology Officer flagged submitted documents as Fraud.', 'error');
      return;
    }
    if (isDocVerified) {
      navigateTo('request-verification');
    } else {
      navigateTo('upload-documents');
    }
  };

  const onAddShopSubmit = (e) => {
    e.preventDefault();
    if (!newShopForm.name.trim() || !newShopForm.address.trim()) {
      showToast('Please fill in Establishment Name and Address', 'error');
      return;
    }
    handleAddOwnerShop(newShopForm);
    setShowAddShopModal(false);
    setNewShopForm({
      name: '',
      branchType: 'Retail Branch',
      tradeLicense: '',
      gstin: '',
      zone: 'Ward 4 (Commercial Circle)',
      address: '',
      phone: '',
      scaleType: 'Electronic Countertop',
      scaleModel: 'Contech CA-30 Series'
    });
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 flex flex-col gap-5 sm:gap-6 min-h-screen">
      {/* Top Banner: Merchant Account Identity & Multi-Shop Selector */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Verified Merchant Account • {storeInfo.contactPerson || storeInfo.name || 'Merchant Owner'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Enterprise Commercial Establishments
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Manage multi-branch shop licenses, mandatory statutory document filings, counter scale verification, and departmental certification history.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto shrink-0">
            <button
              onClick={() => setShowAddShopModal(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">add_business</span>
              <span>+ Register New Shop</span>
            </button>

            <button
              onClick={() => {
                setDeleteConfirmText('');
                setShowDeleteAccountModal(true);
              }}
              className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-300 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              title="Permanently delete merchant account"
              type="button"
            >
              <span className="material-symbols-outlined text-base text-red-600">delete_forever</span>
              <span className="hidden sm:inline">Delete Account</span>
            </button>
          </div>
        </div>

        {/* Multi-Shop Establishment Tabs */}
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Your Establishments ({ownerShops.length} Registered Shops):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {ownerShops.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 p-6 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl text-xs text-gray-500">
                <span className="material-symbols-outlined text-3xl text-gray-400 mb-1 block">storefront</span>
                <span className="font-semibold text-gray-700 block">No store registered under this account yet</span>
                <span>Click &quot;+ Register New Shop&quot; above to register your first commercial establishment.</span>
              </div>
            ) : (
              ownerShops.map((shop, idx) => {
                const isSelected = activeShopIndex === idx;
                return (
                  <div
                    key={shop.id || idx}
                    onClick={() => handleSelectOwnerShop(idx)}
                    className={`p-3 sm:p-3.5 rounded-xl text-left border transition-all relative flex flex-col justify-between gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-[#023625]/5 border-[#023625] ring-2 ring-[#023625]/20 shadow-xs'
                        : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`material-symbols-outlined text-lg shrink-0 ${isSelected ? 'text-[#023625]' : 'text-gray-400'}`}>
                          storefront
                        </span>
                        <span className="text-xs font-bold text-gray-900 truncate">
                          {shop.name}
                        </span>
                      </div>

                      {ownerShops.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDeleteShopModal(shop);
                          }}
                          className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                          title={`Delete branch ${shop.name}`}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-gray-200/50">
                      <span className="font-mono">{shop.merchantUid}</span>
                      <span className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                        shop.documentStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {shop.documentStatus === 'verified' ? 'Verified' : 'Review Due'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* CONDITIONAL BANNER: Step 1 Action Required - Register Weighing Scale */}
      {!hasRegisteredScales && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-400 text-amber-950 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
              <span className="material-symbols-outlined text-3xl animate-bounce">scale</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-950 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Step 1 Action Required Before Document Upload
                </span>
                <span className="text-[10px] font-bold text-amber-800">
                  Legal Metrology Rule 14
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                Register Your Weighing Scale First
              </h2>
              <p className="text-xs text-gray-700 mt-0.5 max-w-xl leading-relaxed">
                Before uploading statutory verification documents (scale tax invoice, serial nameplate photograph, and counter installation view), you must register your shop's weighing scale so files can be matched to your scale serial number.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('register-instrument')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#023625] hover:bg-[#1a4b38] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>+ Add Scale Instrument (Step 1)</span>
          </button>
        </div>
      )}

      {/* CONDITIONAL BANNER 1: Official Verification Completed & Form XVII Certificate Issued */}
      {isCertified && (
        <div className="bg-gradient-to-r from-[#023625] to-[#0A4D35] rounded-2xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/40">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0 text-emerald-300">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                  Legal Metrology Act 2009 • Completed & Certified
                </span>
                <span className="text-xs text-emerald-200 font-mono">
                  {activeShop.certificationHistory?.[0]?.certId || activeShop.certificateId || 'Form XVII Certified'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Official Verification Complete • Form XVII Certificate Issued
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                Your commercial establishment and counter scales have successfully passed physical inspection and metrological verification by <strong>{assignedInspectorName || 'Assigned Officer'}</strong>. Form XVII verification certificate has been cryptographically registered with 365 days statutory compliance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={() => handleViewActiveCertificate()}
              className="w-full md:w-auto px-5 py-3 rounded-xl bg-white hover:bg-emerald-50 text-[#023625] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              type="button"
            >
              <span className="material-symbols-outlined text-lg text-emerald-700">workspace_premium</span>
              <span>View Form XVII Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* CONDITIONAL BANNER 2: Field Inspection Visit Scheduled */}
      {isVisitScheduled && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 text-amber-950 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E0702A] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-2xl">event_available</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#E0702A] block">
                Field Inspection Scheduled • On-Site Step
              </span>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                Inspector Verification Visit Booked
              </h2>
              <p className="text-xs text-gray-600 mt-0.5">
                Slot: <strong className="text-gray-900">{typeof activeShop.scheduledSlot === 'object' ? `${activeShop.scheduledSlot.date} • ${activeShop.scheduledSlot.time}` : (activeShop.scheduledSlot || 'Upcoming Slot')}</strong> • Assigned Officer: <strong className="text-[#023625]">{assignedInspectorName || 'Insp. R. Deshmukh'} ({activeShop.inspectorBadge || 'LM-BLR-402'})</strong>
              </p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('track-status')}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-base">route</span>
            <span>Track Inspection Visit</span>
          </button>
        </div>
      )}

      {/* SECTION 1: Active Shop Profile & Statutory Credentials Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {activeShop.name}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isCertified
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : isVisitScheduled
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {isCertified ? 'Verified & Compliant (365 Days Valid)' : isVisitScheduled ? 'Verification Visit Scheduled' : (activeShop.status || 'Active Commercial Establishment')}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {activeShop.branchType} • Jurisdiction: <strong>{activeShop.zone}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            {!hasRegisteredScales ? (
              <>
                <button
                  onClick={() => navigateTo('register-instrument')}
                  className="flex-1 sm:flex-initial justify-center px-4 py-2 rounded-xl bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">add_circle</span>
                  <span>+ Add Scale (Step 1)</span>
                </button>
                <button
                  onClick={() => navigateTo('upload-documents')}
                  className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-500 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-gray-400">lock</span>
                  <span>Upload Documents (Step 2)</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigateTo('upload-documents')}
                  className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-[#023625]">upload_file</span>
                  <span>Upload Documents (5)</span>
                </button>
                <button
                  onClick={() => navigateTo('register-instrument')}
                  className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base text-gray-500">add</span>
                  <span>Add Another Scale</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 6-Field Statutory Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Trade License Number</span>
            <span className="text-xs font-bold text-gray-900 font-mono mt-0.5">{activeShop.tradeLicense}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">GSTIN / Tax ID</span>
            <span className="text-xs font-bold text-gray-900 font-mono mt-0.5">{activeShop.gstin || 'Pending Registration'}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Shop &amp; Establishment Act Reg</span>
            <span className="text-xs font-bold text-gray-900 font-mono mt-0.5">{activeShop.shopActReg || 'Pending Registration'}</span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Premises Physical Address</span>
            <span className="text-xs font-medium text-gray-800 truncate mt-0.5" title={activeShop.address}>
              {activeShop.address}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Assigned Field Inspector</span>
            <span className="text-xs font-bold text-[#023625] mt-0.5 truncate">
              {activeShop.assignedInspector ? (
                `${activeShop.assignedInspector} ${activeShop.inspectorBadge ? `(${activeShop.inspectorBadge})` : ''}`
              ) : (
                <span className="text-amber-800 font-bold">Pending Inspector Allocation</span>
              )}
            </span>
          </div>

          <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col">
            <span className="text-[10px] uppercase font-bold text-gray-400">Registered Scales at Branch</span>
            <span className="text-xs font-bold text-gray-900 mt-0.5">
              {activeShop.instruments?.length || activeShop.registeredScalesCount || 0} Commercial Instruments
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Statutory Documents Verification & Upload Status */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-[#023625]">folder_shared</span>
            <h2 className="text-sm sm:text-base font-bold text-gray-900">
              Mandatory Statutory Documents (5/5 Files Required)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isDocVerified ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                <span className="material-symbols-outlined text-sm text-emerald-700">verified</span>
                <span>Verified by Inspector</span>
              </span>
            ) : isDocFraud ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-900 text-xs font-bold border border-red-300">
                <span className="material-symbols-outlined text-sm text-red-700">report</span>
                <span>Flagged as Fraud / Blocked</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                <span className="material-symbols-outlined text-sm text-amber-700">pending</span>
                <span>Under Inspector Scrutiny</span>
              </span>
            )}
          </div>
        </div>

        {/* 5 Documents Summary Chips */}
        {(() => {
          const docsObj = currentDocData.docs || {};
          const isRegUploaded = Boolean(docsObj.businessRegistration?.uploaded || docsObj.businessRegistration?.fileName);
          const isIdUploaded = Boolean(docsObj.ownerId?.uploaded || docsObj.ownerId?.fileName);
          const isInvoiceUploaded = Boolean(docsObj.purchaseInvoice?.uploaded || docsObj.purchaseInvoice?.fileName);
          const isPlateUploaded = Boolean(docsObj.instrumentPlate?.uploaded || docsObj.instrumentPlate?.fileName);
          const isPhotoUploaded = Boolean(docsObj.instrumentPhotos?.uploaded || docsObj.instrumentPhotos?.fileName);

          return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">1. Business Reg</span>
                <span className="text-xs font-bold text-gray-900 truncate">Trade License</span>
                {isRegUploaded ? (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">check</span> Uploaded
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">pending</span> Pending
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">2. Owner ID</span>
                <span className="text-xs font-bold text-gray-900 truncate">Govt Photo ID</span>
                {isIdUploaded ? (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">check</span> Uploaded
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">pending</span> Pending
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">3. Scale Invoice</span>
                <span className="text-xs font-bold text-gray-900 truncate">Purchase Bill</span>
                {isInvoiceUploaded ? (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">check</span> Uploaded
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">pending</span> Pending
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">4. Plate Photo</span>
                <span className="text-xs font-bold text-gray-900 truncate">Serial Nameplate</span>
                {isPlateUploaded ? (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">check</span> Uploaded
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">pending</span> Pending
                  </span>
                )}
              </div>

              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50 flex flex-col gap-1">
                <span className="text-[10px] uppercase font-bold text-gray-400">5. Scale Photo</span>
                <span className="text-xs font-bold text-gray-900 truncate">Counter Setup</span>
                {isPhotoUploaded ? (
                  <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">check</span> Uploaded
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">pending</span> Pending
                  </span>
                )}
              </div>
            </div>
          );
        })()}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <p className="text-xs text-gray-500">
            {!hasRegisteredScales
              ? 'Step 1 Incomplete: Under Rule 14, evidentiary documents must reference a registered scale before officer review.'
              : 'Rule 14 mandates electronic submission and officer verification of all 5 documents before physical testing.'}
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!hasRegisteredScales ? (
              <button
                onClick={() => navigateTo('register-instrument')}
                className="w-full sm:w-auto px-4 py-2 bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">scale</span>
                <span>Register Scale First (Step 1)</span>
              </button>
            ) : (
              <button
                onClick={() => navigateTo('upload-documents')}
                className="w-full sm:w-auto px-4 py-2 bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                <span>Manage &amp; Upload 5 Documents</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 3: Active Counter Scales & Calibration Countdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Visual Countdown Gauge Card */}
        <div className="md:col-span-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-xs">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Calibration Term
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>{activeInstrument?.status || 'Stamping Active'}</span>
            </span>
          </div>

          {/* Clean SVG Circular Gauge */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 my-2 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 220 220">
              <circle cx="110" cy="110" fill="none" r="94" stroke="#F3F4F6" strokeWidth="12" />
              <circle
                className="transition-all duration-1000 ease-out"
                cx="110"
                cy="110"
                fill="none"
                r="94"
                stroke={daysLeft < 30 ? '#E0702A' : '#023625'}
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="12"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-5xl font-extrabold text-gray-900 tracking-tight">
                {daysLeft}
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                Days Remaining
              </span>
              <span className="text-[11px] text-gray-400 mt-1">
                Expires on <strong className="text-gray-700">{activeInstrument?.expiresOn || 'Within 30 Days'}</strong>
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="w-full flex flex-col gap-2 mt-4">
            <button
              onClick={handleBookVisitClick}
              className={`w-full h-11 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                isCertified
                  ? 'bg-[#023625] hover:bg-[#1a4b38]'
                  : isVisitScheduled
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#E0702A] hover:bg-[#c95f1e]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isCertified ? 'workspace_premium' : isVisitScheduled ? 'route' : 'calendar_month'}
              </span>
              <span>
                {isCertified
                  ? 'View Active Certificate (Form XVII)'
                  : isVisitScheduled
                  ? 'Track Scheduled Inspection Visit'
                  : !isInspectorAssigned
                  ? 'View Assignment Status'
                  : isDocVerified
                  ? 'Schedule Inspector Visit'
                  : 'Upload Docs & Book Visit'}
              </span>
            </button>
            <span className="text-xs text-gray-400 py-0.5 font-medium">
              {isCertified
                ? 'Statutory Certificate Form XVII • Rule 14 Legal Metrology'
                : 'Statutory Fee ₹150 • Rule 14 Legal Metrology'}
            </span>
          </div>
        </div>

        {/* Right Column: Scale Details & Switcher Card */}
        <div className="md:col-span-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">scale</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 leading-none">
                    {activeInstrument?.name || 'Counter Scale'}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono mt-0.5 block">
                    {activeInstrument?.model || 'Contech CA-30'}
                  </span>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {activeInstrument?.class || 'Class III Commercial'}
              </span>
            </div>

            {/* Instrument Multiple Devices Selector */}
            {instruments.length > 1 && (
              <div className="mb-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Select Counter Instrument ({instruments.length} Scales Registered):
                </span>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {instruments.map((inst, idx) => (
                    <button
                      key={inst.id}
                      onClick={() => setActiveInstrumentIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                        activeInstrumentIndex === idx
                          ? 'bg-[#023625] text-white font-bold shadow-xs'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">scale</span>
                      <span>{inst.model}</span>
                      <span className="text-[10px] opacity-75 font-mono">({inst.serialNumber})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Spec List */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-500 font-medium">Serial Number</span>
                <span className="font-mono font-bold text-gray-900">{activeInstrument?.serialNumber}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-500 font-medium">Capacity &amp; Division</span>
                <span className="font-semibold text-gray-900">{activeInstrument?.capacity}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-500 font-medium">Installed Location</span>
                <span className="font-semibold text-gray-900">{activeInstrument?.counter || 'Billing Counter 1'}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50">
                <span className="text-gray-500 font-medium">Holographic Seal Ref</span>
                <span className="font-mono text-[#023625] font-bold">{activeInstrument?.sealNumber}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 mt-4">
            <button
              onClick={() => navigateTo('register-instrument')}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>Add Scale to Shop</span>
            </button>
            <button
              onClick={() => handleViewActiveCertificate()}
              className="w-full sm:w-auto px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>View Active Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 4: Previously Certified Scales & Historical Stamping Archive */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#023625] flex items-center justify-center border border-emerald-100 shrink-0">
              <span className="material-symbols-outlined text-lg">history_edu</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Previously Certified Scales &amp; Stamping Archive
              </h2>
              <p className="text-xs text-gray-500">
                Official historical records of verified and stamped instruments for <strong>{activeShop.name}</strong>.
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 self-start sm:self-auto">
            {activeShop.certificationHistory?.length || 0} Certificates Issued
          </span>
        </div>

        {/* Certificate Archive List */}
        {activeShop.certificationHistory && activeShop.certificationHistory.length > 0 ? (
          <div className="flex flex-col gap-3">
            {activeShop.certificationHistory.map((cert) => (
              <div
                key={cert.certId}
                className="p-3.5 sm:p-4 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white border border-gray-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                    <span className="material-symbols-outlined text-lg sm:text-xl">verified</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-extrabold text-xs sm:text-sm text-gray-900">
                        {cert.certId}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {cert.statusBadge}
                      </span>
                      <span className="text-xs text-gray-400 font-mono">
                        {cert.serialNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600 mt-1 flex-wrap">
                      <span>Scale: <strong>{cert.instrumentModel}</strong></span>
                      <span className="text-gray-300">•</span>
                      <span>Verified: <strong>{cert.verifiedDate}</strong></span>
                      <span className="text-gray-300">•</span>
                      <span>Valid Until: <strong>{cert.validUntil}</strong></span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5 flex-wrap">
                      <span>Seal: <strong className="font-mono text-gray-700">{cert.inspectorSeal}</strong></span>
                      <span className="text-gray-300">•</span>
                      <span>Officer: <strong className="text-gray-700">{cert.inspectorName} ({cert.inspectorBadge})</strong></span>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-auto shrink-0 flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleViewHistoricalCertificate(cert)}
                    className="w-full md:w-auto px-4 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-[#023625] text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>View Certificate</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 sm:p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-3xl text-gray-300 mb-1 block">receipt_long</span>
            <p className="text-xs font-bold text-gray-700">No Past Certificates on Record for this Branch</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Once an Inspector conducts the physical weights audit, verified certificates will be archived here.
            </p>
          </div>
        )}
      </div>

      {/* MODAL: Register New Shop / Branch */}
      {showAddShopModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-gray-200 shadow-2xl p-4 sm:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                  Register New Shop / Branch Establishment
                </h3>
                <p className="text-xs text-gray-500">
                  Add another commercial branch under <strong>{storeInfo.contactPerson || storeInfo.name || 'your merchant profile'}</strong>.
                </p>
              </div>
              <button
                onClick={() => setShowAddShopModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={onAddShopSubmit} className="flex flex-col gap-3.5 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Establishment / Branch Name *</label>
                <input
                  value={newShopForm.name}
                  onChange={(e) => setNewShopForm({ ...newShopForm, name: e.target.value })}
                  placeholder="e.g. Commercial Branch 2 (West Wing)"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#023625] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Branch Type</label>
                  <select
                    value={newShopForm.branchType}
                    onChange={(e) => setNewShopForm({ ...newShopForm, branchType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#023625] focus:outline-none"
                  >
                    <option value="Retail Branch">Retail Branch</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Wholesale Depot">Wholesale Depot</option>
                    <option value="Confectionery">Confectionery</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Jurisdiction Zone</label>
                  <select
                    value={newShopForm.zone}
                    onChange={(e) => setNewShopForm({ ...newShopForm, zone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#023625] focus:outline-none"
                  >
                    <option value="Ward 4 (Commercial Circle)">Ward 4 (Commercial Circle)</option>
                    <option value="Ward 2 (Commercial Ganj)">Ward 2 (Commercial Ganj)</option>
                    <option value="Ward 1 (APMC Yard)">Ward 1 (APMC Yard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Shop Address *</label>
                <input
                  value={newShopForm.address}
                  onChange={(e) => setNewShopForm({ ...newShopForm, address: e.target.value })}
                  placeholder="e.g. Shop #55, Market Road, Bengaluru - 560001"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#023625] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Trade License (Optional)</label>
                  <input
                    value={newShopForm.tradeLicense}
                    onChange={(e) => setNewShopForm({ ...newShopForm, tradeLicense: e.target.value })}
                    placeholder="BBMP/TL/2025/..."
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#023625] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Scale Model</label>
                  <input
                    value={newShopForm.scaleModel}
                    onChange={(e) => setNewShopForm({ ...newShopForm, scaleModel: e.target.value })}
                    placeholder="Contech CA-30"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-[#023625] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2 mt-2">
                <button
                  onClick={() => setShowAddShopModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs"
                  type="button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#023625] hover:bg-[#1a4b38] text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Register Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Branch Modal */}
      {showDeleteShopModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-200 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">store</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">De-Register Establishment</h3>
                <span className="text-xs text-gray-500 font-mono">{showDeleteShopModal.merchantUid}</span>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete and de-register <strong>{showDeleteShopModal.name}</strong>? All registered weighing scales, calibration records, and certificates associated with this branch will be removed.
            </p>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowDeleteShopModal(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleDeleteOwnerShop(showDeleteShopModal.id);
                  setShowDeleteShopModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                <span>Delete Branch</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg border border-red-200 shadow-2xl p-6 flex flex-col gap-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">delete_forever</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                      Permanent Deletion
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">
                    Delete Merchant Account
                  </h3>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmText('');
                }}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Warning Box */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-900 text-xs font-bold">
                <span className="material-symbols-outlined text-base text-red-700">warning</span>
                <span>Statutory &amp; Data Loss Warning</span>
              </div>
              <p className="text-xs text-red-800 leading-relaxed">
                This action is <strong>irreversible</strong>. Deleting your account will permanently erase:
              </p>
              <ul className="text-xs text-red-900 list-disc list-inside space-y-1">
                <li>All <strong>{ownerShops.length} registered commercial establishments</strong></li>
                <li>All <strong>weighing instrument verification records &amp; serial numbers</strong></li>
                <li>All <strong>official Form XVII certificates &amp; hologram stamping data</strong></li>
                <li>All <strong>submitted statutory documents &amp; trade licenses</strong></li>
              </ul>
              <p className="text-[11px] text-red-700 font-medium italic mt-1">
                * Under Legal Metrology Act 2009, conducting commercial weighing without an active state registration is prohibited.
              </p>
            </div>

            {/* Confirmation Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">
                To confirm deletion, please type <span className="font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">DELETE</span> below:
              </label>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono uppercase tracking-wider focus:ring-2 focus:ring-red-500 focus:outline-none"
                type="text"
                autoFocus
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteAccountModal(false);
                  setDeleteConfirmText('');
                }}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
                    showToast('Please type DELETE to confirm account removal', 'error');
                    return;
                  }
                  setIsDeleting(true);
                  try {
                    await handleDeleteShopOwnerAccount();
                  } finally {
                    setIsDeleting(false);
                    setShowDeleteAccountModal(false);
                  }
                }}
                disabled={deleteConfirmText.trim().toUpperCase() !== 'DELETE' || isDeleting}
                className={`px-5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 ${
                  deleteConfirmText.trim().toUpperCase() === 'DELETE' && !isDeleting
                    ? 'bg-red-600 hover:bg-red-700 text-white cursor-pointer active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-base">
                  {isDeleting ? 'progress_activity' : 'delete_forever'}
                </span>
                <span>{isDeleting ? 'Deleting Account...' : 'Permanently Delete Account'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
