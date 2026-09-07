import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CertificateView = () => {
  const { navigateTo, certificateData, storeInfo, activeRole, showToast } = useApp();
  const [showSpecs, setShowSpecs] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast(`Downloading signed certificate PDF (${certificateData.certId})...`, 'info');
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 flex flex-col min-h-screen">
      {/* Screen Header with Archival Context */}
      <div className="max-w-2xl mx-auto w-full mb-unit-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/60 pb-5 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-[#2E7D32] uppercase tracking-wider bg-[#E7F0E8] px-2 py-0.5 rounded-full">
              Step 5: Verified &amp; Certified
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-secondary font-semibold">
              {certificateData.ruleForm}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl text-primary tracking-tight font-bold">
            Official Verification Certificate
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1">
            Issued under Section 24 of The Legal Metrology Act, 2009
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeRole === 'inspector') navigateTo('inspector-schedule');
              else if (activeRole === 'admin') navigateTo('admin-dashboard');
              else if (activeRole === 'public') navigateTo('public-portal');
              else navigateTo('shop-dashboard');
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-sm">
              {activeRole === 'inspector' ? 'arrow_back' : activeRole === 'admin' ? 'dashboard' : activeRole === 'public' ? 'public' : 'storefront'}
            </span>
            <span>
              {activeRole === 'inspector' ? 'Inspector Route' : activeRole === 'admin' ? 'Admin Center' : activeRole === 'public' ? 'Public Portal' : 'Dashboard'}
            </span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-colors text-xs font-semibold"
            type="button"
          >
            <span className="material-symbols-outlined text-sm">print</span>
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Centered Formal Government Certificate Card */}
      <div className="max-w-2xl mx-auto w-full mb-unit-12 print-only-full">
        <div className="p-4 sm:p-6 md:p-10 bg-[#FAF8F4] border-2 border-[#1F4D3A] rounded-2xl relative shadow-md overflow-hidden">
          {/* Classical Watermark Accent */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 opacity-[0.03] pointer-events-none select-none text-primary">
            <span className="material-symbols-outlined text-[320px]">verified_user</span>
          </div>

          {/* Ornamental Inner Border */}
          <div className="absolute inset-1.5 border border-[#1F4D3A]/20 rounded-[14px] pointer-events-none"></div>

          {/* Top Emblem & Header */}
          <div className="relative z-10 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border border-outline-variant bg-surface-container-low flex items-center justify-center text-primary shadow-inner mb-3">
              <span className="material-symbols-outlined text-3xl">account_balance</span>
            </div>
            <div className="space-y-0.5">
              <div className="text-[11px] uppercase tracking-widest text-primary font-bold">
                Government of India • State of Karnataka
              </div>
              <div className="text-xl md:text-2xl text-primary font-extrabold font-headline-sm">
                Directorate of Legal Metrology
              </div>
              <div className="text-xs text-on-surface-variant">
                Department of Consumer Affairs, Food &amp; Civil Supplies
              </div>
            </div>
            <div className="w-32 h-0.5 bg-primary-container/30 my-4"></div>

            {/* Status Badge & Certificate Identification */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="inline-flex items-center gap-1.5 bg-[#E7F0E8] text-[#2E7D32] px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wide shadow-xs border border-[#2E7D32]/20">
                <span className="material-symbols-outlined text-sm font-bold">verified</span>
                <span>{certificateData.statusBadge}</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-primary tracking-tight font-mono">
                {certificateData.certId}
              </div>
            </div>
          </div>

          {/* Middle Section: Scannable QR Code + Days Left Gauge */}
          <div className="relative z-10 mt-6 pt-5 border-t border-b border-outline-variant/60 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center py-5">
            {/* Left: Scannable QR Pattern */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left pl-0 sm:pl-2">
              <div className="p-3 bg-surface-container-lowest border-2 border-[#1F4D3A] rounded-xl shadow-xs">
                <svg className="w-28 h-28 md:w-32 md:h-32 text-primary" fill="currentColor" viewBox="0 0 100 100">
                  <path d="M0,0 h30 v10 h-20 v20 h-10 Z M70,0 h30 v30 h-10 v-20 h-20 Z M0,70 h10 v20 h20 v10 h-30 Z" />
                  <rect fill="#1F4D3A" height="14" width="14" x="8" y="8" />
                  <rect fill="#1F4D3A" height="14" width="14" x="78" y="8" />
                  <rect fill="#1F4D3A" height="14" width="14" x="8" y="78" />
                  <rect height="6" width="6" x="36" y="8" />
                  <rect height="12" width="6" x="46" y="8" />
                  <rect height="6" width="6" x="58" y="8" />
                  <rect height="6" width="12" x="36" y="20" />
                  <rect height="6" width="6" x="54" y="20" />
                  <rect height="12" width="6" x="8" y="36" />
                  <rect height="6" width="12" x="20" y="36" />
                  <rect height="6" width="28" x="36" y="36" />
                  <rect height="6" width="12" x="70" y="36" />
                  <rect height="12" width="6" x="88" y="36" />
                  <rect height="6" width="12" x="8" y="54" />
                  <rect height="12" width="6" x="26" y="48" />
                  <rect height="12" width="12" x="38" y="48" />
                  <rect height="6" width="12" x="56" y="48" />
                  <rect height="6" width="18" x="74" y="48" />
                  <rect height="12" width="6" x="20" y="66" />
                  <rect height="6" width="12" x="36" y="66" />
                  <rect height="18" width="6" x="54" y="66" />
                  <rect height="6" width="12" x="66" y="66" />
                  <rect height="10" width="10" x="84" y="66" />
                  <rect height="14" width="12" x="36" y="78" />
                  <rect height="6" width="10" x="70" y="78" />
                  <rect height="6" width="26" x="66" y="88" />
                  <circle cx="50" cy="50" fill="#E0702A" r="4" />
                </svg>
              </div>
              <p className="text-xs text-on-surface-variant mt-2 max-w-[180px] leading-snug">
                Scan with any smartphone camera to verify authentic government registration
              </p>
            </div>

            {/* Right: Days Remaining Radial Indicator */}
            <div className="flex flex-col items-center text-center">
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" fill="transparent" r="52" stroke="#DADDD3" strokeWidth="8" />
                  <circle
                    cx="60"
                    cy="60"
                    fill="transparent"
                    r="52"
                    stroke="#1F4D3A"
                    strokeDasharray="326.7"
                    strokeDashoffset="29.4"
                    strokeLinecap="round"
                    strokeWidth="8"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl md:text-3xl font-extrabold text-[#1F4D3A] leading-none">
                    {certificateData.daysLeft}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mt-0.5">
                    Days Valid
                  </span>
                </div>
              </div>
              <p className="text-xs md:text-sm font-bold text-primary mt-2">
                Valid until {certificateData.validUntil}
              </p>
              <p className="text-[11px] text-on-surface-variant">Full 1-Year Stamping Term</p>
            </div>
          </div>

          {/* Instrument & Establishment Details */}
          <div className="relative z-10 mt-5 bg-surface-container-low/70 border border-outline-variant/60 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-surface-container-lowest text-primary border border-outline-variant shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-xl">scale</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-on-surface-variant font-bold tracking-wider">
                  Certified Commercial Instrument
                </span>
                <div className="text-sm md:text-base text-on-surface font-bold mt-0.5">
                  {certificateData.instrumentModel}
                </div>
                <div className="text-xs text-on-surface-variant mt-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-secondary">storefront</span>
                  <span>{storeInfo.name}, {storeInfo.zone}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-outline-variant/40 text-left text-xs">
              <div>
                <div className="text-outline">Inspector Seal Stamped</div>
                <div className="font-bold text-primary font-mono">{certificateData.inspectorSeal}</div>
              </div>
              <div>
                <div className="text-outline">Verification Date</div>
                <div className="font-bold text-primary">{certificateData.verifiedDate}</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="relative z-10 mt-6 flex flex-col items-center no-print w-full">
            <button
              onClick={handleDownloadPdf}
              className="w-full sm:w-auto sm:min-w-[240px] inline-flex items-center justify-center gap-2 bg-[#E0702A] hover:bg-[#c65e1e] text-white px-6 sm:px-8 py-3 rounded-lg text-sm font-bold shadow transition-all active:translate-y-0.5"
              type="button"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Download Official PDF</span>
            </button>

            <button
              onClick={() => setShowSpecs(!showSpecs)}
              className="mt-3 inline-flex items-center gap-1 text-primary hover:text-secondary text-xs font-semibold transition-colors underline-offset-4 hover:underline focus:outline-none"
              type="button"
            >
              <span>{showSpecs ? 'Hide' : 'View'} Calibration Test Weights Record</span>
              <span className={`material-symbols-outlined text-sm transition-transform ${showSpecs ? 'rotate-180' : ''}`}>
                expand_more
              </span>
            </button>
          </div>

          {/* Expandable Calibration Record */}
          {showSpecs && (
            <div className="relative z-10 mt-5 pt-4 border-t border-outline-variant text-left bg-surface-container-lowest/70 rounded-xl p-4 border text-xs">
              <h4 className="font-bold text-primary mb-2 flex items-center gap-1.5 text-xs">
                <span className="material-symbols-outlined text-secondary text-base">history_edu</span>
                <span>Calibrated Working Weights Test Log</span>
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm">
                  <thead>
                    <tr className="border-b border-outline-variant bg-surface-container text-on-surface text-[11px] font-bold">
                      <th className="py-1.5 px-3">Test Load</th>
                      <th className="py-1.5 px-3">Observed Reading</th>
                      <th className="py-1.5 px-3">Permissible Error (MPE)</th>
                      <th className="py-1.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30 text-[11px]">
                    {certificateData.calibrationTests.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-surface-container-low/40' : 'bg-surface-container-lowest'}>
                        <td className="py-1.5 px-3 font-medium">{row.load}</td>
                        <td className="py-1.5 px-3">{row.observed}</td>
                        <td className="py-1.5 px-3 text-on-surface-variant">{row.mpe}</td>
                        <td className="py-1.5 px-3 text-[#2E7D32] font-bold">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 pt-2 border-t border-outline-variant/50 text-[11px] text-on-surface-variant">
                <div><strong>Standard Reference:</strong> {certificateData.workingStandardRef}</div>
                <div><strong>Digital Signature:</strong> {certificateData.digitalSignature}</div>
              </div>
            </div>
          )}

          {/* Legal Footer Notice */}
          <div className="relative z-10 mt-6 pt-3 border-t border-dashed border-outline-variant/80 text-center">
            <p className="text-[11px] text-outline leading-tight">
              Issued under Section 24 of The Legal Metrology Act, 2009. Tampering with this certificate or obliterating the physical verification stamp is punishable under law.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};
