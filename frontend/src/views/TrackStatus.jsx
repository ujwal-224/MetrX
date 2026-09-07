import React from 'react';
import { useApp } from '../context/AppContext';

export const TrackStatus = () => {
  const {
    navigateTo,
    storeInfo,
    activeShop,
    activeInstrument,
    verificationStatus,
    documentSubmissions,
    jumpToTourStep,
    showToast
  } = useApp();

  const currentMerchantId = storeInfo?.id || activeShop?.id || 'merch-1';
  const currentStep = verificationStatus.step || 2;
  const docData = documentSubmissions[currentMerchantId] || activeShop?.documentSubmissionData || {};
  const docStatus = docData.status || activeShop?.documentStatus || verificationStatus.documentStatus || 'pending_review';

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 min-h-screen">
      {/* Breadcrumb Hierarchy */}
      <div className="max-w-3xl mx-auto w-full mb-3 sm:mb-4 flex items-center gap-2 text-xs text-gray-500">
        <button
          onClick={() => navigateTo('shop-dashboard')}
          className="hover:text-gray-900 transition-colors flex items-center gap-1 font-medium"
        >
          <span className="material-symbols-outlined text-sm">storefront</span>
          <span>Shop Dashboard</span>
        </button>
        <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
        <span className="text-[#023625] font-semibold truncate">Appointment &amp; Compliance Tracker</span>
      </div>

      {/* Section Headline Header */}
      <div className="max-w-3xl mx-auto w-full mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Application Status • Ref #{verificationStatus.applicationRef}
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Track Your Verification Progress
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Official statutory workflow for countertop scale re-verification under Legal Metrology Act 2009.
        </p>
      </div>

      {/* Central Tracking Card */}
      <div className="max-w-3xl w-full mx-auto bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs flex flex-col">
        {/* Instrument Details Sub-bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 sm:pb-5 border-b border-gray-100 mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-200 text-[#023625] shrink-0">
              <span className="material-symbols-outlined text-xl sm:text-2xl">scale</span>
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-gray-900">
                {activeInstrument.name} ({activeInstrument.model})
              </div>
              <span className="text-[11px] sm:text-xs text-gray-500 font-mono">
                Serial: {activeInstrument.serialNumber} • Capacity: {activeInstrument.capacity}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-bold self-start sm:self-auto">
            <span className="material-symbols-outlined text-sm">event</span>
            <span>
              {currentStep >= 3 ? `Slot: ${verificationStatus.slotLabel}` : 'Slot: Pending Verification'}
            </span>
          </div>
        </div>

        {/* 5-Step Progress Stepper */}
        <div className="w-full py-3 sm:py-4 mb-4 sm:mb-6 overflow-x-auto no-scrollbar">
          <div className="relative flex items-center justify-between min-w-[340px] px-2 sm:px-0">
            {/* Connecting line */}
            <div className="absolute left-0 top-4 w-full h-1 bg-gray-200 z-0"></div>
            <div
              className="absolute left-0 top-4 h-1 bg-[#023625] z-0 transition-all duration-500"
              style={{
                width:
                  currentStep === 1
                    ? '0%'
                    : currentStep === 2
                    ? '25%'
                    : currentStep === 3
                    ? '50%'
                    : currentStep === 4
                    ? '75%'
                    : '100%'
              }}
            ></div>

            {/* Step 1: Requested */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-700 text-emerald-800 flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base">check</span>
              </div>
              <span className="text-[11px] font-bold text-gray-900 mt-1.5">Requested</span>
              <span className="text-[10px] text-gray-400 hidden sm:block">{verificationStatus.requestedAt}</span>
            </div>

            {/* Step 2: Documents Uploaded */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-xs relative z-10 ${
                  docStatus === 'verified'
                    ? 'bg-emerald-100 border-emerald-700 text-emerald-800'
                    : docStatus === 'fraud'
                    ? 'bg-red-100 border-red-600 text-red-700'
                    : currentStep === 2
                    ? 'bg-[#023625] border-[#023625] text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <span className="material-symbols-outlined text-sm">
                  {docStatus === 'verified' ? 'check' : docStatus === 'fraud' ? 'close' : 'description'}
                </span>
              </div>
              <span className={`text-[11px] font-bold mt-1.5 ${currentStep === 2 ? 'text-[#023625]' : 'text-gray-700'}`}>
                Documents
              </span>
              <span className={`text-[10px] font-semibold hidden sm:block ${
                docStatus === 'verified' ? 'text-emerald-700' : docStatus === 'fraud' ? 'text-red-600' : 'text-amber-600'
              }`}>
                {docStatus === 'verified' ? 'Verified' : docStatus === 'fraud' ? 'Fraud / Blocked' : '5 Uploaded'}
              </span>
            </div>

            {/* Step 3: Scheduled */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep >= 3
                    ? 'bg-[#023625] border-[#023625] text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <span className="material-symbols-outlined text-sm">event_available</span>
              </div>
              <span className={`text-[11px] font-medium mt-1.5 ${currentStep >= 3 ? 'text-[#023625] font-bold' : 'text-gray-400'}`}>
                Scheduled
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:block">Slot Confirmed</span>
            </div>

            {/* Step 4: Inspected */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep >= 4
                    ? 'bg-[#023625] border-[#023625] text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <span className="material-symbols-outlined text-sm">search</span>
              </div>
              <span className={`text-[11px] font-medium mt-1.5 ${currentStep >= 4 ? 'text-[#023625] font-bold' : 'text-gray-400'}`}>
                Inspected
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:block">Weights Test</span>
            </div>

            {/* Step 5: Certified */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  currentStep >= 5
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                <span className="material-symbols-outlined text-sm">verified</span>
              </div>
              <span className={`text-[11px] font-medium mt-1.5 ${currentStep >= 5 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                Certified
              </span>
              <span className="text-[10px] text-gray-400 hidden sm:block">Holo Seal</span>
            </div>
          </div>
        </div>

        {/* Document Status Callout Box */}
        <div className={`p-4 rounded-xl mb-6 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          docStatus === 'verified'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : docStatus === 'fraud'
            ? 'bg-red-50 border-red-200 text-red-950'
            : 'bg-amber-50 border-amber-200 text-amber-950'
        }`}>
          <div className="flex items-start gap-2.5">
            <span className={`material-symbols-outlined text-xl mt-0.5 ${
              docStatus === 'verified' ? 'text-emerald-700' : docStatus === 'fraud' ? 'text-red-600' : 'text-amber-700'
            }`}>
              {docStatus === 'verified' ? 'verified_user' : docStatus === 'fraud' ? 'gavel' : 'description'}
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                Statutory Document Scrutiny: {docStatus === 'verified' ? 'Verified & Approved' : docStatus === 'fraud' ? 'Flagged as Fraud' : 'Submitted (5/5 Files)'}
              </div>
              <p className="text-xs mt-0.5">
                {docStatus === 'verified'
                  ? 'All 5 documents verified by Inspector. You can confirm your physical inspection appointment.'
                  : docStatus === 'fraud'
                  ? 'Discrepancy detected in submitted scale plate. Scheduling disabled by Legal Metrology Department.'
                  : '5 documents submitted (Business Reg, Owner ID, Invoice, Plate Photo, Instrument Photo). Awaiting Officer decision.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto flex items-center gap-2">
            <button
              onClick={() => navigateTo('upload-documents')}
              className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-xs flex items-center justify-center gap-1"
            >
              <span>View 5 Documents</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>

            {docStatus === 'verified' && currentStep < 3 && (
              <button
                onClick={() => navigateTo('request-verification')}
                className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-[#E0702A] hover:bg-[#c95f1e] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1"
              >
                <span>Schedule Visit</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        {/* Assigned Officer Context Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#023625] font-bold flex items-center justify-center shrink-0 border border-emerald-200">
              RD
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Assigned Verification Officer
              </span>
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                {verificationStatus.inspectorName} ({verificationStatus.inspectorBadge})
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {currentStep >= 3
                  ? `Visiting your shop on ${verificationStatus.slotLabel} between ${verificationStatus.timeLabel}.`
                  : 'Assigned for document scrutiny and on-site physical counter testing.'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:border-gray-200 sm:pl-4">
            <span className="text-[11px] text-gray-400 block">Fee Schedule</span>
            <span className="text-xs font-bold text-gray-900">₹150 (Statutory Rule 14)</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-gray-100 text-xs">
          <button
            onClick={() => showToast('SMS reminder re-sent to registered phone.', 'info')}
            className="text-[#023625] hover:underline flex items-center justify-center sm:justify-start gap-1 py-1 font-semibold"
          >
            <span className="material-symbols-outlined text-sm">sms</span>
            <span>Resend SMS Reminder</span>
          </button>

          <a
            href="tel:180063872"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm text-[#023625]">call</span>
            <span>Helpdesk Support</span>
          </a>
        </div>
      </div>
    </main>
  );
};

