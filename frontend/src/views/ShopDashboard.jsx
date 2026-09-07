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
    handleViewHistoricalCertificate,
    handleViewActiveCertificate,
    showToast
  } = useApp();

  const [showAddShopModal, setShowAddShopModal] = useState(false);
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

  const daysLeft = activeInstrument?.daysRemaining ?? 28;
  const circumference = 590.6;
  const strokeOffset = Math.max(0, circumference - (circumference * (daysLeft / 365)));

  const assignedInspectorName = activeShop?.assignedInspector || storeInfo?.assignedInspector;
  const isInspectorAssigned = assignedInspectorName &&
    assignedInspectorName !== 'Pending Admin Allocation' &&
    assignedInspectorName !== 'Unassigned (Action Required)' &&
    assignedInspectorName !== 'PENDING' &&
    assignedInspectorName !== '';

  const currentDocData = documentSubmissions[activeShop.id] || activeShop.documentSubmissionData || {};
  const currentDocStatus = currentDocData.status || activeShop.documentStatus || verificationStatus.documentStatus || 'not_uploaded';
  const isDocVerified = currentDocStatus === 'verified';
  const isDocFraud = currentDocStatus === 'fraud';

  const handleBookVisitClick = () => {
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

          <button
            onClick={() => setShowAddShopModal(true)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
            type="button"
          >
            <span className="material-symbols-outlined text-base">add_business</span>
            <span>+ Register New Shop / Branch</span>
          </button>
        </div>

        {/* Multi-Shop Establishment Tabs */}
        <div>
          <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
            Your Establishments ({ownerShops.length} Registered Shops):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {ownerShops.map((shop, idx) => {
              const isSelected = activeShopIndex === idx;
              return (
                <button
                  key={shop.id}
                  onClick={() => handleSelectOwnerShop(idx)}
                  className={`p-3 sm:p-3.5 rounded-xl text-left border transition-all relative flex flex-col justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#023625]/5 border-[#023625] ring-2 ring-[#023625]/20 shadow-xs'
                      : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`material-symbols-outlined text-lg ${isSelected ? 'text-[#023625]' : 'text-gray-400'}`}>
                        storefront
                      </span>
                      <span className="text-xs font-bold text-gray-900 truncate max-w-[180px]">
                        {shop.name}
                      </span>
                    </div>
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
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 1: Active Shop Profile & Statutory Credentials Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {activeShop.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                {activeShop.status || 'Active Commercial Establishment'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {activeShop.branchType} • Jurisdiction: <strong>{activeShop.zone}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              onClick={() => navigateTo('upload-documents')}
              className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-gray-500">upload_file</span>
              <span>Upload Documents (5)</span>
            </button>
            <button
              onClick={() => navigateTo('register-instrument')}
              className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-gray-500">add</span>
              <span>Register Scale</span>
            </button>
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
            Rule 14 mandates electronic submission and officer verification of all 5 documents before physical testing.
          </p>
          <button
            onClick={() => navigateTo('upload-documents')}
            className="w-full sm:w-auto px-4 py-2 bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            <span>Manage &amp; Upload 5 Documents</span>
          </button>
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
              className="w-full h-11 bg-[#E0702A] hover:bg-[#c95f1e] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              <span>{!isInspectorAssigned ? 'View Assignment Status' : isDocVerified ? 'Schedule Inspector Visit' : 'Upload Docs & Book Visit'}</span>
            </button>
            <span className="text-xs text-gray-400 py-0.5 font-medium">
              Statutory Fee ₹150 • Rule 14 Legal Metrology
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
                  className="px-5 py-2 rounded-xl bg-[#023625] hover:bg-[#1a4b38] text-white font-bold text-xs shadow-xs"
                >
                  Register Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
