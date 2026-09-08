import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const UploadDocuments = () => {
  const {
    navigateTo,
    storeInfo,
    activeShop,
    instruments = [],
    activeInstrument,
    verificationStatus,
    documentSubmissions,
    handleUploadDocuments,
    showToast
  } = useApp();

  const currentMerchantId = storeInfo?.id || activeShop?.id || 'merch-1';
  const currentDocData = (documentSubmissions && documentSubmissions[currentMerchantId]) || activeShop?.documentSubmissionData || {};
  const currentStatus = currentDocData.status || activeShop?.documentStatus || verificationStatus?.documentStatus || 'pending_review';

  const currentStore = storeInfo || activeShop || { name: 'Commercial Establishment' };
  
  // Check if shop has a registered instrument scale
  const shopInstruments = (activeShop?.instruments && activeShop.instruments.length > 0)
    ? activeShop.instruments
    : (instruments && instruments.length > 0)
    ? instruments
    : [];
  const hasScale = Boolean(shopInstruments && shopInstruments.length > 0 && shopInstruments[0]?.serialNumber);
  const currentInst = shopInstruments?.[0] || activeInstrument || null;

  const assignedInspectorName = activeShop?.assignedInspector || storeInfo?.assignedInspector;
  const isInspectorAssigned = assignedInspectorName &&
    assignedInspectorName !== 'Pending Admin Allocation' &&
    assignedInspectorName !== 'Unassigned (Action Required)' &&
    assignedInspectorName !== 'PENDING' &&
    assignedInspectorName !== '';

  const [files, setFiles] = useState(() => {
    const d = currentDocData.docs || {};
    return {
      businessRegistration: {
        title: 'Business Registration',
        subTitle: 'Trade License / GSTIN / Shop & Establishment Act Certificate',
        fileName: d.businessRegistration?.fileName || '',
        fileSize: d.businessRegistration?.fileSize || '',
        mandatory: true,
        uploaded: Boolean(d.businessRegistration?.uploaded || d.businessRegistration?.fileName)
      },
      ownerId: {
        title: 'Owner ID Proof',
        subTitle: 'Aadhaar Card / Voter ID / Government Photo ID',
        fileName: d.ownerId?.fileName || '',
        fileSize: d.ownerId?.fileSize || '',
        mandatory: true,
        uploaded: Boolean(d.ownerId?.uploaded || d.ownerId?.fileName)
      },
      purchaseInvoice: {
        title: 'Purchase Invoice',
        subTitle: 'Original Scale Purchase Bill / Manufacturer Tax Invoice',
        fileName: d.purchaseInvoice?.fileName || '',
        fileSize: d.purchaseInvoice?.fileSize || '',
        mandatory: true,
        uploaded: Boolean(d.purchaseInvoice?.uploaded || d.purchaseInvoice?.fileName)
      },
      instrumentPlate: {
        title: 'Instrument Plate Photo',
        subTitle: 'Clear photograph of scale model specification & serial plate (JPG/PNG only)',
        fileName: d.instrumentPlate?.fileName || '',
        fileSize: d.instrumentPlate?.fileSize || '',
        mandatory: true,
        uploaded: Boolean(d.instrumentPlate?.uploaded || d.instrumentPlate?.fileName)
      },
      instrumentPhotos: {
        title: 'Instrument Photos',
        subTitle: 'Installed countertop scale photograph - Front & profile view (JPG/PNG only)',
        fileName: d.instrumentPhotos?.fileName || '',
        fileSize: d.instrumentPhotos?.fileSize || '',
        mandatory: true,
        uploaded: Boolean(d.instrumentPhotos?.uploaded || d.instrumentPhotos?.fileName)
      }
    };
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (key, file) => {
    if (!hasScale) {
      showToast('Prerequisite Required: Please add your weighing scale instrument before uploading documents.', 'error');
      navigateTo('register-instrument');
      return;
    }
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFiles((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          fileName: file.name,
          fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          fileData: event.target.result,
          fileType: file.type,
          uploaded: true
        }
      }));
      showToast(`Attached file: ${file.name}`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleClearFiles = () => {
    setFiles({
      businessRegistration: {
        title: 'Business Registration',
        subTitle: 'Trade License / GSTIN / Shop & Establishment Act Certificate',
        fileName: '',
        fileSize: '',
        mandatory: true,
        uploaded: false
      },
      ownerId: {
        title: 'Owner ID Proof',
        subTitle: 'Aadhaar Card / Voter ID / Government Photo ID',
        fileName: '',
        fileSize: '',
        mandatory: true,
        uploaded: false
      },
      purchaseInvoice: {
        title: 'Purchase Invoice',
        subTitle: 'Original Scale Purchase Bill / Manufacturer Tax Invoice',
        fileName: '',
        fileSize: '',
        mandatory: true,
        uploaded: false
      },
      instrumentPlate: {
        title: 'Instrument Plate Photo',
        subTitle: 'Clear photograph of scale model specification & serial plate (JPG/PNG only)',
        fileName: '',
        fileSize: '',
        mandatory: true,
        uploaded: false
      },
      instrumentPhotos: {
        title: 'Instrument Photos',
        subTitle: 'Installed countertop scale photograph - Front & profile view (JPG/PNG only)',
        fileName: '',
        fileSize: '',
        mandatory: true,
        uploaded: false
      }
    });
    showToast('Reset file attachments', 'info');
  };

  const onSubmit = () => {
    if (!hasScale) {
      showToast('Prerequisite Required: You must register a weighing scale before submitting statutory documents.', 'error');
      navigateTo('register-instrument');
      return;
    }
    if (!isInspectorAssigned) {
      showToast('Action Blocked: Please wait until Department Admin assigns an Inspector to your store.', 'error');
      return;
    }
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      handleUploadDocuments(currentMerchantId, {
        businessRegistration: { ...files.businessRegistration, status: 'Uploaded', uploadedAt: 'Just now' },
        ownerId: { ...files.ownerId, status: 'Uploaded', uploadedAt: 'Just now' },
        purchaseInvoice: { ...files.purchaseInvoice, status: 'Uploaded', uploadedAt: 'Just now' },
        instrumentPlate: { ...files.instrumentPlate, status: 'Uploaded', uploadedAt: 'Just now' },
        instrumentPhotos: { ...files.instrumentPhotos, status: 'Uploaded', uploadedAt: 'Just now' }
      });
    }, 600);
  };

  const allUploaded = Object.values(files).every((f) => f.uploaded);

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 min-h-screen">
      <div className="max-w-3xl mx-auto flex flex-col gap-5 sm:gap-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => navigateTo('shop-dashboard')}
            className="hover:text-gray-900 transition-colors flex items-center gap-1 font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Shop Dashboard</span>
          </button>
          <span>/</span>
          <span className="text-[#023625] font-bold">Step 2: Statutory Document Upload</span>
        </div>

        {/* WORKFLOW STEPPER BAR */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-gray-500">
              Establishment Certification Workflow
            </span>
            <span className="text-xs font-bold font-mono text-[#023625]">
              {hasScale ? 'Stage 2 of 3 Active' : 'Stage 1 of 3 (Action Required)'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1: Add Scale */}
            <div
              onClick={() => navigateTo('register-instrument')}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                hasScale
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 hover:bg-emerald-100/70'
                  : 'bg-amber-50 border-2 border-amber-400 text-amber-950 ring-2 ring-amber-400/20'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                hasScale ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white animate-pulse'
              }`}>
                <span className="material-symbols-outlined text-base">
                  {hasScale ? 'check' : 'scale'}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  Step 1 • Prerequisite
                </span>
                <span className="text-xs font-extrabold block truncate">
                  {hasScale ? 'Scale Added' : 'Add Scale First'}
                </span>
              </div>
            </div>

            {/* Step 2: Upload Documents */}
            <div
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                !hasScale
                  ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                  : currentStatus === 'verified'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-[#023625]/5 border-2 border-[#023625] text-[#023625] ring-2 ring-[#023625]/20'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                !hasScale
                  ? 'bg-gray-200 text-gray-500'
                  : currentStatus === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#023625] text-white'
              }`}>
                <span className="material-symbols-outlined text-base">
                  {!hasScale ? 'lock' : currentStatus === 'verified' ? 'check' : 'upload_file'}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  Step 2 • Compliance
                </span>
                <span className="text-xs font-extrabold block truncate">
                  Upload Documents
                </span>
              </div>
            </div>

            {/* Step 3: Verification Visit */}
            <div
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                currentStatus !== 'verified'
                  ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                  : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                currentStatus === 'verified' ? 'bg-[#E0702A] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                <span className="material-symbols-outlined text-base">
                  {currentStatus === 'verified' ? 'event' : 'lock'}
                </span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  Step 3 • Stamping
                </span>
                <span className="text-xs font-extrabold block truncate">
                  Inspector Visit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PREREQUISITE ALERT BANNER IF NO SCALE REGISTERED */}
        {!hasScale && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/80 border-2 border-amber-400 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <span className="material-symbols-outlined text-3xl animate-bounce">scale</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-300">
                    Action Required Before Document Upload
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-gray-900">
                  Step 1: Register Your Weighing Scale First
                </h2>
                <p className="text-xs text-gray-700 mt-1 max-w-xl leading-relaxed">
                  Under Legal Metrology Rule 14, evidentiary documents (scale tax invoice, serial nameplate photo, and counter installation view) must match a registered instrument. Please add your scale details before uploading documents.
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

        {/* Header Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#023625] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Rule 14 • Legal Metrology Automated Compliance Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Upload Statutory Verification Documents
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Submitted documents are automatically matched against <strong>Inspection Rules &amp; Anti-Counterfeit Criteria</strong>. Compliant submissions proceed directly to the Inspector for final review; non-matching or counterfeit files are rejected as Fraud to protect enforcement officers' time.
          </p>
        </div>

        {/* Current Document Scrutiny Status Banner */}
        {!isInspectorAssigned ? (
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 text-amber-950 flex items-start gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-[#E0702A] text-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">person_search</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#023625] block">
                Stage 1 • Inspector Assignment In Progress
              </span>
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                Awaiting Enforcement Officer Allocation by Department Admin
              </h3>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Your store <strong>{currentStore.name}</strong> has been registered. The Department Admin / Controller will assign a designated Legal Metrology Officer to your jurisdiction. Once assigned, you can submit the 5 statutory documents for officer review.
              </p>
            </div>
          </div>
        ) : currentStatus === 'verified' ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  Inspector Scrutiny Cleared • 100% Rules Compliant
                </span>
                <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                  All 5 Statutory Documents Verified &amp; Approved
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Verified by <strong>{assignedInspectorName || currentDocData.reviewedBy || 'Assigned Officer'}</strong>. You are authorized to schedule your verification visit.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('request-verification')}
              className="shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E0702A] hover:bg-[#c95f1e] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <span>Schedule Inspection Visit</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        ) : currentStatus === 'fraud' ? (
          <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-400 text-red-950 flex flex-col gap-3 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-2xl">gavel</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                    Statutory Rule Engine • Fraud Rejection Notice
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-red-200 text-red-900 text-[10px] font-bold">
                    INSPECTOR TIME PROTECTED
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-red-950 mt-1">
                  Application Flagged as Fraud / Counterfeit (Non-Compliant with Inspection Rules)
                </h3>
                <p className="text-xs text-red-900 mt-1 leading-relaxed">
                  The automated inspection rules engine detected a non-conformance between the submitted document credentials (instrument plate / invoice / trade license) and the Legal Metrology model approval criteria. Under Section 30 of the Legal Metrology Act 2009, <strong>this application is rejected as fraud and will not proceed to an inspection visit</strong>.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-red-200 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[11px] text-red-700">
                Reason: {currentDocData.remarks || 'Document inspection rules failed. Generic or invalid files rejected.'}
              </span>
              <button
                onClick={handleClearFiles}
                className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-sm">restart_alt</span>
                <span>Clear &amp; Re-Upload Genuine Documents</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E0702A] text-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">rule</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Assigned Inspector: {assignedInspectorName || 'Pending Allocation'}
              </span>
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                {currentDocData.status === 'pending_review' ? 'Automated Pre-Check Cleared • In Inspector Queue' : 'Action Required: Upload 5 Statutory Documents'}
              </h3>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                {currentDocData.status === 'pending_review'
                  ? `Your documents passed the automated rules filter and are now queued for ${assignedInspectorName || 'your assigned officer'} to conduct final review.`
                  : `Please attach all 5 mandatory documents below. Our engine will verify them against statutory criteria before routing to ${assignedInspectorName || 'the assigned officer'}.`}
              </p>
            </div>
          </div>
        )}

        {/* Selected Scale Summary Strip */}
        <div className={`border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs ${
          hasScale ? 'bg-white border-gray-200' : 'bg-amber-50/50 border-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
              hasScale ? 'bg-gray-100 text-[#023625] border-gray-200' : 'bg-amber-100 text-amber-800 border-amber-300'
            }`}>
              <span className="material-symbols-outlined text-2xl">scale</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-gray-900">
                  {hasScale ? `${currentInst.name} (${currentInst.model})` : 'No Weighing Scale Registered Yet'}
                </h2>
                {hasScale && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200">
                    Step 1 Complete
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 font-mono block mt-0.5">
                {hasScale
                  ? `Serial: ${currentInst.serialNumber} • Capacity: ${currentInst.capacity || '30 kg'} • Premise: ${currentStore.name}`
                  : 'Click "+ Register Scale" to attach your commercial scale before uploading documents.'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('register-instrument')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                hasScale
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  : 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>{hasScale ? 'Add Another Scale' : 'Register Scale (Step 1)'}</span>
            </button>
          </div>
        </div>

        {/* Toolbar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm text-[#023625]">verified_user</span>
            <span>Mandatory Statutory File Uploads (5 Documents Required)</span>
          </span>
          <span className="text-xs text-gray-500 font-medium">
            Strict Inspection Rule Matching Active (PDF / JPG / PNG)
          </span>
        </div>

        {/* Document Upload Cards (5 Mandatory Files) */}
        <div className="flex flex-col gap-4 mb-8">
          {!hasScale && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-700 text-lg">lock</span>
                <span><strong>Document Uploads Locked:</strong> You must register your shop's weighing scale first so files can be matched to your scale serial number.</span>
              </div>
              <button
                onClick={() => navigateTo('register-instrument')}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0 flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-xs">add</span>
                <span>+ Add Scale (Step 1)</span>
              </button>
            </div>
          )}

          {Object.entries(files).map(([key, doc], idx) => {
            return (
              <div
                key={key}
                className={`rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  !hasScale
                    ? 'bg-gray-50/80 border-2 border-dashed border-gray-300 opacity-75'
                    : 'bg-white border border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 ${
                    !hasScale
                      ? 'bg-gray-200 text-gray-400 border-gray-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-100'
                  }`}>
                    <span className="material-symbols-outlined text-xl">
                      {!hasScale ? 'lock' : key.includes('Photo') || key.includes('Plate') ? 'photo_camera' : 'description'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-gray-400 font-mono">
                        0{idx + 1}
                      </span>
                      <h3 className="text-sm font-bold text-gray-900">
                        {doc.title}
                      </h3>
                      {doc.mandatory && (
                        <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                          Mandatory
                        </span>
                      )}
                      {!hasScale && (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[11px]">lock</span>
                          <span>Requires Scale (Step 1)</span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.subTitle}
                    </p>

                    {/* Attached File Pill */}
                    {doc.uploaded && (
                      <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-xs text-gray-700">
                        <span className="material-symbols-outlined text-sm text-emerald-700">check_circle</span>
                        <span className="font-mono font-medium truncate max-w-[200px] sm:max-w-[280px]">
                          {doc.fileName}
                        </span>
                        <span className="text-gray-400">({doc.fileSize})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Action */}
                <div className="w-full sm:w-auto shrink-0 flex items-center gap-2 justify-end">
                  {!hasScale ? (
                    <button
                      onClick={() => {
                        showToast('Prerequisite: Please register your weighing scale (Step 1) before attaching documents.', 'info');
                        navigateTo('register-instrument');
                      }}
                      className="cursor-pointer px-3.5 py-2 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-sm text-amber-700">add_circle</span>
                      <span>Add Scale to Unlock</span>
                    </button>
                  ) : (
                    <label className="cursor-pointer px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                      <span className="material-symbols-outlined text-sm text-gray-500">upload_file</span>
                      <span>{doc.uploaded ? 'Re-Upload' : 'Upload File'}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(key, file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bottom Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            <span>Documents encrypted and securely routed to Department Registry.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => navigateTo('shop-dashboard')}
              className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold cursor-pointer"
              type="button"
            >
              Back to Dashboard
            </button>

            {!hasScale ? (
              <button
                onClick={() => navigateTo('register-instrument')}
                className="px-6 py-2.5 rounded-xl bg-[#023625] hover:bg-[#1c4d39] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">scale</span>
                <span>Proceed to Step 1: Register Scale</span>
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={isUploading || !allUploaded || !isInspectorAssigned}
                className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 active:scale-95 ${
                  !isInspectorAssigned
                    ? 'bg-gray-400 cursor-not-allowed opacity-70'
                    : 'bg-[#023625] hover:bg-[#1c4d39] cursor-pointer'
                }`}
                type="button"
              >
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                    <span>Submitting to Inspector...</span>
                  </>
                ) : !isInspectorAssigned ? (
                  <>
                    <span className="material-symbols-outlined text-base">lock</span>
                    <span>Awaiting Inspector Allocation</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">send</span>
                    <span>Submit 5 Documents to {assignedInspectorName}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
