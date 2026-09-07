import React from 'react';
import { useApp } from '../context/AppContext';

export const TrackStatus = () => {
  const {
    navigateTo,
    activeInstrument,
    verificationStatus,
    jumpToTourStep,
    showToast
  } = useApp();

  const currentStep = verificationStatus.step || 2;

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 min-h-screen">
      {/* Breadcrumb Hierarchy */}
      <div className="max-w-3xl mx-auto w-full mb-unit-4 flex items-center gap-unit-2 text-xs text-on-surface-variant">
        <button
          onClick={() => navigateTo('shop-dashboard')}
          className="hover:text-primary transition-colors flex items-center gap-unit-1"
        >
          <span className="material-symbols-outlined text-sm">storefront</span>
          <span>Shop Dashboard</span>
        </button>
        <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
        <span className="text-primary font-semibold">Step 3: Appointment Tracker</span>
      </div>

      {/* Section Headline Header */}
      <div className="max-w-3xl mx-auto w-full mb-unit-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Confirmed Appointment • Booking Ref #{verificationStatus.applicationRef}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-primary tracking-tight">
          Track Your Verification Visit
        </h1>
        <p className="text-xs md:text-sm text-on-surface-variant mt-1">
          An accredited Legal Metrology Officer has been scheduled to inspect and stamp your commercial scale on-site.
        </p>
      </div>

      {/* Central Tracking Card */}
      <div className="max-w-3xl w-full mx-auto bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 md:p-8 shadow-sm flex flex-col">
        {/* Instrument Details Sub-bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-outline-variant mb-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center border border-outline-variant text-primary shrink-0">
              <span className="material-symbols-outlined text-2xl">scale</span>
            </div>
            <div>
              <div className="text-base font-bold text-on-surface">
                {activeInstrument.name} ({activeInstrument.model})
              </div>
              <span className="text-xs text-outline font-mono">
                Serial: {activeInstrument.serialNumber} • Capacity: {activeInstrument.capacity}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F0E8] border border-[#C3ECD5] text-[#2E7D32] text-xs font-bold">
            <span className="material-symbols-outlined text-sm">event</span>
            <span>Slot: {verificationStatus.slotLabel}</span>
          </div>
        </div>

        {/* 4-Step Progress Stepper */}
        <div className="w-full py-4 mb-6">
          <div className="relative flex items-center justify-between">
            {/* Connecting line */}
            <div className="absolute left-0 top-5 w-full h-1 bg-surface-container-high z-0"></div>
            <div
              className="absolute left-0 top-5 h-1 bg-secondary z-0 transition-all duration-500"
              style={{
                width:
                  currentStep === 1
                    ? '0%'
                    : currentStep === 2
                    ? '33%'
                    : currentStep === 3
                    ? '66%'
                    : '100%'
              }}
            ></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#E7F0E8] border-2 border-[#2E7D32] text-[#2E7D32] flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-base sm:text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check
                </span>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-on-surface mt-1.5">Requested</span>
              <span className="text-[10px] sm:text-[11px] text-outline hidden sm:block">{verificationStatus.requestedAt}</span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="relative flex items-center justify-center">
                {currentStep === 2 && (
                  <span className="absolute w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary-container/20 animate-ping"></span>
                )}
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 text-white flex items-center justify-center shadow-xs relative z-10 ${
                    currentStep >= 2 ? 'bg-primary-container border-primary' : 'bg-surface-container border-outline-variant text-outline'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm sm:text-base">event_available</span>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-primary mt-1.5 flex items-center gap-1">
                {currentStep === 2 && <span className="w-1.5 h-1.5 rounded-full bg-[#E0702A]"></span>}
                Scheduled
              </span>
              <span className="text-[10px] sm:text-[11px] text-secondary font-medium hidden sm:block">Slot Confirmed</span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center ${
                  currentStep >= 3
                    ? 'bg-primary-container border-primary text-white'
                    : 'bg-surface-container border-outline-variant text-outline'
                }`}
              >
                <span className="material-symbols-outlined text-sm sm:text-base">search</span>
              </div>
              <span className={`text-[11px] sm:text-xs font-medium mt-1.5 ${currentStep >= 3 ? 'text-primary font-bold' : 'text-outline'}`}>
                Inspected
              </span>
              <span className="text-[10px] sm:text-[11px] text-outline-variant hidden sm:block">Weights Test</span>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center ${
                  currentStep >= 4
                    ? 'bg-[#2E7D32] border-[#2E7D32] text-white shadow-md'
                    : 'bg-surface-container border-outline-variant text-outline'
                }`}
              >
                <span className="material-symbols-outlined text-sm sm:text-base">verified</span>
              </div>
              <span className={`text-[11px] sm:text-xs font-medium mt-1.5 ${currentStep >= 4 ? 'text-[#2E7D32] font-bold' : 'text-outline'}`}>
                Certified
              </span>
              <span className="text-[10px] sm:text-[11px] text-outline-variant hidden sm:block">Holo Seal</span>
            </div>
          </div>
        </div>

        {/* Assigned Officer Context Box */}
        <div className="bg-surface-container-low border border-outline-variant/80 rounded-xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container text-primary font-bold flex items-center justify-center shrink-0">
              RD
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#2E7D32] block">
                Assigned Verification Officer
              </span>
              <h3 className="text-sm sm:text-base font-bold text-primary">
                {verificationStatus.inspectorName} ({verificationStatus.inspectorBadge})
              </h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Visiting your shop on <strong>{verificationStatus.slotLabel}</strong> between <strong>{verificationStatus.timeLabel}</strong>.
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto text-left sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l sm:border-outline-variant/60 sm:pl-4">
            <span className="text-[11px] text-outline block">Estimated Duration</span>
            <span className="text-xs font-bold text-on-surface">15–20 minutes</span>
          </div>
        </div>

        {/* Inspector Next Step Walkthrough Simulator */}
        <div className="bg-[#FAF5E8] border border-[#E4D7B5] rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-[#78350F]">
            <span className="material-symbols-outlined text-lg text-[#E0702A] shrink-0">science</span>
            <span>
              <strong>Ready for Step 4?</strong> Experience the inspector's viewpoint to test standard weights and apply the tamper seal.
            </span>
          </div>
          <button
            onClick={() => jumpToTourStep(4)}
            className="w-full sm:w-auto shrink-0 px-4 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Step 4 (Inspector Audit)</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-outline-variant/40 text-xs">
          <button
            onClick={() => showToast('SMS reminder re-sent to registered phone.', 'info')}
            className="text-secondary hover:underline flex items-center justify-center sm:justify-start gap-1 py-1"
          >
            <span className="material-symbols-outlined text-sm">sms</span>
            <span>Resend SMS Reminder</span>
          </button>

          <a
            href="tel:180063872"
            className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface font-semibold hover:bg-surface-container transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm text-primary">call</span>
            <span>Helpdesk Support</span>
          </a>
        </div>
      </div>
    </main>
  );
};
