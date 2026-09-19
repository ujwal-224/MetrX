import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../context/AppContext';

export const AdminDashboard = () => {
  const { t } = useTranslation();
  const {
    inspectors,
    merchants,
    operations,
    handleCreateInspector,
    handleToggleInspectorStatus,
    handleDeleteInspector,
    handleAssignInspectorToMerchant,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('operations'); // 'operations' | 'inspectors' | 'merchants'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Inspector Form State
  const [newInspForm, setNewInspForm] = useState({
    name: '',
    badgeNumber: '',
    email: '',
    password: '',
    zone: 'Ward 4 (Commercial Circle)',
    phone: ''
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!newInspForm.name.trim()) {
      showToast(t('toast.enterInspectorName', 'Please enter inspector name'), 'error');
      return;
    }
    handleCreateInspector(newInspForm);
    setNewInspForm({
      name: '',
      badgeNumber: '',
      email: '',
      password: '',
      zone: 'Ward 4 (Commercial Circle)',
      phone: ''
    });
    setIsCreateModalOpen(false);
  };

  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 min-h-screen">
      {/* Header Banner - Rich Metrology Forest Green Palette */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#DADDD3]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E0702A] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#023625]">
              {t('admin.deptSubtitle', 'Directorate of Legal Metrology • Administration')}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#023625] tracking-tight">
            {t('admin.title', 'Department Admin Dashboard')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t('admin.loggedIn', 'Logged In')}: <strong className="text-gray-900">Admin</strong>
          </p>
        </div>

        {/* Action Button to Provision Inspector */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#023625] hover:bg-[#1b4a36] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">person_add</span>
            <span>{t('admin.provisionInspector', 'Provision New Inspector')}</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards - Green & Amber Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 my-5 sm:my-6">
        <div className="bg-white border-2 border-[#DADDD3] hover:border-[#023625] rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">{t('admin.liveOperations', 'Live Operations')}</span>
            <span className="w-8 h-8 rounded-lg bg-[#E7F0E8] text-[#023625] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">sync_saved_locally</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#023625]">{operations.length} {t('admin.activeAudits', 'Active Audits')}</div>
          <span className="text-xs text-[#E0702A] font-semibold flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E0702A] animate-ping"></span>
            {t('admin.realtimeTracking', 'Real-time tracking of inspectors & shops')}
          </span>
        </div>

        <div className="bg-white border-2 border-[#DADDD3] hover:border-[#023625] rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500">{t('admin.authorizedInspectors', 'Authorized Inspectors')}</span>
            <span className="w-8 h-8 rounded-lg bg-[#E7F0E8] text-[#023625] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">badge</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#023625]">{inspectors.length} {t('admin.fieldOfficers', 'Field Officers')}</div>
          <span className="text-xs text-[#2E7D32] font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">verified</span>
            {t('admin.adminCredentialsOnly', 'Admin-Provisioned Credentials Only')}
          </span>
        </div>

        <div
          onClick={() => setActiveTab('merchants')}
          className="bg-white border-2 border-[#DADDD3] hover:border-[#E0702A] rounded-2xl p-4 sm:p-5 shadow-xs transition-all sm:col-span-2 lg:col-span-1 cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-gray-500 group-hover:text-[#E0702A]">{t('admin.registeredShopOwnersClick', 'Registered Shop Owners (Click to view)')}</span>
            <span className="w-8 h-8 rounded-lg bg-[#FAF8F4] border border-amber-200 text-[#E0702A] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">storefront</span>
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-[#023625]">{merchants.length} {t('admin.storesSynced', 'Stores Synced')}</div>
          {merchants.some((m) => !m.assignedInspector) ? (
            <span className="text-xs text-[#E0702A] font-bold mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#E0702A] animate-ping"></span>
              <span>{merchants.filter((m) => !m.assignedInspector).length} {t('admin.pendingAssignment', 'Pending Inspector Assignment')}</span>
            </span>
          ) : (
            <span className="text-xs text-gray-600 font-medium mt-1 block">
              {t('admin.allStoresAllocated', 'All stores allocated to officers')}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#DADDD3] mb-5 sm:mb-6 overflow-x-auto no-scrollbar pb-1 touch-pan-x">
        <button
          onClick={() => setActiveTab('operations')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'operations'
              ? 'border-[#023625] text-[#023625]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">route</span>
          <span>{t('admin.tabLiveOps', '1. Live Field Operations')} ({operations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inspectors')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'inspectors'
              ? 'border-[#023625] text-[#023625]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">badge</span>
          <span>{t('admin.tabInspectors', '2. Inspector Accounts')} ({inspectors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('merchants')}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
            activeTab === 'merchants'
              ? 'border-[#023625] text-[#023625]'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <span className="material-symbols-outlined text-base">storefront</span>
          <span>{t('admin.tabMerchants', '3. Registered Shop Owners')} ({merchants.length})</span>
          {merchants.some((m) => !m.assignedInspector) && (
            <span className="px-2 py-0.5 rounded-full bg-[#E0702A] text-white text-[10px] font-bold animate-pulse">
              {merchants.filter((m) => !m.assignedInspector).length} {t('admin.unassigned', 'Unassigned')}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: Live Inspector Operations on Shops */}
      {activeTab === 'operations' && (
        <div className="bg-white border border-[#DADDD3] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#DADDD3] bg-[#FAF8F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#023625]">
                {t('admin.realtimeOpsTitle', 'Real-Time Metrological Operations by Field Officers')}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {t('admin.realtimeOpsDesc', 'Monitoring which inspector is conducting which calibration & stamping operation on which shop owner:')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7F0E8] text-[#023625] text-xs font-bold self-start sm:self-auto border border-[#c3ecd5]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              {t('admin.liveDispatchFeed', 'Live Dispatch Feed')}
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead>
                <tr className="bg-[#F6F2E9] border-b border-[#DADDD3] text-[#023625] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">{t('admin.thFieldInspector', 'Field Inspector')}</th>
                  <th className="py-3.5 px-4">{t('admin.thTargetShop', 'Target Shop & UID')}</th>
                  <th className="py-3.5 px-4">{t('admin.thOperationTask', 'Operation / Task')}</th>
                  <th className="py-3.5 px-4">{t('admin.thInstrument', 'Weighing Instrument')}</th>
                  <th className="py-3.5 px-4">{t('admin.thSlot', 'Scheduled Slot')}</th>
                  <th className="py-3.5 px-4">{t('admin.thLiveStatus', 'Live Status')}</th>
                  <th className="py-3.5 px-4 text-right">{t('admin.thAdminAction', 'Admin Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7F0E8]">
                {operations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-gray-300">radar</span>
                        <span className="font-semibold text-sm text-gray-700">{t('empty.adminOpsTitle', 'No Active Field Operations')}</span>
                        <span className="text-xs text-gray-400">{t('empty.adminOpsDesc', 'Scheduled shop visits and active audits will stream here in real time.')}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  operations.map((op) => (
                    <tr key={op.id} className="hover:bg-[#FAF8F4] transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#023625]">badge</span>
                        <span>{op.inspectorName}</span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-500 pl-5">{op.badgeNumber}</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-bold text-[#023625] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-sm text-[#E0702A]">storefront</span>
                        <span>{op.shopName}</span>
                      </div>
                      <span className="text-[11px] font-mono text-gray-500 pl-5">{op.merchantUid} • {op.zone}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-800 block">
                        {op.operationType === 'On-Site Stamping & Verification'
                          ? t('admin.onSiteStamping', 'On-Site Stamping & Verification')
                          : op.operationType}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {op.remarks?.startsWith('Assigned to ')
                          ? `${t('admin.assignedTo', 'Assigned to')} ${op.remarks.replace('Assigned to ', '')}`
                          : op.remarks === 'Requires Inspector Assignment by Controller'
                          ? t('admin.requiresInspectorAssignment', 'Requires Inspector Assignment by Controller')
                          : op.remarks}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="bg-[#FAF8F4] border border-[#DADDD3] px-2 py-1 rounded text-[11px] font-mono text-gray-700 block">
                        {op.scaleModel}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-gray-700 font-medium">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-gray-400">schedule</span>
                        {op.slot?.includes('(Assigned Slot)')
                          ? op.slot.replace('(Assigned Slot)', `(${t('admin.assignedSlot', 'Assigned Slot')})`)
                          : op.slot === 'Awaiting Inspector Assignment'
                          ? t('admin.awaitingInspectorAssignment', 'Awaiting Inspector Assignment')
                          : op.slot}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        op.statusType === 'completed'
                          ? 'bg-[#E7F0E8] text-[#2E7D32] border border-[#c3ecd5]'
                          : op.statusType === 'in_progress'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          op.statusType === 'completed' ? 'bg-emerald-600' : 'bg-[#E0702A] animate-ping'
                        }`}></span>
                        <span>
                          {op.liveStatus === 'Inspector Assigned • Pending Docs'
                            ? t('admin.inspectorAssignedPendingDocs', 'Inspector Assigned • Pending Docs')
                            : op.liveStatus === 'Docs Verified • Ready for Visit'
                            ? t('admin.docsVerifiedReady', 'Docs Verified • Ready for Visit')
                            : op.liveStatus === 'New Registration • Pending Allocation'
                            ? t('admin.newRegPendingAllocation', 'New Registration • Pending Allocation')
                            : op.liveStatus}
                        </span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const targetMerch = merchants.find(
                                (m) =>
                                  m.id === op.id?.replace('OP-', '') ||
                                  m.name === op.shopName ||
                                  m.merchantUid === op.merchantUid
                              );
                              if (targetMerch) {
                                handleAssignInspectorToMerchant(targetMerch.id, e.target.value);
                              } else {
                                handleAssignInspectorToMerchant(op.shopName, e.target.value);
                              }
                              e.target.value = '';
                            }
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer outline-none transition-all shadow-xs ${
                            op.badgeNumber === 'LM-PENDING'
                              ? 'bg-[#023625] text-white border border-[#023625] hover:bg-[#1b4a36]'
                              : 'bg-white hover:bg-gray-50 text-[#023625] border border-[#DADDD3] hover:border-[#023625]'
                          }`}
                        >
                          <option value="" disabled className="text-gray-700 bg-white">
                            {op.badgeNumber === 'LM-PENDING' ? t('admin.assignInspector', 'Assign Inspector...') : t('admin.reassignInspector', 'Reassign Inspector...')}
                          </option>
                          {inspectors
                            .filter((insp) => insp.status === 'Active')
                            .map((insp) => (
                              <option key={insp.id} value={insp.id} className="text-gray-900 bg-white">
                                {insp.name} ({insp.badgeNumber} • {insp.zone?.split(' ')[0] || 'Ward'})
                              </option>
                            ))}
                        </select>

                        {op.badgeNumber !== 'LM-PENDING' && (
                          <button
                            onClick={() => showToast(`Auditing live field telemetry for ${op.inspectorName} at ${op.shopName}`, 'info')}
                            className="px-2.5 py-1 text-xs bg-white hover:bg-gray-100 border border-[#DADDD3] text-[#023625] font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap"
                          >
                            {t('admin.dossier', 'Dossier')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Inspector Accounts (Admin-Provisioned ONLY) */}
      {activeTab === 'inspectors' && (
        <div className="bg-white border border-[#DADDD3] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#DADDD3] bg-[#FAF8F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#023625]">
                {t('admin.inspectorLedgerTitle', 'Authorized Inspector Accounts Ledger')}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {t('admin.inspectorLedgerDesc', 'Inspectors can ONLY log in with credentials created below. Outside signups are strictly prohibited:')}
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#023625] hover:bg-[#1b4a36] text-white text-xs font-bold flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>{t('admin.createInspectorAccount', 'Create Inspector Account')}</span>
            </button>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="bg-[#F6F2E9] border-b border-[#DADDD3] text-[#023625] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">{t('admin.thBadgeNumber', 'Badge Number')}</th>
                  <th className="py-3.5 px-4">{t('admin.thInspectorName', 'Inspector Name')}</th>
                  <th className="py-3.5 px-4">{t('admin.thJurisdictionZone', 'Jurisdiction Zone')}</th>
                  <th className="py-3.5 px-4">{t('admin.thAuthorizedEmail', 'Authorized Login Email')}</th>
                  <th className="py-3.5 px-4">{t('common.status', 'Status')}</th>
                  <th className="py-3.5 px-4 text-right">{t('admin.thAccessControl', 'Access Control')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7F0E8]">
                {inspectors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-gray-300">badge</span>
                        <span className="font-semibold text-sm text-gray-700">{t('empty.adminInspectorsTitle', 'No Inspector Accounts Provisioned')}</span>
                        <span className="text-xs text-gray-400">{t('empty.adminInspectorsDesc', 'Click "Create Inspector Account" above to provision new official inspector credentials.')}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  inspectors.map((insp) => (
                    <tr key={insp.id} className="hover:bg-[#FAF8F4] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#023625]">
                        {insp.badgeNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{insp.name}</div>
                        <div className="text-[11px] text-gray-500">{insp.phone}</div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        {insp.zone}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-gray-800">
                        <div>{insp.email}</div>
                        <div className="text-[10px] text-gray-400">Password: ••••••••</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          insp.status === 'Active'
                            ? 'bg-[#E7F0E8] text-[#2E7D32] border border-[#c3ecd5]'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            insp.status === 'Active' ? 'bg-emerald-600' : 'bg-red-600'
                          }`}></span>
                          <span>{insp.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleToggleInspectorStatus(insp.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              insp.status === 'Active'
                                ? 'bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800'
                                : 'bg-[#E7F0E8] hover:bg-[#c3ecd5] border border-[#c3ecd5] text-[#023625]'
                            }`}
                            title={insp.status === 'Active' ? t('admin.suspendAccess', 'Suspend Access') : t('admin.reactivate', 'Reactivate')}
                          >
                            {insp.status === 'Active' ? t('admin.suspendAccess', 'Suspend Access') : t('admin.reactivate', 'Reactivate')}
                          </button>

                          <button
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to permanently delete inspector "${insp.name}" (${insp.badgeNumber})?`)) {
                                handleDeleteInspector(insp.id);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-all flex items-center gap-1 cursor-pointer"
                            title={t('aria.deleteInspector', 'Permanently Delete Inspector Account')}
                            aria-label={t('aria.deleteInspector', 'Permanently Delete Inspector Account')}
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                            <span>{t('admin.delete', 'Delete')}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Registered Shop Owners (Self-Registered by Merchants) */}
      {activeTab === 'merchants' && (
        <div className="bg-white border border-[#DADDD3] rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#DADDD3] bg-[#FAF8F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#023625]">
                {t('admin.merchantsDirTitle', 'Registered Shop Owners & Merchants Directory')}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {t('admin.merchantsDirDesc', 'Stores created by merchants via portal self-registration are dynamically synchronized here:')}
              </p>
            </div>
            <span className="text-xs font-bold text-[#E0702A] bg-[#FAF8F4] px-3 py-1 rounded-full border border-amber-200">
              {merchants.length} {t('admin.totalMerchants', 'Total Merchants')}
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs min-w-[780px]">
              <thead>
                <tr className="bg-[#F6F2E9] border-b border-[#DADDD3] text-[#023625] font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">UID</th>
                  <th className="py-3.5 px-4">{t('admin.thShopName', 'Establishment Name')}</th>
                  <th className="py-3.5 px-4">{t('admin.thOwnerContact', 'Owner Name & Contact')}</th>
                  <th className="py-3.5 px-4">{t('admin.thZoneWard', 'Zone / Ward')}</th>
                  <th className="py-3.5 px-4">{t('admin.thRegisteredScales', 'Registered Scales')}</th>
                  <th className="py-3.5 px-4">{t('admin.thAssignedInspector', 'Assigned Inspector')}</th>
                  <th className="py-3.5 px-4 text-right">{t('admin.thAssignOfficer', 'Assign / Reassign Officer')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7F0E8]">
                {merchants.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-gray-300">storefront</span>
                        <span className="font-semibold text-sm text-gray-700">{t('empty.adminMerchantsTitle', 'No Registered Establishments Yet')}</span>
                        <span className="text-xs text-gray-400">{t('empty.adminMerchantsDesc', 'Stores registered by merchants will appear here for inspector allocation.')}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  merchants.map((m) => {
                    const isUnassigned = !m.assignedInspector;
                    return (
                      <tr
                        key={m.id}
                        className={`transition-colors ${
                          isUnassigned
                            ? 'bg-amber-50/50 hover:bg-amber-50/80'
                            : 'hover:bg-[#FAF8F4]'
                        }`}
                      >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#E0702A]">
                        {m.merchantUid}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-gray-900">{m.name}</div>
                        <div className="text-[11px] font-mono text-gray-500">{m.tradeLicense}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-gray-800">{m.ownerName}</div>
                        <div className="text-[11px] text-gray-500">{m.phone}</div>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700">
                        {m.zone}
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {m.registeredScales} commercial scale(s)
                      </td>

                      <td className="py-3.5 px-4">
                        {m.assignedInspector ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#023625] bg-[#E7F0E8] px-2.5 py-0.5 rounded-full border border-[#c3ecd5]">
                            <span className="material-symbols-outlined text-xs">badge</span>
                            <span>{m.assignedInspector}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
                            <span className="material-symbols-outlined text-xs">pending</span>
                            <span>{t('admin.pendingAllocation', 'Pending Allocation')}</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end">
                          <select
                            defaultValue=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAssignInspectorToMerchant(m.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className={`border rounded-lg px-2.5 py-1 text-xs font-semibold cursor-pointer outline-none transition-all shadow-xs ${
                              isUnassigned
                                ? 'bg-[#023625] text-white border-[#023625] hover:bg-[#1b4a36]'
                                : 'bg-white hover:bg-gray-50 text-[#023625] border-[#DADDD3] focus:border-[#023625]'
                            }`}
                          >
                            <option value="" disabled className="text-gray-700 bg-white">
                              {m.assignedInspector ? t('admin.reassignInspector', 'Reassign Officer...') : t('admin.assignInspector', 'Assign Inspector Now...')}
                            </option>
                            {inspectors
                              .filter((insp) => insp.status === 'Active')
                              .map((insp) => (
                                <option key={insp.id} value={insp.id} className="text-gray-900 bg-white">
                                  {insp.name} ({insp.badgeNumber} • {insp.zone.split(' ')[0]})
                                </option>
                              ))}
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Create / Provision New Inspector Account */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-gray-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl border border-[#DADDD3] relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#DADDD3]">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#E7F0E8] text-[#023625] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">person_add</span>
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-[#023625]">{t('admin.modalTitle', 'Provision New Field Inspector')}</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500">{t('admin.modalSubtitle', 'Government Legal Metrology Enforcement Officer')}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center shrink-0"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="pt-4 space-y-3.5 sm:space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('admin.labelFullName', 'Inspector Full Name')} *</label>
                <input
                  type="text"
                  required
                  placeholder={t('form.officerNamePlaceholder', 'e.g. Insp. M. Patil')}
                  value={newInspForm.name}
                  onChange={(e) => setNewInspForm({ ...newInspForm, name: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('admin.labelBadgeNumber', 'Badge Number')} *</label>
                  <input
                    type="text"
                    placeholder={t('form.badgeNumberPlaceholder', 'e.g. LM-BLR-518')}
                    value={newInspForm.badgeNumber}
                    onChange={(e) => setNewInspForm({ ...newInspForm, badgeNumber: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('admin.labelPhone', 'Phone Number')}</label>
                  <input
                    type="text"
                    placeholder={t('form.phonePlaceholder', '+91 98450 00000')}
                    value={newInspForm.phone}
                    onChange={(e) => setNewInspForm({ ...newInspForm, phone: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('admin.labelAssignedZone', 'Assigned Zone / Ward')}</label>
                <select
                  value={newInspForm.zone}
                  onChange={(e) => setNewInspForm({ ...newInspForm, zone: e.target.value })}
                  className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#023625]"
                >
                  <option value="Ward 4 (Commercial Circle)">Ward 4 (Commercial Circle)</option>
                  <option value="Ward 2 (Commercial Ganj)">Ward 2 (Commercial Ganj)</option>
                  <option value="Ward 1 (APMC Yard)">Ward 1 (APMC Yard)</option>
                  <option value="Zone 5 (Outer Ring Road)">Zone 5 (Outer Ring Road)</option>
                  <option value="Zone 3 (Industrial Hub)">Zone 3 (Industrial Hub)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('admin.labelLoginEmail', 'Login Email')} *</label>
                  <input
                    type="email"
                    placeholder={t('form.emailPlaceholder', 'officer@metrx.com')}
                    value={newInspForm.email}
                    onChange={(e) => setNewInspForm({ ...newInspForm, email: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">{t('admin.labelPassword', 'Assigned Password')} *</label>
                  <input
                    type="password"
                    placeholder={t('form.passwordPlaceholder', '••••••••')}
                    value={newInspForm.password}
                    onChange={(e) => setNewInspForm({ ...newInspForm, password: e.target.value })}
                    className="w-full bg-[#FAF8F4] border border-[#DADDD3] rounded-xl p-2.5 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#023625]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#DADDD3] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-[#DADDD3] rounded-xl text-gray-700 font-semibold hover:bg-gray-100"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#023625] hover:bg-[#1b4a36] text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  {t('admin.btnCreateAccount', 'Create & Issue Credentials')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
