import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const RoleQuickSwitcher = () => {
  const {
    activeRole,
    switchRole,
    tourStep,
    jumpToTourStep,
    isTourBannerVisible,
    setIsTourBannerVisible,
    language,
    setLanguage
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(true);

  const steps = [
    { num: 1, title: '1. Scale Status (28d Due)', role: 'shop-owner', icon: 'timelapse' },
    { num: 2, title: '2. Book Inspector', role: 'shop-owner', icon: 'calendar_month' },
    { num: 3, title: '3. Track Appointment', role: 'shop-owner', icon: 'pending_actions' },
    { num: 4, title: '4. Inspector Stamps', role: 'inspector', icon: 'checklist' },
    { num: 5, title: '5. Legal Certificate', role: 'shop-owner', icon: 'verified' }
  ];

  return (
    <div className="bg-[#023625] text-white border-b border-[#1f4d3a] z-50 sticky top-0 shadow-md no-print transition-all">
      {/* Top Bar: Clean Persona Selector & Utilities */}
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Brand & Persona Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 font-bold tracking-wide text-white">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E0702A] ring-4 ring-[#E0702A]/20"></span>
            <span className="text-sm font-semibold tracking-tight">MetrX</span>
            <span className="text-white/40 font-normal hidden sm:inline">•</span>
            <span className="text-xs font-normal text-[#c3ecd5] hidden md:inline">
              National Legal Metrology Digital System
            </span>
          </div>

          <div className="h-4 w-px bg-white/20 hidden sm:block"></div>

          {/* Three Clear Persona Switcher Tabs */}
          <div className="inline-flex rounded-lg bg-black/25 p-0.5 border border-white/10">
            <button
              onClick={() => switchRole('shop-owner')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeRole === 'shop-owner'
                  ? 'bg-[#E0702A] text-white font-semibold shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-sm">storefront</span>
              <span>Shop Owner</span>
            </button>

            <button
              onClick={() => switchRole('inspector')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeRole === 'inspector'
                  ? 'bg-[#E0702A] text-white font-semibold shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-sm">badge</span>
              <span>Field Inspector</span>
            </button>

            <button
              onClick={() => switchRole('public')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeRole === 'public'
                  ? 'bg-[#E0702A] text-white font-semibold shadow-sm'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-sm">public</span>
              <span>Citizen Portal</span>
            </button>
          </div>
        </div>

        {/* Right side: Tour Toggle & Language Switcher */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded bg-[#1f4d3a] hover:bg-[#416654] text-[#c3ecd5] text-xs font-medium flex items-center gap-1 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">
              {isExpanded ? 'expand_less' : 'route'}
            </span>
            <span className="hidden sm:inline">
              {isExpanded ? 'Hide Guided Tour' : 'Guided Tour (5 Steps)'}
            </span>
          </button>

          <div className="flex items-center rounded border border-white/20 p-0.5 bg-black/20">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                language === 'EN' ? 'bg-[#c3ecd5] text-[#023625]' : 'text-white/70 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('HI')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                language === 'HI' ? 'bg-[#c3ecd5] text-[#023625]' : 'text-white/70 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Guided Tour Stepper */}
      {isExpanded && isTourBannerVisible && (
        <div className="bg-[#1f4d3a]/90 border-t border-[#416654]/40 px-4 py-2 text-xs flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-[#c3ecd5] shrink-0 font-medium">
            <span className="material-symbols-outlined text-sm text-[#ff985f]">assistant_navigation</span>
            <span>Interactive Workflow Journey:</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto py-1">
            {steps.map((s) => {
              const isCurrent = tourStep === s.num;
              const isDone = tourStep > s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => jumpToTourStep(s.num)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isCurrent
                      ? 'bg-[#E0702A] text-white font-bold ring-2 ring-white/30 shadow'
                      : isDone
                      ? 'bg-[#023625] text-[#c3ecd5] hover:bg-[#416654]'
                      : 'bg-black/20 text-white/70 hover:bg-black/40 hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">{s.icon}</span>
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsTourBannerVisible(false)}
            className="text-white/50 hover:text-white text-xs shrink-0 hidden lg:block"
            title="Dismiss Tour Bar"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}
    </div>
  );
};
