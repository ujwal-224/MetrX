import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const StateRegistry = () => {
  const { registry, navigateTo, activeRole, showToast, handleViewRegistryCertificate } = useApp();
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
    <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 min-h-screen">
      {/* Breadcrumb Hierarchy */}
      <div className="mb-3 sm:mb-4 flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <button
          onClick={() => {
            if (activeRole === 'inspector') navigateTo('inspector-schedule');
            else if (activeRole === 'admin') navigateTo('admin-dashboard');
            else if (activeRole === 'public') navigateTo('public-portal');
            else navigateTo('shop-dashboard');
          }}
          className="hover:text-primary transition-colors flex items-center gap-1 font-medium"
        >
          <span className="material-symbols-outlined text-base">
            {activeRole === 'inspector' ? 'route' : activeRole === 'admin' ? 'dashboard' : activeRole === 'public' ? 'public' : 'storefront'}
          </span>
          <span>
            {activeRole === 'inspector' ? "Inspector Route" : activeRole === 'admin' ? "Admin Command Center" : activeRole === 'public' ? 'Citizen Portal' : 'Shop Dashboard'}
          </span>
        </button>
        <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
        <span className="text-[#023625] font-semibold">State Compliance Registry &amp; Ledger</span>
      </div>

      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl text-gray-900 tracking-tight font-bold">
            State Compliance Registry &amp; Ledger
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Directorate of Legal Metrology, Government of Karnataka • Form XVII Public Verification Index
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:flex-initial bg-surface-container-lowest border border-outline-variant px-3 sm:px-4 py-2 rounded-xl shadow-sm text-center sm:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-outline block font-bold">
              Active Registered
            </span>
            <span className="text-sm sm:text-base font-bold text-primary">{registry.length} Verified Units</span>
          </div>
          <div className="flex-1 sm:flex-initial bg-surface-container-lowest border border-outline-variant px-3 sm:px-4 py-2 rounded-xl shadow-sm text-center sm:text-left">
            <span className="text-[10px] sm:text-xs uppercase tracking-wider text-outline block font-bold">
              Compliance Rate
            </span>
            <span className="text-sm sm:text-base font-bold text-[#2E7D32]">
              {registry.length > 0 ? '100%' : 'N/A'}
            </span>
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
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-4xl text-gray-300">verified_user</span>
                      <span className="font-semibold text-sm text-gray-700">No Registry Records Found</span>
                      <span className="text-xs text-gray-400">
                        {filterQuery ? 'Try adjusting your search criteria.' : 'Certificates issued by enforcement officers upon field inspection will be recorded here.'}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => {
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
                        onClick={() => handleViewRegistryCertificate(item)}
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
