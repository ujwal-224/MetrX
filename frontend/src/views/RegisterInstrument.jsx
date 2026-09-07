import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RegisterInstrument = () => {
  const { navigateTo, storeInfo, handleRegisterInstrument, showToast } = useApp();

  const [instrumentType, setInstrumentType] = useState('counter_scale');
  const [serialNumber, setSerialNumber] = useState('');
  const [capacity, setCapacity] = useState('');
  const [modelName, setModelName] = useState('');
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
      photoUrl: photoPreview
    });
  };

  return (
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 min-h-screen">
      <div className="w-full max-w-2xl mx-auto flex flex-col">
        {/* Back / Breadcrumb Navigation */}
        <div className="mb-unit-4">
          <button
            onClick={() => navigateTo('shop-dashboard')}
            className="inline-flex items-center gap-unit-1 text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to {storeInfo.name}</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="border-b border-outline-variant/50 pb-unit-6 mb-unit-8">
          <div className="flex items-center gap-unit-2 mb-unit-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">edit_document</span>
              Standard Verification Scheme
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight">
            Register New Instrument
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-unit-1">
            Add your shop weighing or measuring device for government calibration certification.
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
          </div>

          {/* Legal Disclaimer & Note */}
          <div className="bg-surface-container-low border-l-2 border-secondary p-unit-3 rounded-r-lg flex items-start gap-unit-3">
            <span className="material-symbols-outlined text-secondary text-lg mt-0.5">verified_user</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Under Section 24 of the Legal Metrology Act, 2009, all commercial instruments must undergo physical stamping by an accredited inspector within 30 days of registration.
            </p>
          </div>

          {/* Element 4: Actions */}
          <div className="pt-4 border-t border-outline-variant/40 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={() => navigateTo('shop-dashboard')}
              type="button"
              className="text-center py-2.5 px-4 text-outline hover:text-on-surface transition-colors font-medium text-xs sm:text-sm"
            >
              Cancel
            </button>
            <button
              className="bg-[#E0702A] hover:bg-[#c96222] active:translate-y-0.5 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all duration-150"
              type="submit"
            >
              <span className="material-symbols-outlined text-lg">save</span>
              <span>Save Instrument</span>
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
