import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const InspectorSchedule = () => {
  const {
    navigateTo,
    getInspectorVisits,
    currentInspector,
    handleStartInspection,
    documentSubmissions,
    getDocumentSubmission,
    handleInspectorReviewDocuments,
    handleViewVisitCertificate,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(true);
  const [selectedShopDocs, setSelectedShopDocs] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [blobUrl, setBlobUrl] = useState(null);
  const [inspectorNotes, setInspectorNotes] = useState('All 5 statutory documents and serial specifications verified with State Registry.');

  // Convert Base64 / Data URLs to Blob URLs so browsers can render PDFs without iframe sandbox blocking
  React.useEffect(() => {
    if (previewDoc?.fileData) {
      if (typeof previewDoc.fileData === 'string' && previewDoc.fileData.startsWith('data:')) {
        try {
          const parts = previewDoc.fileData.split(',');
          const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
          const binary = atob(parts[1]);
          const array = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            array[i] = binary.charCodeAt(i);
          }
          const blob = new Blob([array], { type: mime });
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
          return () => {
            URL.revokeObjectURL(url);
          };
        } catch (e) {
          console.warn('[Blob URL Conversion Notice]', e);
          setBlobUrl(previewDoc.fileData);
        }
      } else {
        setBlobUrl(previewDoc.fileData);
      }
    } else {
      setBlobUrl(null);
    }
  }, [previewDoc]);

  const handleOpenDocPreview = (docConfig) => {
    setPreviewDoc(docConfig);
  };

  const inspectorVisits = getInspectorVisits ? getInspectorVisits() : [];

  const filteredVisits = inspectorVisits.filter((v) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.shopName.toLowerCase().includes(term) ||
      v.address.toLowerCase().includes(term) ||
      v.regNumber.toLowerCase().includes(term)
    );
  });

  const activeZone = currentInspector?.zone || 'Zone 4';
  const inspectorName = currentInspector?.name || 'Insp. R. Deshmukh';
  const inspectorBadge = currentInspector?.badgeNumber ? `Badge #${currentInspector.badgeNumber}` : 'Badge #LM-BLR-402';

  const openDocReview = (visit) => {
    const merchantId = visit.merchantId || visit.shopId || visit.id?.replace('visit-dyn-', '').replace('visit-shop-', '') || 'merch-1';
    const shopName = (visit.shopName || '').trim();

    // Look across all document sub keys
    let matchingDoc =
      documentSubmissions[merchantId] ||
      documentSubmissions[shopName.toLowerCase()] ||
      documentSubmissions[shopName] ||
      documentSubmissions[visit.shopId] ||
      documentSubmissions[visit.id] ||
      Object.values(documentSubmissions).find(
        (sub) =>
          (sub.shopName && shopName && sub.shopName.toLowerCase().trim() === shopName.toLowerCase().trim()) ||
          (sub.merchantId && (sub.merchantId === merchantId || sub.merchantId === visit.shopId))
      );

    if (!matchingDoc) {
      try {
        const cached = JSON.parse(localStorage.getItem('metrx_submissions') || '{}');
        matchingDoc =
          cached[merchantId] ||
          cached[shopName.toLowerCase()] ||
          cached[shopName] ||
          Object.values(cached).find(
            (sub) => sub.shopName && shopName && sub.shopName.toLowerCase().trim() === shopName.toLowerCase().trim()
          );
      } catch {}
    }

    if (!matchingDoc && getDocumentSubmission) {
      matchingDoc = getDocumentSubmission(merchantId);
    }

    setSelectedShopDocs({
      shopName: visit.shopName,
      regNumber: visit.regNumber,
      merchantId: merchantId,
      model: visit.model,
      instrumentName: visit.instrumentName,
      serialNumber: visit.serialNumber || '#KA-BLR-88412',
      zone: visit.address || activeZone,
      ...matchingDoc
    });
  };

  const handleDecision = (decision) => {
    if (!selectedShopDocs) return;
    handleInspectorReviewDocuments(selectedShopDocs.merchantId, decision, inspectorNotes);
    setSelectedShopDocs(null);
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 min-h-screen">
      <div className="flex flex-col gap-5 sm:gap-6">
        {/* View Title & Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-gray-200 pb-4 sm:pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Official Field Route • {activeZone} • {inspectorName} ({inspectorBadge})
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
              Assigned Verification Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              <strong className="text-gray-800">{inspectorVisits.length} Establishments Assigned to Your Badge</strong>
            </p>
          </div>

          {/* KPI Summary Chips */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <div className="flex-1 sm:flex-initial bg-white border border-gray-200 px-3 sm:px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs">
              <span className="material-symbols-outlined text-amber-600 text-lg">pending_actions</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Actionable</span>
                <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                  {inspectorVisits.filter((v) => v.isNextUp).length > 0 ? `${inspectorVisits.filter((v) => v.isNextUp).length} Next Up` : 'Queue Clear'}
                </span>
              </div>
            </div>
            <div className="flex-1 sm:flex-initial bg-white border border-gray-200 px-3 sm:px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs">
              <span className="material-symbols-outlined text-emerald-700 text-lg">verified</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Completed</span>
                <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                  {inspectorVisits.filter((v) => v.statusType === 'completed').length} Certified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar Component */}
        <div className="bg-white border border-gray-200 rounded-xl p-2.5 sm:p-3 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shadow-xs">
          <div className="flex items-center gap-2 flex-1 w-full pl-1 sm:pl-2">
            <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-0 text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm focus:ring-0 focus:outline-none"
              placeholder="Search assigned shop name, license, or address..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
            {filterActive && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-gray-700 text-xs font-medium">
                <span className="material-symbols-outlined text-sm text-emerald-700">location_on</span>
                <span>{activeZone}</span>
                <button
                  onClick={() => setFilterActive(false)}
                  className="ml-1 text-gray-400 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            )}
            <button
              onClick={() => showToast(`Filtered for ${activeZone} assigned route`, 'info')}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Inspection Cards List */}
        <div className="flex flex-col gap-4">
          {inspectorVisits.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <span className="material-symbols-outlined text-3xl">assignment_turned_in</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No Establishments Assigned</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
                You have no pending field verification visits assigned to your badge ({inspectorBadge}). New shop verification requests allocated by Department Admin will appear in your route queue.
              </p>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Route Standby • {activeZone}</span>
              </div>
            </div>
          ) : filteredVisits.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-xs">
              <p className="text-sm text-gray-500">No assigned shops match your search query "{searchTerm}".</p>
            </div>
          ) : (
            filteredVisits.map((visit) => {
              const isNext = visit.isNextUp;
              const isCompleted = visit.statusType === 'completed';
              const merchantId = visit.merchantId || visit.id?.replace('visit-dyn-', '') || 'merch-1';
              const docInfo = documentSubmissions[merchantId] || (getDocumentSubmission ? getDocumentSubmission(merchantId) : null) || {};
              const docMap = docInfo.docs || {};
              const uploadedCount = Object.values(docMap).filter((d) => d && (d.uploaded || d.fileName || (typeof d === 'string' && d.length > 0))).length;
              const docState = docInfo.status || (uploadedCount > 0 ? 'pending_review' : 'not_uploaded');

              return (
                <article
                  key={visit.id}
                  className={`bg-white rounded-2xl p-5 sm:p-6 transition-all shadow-xs relative overflow-hidden ${
                    isCompleted
                      ? 'border border-emerald-200 bg-emerald-50/20'
                      : isNext
                      ? 'border-2 border-emerald-700 ring-4 ring-emerald-700/10'
                      : 'border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Left Accent Stripe */}
                  {isNext && <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#E0702A]"></div>}
                  {isCompleted && <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500"></div>}

                  {/* Top Card Row: Time Slot & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">
                        <span className="material-symbols-outlined text-sm text-emerald-800">schedule</span>
                        <span>{visit.timeSlot}</span>
                      </div>

                      {isNext && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E0702A]"></span>
                          {visit.timeRelative}
                        </span>
                      )}

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <span className="material-symbols-outlined text-xs text-emerald-700">check_circle</span>
                          Audit Completed
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <span className="material-symbols-outlined text-xs">verified</span>
                        <span>{visit.status}</span>
                      </span>
                    ) : visit.statusType === 'pending' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="material-symbols-outlined text-xs">pending</span>
                        <span>{visit.status}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        <span className="material-symbols-outlined text-xs">event</span>
                        <span>{visit.status}</span>
                      </span>
                    )}
                  </div>

                  {/* Middle Content Row */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                        {visit.shopName}
                      </h2>
                      {visit.classBadge && (
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {visit.classBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      <span className="material-symbols-outlined text-sm text-gray-400">store</span>
                      <span>{visit.address}</span>
                      <span className="text-gray-300">•</span>
                      <span className="font-mono">{visit.regNumber}</span>
                    </div>

                    {/* Document Scrutiny & Specs Strip */}
                    <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-700">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-emerald-800">scale</span>
                          <span>
                            Instrument: <strong className="text-gray-900">{visit.instrumentName}</strong>
                          </span>
                        </div>
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <div>
                          Model: <strong className="text-gray-900">{visit.model}</strong>
                        </div>
                      </div>

                      {/* Document Scrutiny Action & Status Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        {docState === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[11px] border border-emerald-300">
                            <span className="material-symbols-outlined text-xs text-emerald-700">verified</span>
                            <span>5 Docs Verified</span>
                          </span>
                        ) : docState === 'fraud' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-100 text-red-900 font-bold text-[11px] border border-red-300">
                            <span className="material-symbols-outlined text-xs text-red-700">report</span>
                            <span>Flagged Fraud</span>
                          </span>
                        ) : uploadedCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                            <span className="material-symbols-outlined text-xs text-amber-700">pending</span>
                            <span>{uploadedCount}/5 Docs Uploaded</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600 font-bold text-[11px] border border-gray-300">
                            <span className="material-symbols-outlined text-xs text-gray-500">pending_actions</span>
                            <span>Docs Not Uploaded</span>
                          </span>
                        )}

                        <button
                          onClick={() => openDocReview(visit)}
                          className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs font-bold text-[#023625] shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">description</span>
                          <span>{uploadedCount > 0 ? `Review Docs (${uploadedCount}/5)` : 'Inspect Docs (Pending)'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-gray-500">
                      Assigned Officer: <strong className="text-gray-700">{visit.assignedOfficer || inspectorName} ({visit.officerBadge || inspectorBadge})</strong>
                    </span>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => showToast(`Navigation route plotted to ${visit.shopName}`, 'info')}
                        className="flex-1 sm:flex-initial justify-center px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base text-gray-500">near_me</span>
                        <span>Directions</span>
                      </button>

                      {isCompleted ? (
                        <button
                          onClick={() => handleViewVisitCertificate(visit)}
                          className="flex-1 sm:flex-initial justify-center px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-base">verified</span>
                          <span>View Issued Certificate</span>
                        </button>
                      ) : isNext ? (
                        <button
                          onClick={() => handleStartInspection(visit)}
                          className="flex-1 sm:flex-initial justify-center px-4 py-2 bg-[#023625] hover:bg-[#1f4d3a] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                          type="button"
                        >
                          <span>Start Inspection</span>
                          <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartInspection(visit)}
                          className="flex-1 sm:flex-initial justify-center px-3.5 py-2 border border-[#023625] bg-[#023625]/5 hover:bg-[#023625]/10 text-[#023625] rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          type="button"
                        >
                          <span>Inspect Shop</span>
                          <span className="material-symbols-outlined text-sm">fact_check</span>
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-400 pt-2 pb-4">
          <span>Official Field Inspector Terminal • Device GPS Geo-Fencing Active • Department of Legal Metrology</span>
        </div>
      </div>

      {/* Inspector Statutory Document Scrutiny Modal */}
      {selectedShopDocs && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 flex flex-col gap-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Statutory Rule 14 Scrutiny
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {selectedShopDocs.regNumber}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedShopDocs.shopName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verify 5 uploaded credentials before authorizing on-site inspection visit scheduling.
                </p>
              </div>
              <button
                onClick={() => setSelectedShopDocs(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* 5 Uploaded Documents Inspection Grid */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                <span>5 Mandatory Submitted Documents:</span>
                <span className="text-[11px] font-normal text-gray-500">Click &quot;View Document&quot; to inspect evidentiary files</span>
              </span>

              {/* 1. Business Registration */}
              {(() => {
                const doc = selectedShopDocs.docs?.businessRegistration;
                const isUploaded = Boolean(doc?.fileName || doc?.uploaded);
                return (
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#023625] shrink-0">
                        <span className="material-symbols-outlined text-lg">description</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">
                          1. Business Registration
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Trade License / GSTIN: {isUploaded ? (
                            <strong className="text-gray-800 font-mono">{doc.fileName}</strong>
                          ) : (
                            <em className="text-gray-400 font-normal">Pending submission by merchant</em>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isUploaded ? (
                        <button
                          onClick={() =>
                            handleOpenDocPreview({
                              type: 'businessRegistration',
                              title: 'Commercial Trade License & Business Registration',
                              fileName: doc.fileName || 'Trade_License_BBMP_2025.pdf',
                              fileSize: doc.fileSize,
                              fileData: doc.fileData,
                              fileType: doc.fileType,
                              uploadedAt: doc.uploadedAt,
                              shopName: selectedShopDocs.shopName,
                              regNumber: selectedShopDocs.regNumber,
                              zone: selectedShopDocs.zone
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>View Document</span>
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Pending Upload
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 2. Owner ID */}
              {(() => {
                const doc = selectedShopDocs.docs?.ownerId;
                const isUploaded = Boolean(doc?.fileName || doc?.uploaded);
                return (
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#023625] shrink-0">
                        <span className="material-symbols-outlined text-lg">badge</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">
                          2. Owner ID Proof
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Government Photo ID / Aadhaar: {isUploaded ? (
                            <strong className="text-gray-800 font-mono">{doc.fileName}</strong>
                          ) : (
                            <em className="text-gray-400 font-normal">Pending submission by merchant</em>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isUploaded ? (
                        <button
                          onClick={() =>
                            handleOpenDocPreview({
                              type: 'ownerId',
                              title: 'Proprietor Government Photo Identity Proof',
                              fileName: doc.fileName || 'Govt_Photo_Identity_Card.pdf',
                              fileSize: doc.fileSize,
                              fileData: doc.fileData,
                              fileType: doc.fileType,
                              uploadedAt: doc.uploadedAt,
                              shopName: selectedShopDocs.shopName,
                              regNumber: selectedShopDocs.regNumber,
                              zone: selectedShopDocs.zone
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>View Document</span>
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Pending Upload
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 3. Purchase Invoice */}
              {(() => {
                const doc = selectedShopDocs.docs?.purchaseInvoice;
                const isUploaded = Boolean(doc?.fileName || doc?.uploaded);
                return (
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#023625] shrink-0">
                        <span className="material-symbols-outlined text-lg">receipt_long</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">
                          3. Purchase Invoice
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Scale Tax Invoice: {isUploaded ? (
                            <strong className="text-gray-800 font-mono">{doc.fileName}</strong>
                          ) : (
                            <em className="text-gray-400 font-normal">Pending submission by merchant</em>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isUploaded ? (
                        <button
                          onClick={() =>
                            handleOpenDocPreview({
                              type: 'purchaseInvoice',
                              title: 'Manufacturer Metrological Scale Tax Invoice',
                              fileName: doc.fileName || 'Scale_Manufacturer_Tax_Invoice.pdf',
                              fileSize: doc.fileSize,
                              fileData: doc.fileData,
                              fileType: doc.fileType,
                              uploadedAt: doc.uploadedAt,
                              shopName: selectedShopDocs.shopName,
                              regNumber: selectedShopDocs.regNumber,
                              model: selectedShopDocs.model,
                              serialNumber: selectedShopDocs.serialNumber
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>View Document</span>
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Pending Upload
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 4. Instrument Plate Photo */}
              {(() => {
                const doc = selectedShopDocs.docs?.instrumentPlate;
                const isUploaded = Boolean(doc?.fileName || doc?.uploaded);
                return (
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#023625] shrink-0">
                        <span className="material-symbols-outlined text-lg">photo_camera</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">
                          4. Instrument Plate Photo
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Serial &amp; Model Spec Plate: {isUploaded ? (
                            <strong className="text-gray-800 font-mono">{doc.fileName}</strong>
                          ) : (
                            <em className="text-gray-400 font-normal">Pending submission by merchant</em>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isUploaded ? (
                        <button
                          onClick={() =>
                            handleOpenDocPreview({
                              type: 'instrumentPlate',
                              title: 'Scale Specification & Serial Number Nameplate Photo',
                              fileName: doc.fileName || 'Instrument_Spec_Nameplate.jpg',
                              fileSize: doc.fileSize,
                              fileData: doc.fileData,
                              fileType: doc.fileType,
                              uploadedAt: doc.uploadedAt,
                              shopName: selectedShopDocs.shopName,
                              model: selectedShopDocs.model,
                              serialNumber: selectedShopDocs.serialNumber
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>View Photo</span>
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Pending Upload
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* 5. Instrument Photos */}
              {(() => {
                const doc = selectedShopDocs.docs?.instrumentPhotos;
                const isUploaded = Boolean(doc?.fileName || doc?.uploaded);
                return (
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#023625] shrink-0">
                        <span className="material-symbols-outlined text-lg">camera_alt</span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-gray-900">
                          5. Instrument Photos
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          Installed Scale View: {isUploaded ? (
                            <strong className="text-gray-800 font-mono">{doc.fileName}</strong>
                          ) : (
                            <em className="text-gray-400 font-normal">Pending submission by merchant</em>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isUploaded ? (
                        <button
                          onClick={() =>
                            handleOpenDocPreview({
                              type: 'instrumentPhotos',
                              title: 'Installed Countertop Scale Front & Profile View',
                              fileName: doc.fileName || 'Installed_Counter_Scale_Front.jpg',
                              fileSize: doc.fileSize,
                              fileData: doc.fileData,
                              fileType: doc.fileType,
                              uploadedAt: doc.uploadedAt,
                              shopName: selectedShopDocs.shopName,
                              model: selectedShopDocs.model,
                              serialNumber: selectedShopDocs.serialNumber
                            })
                          }
                          className="px-2.5 py-1.5 rounded-lg bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                          <span>View Photo</span>
                        </button>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          Pending Upload
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Officer Observation Input */}
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Inspector Scrutiny Remarks &amp; Finding:
              </label>
              <textarea
                value={inspectorNotes}
                onChange={(e) => setInspectorNotes(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                placeholder="Enter officer notes or reasons for approval / discrepancy..."
              />
            </div>

            {/* Decision Action Buttons */}
            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-gray-500 text-center sm:text-left">
                Statutory Decision Authority: <strong>{inspectorName}</strong>
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                {/* 2nd Option: Fraud / Reject */}
                <button
                  onClick={() => handleDecision('fraud')}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">report</span>
                  <span>Flag as Fraud / Reject</span>
                </button>

                {/* 1st Option: Verified */}
                <button
                  onClick={() => handleDecision('verified')}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-[#023625] hover:bg-[#1a4b38] text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  type="button"
                >
                  <span className="material-symbols-outlined text-base">verified</span>
                  <span>Approve &amp; Mark Verified</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Direct Document Display Modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setPreviewDoc(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-5xl h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-gray-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Clean Modal Header */}
            <div className="px-5 py-3.5 bg-[#023625] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-xl text-emerald-300 shrink-0">
                  {previewDoc.fileData?.startsWith('data:image/') || previewDoc.fileType?.includes('image') || previewDoc.fileName?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)
                    ? 'photo'
                    : 'description'}
                </span>
                <div className="min-w-0">
                  <span className="font-bold text-sm text-white font-mono truncate block">
                    {previewDoc.fileName || 'Uploaded_Document.pdf'}
                  </span>
                  <span className="text-[11px] text-emerald-200 block truncate">
                    {previewDoc.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {blobUrl && (
                  <button
                    onClick={() => window.open(blobUrl, '_blank')}
                    className="px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Open in new window"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    <span className="hidden sm:inline">Fullscreen</span>
                  </button>
                )}
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-red-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>

            {/* Document Direct Display Body */}
            <div className="flex-1 w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {previewDoc.fileData?.startsWith('data:image/') ||
              previewDoc.fileType?.includes('image') ||
              previewDoc.fileName?.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ? (
                <div className="w-full h-full p-4 flex items-center justify-center bg-gray-950 overflow-auto">
                  <img
                    src={blobUrl || previewDoc.fileData}
                    alt={previewDoc.fileName}
                    className="max-h-full max-w-full object-contain rounded shadow"
                  />
                </div>
              ) : (
                <iframe
                  src={blobUrl || previewDoc.fileData}
                  className="w-full h-full border-0"
                  title={previewDoc.fileName}
                />
              )}
            </div>

            {/* Clean Modal Footer */}
            <div className="px-5 py-2.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 shrink-0">
              <span className="font-mono text-[11px]">
                {previewDoc.fileName} {previewDoc.fileSize ? `(${previewDoc.fileSize})` : ''}
              </span>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-[#023625] hover:bg-[#1a4b38] text-white text-xs font-bold rounded-lg cursor-pointer"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

