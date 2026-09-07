import React from 'react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { currentView, navigateTo, activeRole, storeInfo, showToast, switchRole } = useApp();

  const isShopOwner = activeRole === 'shop-owner';

  return (
    <aside className="fixed top-0 left-0 h-screen w-sidebar-width-expanded z-40 bg-primary-container text-on-primary border-r border-outline-variant/30 flex flex-col justify-between py-unit-6 px-unit-4 shadow-none select-none no-print">
      <div className="flex flex-col gap-unit-6">
        {/* Authority Header */}
        <div
          onClick={() => switchRole('public')}
          className="flex items-center gap-unit-3 px-unit-2 cursor-pointer group"
          title="Go to Public Portal"
        >
          <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/10 border border-white/20 flex items-center justify-center text-on-primary group-hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              balance
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm text-title-md text-on-primary leading-tight font-bold tracking-tight">
              MetrX Authority
            </span>
            <span className="font-body-sm text-body-sm text-on-primary-container">
              Legal Metrology Division
            </span>
          </div>
        </div>

        {/* Identity Badge Context */}
        {isShopOwner ? (
          <div className="bg-primary/50 border border-outline-variant/20 rounded-xl p-unit-3 flex flex-col gap-unit-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#ff985f] font-semibold">
                Your Merchant Store
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            </div>
            <div className="font-title-md text-title-md text-on-primary truncate font-bold">
              {storeInfo.name}
            </div>
            <div className="font-body-sm text-body-sm text-on-primary-container flex items-center gap-1 text-xs">
              <span className="material-symbols-outlined text-sm">store</span>
              <span className="truncate">Ward 4, Commercial Circle</span>
            </div>
          </div>
        ) : (
          <div className="bg-primary/50 border border-outline-variant/20 rounded-xl p-unit-3 flex items-center gap-unit-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-outline-variant">
              RD
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-[#ff985f] font-semibold">
                Field Officer
              </span>
              <span className="font-label-md text-label-md text-on-primary font-bold truncate">
                Insp. R. Deshmukh
              </span>
              <span className="font-body-sm text-body-sm text-inverse-primary truncate text-xs">
                Bengaluru Central (Zone 4)
              </span>
            </div>
          </div>
        )}

        {/* Primary CTA in Sidebar */}
        {isShopOwner ? (
          <button
            onClick={() => navigateTo('request-verification')}
            className="w-full h-11 bg-[#E0702A] hover:bg-[#c96222] active:translate-y-0.5 text-white font-label-lg text-label-lg font-semibold rounded-lg flex items-center justify-center gap-unit-2 shadow-sm transition-all duration-150"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            <span>Request Inspection</span>
          </button>
        ) : (
          <button
            onClick={() => navigateTo('field-inspection')}
            className="w-full h-11 bg-[#E0702A] hover:bg-[#c96222] active:translate-y-0.5 text-white font-label-lg text-label-lg font-semibold rounded-lg flex items-center justify-center gap-unit-2 shadow-sm transition-all duration-150"
            type="button"
          >
            <span className="material-symbols-outlined text-lg">checklist</span>
            <span>Start Next Inspection</span>
          </button>
        )}

        {/* Role-tailored, Simple Navigation Menu */}
        <nav aria-label="Authenticated Navigation" className="flex flex-col gap-1.5">
          {isShopOwner ? (
            <>
              <button
                onClick={() => navigateTo('shop-dashboard')}
                className={`text-left px-3 py-2.5 flex items-center gap-3 rounded-lg text-label-md font-medium transition-all ${
                  currentView === 'shop-dashboard'
                    ? 'bg-secondary text-white border-l-4 border-[#E0702A] font-semibold shadow-sm'
                    : 'text-[#c3ecd5] hover:text-white hover:bg-secondary/40'
                }`}
              >
                <span className="material-symbols-outlined text-lg">dashboard</span>
                <span>My Scale &amp; Status</span>
              </button>

              <button
                onClick={() => navigateTo('track-status')}
                className={`text-left px-3 py-2.5 flex items-center gap-3 rounded-lg text-label-md font-medium transition-all ${
                  currentView === 'track-status'
                    ? 'bg-secondary text-white border-l-4 border-[#E0702A] font-semibold shadow-sm'
                    : 'text-[#c3ecd5] hover:text-white hover:bg-secondary/40'
                }`}
              >
                <span className="material-symbols-outlined text-lg">pending_actions</span>
                <span>Track Inspector Visit</span>
              </button>

              <button
                onClick={() => navigateTo('certificate-view')}
                className={`text-left px-3 py-2.5 flex items-center gap-3 rounded-lg text-label-md font-medium transition-all ${
                  currentView === 'certificate-view'
                    ? 'bg-secondary text-white border-l-4 border-[#E0702A] font-semibold shadow-sm'
                    : 'text-[#c3ecd5] hover:text-white hover:bg-secondary/40'
                }`}
              >
                <span className="material-symbols-outlined text-lg">verified</span>
                <span>Official Certificate</span>
              </button>

              <button
                onClick={() => navigateTo('register-instrument')}
                className={`text-left px-3 py-2.5 flex items-center gap-3 rounded-lg text-label-md font-medium transition-all ${
                  currentView === 'register-instrument'
                    ? 'bg-secondary text-white border-l-4 border-[#E0702A] font-semibold shadow-sm'
                    : 'text-[#c3ecd5] hover:text-white hover:bg-secondary/40'
                }`}
              >
                <span className="material-symbols-outlined text-lg">add_circle</span>
                <span>Register Another Scale</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateTo('inspector-schedule')}
                className={`text-left px-3 py-2.5 flex items-center gap-3 rounded-lg text-label-md font-medium transition-all ${
                  currentView === 'inspector-schedule'
                    ? 'bg-secondary text-white border-l-4 border-[#E0702A] font-semibold shadow-sm'
                    : 'text-[#c3ecd5] hover:text-white hover:bg-secondary/40'
                }`}
              >
                <span className="material-symbols-outlined text-lg">fact_check</span>
                <span>Today's Field Route</span>
              </button>

              <button
                onClick={() => navigateTo('field-inspection')}
                className={`text-left px-3 py-2.5 flex items-center gap-3 rounded-lg text-label-md font-medium transition-all ${
                  currentView === 'field-inspection'
                    ? 'bg-secondary text-white border-l-4 border-[#E0702A] font-semibold shadow-sm'
                    : 'text-[#c3ecd5] hover:text-white hover:bg-secondary/40'
                }`}
              >
                <span className="material-symbols-outlined text-lg">checklist</span>
                <span>Active Inspection Checklist</span>
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="flex flex-col gap-1 border-t border-white/10 pt-unit-4 text-xs">
        <button
          onClick={() => switchRole('public')}
          className="text-left text-[#c3ecd5] hover:text-white hover:bg-secondary/40 px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors"
        >
          <span className="material-symbols-outlined text-base">public</span>
          <span>View Public Citizen Page</span>
        </button>

        <button
          onClick={() => showToast('All actions are digitally signed under Legal Metrology Act, 2009', 'info')}
          className="text-left text-[#c3ecd5] hover:text-white hover:bg-secondary/40 px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors"
        >
          <span className="material-symbols-outlined text-base">shield</span>
          <span>Security &amp; Audit Seal</span>
        </button>
      </div>
    </aside>
  );
};
