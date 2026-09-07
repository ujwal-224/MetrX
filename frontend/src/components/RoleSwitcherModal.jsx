import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const RoleSwitcherModal = () => {
  const {
    activeRole,
    switchRole,
    isRoleModalOpen,
    setIsRoleModalOpen,
    showToast,
    storeInfo
  } = useApp();

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsRoleModalOpen(false);
      }
    };
    if (isRoleModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRoleModalOpen, setIsRoleModalOpen]);

  if (!isRoleModalOpen) return null;

  const roles = [
    {
      id: 'shop-owner',
      title: 'Shop Owner / Merchant',
      subtitle: 'Kirana Store, Supermarket, Jeweler & Retailer',
      icon: 'storefront',
      badge: `${storeInfo.name} • Ward 4`,
      themeColor: '#023625',
      accentColor: '#E0702A',
      features: [
        'Monitor scale calibration countdown (28 days left)',
        'Book inspector on-site visit & pay ₹150 fee',
        'Download & print official Form XVII Certificate',
        'Register new weighing scales with serial plates'
      ],
      actionLabel: 'Enter Shop Owner Dashboard',
      landingView: 'shop-dashboard'
    },
    {
      id: 'inspector',
      title: 'Field Metrology Inspector',
      subtitle: 'Government Legal Metrology Verification Officer',
      icon: 'badge',
      badge: 'Insp. R. Deshmukh • Badge #LM-BLR-402',
      themeColor: '#023625',
      accentColor: '#059669',
      features: [
        'Daily inspection route queue filtered by Ward/Area',
        'GPS turn-by-turn navigation route to shops',
        'Interactive 4-point field calibration checklist',
        'Capture photo evidence & digitally issue certificates'
      ],
      actionLabel: 'Enter Inspector Route Terminal',
      landingView: 'inspector-schedule'
    },
    {
      id: 'public',
      title: 'Citizen & Consumer',
      subtitle: 'Public Transparency, Registry & Anti-Fraud',
      icon: 'public',
      badge: 'Directorate of Legal Metrology • Public Portal',
      themeColor: '#1e3a8a',
      accentColor: '#2563eb',
      features: [
        'Scan QR code on any shop certificate to verify authenticity',
        'Search state-wide registered commercial scales ledger',
        'Submit short-weight complaints & seal tampering reports',
        'Download Legal Metrology Act regulations & fee charts'
      ],
      actionLabel: 'Enter Citizen Portal',
      landingView: 'public-portal'
    }
  ];

  const handleSelectRole = (roleId) => {
    switchRole(roleId);
    setIsRoleModalOpen(false);
    const roleName =
      roleId === 'shop-owner'
        ? 'Shop Owner Dashboard'
        : roleId === 'inspector'
        ? 'Field Inspector Terminal'
        : 'Citizen & Consumer Portal';
    showToast(`Switched persona to: ${roleName}`, 'success');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={() => setIsRoleModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl border border-gray-200 relative p-5 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#E0702A] animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Persona Switcher
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Select User Role / Perspective
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Experience the Legal Metrology Digital Verification System from any stakeholder's point of view:
            </p>
          </div>

          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* 3 Persona Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {roles.map((role) => {
            const isCurrent = activeRole === role.id;
            return (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`flex flex-col justify-between p-5 rounded-xl border-2 transition-all cursor-pointer relative group ${
                  isCurrent
                    ? 'border-[#023625] bg-emerald-50/40 shadow-md ring-2 ring-emerald-600/10'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {/* Active Role Ribbon Badge */}
                {isCurrent && (
                  <span className="absolute -top-2.5 right-4 bg-[#023625] text-[#bceed3] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                    Current Active
                  </span>
                )}

                <div>
                  {/* Persona Icon & Title */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform group-hover:scale-105 ${
                        isCurrent
                          ? 'bg-[#023625] text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span className="material-symbols-outlined">{role.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                        {role.title}
                      </h3>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        {role.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Profile Badge */}
                  <div className="bg-gray-50 border border-gray-200/80 rounded-lg px-2.5 py-1.5 text-[11px] font-mono text-gray-700 font-semibold mb-4 flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="truncate">{role.badge}</span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2 mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                      What you can do:
                    </span>
                    {role.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600 leading-snug">
                        <span className="material-symbols-outlined text-sm text-emerald-700 shrink-0 mt-0.5">
                          check_circle
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRole(role.id);
                  }}
                  className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                    isCurrent
                      ? 'bg-[#023625] text-white hover:bg-[#1b4a36] shadow-xs'
                      : 'bg-gray-100 text-gray-800 hover:bg-[#023625] hover:text-white'
                  }`}
                >
                  <span>{isCurrent ? 'Continue as ' + role.title.split('/')[0] : role.actionLabel}</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer Note */}
        <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <span>You can switch between roles anytime using the "Switch Role" button in the header.</span>
          <button
            onClick={() => setIsRoleModalOpen(false)}
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            Keep Current Role
          </button>
        </div>
      </div>
    </div>
  );
};
