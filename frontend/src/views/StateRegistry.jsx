import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const StateRegistry = () => {
  const { registry, navigateTo, showToast } = useApp();
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');

  const filteredData = registry.filter((item) => {
    const matchesQuery =
      !filterQuery.trim() ||
      item.shopName.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.certId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.serial.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.merchantUid.toLowerCase().includes(filterQuery.toLowerCase());

    const matchesZone =
      selectedZone === 'all' || item.zone.toLowerCase().includes(selectedZone.toLowerCase());

    return matchesQuery && matchesZone;
  });

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8 min-h-screen">
      {/* Breadcrumb Hierarchy */}
      <div className="mb-unit-4 flex items-center gap-unit-2 text-body-sm font-body-sm text-on-surface-variant">
        <button
          onClick={() => navigateTo('shop-dashboard')}
          className="hover:text-primary transition-colors flex items-center gap-unit-1"
        >
          <span className="material-symbols-outlined text-base">account_balance</span>
          <span>Legal Metrology Division</span>
        </button>
        <span className="material-symbols-outlined text-sm text-outline">chevron_right</span>
        <span className="text-primary font-semibold">State Compliance Registry &amp; Ledger</span>
      </div>

      {/* Header & KPI Summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-unit-4 mb-unit-6">
        <div>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg text-primary tracking-tight font-bold">
            State Compliance Registry &amp; Ledger
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Directorate of Legal Metrology, Government of Karnataka • Form XVII Public Verification Index
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial bg-surface-container-lowest border border-outline-variant px-3 sm:px-4 py-2 rounded-xl shadow-sm text-center sm:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-outline block font-bold">
              Active Registered
            </span>
            <span className="text-sm sm:text-base font-bold text-primary">12,480 Units</span>
          </div>
          <div className="flex-1 sm:flex-initial bg-surface-container-lowest border border-outline-variant px-3 sm:px-4 py-2 rounded-xl shadow-sm text-center sm:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-outline block font-bold">
              Compliance Rate
            </span>
            <span className="text-sm sm:text-base font-bold text-[#2E7D32]">99.4%</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1 w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
            placeholder="Search by Establishment, Certificate ID, or Serial..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="flex-1 sm:flex-initial bg-surface-container-low border border-outline-variant rounded-lg px-2.5 sm:px-3 py-2 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            <option value="all">All Zones</option>
            <option value="Ward 4">Ward 4 (Commercial Circle / APMC)</option>
            <option value="Ward 2">Ward 2 (Commercial Ganj)</option>
            <option value="Ring Road">Outer Ring Road</option>
          </select>

          <button
            onClick={() => showToast('Exporting State Registry CSV...', 'info')}
            className="px-3 sm:px-4 py-2 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container text-on-surface rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-base">file_download</span>
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Mobile Swipe Tip */}
      <div className="sm:hidden flex items-center gap-1 text-[11px] text-gray-500 mb-2 px-1">
        <span className="material-symbols-outlined text-xs text-gray-400">swipe</span>
        <span>Swipe horizontally to view full verification ledger</span>
      </div>

      {/* Registry Table Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden mb-unit-8">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left font-body-sm text-body-sm min-w-[650px]">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container text-on-surface font-label-md text-label-md">
                <th className="py-3 px-4">Establishment &amp; UID</th>
                <th className="py-3 px-4">Certificate ID</th>
                <th className="py-3 px-4">Instrument &amp; Serial</th>
                <th className="py-3 px-4">Zone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Valid Until</th>
                <th className="py-3 px-4">Officer Assigned</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filteredData.map((item) => {
                const isUrgent = item.status === 'Renewal Scheduled' || item.status === 'Inspection Slotted';
                return (
                  <tr key={item.id} className="hover:bg-surface-container-low/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-primary">{item.shopName}</div>
                      <div className="text-xs text-outline">{item.merchantUid}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-on-surface">
                      {item.certId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-on-surface font-medium">{item.instrument}</div>
                      <div className="text-xs font-mono text-outline">{item.serial}</div>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface-variant">{item.zone}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isUrgent
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">
                          {isUrgent ? 'schedule' : 'verified'}
                        </span>
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-on-surface font-medium">{item.expiryDate}</td>
                    <td className="py-3.5 px-4 text-on-surface-variant text-xs">{item.inspector}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => navigateTo('certificate-view')}
                        className="px-2.5 py-1 text-xs bg-surface-container border border-outline-variant hover:border-primary text-primary font-semibold rounded transition-all"
                      >
                        View Cert
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Institutional Legal Footnote */}
      <div className="text-center text-body-sm font-body-sm text-outline">
        <span>Standards of Weights and Measures Enforcement Section 24 • Government of Karnataka Official Record</span>
      </div>
    </main>
  );
};
