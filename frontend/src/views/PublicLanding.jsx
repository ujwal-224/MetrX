import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PublicLanding = () => {
  const {
    navigateTo,
    handleAdminLogin,
    handleInspectorLogin,
    handleMerchantLogin,
    handleRegisterMerchant,
    inspectors,
    merchants,
    handleSearchCertificate,
    showToast,
    language,
    t
  } = useApp();

  const [certInput, setCertInput] = useState('');

  // Active Login Modal State: null | 'shop-owner' | 'inspector' | 'admin'
  const [activeModal, setActiveModal] = useState(null);

  // Shop Owner Modal Sub-Tab: 'login' | 'register'
  const [shopTab, setShopTab] = useState('login');

  // Form States (Empty by default)
  const [adminForm, setAdminForm] = useState({
    email: '',
    password: ''
  });

  const [inspectorForm, setInspectorForm] = useState({
    email: '',
    password: ''
  });

  const [merchantLoginForm, setMerchantLoginForm] = useState({
    email: '',
    password: ''
  });

  const [newStoreForm, setNewStoreForm] = useState({
    name: '',
    ownerName: '',
    email: '',
    password: '',
    zone: 'Ward 4 (Commercial Circle)',
    phone: '',
    tradeLicense: '',
    address: '',
    registeredScales: 1
  });

  const handleSearch = (e) => {
    e.preventDefault();
    if (certInput.trim()) {
      handleSearchCertificate(certInput);
    } else {
      showToast('Please enter a certificate number to search', 'error');
    }
  };

  const submitAdminLogin = (e) => {
    e.preventDefault();
    if (handleAdminLogin(adminForm.email, adminForm.password)) {
      setActiveModal(null);
    }
  };

  const submitInspectorLogin = (e) => {
    e.preventDefault();
    if (handleInspectorLogin(inspectorForm.email, inspectorForm.password)) {
      setActiveModal(null);
    }
  };

  const submitMerchantLogin = (e) => {
    e.preventDefault();
    if (handleMerchantLogin(merchantLoginForm.email, merchantLoginForm.password)) {
      setActiveModal(null);
    }
  };

  const submitMerchantRegistration = (e) => {
    e.preventDefault();
    if (!newStoreForm.name.trim() || !newStoreForm.ownerName.trim()) {
      showToast('Please provide store name and merchant owner name', 'error');
      return;
    }
    handleRegisterMerchant(newStoreForm);
    setActiveModal(null);
  };

  return (
    <div className="bg-[#F9FAFB] text-gray-900 antialiased min-h-screen flex flex-col selection:bg-[#E7F0E8] selection:text-[#023625]">
      {/* Main Canvas */}
      <main className="flex-grow flex flex-col w-full max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <section className="w-full py-8 sm:py-12 md:py-16 bg-gradient-to-b from-[#F6F2E9] to-[#E7F0E8] rounded-3xl border border-[#DADDD3] my-4 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Hero Text & Controls */}
            <div className="lg:col-span-7 flex flex-col items-start pr-0 lg:pr-6">
              {/* Authority Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF8F4] border border-[#DADDD3] text-[#023625] mb-4">
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                  account_balance
                </span>
                <span className="text-[11px] sm:text-xs uppercase tracking-wide font-bold">
                  {t('hero.badge', 'Government of India • Ministry of Consumer Affairs • Legal Metrology')}
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl text-[#023625] font-bold tracking-tight text-balance leading-tight mb-3">
                {t('hero.title', 'Digital Metrology')}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mb-6 leading-relaxed">
                {t('hero.subtitle', 'An integrated digital platform for weighing and measuring instrument verification under Legal Metrology regulations. Businesses can register instruments and submit verification requests, authorized officers can conduct and record field inspections, and digital certificates with QR authentication enable transparent verification and complete lifecycle tracking.')}
              </p>

              {/* Public Certificate Verification Search Widget */}
              <div className="w-full max-w-xl bg-white border border-[#DADDD3] rounded-2xl p-4 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-1">
                  <label className="text-xs sm:text-sm text-[#023625] font-bold flex items-center gap-1.5" htmlFor="cert-search-input">
                    <span className="material-symbols-outlined text-[#023625] text-base">fact_check</span>
                    <span>{t('hero.searchLabel', 'Verify Shop Calibration Certificate (Public)')}</span>
                  </label>
                  <span className="text-[11px] text-gray-500 font-mono">e.g. KA-2024-LM-9921</span>
                </div>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                      <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
                    </span>
                    <input
                      id="cert-search-input"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl text-gray-900 text-xs sm:text-sm pl-10 pr-3 py-2.5 focus:border-[#023625] outline-none transition-all placeholder:text-gray-400"
                      placeholder={t('hero.searchPlaceholder', 'Enter Certificate ID or Shop Name...')}
                      type="text"
                    />
                  </div>
                  <button
                    className="bg-[#023625] hover:bg-[#1b4a36] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-base">search</span>
                    <span>{t('hero.verifyBtn', 'Verify')}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Hero Graphic Card */}
            <div className="lg:col-span-5 flex justify-center items-center relative">
              <div className="w-full max-w-md aspect-square bg-white rounded-2xl border-2 border-[#DADDD3] p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
                {/* Graphic Header */}
                <div className="flex justify-between items-center pb-3 border-b border-[#DADDD3]">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#023625] text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      balance
                    </span>
                    <span className="text-xs font-bold text-[#023625]">Directorate Benchmark</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#E7F0E8] text-[#023625] text-[10px] font-bold">STATE SEAL</span>
                </div>

                {/* Scales Diagram */}
                <div className="py-4 flex flex-col items-center justify-center text-center my-auto">
                  <div className="relative flex items-center justify-center mb-3">
                    <div className="w-20 h-20 rounded-full bg-[#E7F0E8] flex items-center justify-center border border-[#c3ecd5]">
                      <span className="material-symbols-outlined text-4xl text-[#023625]">scale</span>
                    </div>
                    <div className="absolute -top-1 -right-3 bg-white border border-[#DADDD3] px-2 py-0.5 rounded-md shadow-xs">
                      <span className="text-[11px] text-[#023625] font-mono font-bold">Δ ≤ 0.001g</span>
                    </div>
                    <div className="absolute -bottom-1 -left-3 bg-white border border-[#DADDD3] px-2 py-0.5 rounded-md shadow-xs">
                      <span className="text-[11px] text-[#E0702A] font-bold">Class II / III</span>
                    </div>
                  </div>
                  <h3 className="text-base text-gray-900 font-bold mb-1">Authentic Legal Stamping</h3>
                  <p className="text-xs text-gray-500 max-w-xs">
                    Encrypted cryptographic metadata embedded in physical &amp; digital metrological verifications.
                  </p>
                </div>

                {/* Certified Indicator Bar (Static Informational Trust Badge) */}
                <div className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-3 flex items-center justify-between shadow-xs select-none">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#023625]">qr_code_2</span>
                    <div className="text-left">
                      <p className="text-xs font-bold text-gray-900 leading-none">Instant QR Validation</p>
                      <p className="text-[11px] text-gray-500 leading-tight mt-0.5">National Metrology Registry 2025</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#2E7D32]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Dedicated Stakeholder Access Cards (Kept Intact) */}
        <section id="login-section" className="w-full py-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E0702A] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {t('portals.tag', 'Stakeholder Portals')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#023625] tracking-tight">
              {t('portals.title', 'Access Your Stakeholder Portal')}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {t('portals.subtitle', 'Choose your role below to log in or create a new store account:')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Shop Owner / Merchant */}
            <div className="bg-white border-2 border-[#DADDD3] hover:border-[#E0702A] rounded-2xl p-6 flex flex-col justify-between shadow-xs transition-all group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-[#E0702A] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-2xl">storefront</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                        {t('portals.merchant.tag', 'Merchant Access')}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mt-1">
                        {t('portals.merchant.title', 'Shop Owner / Merchant')}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {t('portals.merchant.desc', 'For Kirana stores, supermarkets, jewelers & traders. Self-register your store, book calibration slots & print certificates.')}
                </p>

                <div className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-3 mb-4 space-y-1.5 text-xs text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#E0702A]">check_circle</span>
                    <span>{t('portals.merchant.f1', 'Self-registration for new stores')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#E0702A]">check_circle</span>
                    <span>{t('portals.merchant.f2', 'Scale expiry countdown (28d due)')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#E0702A]">check_circle</span>
                    <span>{t('portals.merchant.f3', 'Book on-site inspector visit (₹150 fee)')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShopTab('login');
                    setActiveModal('shop-owner');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#E0702A] hover:bg-[#c95f1f] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">login</span>
                  <span>{t('portals.merchant.signIn', 'Sign In')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShopTab('register');
                    setActiveModal('shop-owner');
                  }}
                  className="py-2.5 px-3 rounded-xl bg-[#FAF8F4] hover:bg-gray-100 border border-[#DADDD3] text-[#023625] font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  <span>{t('portals.merchant.signUp', 'Sign Up')}</span>
                </button>
              </div>
            </div>

            {/* Card 2: Field Metrology Inspector */}
            <div className="bg-white border-2 border-[#DADDD3] hover:border-[#023625] rounded-2xl p-6 flex flex-col justify-between shadow-xs transition-all group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E7F0E8] border border-[#c3ecd5] text-[#023625] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-2xl">badge</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E7F0E8] text-[#023625] border border-[#c3ecd5]">
                        {t('portals.inspector.tag', 'Officer Access')}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mt-1">
                        {t('portals.inspector.title', 'Field Metrology Inspector')}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {t('portals.inspector.desc', 'Government Legal Metrology Verification Officers. Access daily inspection routes, calibration checklists & issue certificates.')}
                </p>

                <div className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-3 mb-4 space-y-1.5 text-xs text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#023625]">verified_user</span>
                    <span>{t('portals.inspector.f1', 'Admin-Provisioned credentials only')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#023625]">check_circle</span>
                    <span>{t('portals.inspector.f2', 'Daily inspection route queue')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#023625]">check_circle</span>
                    <span>{t('portals.inspector.f3', '4-point MPE calibration & hologram')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal('inspector')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#023625] hover:bg-[#1b4a36] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>{t('portals.inspector.login', 'Inspector Login →')}</span>
              </button>
            </div>

            {/* Card 3: Department Admin / Controller */}
            <div className="bg-white border-2 border-[#DADDD3] hover:border-[#1f4d3a] rounded-2xl p-6 flex flex-col justify-between shadow-xs transition-all group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#E7F0E8] border border-[#c3ecd5] text-[#023625] flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-2xl">shield_person</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E7F0E8] text-[#023625] border border-[#c3ecd5]">
                        {t('portals.admin.tag', 'Department Control')}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mt-1">
                        {t('portals.admin.title', 'Department Admin')}
                      </h3>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                  {t('portals.admin.desc', 'State Controllers & District Legal Metrology Admin. Provision officer badges, audit verification ledger & monitor zone compliance.')}
                </p>

                <div className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-3 mb-4 space-y-1.5 text-xs text-gray-700">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#023625]">verified_user</span>
                    <span>{t('portals.admin.f1', 'Provision & manage inspector accounts')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#023625]">check_circle</span>
                    <span>{t('portals.admin.f2', 'State-wide verification operations')}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#023625]">check_circle</span>
                    <span>{t('portals.admin.f3', 'Audit trail & compliance reporting')}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveModal('admin')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#1f4d3a] hover:bg-[#023625] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm text-[#bceed3]">login</span>
                <span>{t('portals.admin.login', 'Admin Login →')}</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* OFFICIAL GOVERNMENT MATTER & STATUTORY INFORMATION SECTIONS */}
        {/* ========================================================================= */}

        {/* Section 1: Statutory Framework & Legal Acts */}
        <section className="w-full py-8 border-t border-[#DADDD3]">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F0E8] text-[#023625] border border-[#c3ecd5] text-[11px] font-bold mb-2">
              <span className="material-symbols-outlined text-xs">gavel</span>
              <span>STATUTORY ACTS &amp; REGULATIONS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#023625] tracking-tight">
              Legal Metrology Regulatory Framework
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl">
              All commercial weighing and measuring instruments in trade and commerce are governed under the following Central Acts and State Enforcement Rules:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white border border-[#DADDD3] rounded-2xl p-5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#E7F0E8] text-[#023625] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-lg">menu_book</span>
              </div>
              <h3 className="text-sm font-bold text-[#023625] mb-1">
                The Legal Metrology Act, 2009 (Act 1 of 2010)
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mandates uniform metric standards across India. Sections 24 and 30 require compulsory verification of any weight or measure before use in commercial trade.
              </p>
            </div>

            <div className="bg-white border border-[#DADDD3] rounded-2xl p-5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#FAF8F4] text-[#E0702A] border border-amber-200 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-lg">description</span>
              </div>
              <h3 className="text-sm font-bold text-[#023625] mb-1">
                Legal Metrology (General) Rules, 2011
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Governs Maximum Permissible Error (MPE) thresholds, calibration test weight tolerances, Rule 14 verification certificates (Form XVII), and lead seal stamping specifications.
              </p>
            </div>

            <div className="bg-white border border-[#DADDD3] rounded-2xl p-5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#E7F0E8] text-[#023625] flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-lg">inventory_2</span>
              </div>
              <h3 className="text-sm font-bold text-[#023625] mb-1">
                Packaged Commodities Rules, 2011
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mandatory declarations on pre-packed goods: Net quantity, Maximum Retail Price (MRP inclusive of all taxes), manufacturing date, and customer grievance contact.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Statutory Verification Procedure & Quality Standards */}
        <section className="w-full py-8 border-t border-[#DADDD3]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F4] text-[#E0702A] border border-amber-200 text-[11px] font-bold mb-2">
                <span className="material-symbols-outlined text-xs">verified</span>
                <span>OFFICIAL AUDIT PROTOCOL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#023625] tracking-tight mb-3">
                Mandatory 4-Point Calibration &amp; Verification Protocol
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                Government Legal Metrology Officers perform rigorous on-site standard testing on all commercial weighing instruments using working standards calibrated against National Physical Laboratory (NPL) primary benchmarks:
              </p>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#DADDD3]">
                  <span className="w-6 h-6 rounded-full bg-[#E7F0E8] text-[#023625] font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="text-gray-900 block">Zero Load &amp; Tare Accuracy Test</strong>
                    <span className="text-gray-600">Verification of scale returning to true zero without deadload drift or electronic hysteresis.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#DADDD3]">
                  <span className="w-6 h-6 rounded-full bg-[#E7F0E8] text-[#023625] font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="text-gray-900 block">Eccentricity (Corner Load) Test</strong>
                    <span className="text-gray-600">Application of 1/3 maximum capacity at center and 4 quadrant corners to detect load-cell distortion.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#DADDD3]">
                  <span className="w-6 h-6 rounded-full bg-[#E7F0E8] text-[#023625] font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="text-gray-900 block">Linearity &amp; Maximum Permissible Error (MPE)</strong>
                    <span className="text-gray-600">Ascending and descending standard weight increments ensuring measurement within ±1e tolerance.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#DADDD3]">
                  <span className="w-6 h-6 rounded-full bg-[#FAF8F4] text-[#E0702A] border border-amber-300 font-bold flex items-center justify-center shrink-0">4</span>
                  <div>
                    <strong className="text-gray-900 block">Physical Wire-Seal &amp; QR Certificate Stamping</strong>
                    <span className="text-gray-600">Affixing tamper-proof lead wire seal with inspector code and issuance of Form XVII Certificate.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-white border border-[#DADDD3] rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-bold text-[#023625] pb-3 border-b border-[#DADDD3] flex items-center gap-2">
                <span className="material-symbols-outlined text-base">receipt_long</span>
                <span>Official Statutory Fee Schedule (Rule 14 • Form XVII)</span>
              </h3>
              
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-gray-500 font-bold uppercase text-[10px] border-b border-[#DADDD3]">
                      <th className="py-2">Instrument Category</th>
                      <th className="py-2">Capacity Range</th>
                      <th className="py-2">Verification Validity</th>
                      <th className="py-2 text-right">Statutory Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-800">
                    <tr>
                      <td className="py-2.5 font-medium">Counter Scale (Class III)</td>
                      <td className="py-2.5 text-gray-600">Up to 50 kg</td>
                      <td className="py-2.5">12 Months (Annual)</td>
                      <td className="py-2.5 text-right font-bold text-[#023625]">₹150.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Platform Weighing Scale</td>
                      <td className="py-2.5 text-gray-600">50 kg to 500 kg</td>
                      <td className="py-2.5">12 Months (Annual)</td>
                      <td className="py-2.5 text-right font-bold text-[#023625]">₹350.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Jewellery Precision Balance (Class II)</td>
                      <td className="py-2.5 text-gray-600">0.001g to 600g</td>
                      <td className="py-2.5">12 Months (Annual)</td>
                      <td className="py-2.5 text-right font-bold text-[#023625]">₹500.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Weighbridge (Commercial)</td>
                      <td className="py-2.5 text-gray-600">10 Tonne to 100 Tonne</td>
                      <td className="py-2.5">12 Months (Annual)</td>
                      <td className="py-2.5 text-right font-bold text-[#023625]">₹2,500.00</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium">Standard Cast Iron Weights (Set)</td>
                      <td className="py-2.5 text-gray-600">50g to 20kg (Class M1)</td>
                      <td className="py-2.5">24 Months (Biennial)</td>
                      <td className="py-2.5 text-right font-bold text-[#023625]">₹100.00 / set</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-gray-500 mt-3 italic">
                * Fees fixed as per Official Gazette Notification under Legal Metrology Act, 2009. Payable directly through on-site UPI or Treasury Challan.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Consumer Protection Rights & Public Awareness */}
        <section className="w-full py-8 border-t border-[#DADDD3]">
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F0E8] text-[#023625] border border-[#c3ecd5] text-[11px] font-bold mb-2">
              <span className="material-symbols-outlined text-xs">shield</span>
              <span>CITIZEN CHARTER &amp; CONSUMER RIGHTS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#023625] tracking-tight">
              Consumer Guidelines &amp; Fair Trade Protection
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl">
              Every consumer has the statutory right to accurate weight and measure in commercial transactions. Follow these public guidelines when purchasing goods:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#DADDD3] text-[#023625] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-base">pin</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Look for the Wire Seal</h4>
              <p className="text-gray-600 leading-relaxed">
                Ensure every commercial scale has an intact government lead wire seal with current inspection year markings.
              </p>
            </div>

            <div className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#DADDD3] text-[#023625] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-base">exposure_zero</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Verify Net Weight &amp; Tare</h4>
              <p className="text-gray-600 leading-relaxed">
                Ensure electronic counter displays indicate true zero ("0.000 kg") before placing commodities on the pan.
              </p>
            </div>

            <div className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#DADDD3] text-[#023625] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-base">qr_code</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Scan Form XVII QR Code</h4>
              <p className="text-gray-600 leading-relaxed">
                Shopkeepers must display the green Form XVII certificate. Scan the official QR code to verify validity.
              </p>
            </div>

            <div className="bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#DADDD3] text-[#E0702A] flex items-center justify-center mb-2.5">
                <span className="material-symbols-outlined text-base">support_agent</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-1">Report Short Weight</h4>
              <p className="text-gray-600 leading-relaxed">
                Report non-compliant merchants or broken seals via the National Consumer Toll-Free Helpline at 1915.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Public Grievance Helpline & Department Contact */}
        <section className="w-full py-8 border-t border-[#DADDD3]">
          <div className="bg-gradient-to-r from-[#023625] to-[#1f4d3a] text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#bceed3] text-[11px] font-bold mb-2">
                <span className="material-symbols-outlined text-xs">contact_support</span>
                <span>NATIONAL METROLOGY HELPDESK</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold tracking-tight">
                Directorate of Legal Metrology • Public Support &amp; Grievances
              </h3>
              <p className="text-xs sm:text-sm text-[#c3ecd5] max-w-2xl mt-1 leading-relaxed">
                For commercial scale registration assistance, license verification, or to file a short-weight complaint under Legal Metrology Act 2009:
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#E0702A]">call</span>
                  <span>Toll-Free Helpline: 1915 / 1800-11-4000</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#E0702A]">mail</span>
                  <span>support-metrology@gov.in</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#E0702A]">schedule</span>
                  <span>Mon – Sat: 09:30 AM – 06:00 PM</span>
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* AUTHENTICATION MODALS */}
      {/* ========================================================================= */}

      {/* 1. ADMIN LOGIN MODAL */}
      {activeModal === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DADDD3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DADDD3]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#E7F0E8] text-[#023625] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">shield_person</span>
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#023625]">Department Admin Login</h3>
                  <p className="text-[11px] text-gray-500">Legal Metrology State Controller</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={submitAdminLogin} className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Admin Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="admin123@metrx.com"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-[#DADDD3] rounded-xl text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#023625] hover:bg-[#1b4a36] text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  Log In to Command Center
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. INSPECTOR LOGIN MODAL (Only Admin-Provisioned Credentials) */}
      {activeModal === 'inspector' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#DADDD3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DADDD3]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#E7F0E8] text-[#023625] flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">badge</span>
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#023625]">Field Inspector Login</h3>
                  <p className="text-[11px] text-gray-500">Authorized Government Verification Officers</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={submitInspectorLogin} className="space-y-3.5 text-xs mt-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Authorized Official Email</label>
                <input
                  type="email"
                  required
                  placeholder="insp123@metrx.com"
                  value={inspectorForm.email}
                  onChange={(e) => setInspectorForm({ ...inspectorForm, email: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={inspectorForm.password}
                  onChange={(e) => setInspectorForm({ ...inspectorForm, password: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 border border-[#DADDD3] rounded-xl text-gray-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#023625] hover:bg-[#1b4a36] text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  Log In as Inspector
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SHOP OWNER LOGIN & SELF-REGISTRATION MODAL */}
      {activeModal === 'shop-owner' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#DADDD3] max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-[#DADDD3]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-50 text-[#E0702A] flex items-center justify-center border border-amber-200">
                  <span className="material-symbols-outlined text-lg">storefront</span>
                </span>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Shop Owner / Merchant Portal</h3>
                  <p className="text-[11px] text-gray-500">Commercial Weighing Scale Compliance</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            {/* Sub-tabs: Sign In vs Sign Up */}
            <div className="flex items-center rounded-xl bg-gray-100 p-1 my-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setShopTab('login')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  shopTab === 'login' ? 'bg-white text-[#023625] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-sm">login</span>
                <span>Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => setShopTab('register')}
                className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  shopTab === 'register' ? 'bg-white text-[#E0702A] shadow-xs' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                <span>Sign Up (New Store)</span>
              </button>
            </div>

            {/* TAB: SIGN IN */}
            {shopTab === 'login' && (
              <div>
                <form onSubmit={submitMerchantLogin} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Merchant Email ID</label>
                    <input
                      type="email"
                      required
                      placeholder="store@domain.com"
                      value={merchantLoginForm.email}
                      onChange={(e) => setMerchantLoginForm({ ...merchantLoginForm, email: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={merchantLoginForm.password}
                      onChange={(e) => setMerchantLoginForm({ ...merchantLoginForm, password: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShopTab('register')}
                      className="text-xs text-[#E0702A] hover:underline font-semibold"
                    >
                      New store? Sign Up here
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveModal(null)}
                        className="px-4 py-2 border border-[#DADDD3] rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#E0702A] hover:bg-[#c95f1f] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: SIGN UP (Becomes visible in Admin) */}
            {shopTab === 'register' && (
              <form onSubmit={submitMerchantRegistration} className="space-y-3 text-xs">
                <div className="bg-[#FAF8F4] border border-amber-200 rounded-xl p-2.5 text-xs text-[#023625] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-[#E0702A]">storefront</span>
                  <span>Create your store account. It will immediately appear in the Department Admin directory.</span>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Store / Establishment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahalakshmi Provision Store"
                    value={newStoreForm.name}
                    onChange={(e) => setNewStoreForm({ ...newStoreForm, name: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Owner Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S. Ramesh"
                      value={newStoreForm.ownerName}
                      onChange={(e) => setNewStoreForm({ ...newStoreForm, ownerName: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      placeholder="+91 98450 11223"
                      value={newStoreForm.phone}
                      onChange={(e) => setNewStoreForm({ ...newStoreForm, phone: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Email (For Login) *</label>
                    <input
                      type="email"
                      required
                      placeholder="store@domain.com"
                      value={newStoreForm.email}
                      onChange={(e) => setNewStoreForm({ ...newStoreForm, email: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={newStoreForm.password}
                      onChange={(e) => setNewStoreForm({ ...newStoreForm, password: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Jurisdiction Zone</label>
                    <select
                      value={newStoreForm.zone}
                      onChange={(e) => setNewStoreForm({ ...newStoreForm, zone: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                    >
                      <option value="Ward 4 (Commercial Circle)">Ward 4 (Commercial Circle)</option>
                      <option value="Ward 2 (Commercial Ganj)">Ward 2 (Commercial Ganj)</option>
                      <option value="Ward 1 (APMC Yard)">Ward 1 (APMC Yard)</option>
                      <option value="Zone 5 (Outer Ring Road)">Zone 5 (Outer Ring Road)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">No. of Weighing Scales</label>
                    <input
                      type="number"
                      min="1"
                      value={newStoreForm.registeredScales}
                      onChange={(e) => setNewStoreForm({ ...newStoreForm, registeredScales: e.target.value })}
                      className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setShopTab('login')}
                    className="text-xs text-[#023625] hover:underline font-semibold"
                  >
                    Already registered? Sign In
                  </button>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="flex-1 sm:flex-initial px-4 py-2 border border-[#DADDD3] rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-initial px-5 py-2 bg-[#E0702A] hover:bg-[#c95f1f] text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      Sign Up &amp; Register Store
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-white border-t border-[#DADDD3] py-4 px-4 sm:px-8 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-gray-500 text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-[#023625]">security</span>
            <span>© 2025 Directorate of Legal Metrology, Government of Karnataka.</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => showToast('Privacy Policy: Digital Personal Data Protection Act 2023 Compliant', 'info')} className="hover:underline">
              Privacy Policy
            </button>
            <button onClick={() => showToast('Terms: Official Form XVII Standard Compliance', 'info')} className="hover:underline">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
