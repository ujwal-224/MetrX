import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PublicLanding = () => {
  const { navigateTo, handleSearchCertificate, language, setLanguage, showToast } = useApp();
  const [certInput, setCertInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      handleSearchCertificate(certInput);
    } else {
      showToast('Please enter a certificate number to search', 'error');
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col selection:bg-secondary-container selection:text-primary">
      {/* Main Canvas */}
      <main className="flex-grow flex flex-col w-full max-w-max-content-width mx-auto">
        {/* Hero Section */}
        <section className="w-full px-4 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16 bg-gradient-to-b from-[#F6F2E9] to-[#E7F0E8] border-b border-outline-variant">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Hero Text & Controls */}
            <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6">
              {/* Government Authority Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container border border-outline-variant/50 mb-3">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wide font-bold">
                  Government of India • Ministry of Consumer Affairs
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl text-primary font-bold tracking-tight text-balance leading-tight mb-3">
                Trusted Verification. Accurate Measures. Stronger Compliance.
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mb-6 leading-relaxed">
                The National Legal Metrology digital verification system standardizes weights, measuring instruments, and trade certifications across all sovereign states and commercial establishments.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 w-full sm:w-auto">
                <button
                  onClick={() => navigateTo('shop-dashboard')}
                  className="bg-[#E0702A] hover:bg-[#c95f1f] text-white font-semibold text-sm px-6 py-2.5 rounded-lg shadow-sm transition-transform active:scale-95 duration-100 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Login to Portal</span>
                </button>
                <button
                  onClick={() => showToast('Downloading Legal Metrology Act 2009 & Rule 14 gazette copy...', 'info')}
                  className="bg-white hover:bg-gray-50 border border-outline-variant text-on-surface font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base text-primary">download</span>
                  <span>Download Regulations</span>
                </button>
              </div>

              {/* Compact Inline 'Know Your Certificate Status' Lookup Widget */}
              <div className="w-full max-w-xl bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <label className="text-xs sm:text-sm text-on-surface font-bold flex items-center gap-1.5" htmlFor="cert-search-input">
                    <span className="material-symbols-outlined text-primary text-base">fact_check</span>
                    <span>Know Your Certificate Status</span>
                  </label>
                  <span className="text-[11px] text-outline font-mono">e.g. KA-2024-LM-9921</span>
                </div>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-outline">
                      <span className="material-symbols-outlined text-lg">badge</span>
                    </span>
                    <input
                      id="cert-search-input"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface text-xs sm:text-sm pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-secondary-container focus:border-primary outline-none transition-all placeholder:text-outline"
                      placeholder="Enter Certificate or Stamping ID..."
                      type="text"
                    />
                  </div>
                  <button
                    className="bg-primary hover:bg-secondary text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-transform active:scale-95 duration-100 flex items-center justify-center gap-1.5 shrink-0"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-base">search</span>
                    <span>Search</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Hero Graphic: Geometric Line-Art Illustration of Scales & Sovereign Seal */}
            <div className="lg:col-span-5 flex justify-center items-center relative py-unit-4">
              <div className="w-full max-w-md aspect-square bg-surface-bright/70 rounded-xl border border-outline-variant p-unit-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-sm shadow-md">
                <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border border-primary/10 pointer-events-none"></div>
                <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full border border-primary/5 pointer-events-none"></div>

                {/* Graphic Header */}
                <div className="flex justify-between items-center pb-unit-3 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      balance
                    </span>
                    <span className="font-label-md text-label-md text-primary font-semibold">Standard Verification Benchmark</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-bold">STATE SEAL</span>
                </div>

                {/* Geometric Scales & Certificate Diagram */}
                <div className="py-unit-6 flex flex-col items-center justify-center text-center my-auto">
                  <div className="relative flex items-center justify-center mb-unit-4">
                    <div className="w-24 h-24 rounded-full bg-secondary-fixed/50 flex items-center justify-center border border-outline-variant">
                      <span className="material-symbols-outlined text-5xl text-primary">scale</span>
                    </div>
                    <div className="absolute -top-1 -right-3 bg-surface-container-lowest border border-outline-variant px-2 py-0.5 rounded-md shadow-sm">
                      <span className="font-label-sm text-label-sm text-primary font-mono font-bold">Δ ≤ 0.001g</span>
                    </div>
                    <div className="absolute -bottom-1 -left-3 bg-surface-container-lowest border border-outline-variant px-2 py-0.5 rounded-md shadow-sm">
                      <span className="font-label-sm text-label-sm text-secondary font-bold">Class II / III</span>
                    </div>
                  </div>
                  <p className="font-headline-sm text-headline-sm text-on-surface font-semibold mb-1">Authentic Legal Stamping</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                    Encrypted cryptographic metadata embedded in physical &amp; digital metrological verifications.
                  </p>
                </div>

                {/* Certified Indicator Bar */}
                <div
                  onClick={() => navigateTo('certificate-view')}
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg p-unit-3 flex items-center justify-between cursor-pointer hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">qr_code_2</span>
                    <div className="text-left">
                      <p className="font-label-sm text-label-sm font-bold text-on-surface leading-none">Instant QR Validation</p>
                      <p className="font-body-sm text-body-sm text-outline leading-tight">Public Registry 2024-25</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="w-full px-4 sm:px-8 md:px-12 py-8 sm:py-12 bg-surface">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Feature Card 1 */}
            <div
              onClick={() => navigateTo('shop-dashboard')}
              className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-5 flex flex-col justify-between hover:border-outline cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center mb-3 text-primary">
                  <span className="material-symbols-outlined text-2xl">storefront</span>
                </div>
                <h3 className="text-base text-primary mb-2 leading-snug font-bold">
                  Kirana &amp; Merchant Easy Compliance
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Direct slot booking and digital reminders ensure seamless renewal of commercial counter scales with zero business interruptions.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-[#DADDD3]/60 flex items-center justify-between">
                <span className="text-xs text-primary font-semibold">Self-Service Portal</span>
                <span className="material-symbols-outlined text-sm text-outline">arrow_forward</span>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div
              onClick={() => navigateTo('certificate-view')}
              className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-5 flex flex-col justify-between hover:border-outline cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center mb-3 text-primary">
                  <span className="material-symbols-outlined text-2xl">fact_check</span>
                </div>
                <h3 className="text-base text-primary mb-2 leading-snug font-bold">
                  Tamper-Proof Digital Certificates
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Instantly verifiable QR codes protect consumer confidence while preventing fraudulent stamping or duplicate calibration forms.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-[#DADDD3]/60 flex items-center justify-between">
                <span className="text-xs text-primary font-semibold">Cryptographic Seals</span>
                <span className="material-symbols-outlined text-sm text-outline">arrow_forward</span>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div
              onClick={() => navigateTo('request-verification')}
              className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-5 flex flex-col justify-between hover:border-outline cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center mb-3 text-primary">
                  <span className="material-symbols-outlined text-2xl">receipt_long</span>
                </div>
                <h3 className="text-base text-primary mb-2 leading-snug font-bold">
                  Standardized Government Fee Schedules
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Zero hidden charges, transparent receipts, and state-mandated fee tables directly mapped to weight classes and device volumes.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-[#DADDD3]/60 flex items-center justify-between">
                <span className="text-xs text-primary font-semibold">Unified Tariffs</span>
                <span className="material-symbols-outlined text-sm text-outline">arrow_forward</span>
              </div>
            </div>

            {/* Feature Card 4 */}
            <div
              onClick={() => navigateTo('inspector-schedule')}
              className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-5 flex flex-col justify-between hover:border-outline cursor-pointer transition-all hover:-translate-y-0.5"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center mb-3 text-primary">
                  <span className="material-symbols-outlined text-2xl">local_police</span>
                </div>
                <h3 className="text-base text-primary mb-2 leading-snug font-bold">
                  Field Inspection Tracking
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant">
                  Real-time visit notifications &amp; digital stamping ensure verification officers document on-site calibration test logs transparently.
                </p>
              </div>
              <div className="pt-3 mt-4 border-t border-[#DADDD3]/60 flex items-center justify-between">
                <span className="text-xs text-primary font-semibold">Geo-Tagged Logs</span>
                <span className="material-symbols-outlined text-sm text-outline">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* Value Badges */}
        <section className="w-full px-4 sm:px-8 md:px-12 pb-12 pt-2 bg-surface">
          <div className="border-t border-[#DADDD3] pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
              <div className="flex items-center justify-start gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-primary shrink-0">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    assured_workload
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-on-surface font-semibold">
                  Ministry of Consumer Affairs Standardized
                </span>
              </div>

              <div className="flex items-center justify-start gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-primary shrink-0">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    gavel
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-on-surface font-semibold">
                  Legal Metrology Act, 2009 Compliant
                </span>
              </div>

              <div className="flex items-center justify-start gap-3 p-3 rounded-lg bg-surface-container-low border border-outline-variant/40">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary-container text-primary shrink-0">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    public
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-on-surface font-semibold">
                  Pan-India Certified Network
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Legal Metrology Institutional Footer Notice */}
      <footer className="w-full bg-surface-container-high border-t border-outline-variant py-unit-4 px-unit-8 md:px-unit-12">
        <div className="max-w-max-content-width mx-auto flex flex-col md:flex-row justify-between items-center gap-unit-2 text-on-surface-variant font-body-sm text-body-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary">security</span>
            <span>© 2025 Legal Metrology Division, Ministry of Consumer Affairs, Food &amp; Public Distribution. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-unit-6 text-on-surface-variant">
            <button onClick={() => showToast('Privacy Policy: Conforms to Digital Personal Data Protection Act 2023', 'info')} className="hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => showToast('Terms: Official Govt. Form LM-VER-04 Standard Compliance', 'info')} className="hover:underline">
              Terms of Service
            </button>
            <button onClick={() => showToast('Accessibility: WCAG 2.1 AA Compliant Portal', 'info')} className="hover:underline">
              Accessibility Statement
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
