import React from 'react';
import { useApp } from '../context/AppContext';

export const Header = () => {
  const {
    currentView,
    navigateTo,
    activeRole,
    logout,
    storeInfo,
    currentInspector,
    language,
    setLanguage,
    showToast
  } = useApp();

  // Role-tailored navigation items
  const allNavItemsByRole = {
    'shop-owner': [
      { id: 'shop-dashboard', label: 'Dashboard', icon: 'dashboard' },
      { id: 'upload-documents', label: 'Documents', icon: 'description' },
      { id: 'request-verification', label: 'Schedule Visit', icon: 'calendar_month' },
      { id: 'track-status', label: 'Track Visit', icon: 'pending_actions' },
      { id: 'certificate-view', label: 'Certificate', icon: 'verified' },
    ],
    'inspector': [
      { id: 'inspector-schedule', label: "Today's Route", icon: 'route' },
      { id: 'field-inspection', label: 'Conduct Inspection', icon: 'fact_check' },
    ],
    'admin': [
      { id: 'admin-dashboard', label: 'Command Center', icon: 'dashboard' },
    ],
    'public': []
  };

  const navItems = allNavItemsByRole[activeRole] || [];

  const roleLabels = {
    'shop-owner': { title: 'Shop Owner', badge: 'Merchant', icon: 'storefront' },
    'inspector': { title: 'Field Inspector', badge: 'Enforcement', icon: 'badge' },
    'admin': { title: 'Department Admin', badge: 'Controller', icon: 'shield_person' },
    'public': { title: 'Citizen & Consumer', badge: 'Public', icon: 'public' }
  };

  const currentRoleInfo = roleLabels[activeRole] || roleLabels['public'];

  const scrollToLogin = () => {
    if (currentView !== 'public-portal') {
      navigateTo('public-portal');
      setTimeout(() => {
        const el = document.getElementById('login-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('login-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div
          onClick={() => {
            if (activeRole === 'inspector') navigateTo('inspector-schedule');
            else if (activeRole === 'admin') navigateTo('admin-dashboard');
            else if (activeRole === 'shop-owner') navigateTo('shop-dashboard');
            else navigateTo('public-portal');
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
            <span className="text-[11px] text-gray-500 font-medium leading-tight mt-0.5 hidden sm:inline">
              Legal Metrology Portal
            </span>
          </div>
        </div>

        {/* Center: Role-Tailored Navigation Bar (Spacious, single-line tabs) */}
        {navItems.length > 0 && (
          <nav className="hidden lg:flex items-center gap-1 bg-gray-100/90 p-1 rounded-xl border border-gray-200/70 shadow-xs">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 cursor-pointer select-none ${
                    isActive
                      ? 'bg-white text-[#023625] shadow-xs font-bold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
                  }`}
                >
                  <span className={`material-symbols-outlined text-base ${isActive ? 'text-[#e0702a]' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right: Auth Profile, Login/Logout & Language */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {activeRole === 'public' ? (
            /* Unauthenticated: Direct Login Button to scroll to login cards */
            <button
              onClick={scrollToLogin}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E0702A] hover:bg-[#c95f1f] text-white transition-all shadow-xs active:scale-95 font-bold text-xs cursor-pointer whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Login to Portal</span>
            </button>
          ) : (
            /* Authenticated in Role: Show Role Identity & Logout Button */
            <div className="flex items-center gap-2">
              {/* User Identity Pill */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50/90 border border-gray-200 text-left shadow-2xs">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  activeRole === 'admin' ? 'bg-[#023625]' : activeRole === 'inspector' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></div>
                <div className="flex flex-col text-xs leading-none max-w-[140px] md:max-w-[170px]">
                  <span className="font-bold text-gray-800 truncate">
                    {activeRole === 'admin'
                      ? 'Dr. Sharma (Admin)'
                      : activeRole === 'inspector'
                      ? (currentInspector?.name || 'Insp. Deshmukh')
                      : storeInfo.name}
                  </span>
                  <span className="text-[10px] text-gray-500 truncate mt-0.5">
                    {activeRole === 'admin'
                      ? 'State Controller'
                      : activeRole === 'inspector'
                      ? `Badge #${currentInspector?.badgeNumber || 'LM-402'}`
                      : 'Merchant • Ward 4'}
                  </span>
                </div>
              </div>

              {/* Explicit Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all active:scale-95 shadow-2xs cursor-pointer whitespace-nowrap"
                title="Log out and return to landing page"
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* Language Toggle */}
          <div className="flex items-center rounded-lg border border-gray-200 p-0.5 bg-gray-100/90 shrink-0 shadow-2xs">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                language === 'EN' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('HI')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                language === 'HI' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* Sub-header Navigation Row for tablet & mobile or medium screens (lg:hidden) */}
      {navItems.length > 0 && (
        <div className="flex lg:hidden overflow-x-auto no-scrollbar px-4 py-2 bg-gray-50/95 border-t border-gray-200/80 gap-1.5 text-xs touch-pan-x">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#023625] text-white shadow-xs'
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
      )}
    </header>
  );
};
