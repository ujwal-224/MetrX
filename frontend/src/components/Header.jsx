import React from 'react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const {
    currentView,
    navigateTo,
    activeRole,
    switchRole,
    isRoleModalOpen,
    setIsRoleModalOpen,
    storeInfo,
    language,
    setLanguage,
    showToast
  } = useApp();

  // Role-tailored navigation items
  const allNavItemsByRole = {
    'shop-owner': [
      { id: 'shop-dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'request-verification', label: 'Schedule Visit', icon: 'calendar_month' },
      { id: 'track-status', label: 'Track Visit', icon: 'pending_actions' },
      { id: 'certificate-view', label: 'Certificate', icon: 'verified' },
    ],
    'inspector': [
      { id: 'inspector-schedule', label: "Today's Route", icon: 'route' },
      { id: 'field-inspection', label: 'Conduct Inspection', icon: 'fact_check' },
      { id: 'state-registry', label: 'State Registry', icon: 'account_balance' },
    ],
    'public': [
      { id: 'public-portal', label: 'Citizen Portal', icon: 'public' },
      { id: 'certificate-view', label: 'Verify Certificate', icon: 'verified' },
      { id: 'state-registry', label: 'State Registry', icon: 'account_balance' },
    ]
  };

  const navItems = allNavItemsByRole[activeRole] || allNavItemsByRole['shop-owner'];

  const roleLabels = {
    'shop-owner': { title: 'Shop Owner', badge: 'Merchant', icon: 'storefront' },
    'inspector': { title: 'Field Inspector', badge: 'Enforcement', icon: 'badge' },
    'public': { title: 'Citizen Portal', badge: 'Public', icon: 'public' }
  };

  const currentRoleInfo = roleLabels[activeRole] || roleLabels['shop-owner'];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs no-print">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Brand Identity */}
        <div
          onClick={() => {
            if (activeRole === 'inspector') navigateTo('inspector-schedule');
            else if (activeRole === 'public') navigateTo('public-portal');
            else navigateTo('shop-dashboard');
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-[#023625] text-[#bceed3] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-xl">balance</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-extrabold text-base tracking-tight text-[#023625]">METRA</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                Official
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5 hidden xs:inline">
              Legal Metrology
            </span>
          </div>
        </div>

        {/* Center: Role-Tailored Navigation Bar */}
        <nav className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl border border-gray-200/60">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-white text-[#023625] shadow-xs font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <span className={`material-symbols-outlined text-base ${isActive ? 'text-[#e0702a]' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Role Switcher Modal Button, Profile & Language */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Prominent Persona / Role Switcher Button */}
          <button
            onClick={() => setIsRoleModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-[#023625] transition-all shadow-xs active:scale-95 group cursor-pointer"
            title="Switch Persona: Shop Owner, Inspector, or Citizen"
          >
            <span className="material-symbols-outlined text-base text-[#e0702a] group-hover:rotate-180 transition-transform duration-300">
              swap_horiz
            </span>
            <span className="text-xs font-bold whitespace-nowrap">
              {currentRoleInfo.title}
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200 font-bold">
              Switch
            </span>
          </button>

          {/* Active Profile Badge (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-left">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <div className="flex flex-col text-xs leading-none">
              <span className="font-bold text-gray-800 truncate max-w-[110px]">
                {activeRole === 'inspector'
                  ? 'Insp. Deshmukh'
                  : activeRole === 'public'
                  ? 'Citizen Viewer'
                  : storeInfo.name}
              </span>
              <span className="text-[10px] text-gray-500">
                {activeRole === 'inspector'
                  ? 'Badge #LM-402'
                  : activeRole === 'public'
                  ? 'State Registry'
                  : 'Ward 4, BLR'}
              </span>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 bg-gray-100 shrink-0">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'EN' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('HI')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'HI' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer Row */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar px-3 py-2 bg-gray-50/90 border-t border-gray-200 gap-1.5 text-xs touch-pan-x">
        {/* Quick Role Switcher Pill on Mobile */}
        <button
          onClick={() => setIsRoleModalOpen(true)}
          className="px-2.5 py-1.5 rounded-lg whitespace-nowrap font-bold flex items-center gap-1 shrink-0 bg-emerald-100 text-[#023625] border border-emerald-300 active:scale-95"
        >
          <span className="material-symbols-outlined text-sm text-[#e0702a]">swap_horiz</span>
          <span>Role: {currentRoleInfo.title}</span>
        </button>

        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-[#023625] text-white font-bold shadow-xs'
                  : 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className={`material-symbols-outlined text-sm ${isActive ? 'text-[#e0702a]' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
