import React from 'react';
import { useApp } from '../context/AppContext';

export const ShopDashboard = () => {
  const {
    navigateTo,
    activeInstrument,
    instruments,
    setActiveInstrumentIndex,
    activeInstrumentIndex,
    storeInfo
  } = useApp();

  const daysLeft = activeInstrument.daysRemaining ?? 28;
  const circumference = 590.6;
  const strokeOffset = Math.max(0, circumference - (circumference * (daysLeft / 365)));

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Top Store Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {storeInfo.name}
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              Verified Merchant
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Ward 4, Commercial Circle, Bengaluru • License #{storeInfo.regNumber}
          </p>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigateTo('register-instrument')}
            className="flex-1 sm:flex-initial justify-center px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-base text-gray-500">add</span>
            <span>Register New Scale</span>
          </button>
          <button
            onClick={() => navigateTo('request-verification')}
            className="flex-1 sm:flex-initial justify-center px-4 py-2 rounded-lg bg-[#e0702a] hover:bg-[#c95f1e] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">calendar_month</span>
            <span>Book Visit</span>
          </button>
        </div>
      </div>

      {/* Action Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-xl">event_upcoming</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-900 text-sm sm:text-base">
                Annual Scale Re-Stamping Due in {daysLeft} Days
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-200 text-amber-900">
                Action Due
              </span>
            </div>
            <p className="text-xs sm:text-sm text-amber-800 mt-0.5 leading-relaxed">
              Karnataka Legal Metrology regulations mandate annual on-site physical calibration tests and holographic wire-seal stamping.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigateTo('request-verification')}
          className="shrink-0 bg-[#e0702a] hover:bg-[#c95f1e] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-all flex items-center gap-1 active:scale-95"
        >
          <span>Choose Date</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Multiple Devices Selector (if any) */}
      {instruments.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0">
            Registered Scales:
          </span>
          {instruments.map((inst, idx) => (
            <button
              key={inst.id}
              onClick={() => setActiveInstrumentIndex(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                activeInstrumentIndex === idx
                  ? 'bg-[#023625] text-white font-bold shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-sm">scale</span>
              <span>{inst.model}</span>
              <span className="text-[10px] opacity-75 font-mono">({inst.serialNumber})</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Two-Column Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Visual Countdown Gauge Card */}
        <div className="md:col-span-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-xs">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Calibration Term
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="material-symbols-outlined text-xs">verified</span>
              <span>{activeInstrument.status}</span>
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
                stroke="#E0702A"
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
                Expires on <strong className="text-gray-700">{activeInstrument.expiresOn}</strong>
              </span>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="w-full flex flex-col gap-2 mt-4">
            <button
              onClick={() => navigateTo('request-verification')}
              className="w-full h-11 bg-[#E0702A] hover:bg-[#c95f1e] text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span className="material-symbols-outlined text-lg">calendar_month</span>
              <span>Schedule Inspector Visit</span>
            </button>
            <a
              href="tel:180063872"
              className="text-xs text-gray-500 hover:text-gray-800 py-1 font-medium transition-colors"
            >
              Need help? Toll-Free 1800-METRA
            </a>
          </div>
        </div>

        {/* Right Column: Scale Details & Status Card */}
        <div className="md:col-span-6 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">scale</span>
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 leading-none">
                    {activeInstrument.name}
                  </h2>
                  <span className="text-xs text-gray-500">{activeInstrument.model}</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
                Class III
              </span>
            </div>

            {/* Spec List */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Serial Number</span>
                <span className="font-mono font-bold text-gray-900">{activeInstrument.serialNumber}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Weighing Capacity</span>
                <span className="font-semibold text-gray-900">{activeInstrument.capacity}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Physical Wire Seal</span>
                <span className="font-mono font-semibold text-emerald-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  {activeInstrument.sealNumber} (Intact)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Certificate Status</span>
                <span className="font-mono font-bold text-gray-900">CERT-KA-2024-9921</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-gray-500">Inspection Zone</span>
                <span className="font-medium text-gray-700">Ward 4 (Insp. R. Deshmukh)</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => navigateTo('certificate-view')}
              className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-emerald-700">verified</span>
              <span>View Certificate</span>
            </button>
            <button
              onClick={() => navigateTo('track-status')}
              className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-sm text-blue-600">pending_actions</span>
              <span>Track Visit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Simple 3-Step Process Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          How Re-Verification Works in 3 Simple Steps:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <strong className="text-gray-900 block font-semibold">Book a Date Online</strong>
              <span className="text-gray-500 mt-0.5 block leading-relaxed">
                Choose a morning or afternoon slot. Government fee is ₹150 payable on-site.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <strong className="text-gray-900 block font-semibold">Inspector Visits Shop</strong>
              <span className="text-gray-500 mt-0.5 block leading-relaxed">
                Officer tests calibration with standard weights and affixes official 2025 tamper seal.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-700 font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <strong className="text-gray-900 block font-semibold">Get Legal Certificate</strong>
              <span className="text-gray-500 mt-0.5 block leading-relaxed">
                Instant digital certificate Form XVII with authentic QR code valid for 1 full year.
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
