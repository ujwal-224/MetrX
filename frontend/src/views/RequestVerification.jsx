import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RequestVerification = () => {
  const {
    navigateTo,
    activeInstrument,
    storeInfo,
    selectedSlot,
    verificationStatus,
    documentSubmissions,
    handleConfirmVerification,
    showToast
  } = useApp();

  const [slot, setSlot] = useState(selectedSlot || 'slot_1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const docData = documentSubmissions['merch-1'] || {};
  const docStatus = docData.status || verificationStatus.documentStatus || 'pending_review';
  const isVerified = docStatus === 'verified';
  const isFraud = docStatus === 'fraud';

  const onConfirm = () => {
    if (isFraud) {
      showToast('Action Blocked: Legal Metrology Officer flagged submitted documents as Fraud.', 'error');
      return;
    }
    if (!isVerified) {
      showToast('Action Blocked: You must wait for your assigned Inspector to verify your 5 documents.', 'error');
      navigateTo('upload-documents');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleConfirmVerification(slot);
    }, 500);
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 min-h-screen">
      <div className="max-w-3xl mx-auto px-0 sm:px-2 pt-1 sm:pt-2">
        {/* Breadcrumb / Back Link */}
        <div className="mb-3 sm:mb-4 flex items-center gap-2 text-gray-500 text-xs">
          <button
            onClick={() => navigateTo('shop-dashboard')}
            className="hover:text-gray-900 transition-colors flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Dashboard</span>
          </button>
          <span>/</span>
          <span className="text-[#023625] font-semibold">Step 3: Choose Inspection Window</span>
        </div>

        {/* Main Header Area */}
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-900 font-bold tracking-tight">
            Schedule Field Verification Visit
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Pick a date and time slot for an accredited Legal Metrology Officer to test and stamp your counter scale on-site.
          </p>
        </div>

        {/* Document Status Validation Callout */}
        {isFraud ? (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border-2 border-red-400 text-red-950 flex items-start gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-2xl">gavel</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-800 block">
                Statutory Enforcement Notice • Scheduling Disabled
              </span>
              <h2 className="text-base font-bold text-red-950">
                Application Flagged as Fraud / Counterfeit Scale
              </h2>
              <p className="text-xs text-red-800 mt-1 leading-relaxed">
                The assigned Inspector has flagged discrepancies in your submitted documentation or scale specification plate. Under Section 30 of the Legal Metrology Act 2009, visit scheduling is prohibited.
              </p>
            </div>
          </div>
        ) : !isVerified ? (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0702A] text-white flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-2xl">pending_actions</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                  Preliminary Scrutiny Required
                </span>
                <h2 className="text-sm sm:text-base font-bold text-amber-950">
                  Documents Under Inspector Verification
                </h2>
                <p className="text-xs text-amber-900 mt-0.5">
                  Your 5 statutory documents have been submitted to Insp. R. Deshmukh. Once the officer marks them <strong>Verified</strong>, appointment confirmation will be unlocked.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigateTo('upload-documents')}
              className="shrink-0 px-4 py-2 rounded-xl border border-amber-400 bg-white hover:bg-amber-100 text-amber-950 font-bold text-xs shadow-xs transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">description</span>
              <span>View 5 Documents</span>
            </button>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
                Eligibility Unlocked
              </span>
              <p className="text-xs text-emerald-900">
                All 5 statutory documents verified and approved by Inspector. Please choose your inspection slot below.
              </p>
            </div>
          </div>
        )}

        {/* SECTION 1: Selected Instrument Summary Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#023625]"></div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-[#023625] shadow-inner shrink-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl">scale</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base md:text-lg text-gray-900 font-bold">
                    {activeInstrument.name} ({activeInstrument.model})
                  </span>
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    Due for Verification
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                  <span>Serial: <strong className="text-gray-800 font-mono">{activeInstrument.serialNumber}</strong></span>
                  <span>•</span>
                  <span>Capacity: <strong className="text-gray-800">{activeInstrument.capacity}</strong></span>
                  <span>•</span>
                  <span>Premises: <strong className="text-gray-800">{storeInfo.name}</strong></span>
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:flex flex-col justify-between items-end">
              <span className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                Zone Jurisdiction
              </span>
              <span className="text-xs font-bold text-[#023625] font-mono">
                Bengaluru Central (LM-BLR-04)
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Calendar & Slot Picker */}
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Select Your Preferred Visit Time
              </h2>
              <p className="text-xs text-gray-500">
                Officers visit commercial zones according to neighborhood routes. Choose an open slot:
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 self-start sm:self-auto">
              <span className="material-symbols-outlined text-base text-[#023625]">calendar_month</span>
              <span>January 2025</span>
            </div>
          </div>

          {/* Slot Tiles */}
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 ${isFraud ? 'opacity-40 pointer-events-none' : ''}`}>
            {/* Slot 1 */}
            <label
              onClick={() => !isFraud && setSlot('slot_1')}
              className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                slot === 'slot_1'
                  ? 'border-2 border-[#023625] bg-white shadow-md ring-2 ring-[#023625]/10'
                  : 'border border-gray-200 bg-white hover:border-gray-300 shadow-xs'
              }`}
            >
              <input
                checked={slot === 'slot_1'}
                onChange={() => setSlot('slot_1')}
                className="sr-only"
                name="inspection_slot"
                type="radio"
                value="slot_1"
                disabled={isFraud}
              />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] uppercase font-bold text-gray-900 px-2 py-0.5 rounded bg-gray-100">
                  Morning Slot
                </span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    slot === 'slot_1'
                      ? 'bg-[#023625] text-white'
                      : 'border border-gray-300 text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">check</span>
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">Thu, 16 Jan</div>
              <div className="text-xs font-semibold text-gray-700 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#023625]">schedule</span>
                <span>10:00 AM – 1:00 PM</span>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-emerald-800 font-semibold text-[11px]">
                  <span className="material-symbols-outlined text-xs">verified</span> Recommended
                </span>
                <span className="text-[10px] uppercase font-mono text-gray-400 font-bold">Fastest</span>
              </div>
            </label>

            {/* Slot 2 */}
            <label
              onClick={() => !isFraud && setSlot('slot_2')}
              className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                slot === 'slot_2'
                  ? 'border-2 border-[#023625] bg-white shadow-md ring-2 ring-[#023625]/10'
                  : 'border border-gray-200 bg-white hover:border-gray-300 shadow-xs'
              }`}
            >
              <input
                checked={slot === 'slot_2'}
                onChange={() => setSlot('slot_2')}
                className="sr-only"
                name="inspection_slot"
                type="radio"
                value="slot_2"
                disabled={isFraud}
              />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] uppercase font-bold text-gray-700 px-2 py-0.5 rounded bg-gray-100">
                  Afternoon Slot
                </span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    slot === 'slot_2'
                      ? 'bg-[#023625] text-white'
                      : 'border border-gray-300 text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">check</span>
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">Fri, 17 Jan</div>
              <div className="text-xs font-semibold text-gray-700 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#023625]">schedule</span>
                <span>2:00 PM – 5:00 PM</span>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium text-[11px]">4 Slots Open</span>
                <span className="text-[10px] uppercase font-mono text-gray-400 font-bold">Regular</span>
              </div>
            </label>

            {/* Slot 3 */}
            <label
              onClick={() => !isFraud && setSlot('slot_3')}
              className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                slot === 'slot_3'
                  ? 'border-2 border-[#023625] bg-white shadow-md ring-2 ring-[#023625]/10'
                  : 'border border-gray-200 bg-white hover:border-gray-300 shadow-xs'
              }`}
            >
              <input
                checked={slot === 'slot_3'}
                onChange={() => setSlot('slot_3')}
                className="sr-only"
                name="inspection_slot"
                type="radio"
                value="slot_3"
                disabled={isFraud}
              />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] uppercase font-bold text-gray-700 px-2 py-0.5 rounded bg-gray-100">
                  Morning Slot
                </span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    slot === 'slot_3'
                      ? 'bg-[#023625] text-white'
                      : 'border border-gray-300 text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">check</span>
                </span>
              </div>
              <div className="text-xl font-bold text-gray-900">Mon, 20 Jan</div>
              <div className="text-xs font-semibold text-gray-700 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#023625]">schedule</span>
                <span>10:00 AM – 1:00 PM</span>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium text-[11px]">5 Slots Open</span>
                <span className="text-[10px] uppercase font-mono text-gray-400 font-bold">Next Week</span>
              </div>
            </label>
          </div>
        </section>

        {/* SECTION 3: Action & Fee Mandate */}
        <section className="border-t border-gray-200 pt-6 flex flex-col items-center">
          {/* Statutory Government Fee Box */}
          <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-3.5 sm:p-4 mb-5 text-center flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <span className="material-symbols-outlined text-xl text-[#023625] shrink-0">receipt_long</span>
              <div>
                <span className="text-xs font-bold text-gray-900 block">Government Statutory Fee</span>
                <span className="text-[11px] text-gray-500">Per Rule 14 table (Commercial Counter Scale)</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-extrabold text-gray-900">₹150</span>
              <span className="text-[10px] text-emerald-800 font-semibold block">Pay on-site (Cash/UPI)</span>
            </div>
          </div>

          {/* Primary Submit Button */}
          {isFraud ? (
            <div className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-red-100 border border-red-300 text-red-800 text-xs font-bold">
              Visit Scheduling Blocked: Discrepancy Flagged by Enforcement Officer
            </div>
          ) : !isVerified ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center">
              <button
                onClick={() => navigateTo('upload-documents')}
                className="w-full sm:w-auto bg-[#023625] hover:bg-[#1a4a37] text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-base">upload_file</span>
                <span>Upload / View 5 Statutory Documents</span>
              </button>
              <button
                disabled
                className="w-full sm:w-auto bg-gray-200 text-gray-400 font-bold text-sm px-6 py-3.5 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
              >
                <span className="material-symbols-outlined text-base">lock</span>
                <span>Confirm Appointment (Locked)</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="w-full sm:w-auto sm:min-w-[280px] bg-[#E0702A] hover:bg-[#c95f1d] text-white font-bold text-sm px-6 sm:px-8 py-3.5 rounded-xl shadow-xs tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-75"
              type="button"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  <span>Confirming Appointment...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">assignment_turned_in</span>
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
          )}

          <span className="text-[11px] text-gray-500 mt-3 text-center">
            Official statutory scheduling under Directorate of Legal Metrology, Government of Karnataka.
          </span>
        </section>
      </div>
    </main>
  );
};

