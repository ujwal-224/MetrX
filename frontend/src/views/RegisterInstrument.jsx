import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RegisterInstrument = () => {
  const { navigateTo, storeInfo, handleRegisterInstrument, showToast } = useApp();

  const [instrumentType, setInstrumentType] = useState('counter_scale');
  const [serialNumber, setSerialNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [modelName, setModelName] = useState('');
  const [verificationMode, setVerificationMode] = useState('Field / In-Situ');
  const [isRepairedOrModified, setIsRepairedOrModified] = useState(false);
  const [repairDetails, setRepairDetails] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      showToast(`Attached plate photo: ${file.name}`, 'info');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!serialNumber.trim()) {
      showToast('Please enter the Serial Number / Model ID from the plate', 'error');
      return;
    }

    let typeTitle = 'Electronic Counter Scale';
    if (instrumentType === 'platform_machine') typeTitle = 'Platform Weighing Machine';
    if (instrumentType === 'beam_scale') typeTitle = 'Beam Scale / Conical Weights';

    handleRegisterInstrument({
      name: typeTitle,
      type: instrumentType,
      model: modelName.trim() || (instrumentType === 'counter_scale' ? 'Digital Scale series' : 'Commercial Series'),
      serialNumber: serialNumber.trim(),
      capacity: capacity.trim() || '30 kg / 1g precision',
      verificationMode,
      isRepairedOrModified,
      repairDetails: isRepairedOrModified ? repairDetails.trim() : null,
      photoUrl: photoPreview
    });
  };

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 min-h-screen">
      <div className="w-full max-w-2xl mx-auto flex flex-col">
        {/* Back / Breadcrumb Navigation */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2 flex-wrap">
          <button
            onClick={() => navigateTo('shop-dashboard')}
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to {storeInfo.name}</span>
          </button>

          <span className="text-[11px] font-bold text-[#023625] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">looks_one</span>
            <span>Step 1 of 2: Scale Registration</span>
          </span>
        </div>

        {/* WORKFLOW STEPPER BAR */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-5 sm:mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[11px] uppercase font-bold tracking-wider text-gray-500">
              Establishment Certification Workflow
            </span>
            <span className="text-xs font-bold font-mono text-[#023625]">
              Step 1 Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Step 1: Add Scale (ACTIVE) */}
            <div className="p-3 rounded-xl border-2 border-[#023625] bg-[#023625]/5 text-[#023625] flex items-center gap-3 ring-2 ring-[#023625]/20 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#023625] text-white flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">scale</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  Step 1 • Current
                </span>
                <span className="text-xs font-extrabold block truncate">
                  Register Scale
                </span>
              </div>
            </div>

            {/* Step 2: Upload Documents */}
            <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 flex items-center gap-3 opacity-75">
              <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">lock</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  Step 2 • Next
                </span>
                <span className="text-xs font-extrabold block truncate">
                  Upload Documents
                </span>
              </div>
            </div>

            {/* Step 3: Verification Visit */}
            <div className="p-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 flex items-center gap-3 opacity-75">
              <div className="w-8 h-8 rounded-lg bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-base">lock</span>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  Step 3 • Final
                </span>
                <span className="text-xs font-extrabold block truncate">
                  Inspector Stamping
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PREREQUISITE INFO NOTICE */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs mb-5 sm:mb-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-2xl">scale</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 block">
              Prerequisite For Statutory Document Verification (Rule 14)
            </span>
            <h3 className="text-sm font-bold text-amber-950 mt-0.5">
              Register Physical Commercial Weighing Scale
            </h3>
            <p className="text-xs text-amber-900 mt-1 leading-relaxed">
              Under Legal Metrology regulations, statutory compliance documents (purchase bill, serial nameplate photograph, and counter view) are verified against your registered scale details. Once you save this scale, you will automatically proceed to <strong>Step 2 (Upload Documents)</strong>.
            </p>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b border-gray-200 pb-4 sm:pb-5 mb-5 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            Register Weighing &amp; Measuring Instrument
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Provide the physical scale specification matching the government-approved maker plate.
          </p>
        </div>

        {/* Form Card Container */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface-container-lowest border border-outline-variant/80 rounded-xl p-unit-6 md:p-unit-8 shadow-sm space-y-unit-8"
        >
          {/* Element 1: Instrument Type Selector */}
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface mb-unit-1 font-semibold">
              Select Instrument Type <span className="text-error">*</span>
            </label>
            <p className="font-body-sm text-body-sm text-outline mb-unit-4">
              Choose the physical category matching the stamped maker plate.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-unit-4" id="instrument-type-group">
              {/* Card 1 */}
              <label
                onClick={() => setInstrumentType('counter_scale')}
                className={`relative flex flex-col items-center justify-center p-unit-4 rounded-lg cursor-pointer text-center group transition-all duration-150 ${
                  instrumentType === 'counter_scale'
                    ? 'border-2 border-primary bg-surface-container-low'
                    : 'border border-outline-variant bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low'
                }`}
              >
                <input
                  checked={instrumentType === 'counter_scale'}
                  onChange={() => setInstrumentType('counter_scale')}
                  className="sr-only"
                  name="instrument_type"
                  type="radio"
                  value="counter_scale"
                />
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-unit-2 ${
                    instrumentType === 'counter_scale'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    scale
                  </span>
                </div>
                <span className={`font-label-lg text-label-lg font-bold leading-snug ${instrumentType === 'counter_scale' ? 'text-primary' : 'text-on-surface'}`}>
                  Electronic Counter Scale
                </span>
                <span className="font-body-sm text-body-sm text-outline mt-unit-1">
                  Digital load-cell display
                </span>
                {instrumentType === 'counter_scale' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  </div>
                )}
              </label>

              {/* Card 2 */}
              <label
                onClick={() => setInstrumentType('platform_machine')}
                className={`relative flex flex-col items-center justify-center p-unit-4 rounded-lg cursor-pointer text-center group transition-all duration-150 ${
                  instrumentType === 'platform_machine'
                    ? 'border-2 border-primary bg-surface-container-low'
                    : 'border border-outline-variant bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low'
                }`}
              >
                <input
                  checked={instrumentType === 'platform_machine'}
                  onChange={() => setInstrumentType('platform_machine')}
                  className="sr-only"
                  name="instrument_type"
                  type="radio"
                  value="platform_machine"
                />
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-unit-2 ${
                    instrumentType === 'platform_machine'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant group-hover:bg-surface-dim'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">view_in_ar</span>
                </div>
                <span className={`font-label-lg text-label-lg font-semibold leading-snug ${instrumentType === 'platform_machine' ? 'text-primary font-bold' : 'text-on-surface'}`}>
                  Platform Weighing Machine
                </span>
                <span className="font-body-sm text-body-sm text-outline mt-unit-1">
                  Heavy bulk or floor deck
                </span>
                {instrumentType === 'platform_machine' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  </div>
                )}
              </label>

              {/* Card 3 */}
              <label
                onClick={() => setInstrumentType('beam_scale')}
                className={`relative flex flex-col items-center justify-center p-unit-4 rounded-lg cursor-pointer text-center group transition-all duration-150 ${
                  instrumentType === 'beam_scale'
                    ? 'border-2 border-primary bg-surface-container-low'
                    : 'border border-outline-variant bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low'
                }`}
              >
                <input
                  checked={instrumentType === 'beam_scale'}
                  onChange={() => setInstrumentType('beam_scale')}
                  className="sr-only"
                  name="instrument_type"
                  type="radio"
                  value="beam_scale"
                />
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-unit-2 ${
                    instrumentType === 'beam_scale'
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-high text-on-surface-variant group-hover:bg-surface-dim'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">balance</span>
                </div>
                <span className={`font-label-lg text-label-lg font-semibold leading-snug ${instrumentType === 'beam_scale' ? 'text-primary font-bold' : 'text-on-surface'}`}>
                  Beam Scale / Weights
                </span>
                <span className="font-body-sm text-body-sm text-outline mt-unit-1">
                  Traditional brass/iron sets
                </span>
                {instrumentType === 'beam_scale' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Element 2: Photo-Upload Control */}
          <div>
            <label className="block font-label-lg text-label-lg text-on-surface mb-unit-1 font-semibold">
              Maker Stamping &amp; Serial Plate Photo <span className="text-error">*</span>
            </label>
            <p className="font-body-sm text-body-sm text-outline mb-unit-3">
              Clear photo showing the legal embossing, lead wire seal, and model stamping plate.
            </p>

            <label className="border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low/50 hover:bg-surface-container-low rounded-xl p-unit-6 md:p-unit-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group relative">
              <input type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
              {photoPreview ? (
                <div className="flex flex-col items-center">
                  <img
                    src={photoPreview}
                    alt="Plate preview"
                    className="max-h-40 rounded-lg border border-primary object-contain mb-3"
                  />
                  <span className="text-xs font-semibold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Photo attached. Click to change.
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-surface-container-high group-hover:bg-primary/10 text-primary flex items-center justify-center mb-unit-3 transition-colors">
                    <span className="material-symbols-outlined text-2xl">photo_camera</span>
                  </div>
                  <p className="font-label-lg text-label-lg text-on-surface font-semibold mb-unit-1">
                    Upload Photo of Instrument Plate &amp; Serial Stamping
                  </p>
                  <p className="font-body-sm text-body-sm text-outline">
                    Drag and drop an image file here, or{' '}
                    <span className="text-primary font-semibold underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
                      browse from device
                    </span>
                  </p>
                  <span className="inline-flex items-center gap-unit-1 text-[11px] font-medium text-outline mt-unit-3 bg-surface-container px-unit-3 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Supports JPG, PNG, PDF up to 10 MB
                  </span>
                </>
              )}
            </label>
          </div>

          {/* Element 3: Form Fields */}
          <div className="space-y-unit-4 border-t border-outline-variant/40 pt-unit-6">
            {/* Shop Name (Read-only) */}
            <div>
              <div className="flex items-center justify-between mb-unit-1">
                <label className="block font-label-md text-label-md font-medium text-on-surface">
                  Shop Name &amp; Establishment Registry
                </label>
                <span className="text-xs text-outline flex items-center gap-1 font-body-sm">
                  <span className="material-symbols-outlined text-xs">lock</span> Verified Profile Record
                </span>
              </div>
              <div className="relative">
                <input
                  className="w-full h-10 px-unit-3 pl-10 bg-surface-container text-on-surface font-body-md border border-outline-variant/70 rounded-lg cursor-not-allowed select-none focus:outline-none"
                  readOnly
                  type="text"
                  value={`${storeInfo.name} (${storeInfo.regNumber})`}
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-base">
                  lock
                </span>
              </div>
            </div>

            {/* Model Name */}
            <div>
              <label className="block font-label-md text-label-md font-medium text-on-surface mb-unit-1">
                Maker &amp; Model Name
              </label>
              <input
                className="w-full h-10 px-unit-3 bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline/70"
                placeholder="e.g. Contech CA-30 or Avery 150kg"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                type="text"
              />
            </div>

            {/* Serial Number / Model ID */}
            <div>
              <label className="block font-label-md text-label-md font-medium text-on-surface mb-unit-1">
                Serial Number / Model ID <span className="text-error">*</span>
              </label>
              <input
                className="w-full h-10 px-unit-3 bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline/70 font-mono"
                placeholder="e.g. CON-30KG-2024-X"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
                type="text"
              />
              <p className="font-body-sm text-body-sm text-outline mt-unit-1">
                Found directly etched on the calibration sticker or metal casing.
              </p>
            </div>

            {/* Maximum Weighing Capacity */}
            <div>
              <label className="block font-label-md text-label-md font-medium text-on-surface mb-unit-1">
                Maximum Weighing Capacity <span className="text-error">*</span>
              </label>
              <div className="relative">
                <input
                  className="w-full h-10 px-unit-3 bg-surface-container-lowest text-on-surface font-body-md border border-outline-variant rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline/70"
                  placeholder="e.g. 30 kg / 1g precision"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  type="text"
                />
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-base">
                  straighten
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-outline mt-unit-1">
                Specify full scale range and smallest division interval as listed on the seal.
              </p>
            </div>

            {/* Verification Venue / Mode (Rule 8 & 10) */}
            <div className="pt-2">
              <label className="block font-label-md text-label-md font-semibold text-on-surface mb-1">
                Verification Venue / Mode (Rule 8 &amp; 10)
              </label>
              <p className="text-xs text-gray-500 mb-2.5">
                Select where the legal metrology verification stamping should be executed:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setVerificationMode('Field / In-Situ')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    verificationMode === 'Field / In-Situ'
                      ? 'border-[#023625] bg-[#E7F0E8] ring-1 ring-[#023625]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg mt-0.5 ${
                    verificationMode === 'Field / In-Situ' ? 'text-[#023625]' : 'text-gray-400'
                  }`}>
                    location_on
                  </span>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Field / In-Situ (On-Site)</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      Officer visits establishment premises to verify fixed or heavy equipment with GPS logging.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationMode('At Test Centre')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    verificationMode === 'At Test Centre'
                      ? 'border-[#023625] bg-[#E7F0E8] ring-1 ring-[#023625]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span className={`material-symbols-outlined text-lg mt-0.5 ${
                    verificationMode === 'At Test Centre' ? 'text-[#023625]' : 'text-gray-400'
                  }`}>
                    domain
                  </span>
                  <div>
                    <div className="text-xs font-bold text-gray-900">At Test Centre / Lab</div>
                    <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      Merchant brings portable scale to government testing laboratory or metrology bench.
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Instrument Condition & Repair History (Rule 7) */}
            <div className="pt-2 border-t border-gray-200/80">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isRepairedOrModified}
                  onChange={(e) => setIsRepairedOrModified(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-[#023625] focus:ring-[#023625] w-4 h-4"
                />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">
                    Instrument Repaired or Modified (Mandatory Re-Verification under Rule 7)
                  </span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    Check if this scale has had load-cells replaced, wire seals broken, or repairs executed.
                  </span>
                </div>
              </label>

              {isRepairedOrModified && (
                <div className="mt-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <span className="material-symbols-outlined text-sm text-amber-700">info</span>
                    <span>Statutory Re-Verification Trigger (Legal Metrology Rule 7)</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Under Rule 7 of Legal Metrology regulations, any weight or measure repaired or altered must undergo full re-verification against working standards prior to commercial trade deployment.
                  </p>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                      Service / Repair Details:
                    </label>
                    <input
                      type="text"
                      value={repairDetails}
                      onChange={(e) => setRepairDetails(e.target.value)}
                      placeholder="e.g. Load cell replacement, recalibration of zero offset, casing repair"
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legal Disclaimer & Note */}
          <div className="bg-surface-container-low border-l-2 border-secondary p-unit-3 rounded-r-lg flex items-start gap-unit-3">
            <span className="material-symbols-outlined text-secondary text-lg mt-0.5">verified_user</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Under Section 24 of the Legal Metrology Act, 2009, all commercial instruments must undergo physical stamping by an accredited inspector within 30 days of registration.
            </p>
          </div>

          {/* Element 4: Actions */}
          <div className="pt-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={() => navigateTo('shop-dashboard')}
              type="button"
              className="text-center py-2.5 px-4 text-gray-500 hover:text-gray-900 transition-colors font-medium text-xs sm:text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              className="bg-[#023625] hover:bg-[#1a4b38] active:translate-y-0.5 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              type="submit"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              <span>Save Scale &amp; Proceed to Upload Documents (Step 2)</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>
        </form>

        {/* Institutional Footer Sign-off */}
        <div className="text-center py-unit-8 text-body-sm font-body-sm text-outline">
          <span>Department of Consumer Affairs • Legal Metrology Digital Administration</span>
        </div>
      </div>
    </main>
  );
};
