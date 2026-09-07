import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const CertificateView = () => {
  const {
    navigateTo,
    certificateData,
    storeInfo,
    activeRole,
    showToast,
    ownerShops,
    activeShopIndex,
    handleSelectOwnerShop,
    handleViewHistoricalCertificate
  } = useApp();

  const [showSpecs, setShowSpecs] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const isShopOwner = activeRole === 'shop-owner';
  const activeShop = ownerShops?.[activeShopIndex] || ownerShops?.[0];

  // Determine current shop status type: 'verified' | 'in_progress' | 'fraud'
  const shopCompliance = (activeShop?.complianceStatus || '').toLowerCase();
  const certStatusBadge = (certificateData?.statusBadge || '').toLowerCase();

  const isFraud =
    Boolean(certificateData?.isFraud) ||
    shopCompliance.includes('fraud') ||
    shopCompliance.includes('reject') ||
    shopCompliance.includes('discrepancy') ||
    shopCompliance.includes('tamper') ||
    shopCompliance.includes('non-compliant');

  const isInProgress =
    !isFraud &&
    (Boolean(certificateData?.inProgress) ||
      shopCompliance.includes('review') ||
      shopCompliance.includes('pending') ||
      shopCompliance.includes('submit') ||
      !activeShop?.certificationHistory ||
      activeShop.certificationHistory.length === 0);

  const isVerified = !isFraud && !isInProgress;

  const isHistorical =
    Boolean(certificateData?.isHistorical) ||
    certStatusBadge.includes('archived') ||
    certStatusBadge.includes('renewed') ||
    false;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    const certId = certificateData?.certId || 'CERT-IN-PROGRESS';
    showToast(`Generating signed statutory Form XVII PDF (${certId})...`, 'info');
    setTimeout(() => {
      window.print();
    }, 350);
  };

  const handleCopyVerificationLink = () => {
    setCopiedLink(true);
    showToast('Public verification link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 flex flex-col min-h-screen bg-slate-50">
      {/* Top Navigation & Action Bar */}
      <div className="w-full mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 pb-4 sm:pb-5 no-print">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0A3828] text-emerald-300 flex items-center justify-center shadow-md shrink-0">
            <span className="material-symbols-outlined text-lg sm:text-xl">workspace_premium</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {isFraud
                  ? 'Statutory Discrepancy Notice'
                  : isInProgress
                  ? 'Certification In Progress'
                  : 'Verification Certificate'}
              </h1>
              {isVerified && !isHistorical && (
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  LIVE &amp; VALID
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
              Official Legal Metrology Form XVII (Rule 14) • Government of Karnataka LMIS Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              if (activeRole === 'inspector') navigateTo('inspector-schedule');
              else if (activeRole === 'admin') navigateTo('admin-dashboard');
              else if (activeRole === 'public') navigateTo('public-portal');
              else navigateTo('shop-dashboard');
            }}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors text-xs font-semibold shadow-xs"
          >
            <span className="material-symbols-outlined text-base text-slate-500">
              {activeRole === 'inspector'
                ? 'arrow_back'
                : activeRole === 'admin'
                ? 'dashboard'
                : activeRole === 'public'
                ? 'public'
                : 'storefront'}
            </span>
            <span>
              {activeRole === 'inspector'
                ? 'Inspector Route'
                : activeRole === 'admin'
                ? 'Admin Center'
                : activeRole === 'public'
                ? 'Public Portal'
                : 'Shop Dashboard'}
            </span>
          </button>

          {isVerified && (
            <>
              <button
                onClick={handleCopyVerificationLink}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors text-xs font-semibold shadow-xs"
                type="button"
              >
                <span className="material-symbols-outlined text-base text-slate-500">
                  {copiedLink ? 'check' : 'share'}
                </span>
                <span>{copiedLink ? 'Copied' : 'Share QR'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#0A3828] bg-[#0A3828] text-white hover:bg-[#062319] transition-all text-xs font-bold shadow-xs active:scale-95"
                type="button"
              >
                <span className="material-symbols-outlined text-base text-emerald-300">print</span>
                <span>Print</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* ESTABLISHMENTS SELECTOR BAR */}
      {isShopOwner && ownerShops && ownerShops.length > 0 && (
        <div className="w-full mb-5 sm:mb-6 no-print">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2 sm:mb-2.5">
            <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#0A3828]">store</span>
              <span>Your Registered Establishments ({ownerShops.length} Branches):</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400">Select branch to view certificate status</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
            {ownerShops.map((shop, idx) => {
              const isSelected = activeShopIndex === idx;
              const sCompliance = (shop.complianceStatus || '').toLowerCase();
              const sIsFraud =
                sCompliance.includes('fraud') ||
                sCompliance.includes('reject') ||
                sCompliance.includes('discrepancy') ||
                sCompliance.includes('non-compliant');
              const sIsVerified =
                !sIsFraud &&
                (sCompliance.includes('certified') ||
                  sCompliance.includes('verified') ||
                  (shop.certificationHistory && shop.certificationHistory.length > 0));

              return (
                <button
                  key={shop.id || idx}
                  onClick={() => handleSelectOwnerShop(idx)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 border-[#0A3828] bg-white shadow-md ring-2 ring-emerald-600/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                  }`}
                  type="button"
                >
                  <div className="flex items-start gap-2.5 mb-2 pr-5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#0A3828] text-emerald-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">storefront</span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {shop.name}
                      </span>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {shop.zone || shop.branchType}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs pt-2.5 border-t border-slate-100">
                    <span className="font-mono text-slate-500 text-[11px] font-medium">
                      {shop.merchantUid}
                    </span>

                    {sIsFraud ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                        <span>Fraud Flagged</span>
                      </span>
                    ) : sIsVerified ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>Review Due</span>
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Historical Certificate Sub-Selector for Verified Shops with Multiple Records */}
      {isShopOwner && isVerified && activeShop?.certificationHistory && activeShop.certificationHistory.length > 1 && (
        <div className="w-full mb-6 no-print">
          <div className="bg-[#0A3828] text-white rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-emerald-300 text-xl">history_edu</span>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Certification History for <strong>{activeShop.name}</strong></span>
                  <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-800 text-emerald-100 border border-emerald-700">
                    {activeShop.certificationHistory.length} Records
                  </span>
                </div>
                <div className="text-[11px] text-emerald-200/90">
                  Switch between the active live certificate and past archived renewals:
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {activeShop.certificationHistory.map((cert, idx) => {
                const isSelected = certificateData?.certId === cert.certId;
                const isCurrent = idx === 0;
                return (
                  <button
                    key={cert.certId}
                    onClick={() => handleViewHistoricalCertificate(cert)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                      isSelected
                        ? 'bg-white text-[#0A3828] ring-2 ring-emerald-300 font-black'
                        : 'bg-emerald-900/80 text-emerald-100 hover:bg-emerald-900 border border-emerald-700/60'
                    }`}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-xs">
                      {isCurrent ? 'verified' : 'history'}
                    </span>
                    <span>
                      {isCurrent
                        ? `Active (${cert.certId})`
                        : `Past (${cert.verifiedDate?.split(' ')[2] || 'Archive'})`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 1. FRAUD / NON-COMPLIANCE / DISCREPANCY DETECTED STATE         */}
      {/* ============================================================== */}
      {isFraud && (
        <div className="w-full max-w-3xl mx-auto mb-12">
          <div className="bg-white border-2 border-rose-500 rounded-2xl shadow-xl overflow-hidden relative">
            {/* Red Header */}
            <div className="bg-gradient-to-r from-rose-700 via-rose-800 to-rose-900 text-white p-6 sm:p-8 relative">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-rose-100 shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-3xl font-bold">gavel</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-200 text-rose-950 tracking-wide uppercase">
                      Statutory Enforcement Action
                    </span>
                    <span className="text-xs font-mono text-rose-200">
                      Ref: NOT-LM-BLR-2025-0982
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
                    Verification Suspended • Statutory Violation Detected
                  </h2>
                  <p className="text-xs sm:text-sm text-rose-100 mt-1 max-w-xl">
                    Commercial scale at <strong>{activeShop?.name}</strong> has failed Maximum Permissible Error (MPE) tolerance tests or has broken physical wire-seals.
                  </p>
                </div>
              </div>
            </div>

            {/* Discrepancy Findings Box */}
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-rose-700 text-xl shrink-0 mt-0.5">
                    report_problem
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-rose-950 uppercase tracking-wider">
                      Audit Discrepancy Breakdown
                    </h3>
                    <p className="text-xs text-rose-900 font-medium mt-1 leading-relaxed">
                      Physical audit by Legal Metrology Officer revealed a calibration variance of <strong>+4.8%</strong> against Class M1 working standard weights (Legal MPE Tolerance limit: ±0.1%). Official wire seal was reported broken or unverified.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Establishment Record
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{activeShop?.name}</div>
                  <div className="text-slate-600 mt-0.5">{activeShop?.address}</div>
                  <div className="font-mono text-slate-500 text-[11px] mt-1">
                    UID: {activeShop?.merchantUid} • Trade Lic: {activeShop?.tradeLicense}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Reporting Enforcement Officer
                  </span>
                  <div className="font-bold text-slate-900 text-sm">
                    {activeShop?.assignedInspector || 'Insp. R. Deshmukh'}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Badge: {activeShop?.inspectorBadge || 'LM-BLR-402'} • Central Division
                  </div>
                  <div className="text-[11px] text-rose-700 font-semibold mt-1">
                    Action: Notice issued under Section 30 of Act of 2009
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <p className="text-[11px] text-slate-500 max-w-md">
                  Using uncertified scales in commercial trade is punishable under law. Please request a re-calibration inspection immediately.
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => navigateTo('request-verification')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base">build</span>
                    <span>Book Re-Calibration Audit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. STILL IN PROGRESS / REVIEW DUE STATE (CLEAN BLUE & SLATE)   */}
      {/* ============================================================== */}
      {isInProgress && (
        <div className="w-full max-w-3xl mx-auto mb-12">
          <div className="bg-white border border-blue-200 rounded-2xl shadow-xl overflow-hidden relative">
            {/* Clean Deep Navy/Emerald Header */}
            <div className="bg-gradient-to-r from-[#0A3828] via-[#124e3a] to-[#0A3828] text-white p-6 sm:p-8 relative">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-200 shrink-0 shadow-inner">
                  <span className="material-symbols-outlined text-3xl font-bold">pending_actions</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500 text-white tracking-wide uppercase">
                      Verification In Progress
                    </span>
                    <span className="text-xs font-mono text-emerald-200">
                      Establishment: {activeShop?.merchantUid}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black mt-1 tracking-tight">
                    Statutory Certification In Progress
                  </h2>
                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
                    Form XVII certificate for <strong>{activeShop?.name}</strong> will be cryptographically issued upon physical weights calibration and holographic wire sealing.
                  </p>
                </div>
              </div>
            </div>

            {/* Stepper Progress Pipeline */}
            <div className="p-6 sm:p-8 flex flex-col gap-6">
              <div>
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#0A3828]">conversion_path</span>
                  <span>4-Step Statutory Certification Pipeline</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Complete</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">1. Scale Registered</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Form VIII declared</div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 uppercase">Verified</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900">2. Trade License</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">BBMP / GSTIN approved</div>
                  </div>

                  {/* Step 3 - In Progress */}
                  <div className="p-3.5 rounded-xl bg-blue-50 border-2 border-blue-400 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                        3
                      </span>
                      <span className="text-[10px] font-extrabold text-blue-900 uppercase bg-blue-200 px-1.5 py-0.2 rounded">
                        Current
                      </span>
                    </div>
                    <div className="text-xs font-bold text-blue-950">3. Physical Audit</div>
                    <div className="text-[11px] text-blue-800 mt-0.5">MPE tolerance test</div>
                  </div>

                  {/* Step 4 */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between opacity-70">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-600 flex items-center justify-center text-xs font-bold">
                        4
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Pending</span>
                    </div>
                    <div className="text-xs font-bold text-slate-700">4. Form XVII Cert</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Holographic wire seal</div>
                  </div>
                </div>
              </div>

              {/* Establishment & Assignment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Establishment &amp; Instrument
                  </span>
                  <div className="font-bold text-slate-900 text-sm">{activeShop?.name}</div>
                  <div className="text-slate-600 mt-0.5">{activeShop?.address}</div>
                  <div className="text-slate-700 mt-1 font-medium">
                    Declared: {activeShop?.instruments?.[0]?.name || 'Electronic Counter Scale'} ({activeShop?.instruments?.[0]?.model || 'Contech Series'})
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                    Assigned Legal Metrology Officer
                  </span>
                  <div className="font-bold text-[#0A3828] text-sm">
                    {activeShop?.assignedInspector || 'Insp. R. Deshmukh'}
                  </div>
                  <div className="text-slate-600 mt-0.5">
                    Official Badge: {activeShop?.inspectorBadge || 'LM-BLR-402'} • Karnataka Directorate
                  </div>
                  <div className="text-[11px] text-blue-800 font-semibold mt-1">
                    Status: On route for physical weights verification
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
                <p className="text-[11px] text-slate-500 max-w-md">
                  Track the assigned inspector's route and estimated arrival time directly on the map.
                </p>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={() => navigateTo('track-status')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0A3828] hover:bg-[#062319] text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base text-emerald-300">near_me</span>
                    <span>Track Inspector Route &amp; Visit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. VERIFIED / CERTIFIED STATE (CLEAN WHITE & EMERALD GOVT CERT) */}
      {/* ============================================================== */}
      {isVerified && (
        <div className="w-full max-w-4xl mx-auto mb-12 print-only-full">
          {/* Certificate Container with Royal Deep Emerald Borders */}
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 sm:border-4 border-[#081C15] p-1.5 sm:p-3 relative overflow-hidden">
            {/* Crisp Inner Double-Border */}
            <div className="border border-slate-300 rounded-xl sm:rounded-2xl p-3.5 sm:p-6 md:p-10 relative bg-white">
              {/* Corner Security Accents */}
              <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-l-2 border-[#0A3828] pointer-events-none"></div>
              <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-5 h-5 sm:w-8 sm:h-8 border-t-2 border-r-2 border-[#0A3828] pointer-events-none"></div>
              <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3 w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-l-2 border-[#0A3828] pointer-events-none"></div>
              <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-5 h-5 sm:w-8 sm:h-8 border-b-2 border-r-2 border-[#0A3828] pointer-events-none"></div>

              {/* Watermark Crest Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                <span className="material-symbols-outlined text-[260px] sm:text-[420px] text-[#0A3828]">
                  verified_user
                </span>
              </div>

              {/* ================= CERTIFICATE HEADER ================= */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Official State Emblem Medal */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-[#081C15] border-2 border-emerald-600 flex items-center justify-center text-emerald-300 shadow-lg mb-2 sm:mb-3">
                  <span className="material-symbols-outlined text-2xl sm:text-4xl">account_balance</span>
                </div>

                {/* State Hierarchy Titles */}
                <div className="text-[9px] sm:text-xs font-black uppercase tracking-[0.18em] sm:tracking-[0.25em] text-slate-600">
                  Government of Karnataka • Department of Consumer Affairs
                </div>
                <h2 className="text-xl sm:text-3xl md:text-4xl font-serif font-black text-[#081C15] tracking-tight mt-0.5">
                  Directorate of Legal Metrology
                </h2>
                <div className="text-[11px] sm:text-sm font-bold text-[#0A3828] mt-1 uppercase tracking-wider">
                  Form XVII • Statutory Certificate of Verification (Rule 14)
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">
                  Issued in accordance with Section 24 of The Legal Metrology Act, 2009
                </div>

                {/* Divider Line */}
                <div className="w-48 sm:w-64 h-0.5 bg-slate-200 my-4"></div>

                {/* Status Badge & Certificate Identification */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 flex-wrap">
                  <div
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black tracking-wide shadow-xs border ${
                      isHistorical
                        ? 'bg-slate-100 text-slate-800 border-slate-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm font-black">
                      {isHistorical ? 'history' : 'verified'}
                    </span>
                    <span>{certificateData?.statusBadge || 'VERIFIED & COMPLIANT'}</span>
                  </div>

                  <div className="font-mono text-base sm:text-lg font-black text-[#081C15] tracking-tight bg-slate-100 px-3.5 py-1 rounded-lg border border-slate-300 shadow-inner">
                    {certificateData?.certId || 'CERT-KA-2024-9921'}
                  </div>
                </div>
              </div>

              {/* ================= SECURITY RIBBON ================= */}
              <div className="relative z-10 my-6 py-2.5 px-4 rounded-xl bg-[#081C15] text-emerald-300 border border-emerald-800 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-emerald-300">lock</span>
                  <span>SECURITY DIGEST: SHA-256 (STATE PKI REPOSITORY VALIDATED)</span>
                </div>
                <div className="text-white/80 font-sans text-[10px] mt-1 sm:mt-0">
                  Karnataka State Legal Metrology Enforcement Network
                </div>
              </div>

              {/* ================= CORE VERIFICATION GAUGES ================= */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-sm">
                {/* Left: Scannable QR Shield */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="p-3 bg-white border-2 border-[#0A3828] rounded-2xl shadow-md relative">
                    <svg
                      className="w-28 h-28 sm:w-32 sm:h-32 text-[#0A3828]"
                      fill="currentColor"
                      viewBox="0 0 100 100"
                    >
                      <path d="M0,0 h30 v10 h-20 v20 h-10 Z M70,0 h30 v30 h-10 v-20 h-20 Z M0,70 h10 v20 h20 v10 h-30 Z" />
                      <rect fill="#0A3828" height="14" width="14" x="8" y="8" />
                      <rect fill="#0A3828" height="14" width="14" x="78" y="8" />
                      <rect fill="#0A3828" height="14" width="14" x="8" y="78" />
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
                      <circle cx="50" cy="50" fill="#059669" r="4" />
                    </svg>
                    <div className="absolute -bottom-2 -right-2 bg-[#0A3828] text-white p-1 rounded-full shadow">
                      <span className="material-symbols-outlined text-xs font-black block">qr_code_scanner</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      Authentic Government QR Stamp
                    </span>
                    <span className="text-[11px] text-slate-500 block max-w-[200px]">
                      Scan with any smartphone camera to verify live registration on Karnataka Registry
                    </span>
                  </div>
                </div>

                {/* Right: Days Remaining Radial Indicator or Archival Seal */}
                <div className="flex flex-col items-center text-center">
                  {isHistorical ? (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-slate-300 bg-white flex flex-col items-center justify-center p-2 shadow-inner">
                      <span className="material-symbols-outlined text-3xl text-slate-500">inventory_2</span>
                      <span className="text-xs font-black text-slate-700 mt-1">ARCHIVED</span>
                      <span className="text-[10px] text-slate-500">Historical Record</span>
                    </div>
                  ) : (
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" fill="transparent" r="52" stroke="#E2E8F0" strokeWidth="9" />
                        <circle
                          cx="60"
                          cy="60"
                          fill="transparent"
                          r="52"
                          stroke="#0A3828"
                          strokeDasharray="326.7"
                          strokeDashoffset="29.4"
                          strokeLinecap="round"
                          strokeWidth="9"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl sm:text-3xl font-black text-[#0A3828] leading-none font-serif">
                          {certificateData?.daysLeft ?? 365}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider text-slate-500 font-extrabold mt-0.5">
                          Days Active
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    <span className="text-xs sm:text-sm font-black text-[#081C15] block">
                      Valid until {certificateData?.validUntil || '12 Jan 2026'}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {isHistorical ? 'Statutory Term Concluded' : 'Full 1-Year Stamping Term'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ================= 4-CARD STRUCTURED DETAILS ================= */}
              <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {/* 1. Establishment Details */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-base text-[#0A3828]">store</span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                      Establishment Details
                    </span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">
                    {certificateData?.shopName || activeShop?.name || storeInfo.name}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    {certificateData?.shopAddress || activeShop?.address || storeInfo.location}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Merchant UID:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {certificateData?.merchantUid || activeShop?.merchantUid || storeInfo.merchantUid}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-0.5">
                    <span className="text-slate-500">BBMP Trade Lic:</span>
                    <span className="font-bold text-slate-800">
                      {certificateData?.tradeLicense || activeShop?.tradeLicense || storeInfo.regNumber}
                    </span>
                  </div>
                </div>

                {/* 2. Instrument Details */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-base text-[#0A3828]">scale</span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                      Certified Instrument Specs
                    </span>
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">
                    {certificateData?.instrumentModel || 'Contech CA-30 (Max 30kg, e=1g)'}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Class III Commercial Precision Non-Automatic Weighing Instrument
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Serial Number:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {certificateData?.serialNumber || activeShop?.instruments?.[0]?.serialNumber || '#KA-BLR-88412'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] mt-0.5">
                    <span className="text-slate-500">Capacity / Precision:</span>
                    <span className="font-bold text-slate-800">
                      {activeShop?.instruments?.[0]?.capacity || '30kg / 1g precision'}
                    </span>
                  </div>
                </div>

                {/* 3. Verification & Wire Seal */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-base text-[#0A3828]">lock_open</span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                      Holographic Stamping &amp; Seal
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Lead Wire Seal No:</span>
                    <span className="font-mono font-black text-[#0A3828] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {certificateData?.inspectorSeal || 'SEAL-LM-BLR-0428'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1.5">
                    <span className="text-slate-500">Verification Date:</span>
                    <span className="font-bold text-slate-900">
                      {certificateData?.verifiedDate || '13 Jan 2025'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-1.5">
                    <span className="text-slate-500">Statutory Term Expiry:</span>
                    <span className="font-bold text-slate-900">
                      {certificateData?.validUntil || '12 Jan 2026'}
                    </span>
                  </div>
                </div>

                {/* 4. Enforcing Officer */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-base text-[#0A3828]">badge</span>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-600">
                      Enforcement Officer
                    </span>
                  </div>
                  <div className="font-bold text-sm text-slate-900">
                    {certificateData?.inspectorName || activeShop?.assignedInspector || 'Insp. R. Deshmukh'}
                  </div>
                  <div className="text-xs text-slate-600 mt-0.5">
                    Legal Metrology Inspector • Badge #{certificateData?.inspectorBadge || activeShop?.inspectorBadge || 'LM-BLR-402'}
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-[#0A3828] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">verified</span>
                    <span>Digitally Signed via State Metrology Gateway</span>
                  </div>
                </div>
              </div>

              {/* ================= CALIBRATION TEST WEIGHTS AUDIT LOG ================= */}
              <div className="relative z-10 mt-6 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowSpecs(!showSpecs)}
                    className="inline-flex items-center gap-2 text-[#0A3828] hover:text-[#062319] text-xs font-bold transition-colors underline-offset-4 hover:underline"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-base text-emerald-700">analytics</span>
                    <span>{showSpecs ? 'Hide' : 'View'} Calibrated Working Weights Test Log (Class M1 Standards)</span>
                    <span
                      className={`material-symbols-outlined text-sm transition-transform ${
                        showSpecs ? 'rotate-180' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  <span className="text-[11px] text-slate-500 font-mono">4-Point MPE Audit</span>
                </div>

                {showSpecs && (
                  <div className="mt-3 p-4 rounded-xl bg-white border border-slate-200 text-xs shadow-inner">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 text-[11px] font-black uppercase">
                            <th className="py-2 px-3">Test Load</th>
                            <th className="py-2 px-3">Observed Reading</th>
                            <th className="py-2 px-3">Permissible Tolerance (MPE)</th>
                            <th className="py-2 px-3">Calibration Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {(certificateData?.calibrationTests || []).map((row, idx) => (
                            <tr key={idx} className={idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}>
                              <td className="py-2 px-3 font-semibold text-slate-900">{row.load}</td>
                              <td className="py-2 px-3 font-mono text-slate-700">{row.observed}</td>
                              <td className="py-2 px-3 text-slate-500">{row.mpe}</td>
                              <td className="py-2 px-3 text-emerald-700 font-black flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                <span>{row.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between gap-1">
                      <div>
                        <strong>Standard Reference:</strong> {certificateData?.workingStandardRef || 'STD/KA/2024/0081 (Calibrated at NPL)'}
                      </div>
                      <div>
                        <strong>Cryptographic DSC:</strong> {certificateData?.digitalSignature || 'Digitally Cryptographed (DSC v4.1)'}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ================= ACTION BUTTONS (NO PRINT) ================= */}
              <div className="relative z-10 mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 no-print">
                <button
                  onClick={handleDownloadPdf}
                  className="w-full sm:w-auto min-w-[240px] inline-flex items-center justify-center gap-2 bg-[#0A3828] hover:bg-[#062319] text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 border border-emerald-700/40"
                  type="button"
                >
                  <span className="material-symbols-outlined text-lg text-emerald-300">download</span>
                  <span>Download Signed Form XVII PDF</span>
                </button>
              </div>

              {/* ================= LEGAL STATUTORY FOOTER ================= */}
              <div className="relative z-10 mt-8 pt-4 border-t-2 border-dashed border-slate-200 text-center">
                <p className="text-[11px] text-slate-500 leading-tight max-w-xl mx-auto">
                  Issued under Section 24 of The Legal Metrology Act, 2009. Tampering with this certificate or obliterating the physical verification wire seal is a cognizable offense punishable under Section 30 of the Act.
                </p>
                <div className="text-[10px] text-slate-400 font-mono mt-1">
                  Karnataka State Legal Metrology Information System (LMIS) • State Data Centre
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
