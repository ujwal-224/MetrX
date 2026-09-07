import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const UploadDocuments = () => {
  const {
    navigateTo,
    storeInfo,
    activeInstrument,
    verificationStatus,
    documentSubmissions,
    handleUploadDocuments,
    showToast
  } = useApp();

  const currentDocData = documentSubmissions['merch-1'] || {};
  const currentStatus = currentDocData.status || verificationStatus.documentStatus || 'pending_review';

  const [files, setFiles] = useState({
    businessRegistration: {
      title: 'Business Registration',
      subTitle: 'Trade License / GSTIN / Shop & Establishment Act Certificate',
      fileName: currentDocData.docs?.businessRegistration?.fileName || 'BBMP_Trade_License_2023_9081.pdf',
      fileSize: currentDocData.docs?.businessRegistration?.fileSize || '1.8 MB',
      mandatory: true,
      uploaded: true
    },
    ownerId: {
      title: 'Owner ID Proof',
      subTitle: 'Aadhaar Card / Voter ID / Government Photo ID',
      fileName: currentDocData.docs?.ownerId?.fileName || 'Shree_Ganesh_Aadhaar_Card.pdf',
      fileSize: currentDocData.docs?.ownerId?.fileSize || '1.2 MB',
      mandatory: true,
      uploaded: true
    },
    purchaseInvoice: {
      title: 'Purchase Invoice',
      subTitle: 'Original Scale Purchase Bill / Manufacturer Tax Invoice',
      fileName: currentDocData.docs?.purchaseInvoice?.fileName || 'Contech_CA30_Tax_Invoice_Bill.pdf',
      fileSize: currentDocData.docs?.purchaseInvoice?.fileSize || '2.4 MB',
      mandatory: true,
      uploaded: true
    },
    instrumentPlate: {
      title: 'Instrument Plate Photo',
      subTitle: 'Clear photograph of scale model specification & serial plate',
      fileName: currentDocData.docs?.instrumentPlate?.fileName || 'Contech_Spec_Nameplate_Photo.jpg',
      fileSize: currentDocData.docs?.instrumentPlate?.fileSize || '3.1 MB',
      mandatory: true,
      uploaded: true
    },
    instrumentPhotos: {
      title: 'Instrument Photos',
      subTitle: 'Installed countertop scale photograph (Front & profile view)',
      fileName: currentDocData.docs?.instrumentPhotos?.fileName || 'Counter_Scale_Front_Installation.jpg',
      fileSize: currentDocData.docs?.instrumentPhotos?.fileSize || '4.5 MB',
      mandatory: true,
      uploaded: true
    }
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateFile = (key, customName, size) => {
    setFiles((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        fileName: customName,
        fileSize: size,
        uploaded: true
      }
    }));
    showToast(`Attached: ${customName}`, 'info');
  };

  const onSubmit = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      handleUploadDocuments('merch-1', {
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
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => navigateTo('shop-dashboard')}
            className="hover:text-gray-900 transition-colors flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Shop Dashboard</span>
          </button>
          <span>/</span>
          <span className="text-[#023625] font-bold">Step 2: Statutory Document Upload</span>
        </div>

        {/* Header Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#023625] bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Rule 14 • Legal Metrology Mandate
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Upload Statutory Verification Documents
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Before booking a physical inspection slot, submit the 5 required establishment and instrument credentials for Inspector preliminary scrutiny.
          </p>
        </div>

        {/* Current Document Scrutiny Status Banner */}
        {currentStatus === 'verified' ? (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-2xl">verified</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                  Inspector Scrutiny Cleared
                </span>
                <h3 className="text-sm sm:text-base font-bold text-emerald-950">
                  All 5 Statutory Documents Verified &amp; Approved
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Verified by <strong>{currentDocData.reviewedBy || 'Insp. R. Deshmukh'}</strong>. You are now authorized to schedule your verification window.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('request-verification')}
              className="shrink-0 w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E0702A] hover:bg-[#c95f1e] text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>Schedule Inspection Visit</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        ) : currentStatus === 'fraud' ? (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-300 text-red-950 flex items-start gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">report</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-800 block">
                Official Rejection Notice • Legal Metrology Act 2009
              </span>
              <h3 className="text-sm sm:text-base font-bold text-red-950">
                Application Flagged as Fraud / Counterfeit Instrument
              </h3>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                The Inspector flagged a discrepancy between the uploaded instrument plate and manufacturer serial database. <strong>Visit scheduling is blocked by Department order.</strong> Please visit the Controller's office for inquiry.
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E0702A] text-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">pending_actions</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                Pending Inspector Verification
              </span>
              <h3 className="text-sm sm:text-base font-bold text-amber-950">
                Documents Submitted • Under Officer Scrutiny
              </h3>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Your 5 statutory documents have been queued for <strong>{currentDocData.reviewedBy || 'Insp. R. Deshmukh'}</strong>. Once verified, the appointment booking window will be unlocked.
              </p>
            </div>
          </div>
        )}

        {/* Selected Scale Summary Strip */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#023625] flex items-center justify-center border border-gray-200 shrink-0">
              <span className="material-symbols-outlined text-2xl">scale</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">
                {activeInstrument.name} ({activeInstrument.model})
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                Serial: {activeInstrument.serialNumber} • Premise: {storeInfo.name}
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            5 Mandatory Documents Required
          </span>
        </div>

        {/* Document Upload Cards (5 Mandatory Files) */}
        <div className="flex flex-col gap-4 mb-8">
          {Object.entries(files).map(([key, doc], idx) => {
            return (
              <div
                key={key}
                className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-100 shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-xl">
                      {key.includes('Photo') || key.includes('Plate') ? 'photo_camera' : 'description'}
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
                  <label className="cursor-pointer px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors">
                    <span className="material-symbols-outlined text-sm text-gray-500">upload_file</span>
                    <span>{doc.uploaded ? 'Re-Upload' : 'Upload File'}</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleSimulateFile(key, file.name, `${(file.size / 1024 / 1024).toFixed(1)} MB`);
                        }
                      }}
                    />
                  </label>
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
              className="px-4 py-2.5 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold"
              type="button"
            >
              Back to Dashboard
            </button>

            <button
              onClick={onSubmit}
              disabled={isUploading || !allUploaded}
              className="px-6 py-2.5 rounded-xl bg-[#023625] hover:bg-[#1c4d39] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              type="button"
            >
              {isUploading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-base">progress_activity</span>
                  <span>Submitting to Inspector...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">send</span>
                  <span>Submit 5 Documents for Scrutiny</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
