import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RequestVerification = () => {
  const {
    navigateTo,
    activeInstrument,
    storeInfo,
    selectedSlot,
    handleConfirmVerification
  } = useApp();

  const [slot, setSlot] = useState(selectedSlot || 'slot_1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleConfirmVerification(slot);
    }, 500);
  };

  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-3xl mx-auto px-0 sm:px-2 pt-2">
        {/* Breadcrumb / Back Link */}
        <div className="mb-unit-4 flex items-center gap-unit-2 text-on-surface-variant text-xs">
          <button
            onClick={() => navigateTo('shop-dashboard')}
            className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Dashboard</span>
          </button>
          <span>/</span>
          <span className="text-primary font-semibold">Step 2: Choose Inspection Window</span>
        </div>

        {/* Main Header Area */}
        <div className="mb-unit-6">
          <h2 className="text-2xl md:text-3xl text-primary font-bold tracking-tight">
            Schedule Field Verification Visit
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant mt-1">
            Pick a date and time slot for an accredited Legal Metrology Officer to test and stamp your counter scale on-site.
          </p>
        </div>

        {/* SECTION 1: Selected Instrument Summary Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 sm:p-6 shadow-sm mb-unit-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-primary-container"></div>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-container-low border border-outline-variant flex items-center justify-center text-primary shadow-inner shrink-0">
                <span className="material-symbols-outlined text-xl sm:text-2xl">scale</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base md:text-lg text-primary font-bold">
                    {activeInstrument.name} ({activeInstrument.model})
                  </span>
                  <span className="inline-flex items-center gap-1 bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    Due for Verification
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-on-surface-variant">
                  <span>Serial: <strong className="text-on-surface font-mono">{activeInstrument.serialNumber}</strong></span>
                  <span>•</span>
                  <span>Capacity: <strong className="text-on-surface">{activeInstrument.capacity}</strong></span>
                  <span>•</span>
                  <span>Premises: <strong className="text-on-surface">{storeInfo.name}</strong></span>
                </div>
              </div>
            </div>
            <div className="text-right hidden sm:flex flex-col justify-between items-end">
              <span className="text-[11px] text-outline uppercase tracking-wider font-semibold">
                Zone Jurisdiction
              </span>
              <span className="text-xs font-bold text-primary font-mono">
                Bengaluru Central (LM-BLR-04)
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Calendar & Slot Picker */}
        <section className="mb-unit-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-unit-3 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-primary">
                Select Your Preferred Visit Time
              </h3>
              <p className="text-xs text-on-surface-variant">
                Officers visit commercial zones according to neighborhood routes. Choose an open slot:
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-surface-container px-3 py-1 rounded-lg border border-outline-variant/60 text-xs font-semibold text-on-surface self-start sm:self-auto">
              <span className="material-symbols-outlined text-base text-secondary">calendar_month</span>
              <span>January 2025</span>
            </div>
          </div>

          {/* Slot Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Slot 1 */}
            <label
              onClick={() => setSlot('slot_1')}
              className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                slot === 'slot_1'
                  ? 'border-2 border-[#1f4d3a] bg-surface-container-lowest shadow-md ring-2 ring-primary-container/10'
                  : 'border border-outline-variant bg-surface-container-lowest hover:border-secondary hover:bg-surface-container-low shadow-sm'
              }`}
            >
              <input
                checked={slot === 'slot_1'}
                onChange={() => setSlot('slot_1')}
                className="sr-only"
                name="inspection_slot"
                type="radio"
                value="slot_1"
              />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] uppercase font-bold text-primary px-2 py-0.5 rounded bg-surface-container-high">
                  Morning Slot
                </span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    slot === 'slot_1'
                      ? 'bg-primary-container text-white'
                      : 'border border-outline-variant text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">check</span>
                </span>
              </div>
              <div className="text-xl font-bold text-primary">Thu, 16 Jan</div>
              <div className="text-xs font-semibold text-on-surface mt-1 flex items-center gap-1 text-[#416654]">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>10:00 AM – 1:00 PM</span>
              </div>
              <div className="mt-3 pt-2 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1 text-[#2E7D32] font-semibold text-[11px]">
                  <span className="material-symbols-outlined text-xs">verified</span> Recommended
                </span>
                <span className="text-[10px] uppercase font-mono text-outline font-bold">Fastest</span>
              </div>
            </label>

            {/* Slot 2 */}
            <label
              onClick={() => setSlot('slot_2')}
              className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                slot === 'slot_2'
                  ? 'border-2 border-[#1f4d3a] bg-surface-container-lowest shadow-md ring-2 ring-primary-container/10'
                  : 'border border-outline-variant bg-surface-container-lowest hover:border-secondary hover:bg-surface-container-low shadow-sm'
              }`}
            >
              <input
                checked={slot === 'slot_2'}
                onChange={() => setSlot('slot_2')}
                className="sr-only"
                name="inspection_slot"
                type="radio"
                value="slot_2"
              />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] uppercase font-bold text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
                  Afternoon Slot
                </span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    slot === 'slot_2'
                      ? 'bg-primary-container text-white'
                      : 'border border-outline-variant text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">check</span>
                </span>
              </div>
              <div className="text-xl font-bold text-primary">Fri, 17 Jan</div>
              <div className="text-xs font-semibold text-on-surface mt-1 flex items-center gap-1 text-[#416654]">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>2:00 PM – 5:00 PM</span>
              </div>
              <div className="mt-3 pt-2 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium text-[11px]">4 Slots Open</span>
                <span className="text-[10px] uppercase font-mono text-outline font-bold">Regular</span>
              </div>
            </label>

            {/* Slot 3 */}
            <label
              onClick={() => setSlot('slot_3')}
              className={`relative flex flex-col p-4 rounded-xl cursor-pointer transition-all ${
                slot === 'slot_3'
                  ? 'border-2 border-[#1f4d3a] bg-surface-container-lowest shadow-md ring-2 ring-primary-container/10'
                  : 'border border-outline-variant bg-surface-container-lowest hover:border-secondary hover:bg-surface-container-low shadow-sm'
              }`}
            >
              <input
                checked={slot === 'slot_3'}
                onChange={() => setSlot('slot_3')}
                className="sr-only"
                name="inspection_slot"
                type="radio"
                value="slot_3"
              />
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] uppercase font-bold text-on-surface-variant px-2 py-0.5 rounded bg-surface-container">
                  Morning Slot
                </span>
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    slot === 'slot_3'
                      ? 'bg-primary-container text-white'
                      : 'border border-outline-variant text-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">check</span>
                </span>
              </div>
              <div className="text-xl font-bold text-primary">Mon, 20 Jan</div>
              <div className="text-xs font-semibold text-on-surface mt-1 flex items-center gap-1 text-[#416654]">
                <span className="material-symbols-outlined text-sm">schedule</span>
                <span>10:00 AM – 1:00 PM</span>
              </div>
              <div className="mt-3 pt-2 border-t border-outline-variant/40 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant font-medium text-[11px]">5 Slots Open</span>
                <span className="text-[10px] uppercase font-mono text-outline font-bold">Next Week</span>
              </div>
            </label>
          </div>

          {/* Simple Explanation Note */}
          <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/60 flex items-start gap-3">
            <span className="material-symbols-outlined text-secondary text-xl shrink-0 mt-0.5">
              info
            </span>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong>What happens on visit day?</strong> An official Inspector arrives at your shop carrying Class M1 reference weights, tests the scale at 5kg/10kg/20kg, applies the official 2025 holographic seal, and immediately generates your verified digital certificate.
            </p>
          </div>
        </section>

        {/* SECTION 3: Action & Fee Mandate */}
        <section className="border-t border-outline-variant pt-6 flex flex-col items-center">
          {/* Statutory Government Fee Box */}
          <div className="w-full max-w-md bg-surface-container-low border border-outline-variant/80 rounded-xl p-3.5 sm:p-4 mb-5 text-center flex items-center justify-between">
            <div className="flex items-center gap-2 text-left">
              <span className="material-symbols-outlined text-xl text-primary shrink-0">receipt_long</span>
              <div>
                <span className="text-xs font-bold text-primary block">Government Statutory Fee</span>
                <span className="text-[11px] text-outline">Per Rule 14 table (Commercial Counter Scale)</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-extrabold text-primary">₹150</span>
              <span className="text-[10px] text-[#2E7D32] font-semibold block">Pay on-site (Cash/UPI)</span>
            </div>
          </div>

          {/* Single Clear Primary Button */}
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="w-full sm:w-auto sm:min-w-[280px] bg-[#E0702A] hover:bg-[#c95f1d] text-white font-bold text-sm px-6 sm:px-8 py-3.5 rounded-lg shadow-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-75"
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

          <span className="text-[11px] text-outline mt-3 text-center">
            Instant SMS &amp; WhatsApp confirmation will be sent to your registered shop phone.
          </span>
        </section>
      </div>
    </main>
  );
};
