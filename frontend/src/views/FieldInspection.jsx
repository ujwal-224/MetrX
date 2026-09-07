import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const FieldInspection = () => {
  const {
    navigateTo,
    checklist,
    toggleChecklistItem,
    handleCompleteInspection,
    storeInfo,
    activeInstrument,
    showToast
  } = useApp();

  const [notes, setNotes] = useState(
    'Instrument leveled correctly. Calibration weights (5kg, 10kg, 20kg) verified within permissible MPE limits. Holographic seal applied.'
  );
  const [photoEvidence, setPhotoEvidence] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = checklist.filter((c) => c.checked).length;
  const totalCount = checklist.length;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoEvidence(URL.createObjectURL(file));
      showToast(`Inspector photo recorded: ${file.name}`, 'info');
    }
  };

  const onSubmitForm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleCompleteInspection(notes);
    }, 600);
  };

  return (
    <main className="flex-1 w-full max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 min-h-screen">
      {/* Breadcrumb Bar */}
      <div className="max-w-2xl mx-auto mb-3 sm:mb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
          <button
            onClick={() => navigateTo('inspector-schedule')}
            className="hover:text-primary flex items-center gap-1 transition-colors font-medium"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Today's Inspection Queue</span>
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold">Step 4: Audit &amp; Stamping</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E7F0E8] text-[#2E7D32]">
            On-Site Active
          </span>
        </nav>
      </div>

      {/* Main Inspection Card Container */}
      <section className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm">
        {/* Header Zone */}
        <div className="pb-4 sm:pb-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
            <div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-[#E0702A] block">
                Inspector Terminal • On-Site Verification
              </span>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                {storeInfo.name}
              </h1>
              <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                Verifying Scale: <strong className="text-gray-800">{activeInstrument.name}</strong> •{' '}
                <span className="font-mono">{activeInstrument.serialNumber}</span>
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2 sm:p-2.5 text-center shrink-0 self-start sm:self-auto">
              <span className="block text-[9px] sm:text-[10px] uppercase font-bold text-gray-400">Accuracy</span>
              <span className="block text-xs sm:text-sm font-bold text-[#023625]">Class III (1g)</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form className="pt-6 flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onSubmitForm(); }}>
          {/* Section 1: Physical Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-primary">
                On-Site Compliance Checklist
              </h2>
              <span className="text-xs font-bold text-secondary bg-surface-container px-2.5 py-1 rounded-full border border-outline-variant/50">
                {completedCount} of {totalCount} Passed
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mb-4">
              Tick each physical test after verifying on the shop counter:
            </p>

            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklistItem(item.id)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${
                    item.checked
                      ? 'bg-[#F4F9F5] border border-[#C3ECD5]'
                      : 'bg-surface-container-lowest border border-outline-variant hover:border-outline'
                  }`}
                >
                  <input
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(item.id)}
                    className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-secondary-container border-outline cursor-pointer accent-primary shrink-0"
                    type="checkbox"
                  />
                  <div className="flex-1">
                    <span className="text-xs md:text-sm font-semibold text-on-surface block leading-snug">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-on-surface-variant mt-0.5 block leading-relaxed">
                      {item.desc}
                    </span>
                  </div>
                  <span
                    className={`material-symbols-outlined text-lg shrink-0 ${
                      item.checked ? 'text-[#2E7D32]' : 'text-outline-variant'
                    }`}
                    style={{ fontVariationSettings: item.checked ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.checked ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Photographic Verification Record */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-bold text-primary">
                Photo Evidence of Hologram Stamp
              </label>
              <span className="text-[11px] text-outline">Mandatory Audit Photo</span>
            </div>

            <label className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-5 text-center bg-surface-container-low transition-colors block cursor-pointer">
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="sr-only" />
              {photoEvidence ? (
                <div className="flex flex-col items-center">
                  <img
                    src={photoEvidence}
                    alt="Audit photo"
                    className="max-h-36 rounded-lg border border-primary object-contain mb-2"
                  />
                  <span className="text-xs font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Photo attached with GPS timestamp. Click to change.
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-primary mb-2 shadow-xs">
                    <span className="material-symbols-outlined text-xl">photo_camera</span>
                  </div>
                  <span className="text-xs font-bold text-on-surface">
                    Tap to Capture Photo of Scale &amp; Stamped Hologram
                  </span>
                  <span className="text-[11px] text-outline mt-0.5">
                    Ensures proof of on-site inspection for audit repository
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Section 3: Notes */}
          <div>
            <label className="block text-xs font-bold text-primary mb-1" htmlFor="notes-box">
              Inspector Observations &amp; Verification Remarks
            </label>
            <textarea
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 text-xs text-on-surface focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
              id="notes-box"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Section 4: Final Issue Action */}
          <div className="pt-4 border-t border-outline-variant flex flex-col items-center gap-3">
            <button
              onClick={onSubmitForm}
              disabled={isSubmitting}
              className="w-full bg-[#023625] hover:bg-[#1a4b38] text-white font-bold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
              type="button"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg sm:text-xl">progress_activity</span>
                  <span>Applying Hologram Stamp & Generating Form XVII Certificate...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg sm:text-xl text-emerald-300">verified</span>
                  <span>Inspection Successful • Issue Form XVII Certificate</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                showToast('Discrepancy notice flagged for merchant rectification.', 'error');
                navigateTo('inspector-schedule');
              }}
              className="text-error hover:underline text-xs flex items-center gap-1 font-semibold"
              type="button"
            >
              <span className="material-symbols-outlined text-sm">flag</span>
              <span>Flag Calibration Discrepancy / Reject</span>
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
