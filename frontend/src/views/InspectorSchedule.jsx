import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const InspectorSchedule = () => {
  const { navigateTo, visits, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState(true);

  const filteredVisits = visits.filter((v) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      v.shopName.toLowerCase().includes(term) ||
      v.address.toLowerCase().includes(term) ||
      v.regNumber.toLowerCase().includes(term)
    );
  });

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex flex-col gap-6">
        {/* View Title & Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Live Field Inspector Route • Zone 4
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Today's Verification Schedule
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Thursday, 16 January 2025 • <strong className="text-gray-800">{visits.length} Inspections Assigned</strong>
            </p>
          </div>

          {/* KPI Summary Chips */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="bg-white border border-gray-200 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs">
              <span className="material-symbols-outlined text-amber-600 text-lg">pending_actions</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Actionable</span>
                <span className="text-sm font-extrabold text-gray-900">1 Next Up</span>
              </div>
            </div>
            <div className="bg-white border border-gray-200 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shadow-xs">
              <span className="material-symbols-outlined text-emerald-700 text-lg">event_available</span>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Upcoming</span>
                <span className="text-sm font-extrabold text-gray-900">3 Slotted</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar Component */}
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 flex-1 w-full pl-2">
            <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-0 text-gray-900 placeholder:text-gray-400 text-xs sm:text-sm focus:ring-0 focus:outline-none"
              placeholder="Search shop name, commercial license, or street address..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end">
            {filterActive && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-lg text-gray-700 text-xs font-medium">
                <span className="material-symbols-outlined text-sm text-emerald-700">location_on</span>
                <span>Ward 4</span>
                <button
                  onClick={() => setFilterActive(false)}
                  className="ml-1 text-gray-400 hover:text-gray-700"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
            )}
            <button
              onClick={() => showToast('Filtered within Ward 4 commercial area', 'info')}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 text-xs font-semibold"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Inspection Cards List */}
        <div className="flex flex-col gap-4">
          {filteredVisits.map((visit) => {
            const isNext = visit.isNextUp;
            return (
              <article
                key={visit.id}
                className={`bg-white rounded-2xl p-5 sm:p-6 transition-all shadow-xs relative overflow-hidden ${
                  isNext
                    ? 'border-2 border-emerald-700 ring-4 ring-emerald-700/10'
                    : 'border border-gray-200 hover:border-gray-300'
                }`}
              >
                {/* Left Accent Stripe */}
                {isNext && <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#E0702A]"></div>}

                {/* Top Card Row: Time Slot & Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">
                      <span className="material-symbols-outlined text-sm text-emerald-800">schedule</span>
                      <span>{visit.timeSlot}</span>
                    </div>

                    {isNext && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E0702A]"></span>
                        {visit.timeRelative}
                      </span>
                    )}
                  </div>

                  {/* Status Badge */}
                  {visit.statusType === 'pending' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      <span className="material-symbols-outlined text-xs">pending</span>
                      <span>{visit.status}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      <span className="material-symbols-outlined text-xs">event</span>
                      <span>{visit.status}</span>
                    </span>
                  )}
                </div>

                {/* Middle Content Row */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                      {visit.shopName}
                    </h2>
                    {visit.classBadge && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                        {visit.classBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                    <span className="material-symbols-outlined text-sm text-gray-400">store</span>
                    <span>{visit.address}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-mono">{visit.regNumber}</span>
                  </div>

                  {/* Device Spec Strip */}
                  <div className="mt-2 p-3 bg-gray-50 rounded-xl border border-gray-200/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-700">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-emerald-800">scale</span>
                      <span>
                        Instrument: <strong className="text-gray-900">{visit.instrumentName}</strong>
                      </span>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <div>
                      Model: <strong className="text-gray-900">{visit.model}</strong>
                    </div>
                    <span className="text-gray-300 hidden sm:inline">•</span>
                    <div>
                      Spec: <strong className="text-gray-900">{visit.specification}</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-gray-500">
                    Inspector: <strong className="text-gray-700">Insp. R. Deshmukh (Badge #LM-BLR-402)</strong>
                  </span>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => showToast(`Navigation route plotted to ${visit.shopName}`, 'info')}
                      className="flex-1 sm:flex-initial justify-center px-3 py-2 border border-gray-300 hover:bg-gray-50 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-base text-gray-500">near_me</span>
                      <span>Directions</span>
                    </button>

                    {isNext ? (
                      <button
                        onClick={() => navigateTo('field-inspection')}
                        className="flex-1 sm:flex-initial justify-center px-4 py-2 bg-[#023625] hover:bg-[#1f4d3a] text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
                        type="button"
                      >
                        <span>Start Inspection</span>
                        <span className="material-symbols-outlined text-base">arrow_forward</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => showToast(`Viewing verification dossier for ${visit.shopName}`, 'info')}
                        className="flex-1 sm:flex-initial justify-center px-3.5 py-2 border border-gray-300 bg-gray-50 hover:bg-gray-100 rounded-lg text-xs font-semibold text-gray-700 transition-colors"
                        type="button"
                      >
                        View Dossier
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center text-xs text-gray-400 pt-2 pb-4">
          <span>Official Field Inspector Terminal • Device GPS Geo-Fencing Active</span>
        </div>
      </div>
    </main>
  );
};
