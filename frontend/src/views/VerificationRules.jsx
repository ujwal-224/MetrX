import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

export const VerificationRules = () => {
  const { navigateTo, showToast } = useApp();

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [selectedRuleId, setSelectedRuleId] = useState(null);

  // Destructive Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: null, // 'delete' | 'toggle'
    ruleId: null,
    ruleName: ''
  });

  // Simulator State in Modal
  const [simulatorObserved, setSimulatorObserved] = useState('9.998');

  // Form State
  const initialFormState = {
    name: '',
    instrumentType: 'Electronic Weighing Instrument',
    instrumentClass: 'Class III Commercial Medium Accuracy',
    manufacturer: '',
    capacityMin: 0,
    capacityMax: 30,
    unit: 'kg',
    applicableStandard: 'Legal Metrology (General) Rules, 2011 - Seventh Schedule',
    verificationInterval: 12,
    isActive: true,
    description: '',
    checks: [
      {
        id: 'chk-1',
        name: 'Instrument Identification & Maker Plate Verification',
        description: 'Verify model approval number, serial plate, manufacturer markings and class designation.',
        checkType: 'checklist',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 0,
        criteria: []
      },
      {
        id: 'chk-2',
        name: 'Physical Condition & Leveling Inspection',
        description: 'Inspect spirit level indicator bubble, platform cleanliness and complete enclosure.',
        checkType: 'physical',
        isMandatory: true,
        requiresPhoto: false,
        requiresDocument: false,
        sortOrder: 1,
        criteria: []
      },
      {
        id: 'chk-3',
        name: 'Measurement Accuracy & Permissible Error Test',
        description: 'Apply calibrated Class M1 working standard weights and verify observed reading within configured tolerance.',
        checkType: 'measurement',
        isMandatory: true,
        requiresPhoto: true,
        requiresDocument: false,
        sortOrder: 2,
        criteria: [
          {
            id: 'crit-1',
            parameter: 'Nominal Half Load Accuracy (10.000 kg)',
            referenceValue: 10.000,
            tolerance: 0.005,
            unit: 'kg',
            comparisonType: 'within_tolerance',
            isMandatory: true
          }
        ]
      }
    ]
  };

  const [form, setForm] = useState(initialFormState);

  // Fetch Rules from Backend API
  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await api.getVerificationRules();
      if (res.success && res.data) {
        setRules(res.data);
      }
    } catch (err) {
      console.error('[Fetch Rules Error]', err);
      showToast('Could not fetch verification rules from database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Filtered Rules
  const filteredRules = rules.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.instrumentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.applicableStandard.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.instrumentClass.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && r.isActive) ||
      (statusFilter === 'inactive' && !r.isActive);

    return matchesSearch && matchesStatus;
  });

  // Open Create Modal
  const handleOpenCreate = () => {
    setForm(initialFormState);
    setModalMode('create');
    setSelectedRuleId(null);
    setIsModalOpen(true);
  };

  // Open Edit / View Modal
  const handleOpenEdit = (rule, mode = 'edit') => {
    setSelectedRuleId(rule.id);
    setModalMode(mode);
    setForm({
      name: rule.name || '',
      instrumentType: rule.instrumentType || 'Electronic Weighing Instrument',
      instrumentClass: rule.instrumentClass || 'Class III Commercial',
      manufacturer: rule.manufacturer || '',
      capacityMin: rule.capacityMin !== undefined ? rule.capacityMin : 0,
      capacityMax: rule.capacityMax !== undefined ? rule.capacityMax : 30,
      unit: rule.unit || 'kg',
      applicableStandard: rule.applicableStandard || '',
      verificationInterval: rule.verificationInterval || 12,
      isActive: rule.isActive !== undefined ? rule.isActive : true,
      description: rule.description || '',
      checks: (rule.checks || []).map((chk, i) => ({
        id: chk.id || `chk-${i}`,
        name: chk.name,
        description: chk.description || '',
        checkType: chk.checkType || 'checklist',
        isMandatory: Boolean(chk.isMandatory),
        requiresPhoto: Boolean(chk.requiresPhoto),
        requiresDocument: Boolean(chk.requiresDocument),
        sortOrder: chk.sortOrder || i,
        criteria: (chk.criteria || []).map((c, j) => ({
          id: c.id || `crit-${j}`,
          parameter: c.parameter,
          referenceValue: c.referenceValue,
          tolerance: c.tolerance,
          unit: c.unit || rule.unit || 'kg',
          comparisonType: c.comparisonType || 'within_tolerance',
          isMandatory: Boolean(c.isMandatory)
        }))
      }))
    });
    setIsModalOpen(true);
  };

  // Check Addition
  const handleAddCheck = () => {
    setForm((prev) => ({
      ...prev,
      checks: [
        ...prev.checks,
        {
          id: `chk-temp-${Date.now()}`,
          name: 'New Inspection Check',
          description: 'Description of requirement',
          checkType: 'checklist',
          isMandatory: true,
          requiresPhoto: false,
          requiresDocument: false,
          sortOrder: prev.checks.length,
          criteria: []
        }
      ]
    }));
  };

  // Check Removal
  const handleRemoveCheck = (index) => {
    setForm((prev) => ({
      ...prev,
      checks: prev.checks.filter((_, i) => i !== index)
    }));
  };

  // Criterion Addition to a Check
  const handleAddCriterion = (checkIndex) => {
    setForm((prev) => {
      const updatedChecks = [...prev.checks];
      const targetCheck = { ...updatedChecks[checkIndex] };
      targetCheck.criteria = [
        ...(targetCheck.criteria || []),
        {
          id: `crit-temp-${Date.now()}`,
          parameter: 'Nominal Load Accuracy Test',
          referenceValue: 10.0,
          tolerance: 0.005,
          unit: prev.unit || 'kg',
          comparisonType: 'within_tolerance',
          isMandatory: true
        }
      ];
      updatedChecks[checkIndex] = targetCheck;
      return { ...prev, checks: updatedChecks };
    });
  };

  // Criterion Removal
  const handleRemoveCriterion = (checkIndex, critIndex) => {
    setForm((prev) => {
      const updatedChecks = [...prev.checks];
      const targetCheck = { ...updatedChecks[checkIndex] };
      targetCheck.criteria = targetCheck.criteria.filter((_, ci) => ci !== critIndex);
      updatedChecks[checkIndex] = targetCheck;
      return { ...prev, checks: updatedChecks };
    });
  };

  // Save Form (Create / Edit)
  const handleSaveForm = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.instrumentType.trim() || !form.applicableStandard.trim()) {
      showToast('Please fill in all mandatory basic fields (Name, Type, Standard)', 'error');
      return;
    }

    try {
      if (modalMode === 'create') {
        const res = await api.createVerificationRule(form);
        if (res.success) {
          showToast('Verification Rule successfully registered in Legal Metrology database!', 'success');
          setIsModalOpen(false);
          fetchRules();
        }
      } else if (modalMode === 'edit' && selectedRuleId) {
        const res = await api.updateVerificationRule(selectedRuleId, form);
        if (res.success) {
          showToast('Verification Rule updated successfully!', 'success');
          setIsModalOpen(false);
          fetchRules();
        }
      }
    } catch (err) {
      console.error('[Save Rule Error]', err);
      showToast(`Operation failed: ${err.message}`, 'error');
    }
  };

  // Prompt Toggle Rule Confirmation
  const promptToggleStatus = (rule) => {
    setConfirmDialog({
      isOpen: true,
      title: rule.isActive ? 'Deactivate Verification Rule' : 'Activate Verification Rule',
      message: rule.isActive
        ? `Are you sure you want to deactivate "${rule.name}"? New verification requests will no longer map to this rule.`
        : `Activate "${rule.name}" so officers and merchants can verify instruments against this standard?`,
      actionType: 'toggle',
      ruleId: rule.id,
      ruleName: rule.name
    });
  };

  // Prompt Delete Confirmation
  const promptDeleteRule = (rule) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Verification Rule',
      message: `Are you sure you want to permanently delete "${rule.name}"? This action cannot be undone and will remove all configured acceptance criteria.`,
      actionType: 'delete',
      ruleId: rule.id,
      ruleName: rule.name
    });
  };

  // Execute Confirmed Destructive Action
  const handleExecuteConfirmedAction = async () => {
    const { actionType, ruleId } = confirmDialog;
    setConfirmDialog({ isOpen: false, title: '', message: '', actionType: null, ruleId: null, ruleName: '' });

    try {
      if (actionType === 'toggle') {
        const res = await api.toggleVerificationRuleStatus(ruleId);
        if (res.success) {
          showToast(res.message || 'Status updated', 'info');
          fetchRules();
        }
      } else if (actionType === 'delete') {
        const res = await api.deleteVerificationRule(ruleId);
        if (res.success) {
          showToast('Verification Rule deleted from system', 'success');
          fetchRules();
        }
      }
    } catch (err) {
      console.error('[Action Error]', err);
      showToast(`Failed: ${err.message}`, 'error');
    }
  };

  // Calculate live test simulation for modal
  const firstCriterion = form.checks.flatMap((c) => c.criteria || [])[0];
  const simObsVal = parseFloat(simulatorObserved);
  const simRefVal = firstCriterion ? Number(firstCriterion.referenceValue) : 10.0;
  const simTol = firstCriterion ? Number(firstCriterion.tolerance) : 0.005;
  const simUnit = firstCriterion ? firstCriterion.unit : form.unit;
  const simError = !isNaN(simObsVal) ? Number((simObsVal - simRefVal).toFixed(5)) : 0;
  const simPassed = !isNaN(simObsVal) && Math.abs(simError) <= simTol;

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 min-h-screen">
      {/* Top Breadcrumb */}
      <div className="mb-4">
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <button
            onClick={() => navigateTo('admin-dashboard')}
            className="hover:text-[#023625] flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">dashboard</span>
            <span>Admin Overview</span>
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-[#023625] font-bold">Verification Rules &amp; Standards</span>
        </nav>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DADDD3]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E0702A] ring-4 ring-[#E0702A]/20"></span>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#023625]">
              DIRECTORATE OF LEGAL METROLOGY • STATUTORY RULES ENGINE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#023625] tracking-tight">
            Verification Rules &amp; Standards
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-3xl">
            Configure verification requirements, applicable standards, testing conditions and validity rules for
            different instrument types.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenCreate}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#023625] hover:bg-[#1b4a36] text-white text-xs sm:text-sm font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>+ Add Verification Rule</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 my-6">
        <div className="bg-white border border-[#DADDD3] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Total Rules</span>
          <div className="text-2xl font-black text-[#023625] mt-1">{rules.length}</div>
          <span className="text-[11px] text-gray-400 font-medium">Configured categories</span>
        </div>
        <div className="bg-white border border-[#DADDD3] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Active Rules</span>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {rules.filter((r) => r.isActive).length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Ready for field audits</span>
        </div>
        <div className="bg-white border border-[#DADDD3] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
            Verification Intervals
          </span>
          <div className="text-2xl font-black text-amber-800 mt-1">12–24 Mos</div>
          <span className="text-[11px] text-amber-600 font-medium">Dynamic re-testing cycle</span>
        </div>
        <div className="bg-white border border-[#DADDD3] rounded-xl p-4 shadow-2xs">
          <span className="text-[11px] font-bold text-[#023625] uppercase tracking-wider block">Standards</span>
          <div className="text-2xl font-black text-[#023625] mt-1">OIML / LM Rules</div>
          <span className="text-[11px] text-gray-400 font-medium">Configured criteria</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search by rule name, instrument type, standard..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm text-gray-900 focus:bg-white focus:border-[#023625] focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">Status:</span>
          <div className="inline-flex rounded-lg bg-gray-100 p-0.5 border border-gray-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                statusFilter === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({rules.length})
            </button>
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                statusFilter === 'active' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setStatusFilter('inactive')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                statusFilter === 'inactive' ? 'bg-gray-700 text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      {/* Rules Table / Cards Layout */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-xs">
          <span className="material-symbols-outlined animate-spin text-3xl text-[#023625] mb-2">progress_activity</span>
          <p className="text-xs sm:text-sm font-semibold text-gray-600">Loading statutory verification rules...</p>
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#023625] flex items-center justify-center mx-auto mb-3">
            <span className="material-symbols-outlined text-2xl">rule</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">No Verification Rules Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all'
              ? 'Try refining your search filter or clearing search terms.'
              : 'Add your first configurable verification rule to get started.'}
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 px-4 py-2 rounded-xl bg-[#023625] text-white text-xs font-bold shadow-xs hover:bg-[#1b4a36] transition-all cursor-pointer"
          >
            + Create New Rule
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50/90 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Instrument Type &amp; Rule</th>
                  <th className="py-3.5 px-4">Category / Class</th>
                  <th className="py-3.5 px-4">Capacity Range</th>
                  <th className="py-3.5 px-4">Applicable Standard</th>
                  <th className="py-3.5 px-4 text-center">Interval</th>
                  <th className="py-3.5 px-4 text-center">Required Tests</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRules.map((rule) => {
                  const checkCount = rule.checks?.length || rule._count?.checks || 0;
                  const criteriaCount = (rule.checks || []).reduce(
                    (acc, chk) => acc + (chk.criteria?.length || 0),
                    0
                  );
                  const updatedDate = new Date(rule.updatedAt || rule.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={rule.id} className="hover:bg-emerald-50/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900 text-xs sm:text-sm">{rule.name}</div>
                        <div className="text-[11px] text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-[#023625]">precision_manufacturing</span>
                          <span>{rule.instrumentType}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 text-gray-800 border border-gray-200">
                          {rule.instrumentClass}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono font-medium text-gray-700 text-xs">
                        {rule.capacityMin} – {rule.capacityMax} {rule.unit}
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600 max-w-xs truncate" title={rule.applicableStandard}>
                        {rule.applicableStandard}
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-[#023625]">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-extrabold border border-emerald-200">
                          {rule.verificationInterval}m
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div className="text-xs font-bold text-gray-800">{checkCount} Checks</div>
                        {criteriaCount > 0 && (
                          <div className="text-[10px] text-emerald-700 font-semibold">
                            {criteriaCount} tolerance test(s)
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {rule.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gray-100 text-gray-600 border border-gray-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                            INACTIVE
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => handleOpenEdit(rule, 'view')}
                            title="View Rule Details"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-[#023625] hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">visibility</span>
                          </button>
                          <button
                            onClick={() => handleOpenEdit(rule, 'edit')}
                            title="Edit Rule & Acceptance Criteria"
                            className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            onClick={() => promptToggleStatus(rule)}
                            title={rule.isActive ? 'Deactivate Rule' : 'Activate Rule'}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              rule.isActive
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            <span className="material-symbols-outlined text-base">
                              {rule.isActive ? 'toggle_on' : 'toggle_off'}
                            </span>
                          </button>
                          <button
                            onClick={() => promptDeleteRule(rule)}
                            title="Delete Verification Rule"
                            className="p-1.5 rounded-lg text-gray-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                        <div className="text-[9px] text-gray-400 mt-0.5">Updated: {updatedDate}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT / VIEW MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
            {/* Modal Header */}
            <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#023625] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-base">
                    {modalMode === 'view' ? 'visibility' : modalMode === 'edit' ? 'edit' : 'add_circle'}
                  </span>
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {modalMode === 'view'
                      ? 'View Verification Rule'
                      : modalMode === 'edit'
                      ? 'Edit Verification Rule & Standards'
                      : 'Configure New Verification Rule'}
                  </h2>
                  <p className="text-[11px] text-gray-500">
                    Define statutory specifications, inspection checks, and tolerance criteria.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveForm} className="overflow-y-auto p-5 space-y-6 flex-1 text-xs sm:text-sm">
              {/* SECTION 1: BASIC INFORMATION */}
              <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#023625] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">info</span>
                    <span>1. Basic Information</span>
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs font-semibold text-gray-600">Active Status:</span>
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      disabled={modalMode === 'view'}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded text-[#023625] focus:ring-emerald-500 cursor-pointer accent-[#023625]"
                    />
                    <span className={`text-xs font-bold ${form.isActive ? 'text-emerald-700' : 'text-gray-400'}`}>
                      {form.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Rule Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={modalMode === 'view'}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Electronic Non-Automatic Weighing Instruments (Class III)"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-[#023625] focus:ring-1 focus:ring-[#023625] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Instrument Type <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={modalMode === 'view'}
                      value={form.instrumentType}
                      onChange={(e) => setForm({ ...form, instrumentType: e.target.value })}
                      placeholder="e.g. Electronic Weighing Instrument"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-[#023625] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Instrument Category / Accuracy Class <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={modalMode === 'view'}
                      value={form.instrumentClass}
                      onChange={(e) => setForm({ ...form, instrumentClass: e.target.value })}
                      placeholder="e.g. Class III Commercial Medium Accuracy"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-[#023625] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Manufacturer (Optional)</label>
                    <input
                      type="text"
                      disabled={modalMode === 'view'}
                      value={form.manufacturer}
                      onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                      placeholder="e.g. Contech / Essae / Avery"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-[#023625] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Applicable Verification Interval <span className="text-rose-500">*</span>
                    </label>
                    <select
                      disabled={modalMode === 'view'}
                      value={form.verificationInterval}
                      onChange={(e) => setForm({ ...form, verificationInterval: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-[#023625] outline-none"
                    >
                      <option value={6}>6 Months (Semi-Annual)</option>
                      <option value={12}>12 Months (Annual - Standard)</option>
                      <option value={24}>24 Months (Biennial)</option>
                      <option value={36}>36 Months (Triennial)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Capacity Min</label>
                      <input
                        type="number"
                        step="any"
                        disabled={modalMode === 'view'}
                        value={form.capacityMin}
                        onChange={(e) => setForm({ ...form, capacityMin: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:border-[#023625] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Capacity Max</label>
                      <input
                        type="number"
                        step="any"
                        disabled={modalMode === 'view'}
                        value={form.capacityMax}
                        onChange={(e) => setForm({ ...form, capacityMax: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:border-[#023625] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Unit</label>
                      <select
                        disabled={modalMode === 'view'}
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs focus:border-[#023625] outline-none"
                      >
                        <option value="kg">kg (Kilogram)</option>
                        <option value="g">g (Gram)</option>
                        <option value="mg">mg (Milligram)</option>
                        <option value="tonne">tonne (Metric Ton)</option>
                        <option value="L">L (Litre)</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Applicable Standard / Statutory Rule Reference <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      disabled={modalMode === 'view'}
                      value={form.applicableStandard}
                      onChange={(e) => setForm({ ...form, applicableStandard: e.target.value })}
                      placeholder="e.g. Legal Metrology (General) Rules, 2011 - Seventh Schedule / OIML R-76"
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm focus:border-[#023625] outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: CONFIGURABLE TESTING REQUIREMENTS */}
              <div className="bg-gray-50/70 border border-gray-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#023625] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">checklist</span>
                      <span>2. Testing Requirements &amp; Checklist Items</span>
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Checks are completely configurable per instrument type. Not all checks are universally mandatory.
                    </p>
                  </div>
                  {modalMode !== 'view' && (
                    <button
                      type="button"
                      onClick={handleAddCheck}
                      className="px-2.5 py-1 rounded-lg bg-[#023625] text-white text-xs font-bold flex items-center gap-1 hover:bg-[#1b4a36] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                      <span>Add Check</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {form.checks.map((chk, cIdx) => (
                    <div
                      key={chk.id || cIdx}
                      className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                            {cIdx + 1}
                          </span>
                          <input
                            type="text"
                            disabled={modalMode === 'view'}
                            value={chk.name}
                            onChange={(e) => {
                              const updated = [...form.checks];
                              updated[cIdx].name = e.target.value;
                              setForm({ ...form, checks: updated });
                            }}
                            placeholder="Check name..."
                            className="font-bold text-xs sm:text-sm text-gray-900 bg-transparent border-b border-gray-200 focus:border-[#023625] outline-none flex-1 pb-0.5"
                          />
                        </div>

                        {modalMode !== 'view' && form.checks.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveCheck(cIdx)}
                            className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                            title="Remove Check"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        )}
                      </div>

                      <input
                        type="text"
                        disabled={modalMode === 'view'}
                        value={chk.description}
                        onChange={(e) => {
                          const updated = [...form.checks];
                          updated[cIdx].description = e.target.value;
                          setForm({ ...form, checks: updated });
                        }}
                        placeholder="Description of required testing steps and inspection instructions..."
                        className="w-full text-xs text-gray-600 bg-gray-50/80 px-2.5 py-1.5 rounded-md border border-gray-200 outline-none"
                      />

                      {/* Check Options */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600 pt-1">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={modalMode === 'view'}
                            checked={chk.isMandatory}
                            onChange={(e) => {
                              const updated = [...form.checks];
                              updated[cIdx].isMandatory = e.target.checked;
                              setForm({ ...form, checks: updated });
                            }}
                            className="w-3.5 h-3.5 rounded text-[#023625] cursor-pointer accent-[#023625]"
                          />
                          <span className={chk.isMandatory ? 'font-bold text-gray-900' : ''}>Mandatory Check</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={modalMode === 'view'}
                            checked={chk.requiresPhoto}
                            onChange={(e) => {
                              const updated = [...form.checks];
                              updated[cIdx].requiresPhoto = e.target.checked;
                              setForm({ ...form, checks: updated });
                            }}
                            className="w-3.5 h-3.5 rounded text-[#023625] cursor-pointer accent-[#023625]"
                          />
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">photo_camera</span>
                            Requires Photo
                          </span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={modalMode === 'view'}
                            checked={chk.requiresDocument}
                            onChange={(e) => {
                              const updated = [...form.checks];
                              updated[cIdx].requiresDocument = e.target.checked;
                              setForm({ ...form, checks: updated });
                            }}
                            className="w-3.5 h-3.5 rounded text-[#023625] cursor-pointer accent-[#023625]"
                          />
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">description</span>
                            Requires Document
                          </span>
                        </label>

                        {/* Measurement Criteria Sub-section for this check */}
                        <div className="ml-auto">
                          {modalMode !== 'view' && (
                            <button
                              type="button"
                              onClick={() => handleAddCriterion(cIdx)}
                              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 flex items-center gap-1 cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-xs">add_chart</span>
                              <span>+ Add Measurement Criterion</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* SECTION 3: MEASUREMENT ACCEPTANCE CRITERIA */}
                      {chk.criteria && chk.criteria.length > 0 && (
                        <div className="mt-2.5 pt-2.5 border-t border-gray-100 space-y-2 bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm text-emerald-700">straighten</span>
                            <span>Configured Measurement Acceptance Criteria</span>
                          </div>

                          {chk.criteria.map((crit, crIdx) => (
                            <div
                              key={crit.id || crIdx}
                              className="bg-white border border-emerald-200 rounded-lg p-2.5 space-y-2 text-xs"
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
                                <div className="sm:col-span-2">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">
                                    Test Parameter
                                  </label>
                                  <input
                                    type="text"
                                    disabled={modalMode === 'view'}
                                    value={crit.parameter}
                                    onChange={(e) => {
                                      const updated = [...form.checks];
                                      updated[cIdx].criteria[crIdx].parameter = e.target.value;
                                      setForm({ ...form, checks: updated });
                                    }}
                                    placeholder="e.g. Accuracy at Half Load"
                                    className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-[#023625]"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">
                                    Reference Value
                                  </label>
                                  <input
                                    type="number"
                                    step="any"
                                    disabled={modalMode === 'view'}
                                    value={crit.referenceValue}
                                    onChange={(e) => {
                                      const updated = [...form.checks];
                                      updated[cIdx].criteria[crIdx].referenceValue = parseFloat(e.target.value) || 0;
                                      setForm({ ...form, checks: updated });
                                    }}
                                    className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono outline-none focus:border-[#023625]"
                                  />
                                </div>

                                <div>
                                  <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">
                                    Tolerance (±)
                                  </label>
                                  <input
                                    type="number"
                                    step="any"
                                    disabled={modalMode === 'view'}
                                    value={crit.tolerance}
                                    onChange={(e) => {
                                      const updated = [...form.checks];
                                      updated[cIdx].criteria[crIdx].tolerance = parseFloat(e.target.value) || 0;
                                      setForm({ ...form, checks: updated });
                                    }}
                                    className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-mono outline-none focus:border-[#023625]"
                                  />
                                </div>

                                <div className="flex items-center gap-1">
                                  <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-0.5">
                                      Comparison
                                    </label>
                                    <select
                                      disabled={modalMode === 'view'}
                                      value={crit.comparisonType}
                                      onChange={(e) => {
                                        const updated = [...form.checks];
                                        updated[cIdx].criteria[crIdx].comparisonType = e.target.value;
                                        setForm({ ...form, checks: updated });
                                      }}
                                      className="w-full px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[11px] outline-none"
                                    >
                                      <option value="within_tolerance">Within tolerance</option>
                                      <option value="greater_than_min">Greater than min</option>
                                      <option value="less_than_max">Less than max</option>
                                      <option value="within_range">Within range</option>
                                      <option value="equal_to">Equal to reference</option>
                                    </select>
                                  </div>
                                  {modalMode !== 'view' && (
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveCriterion(cIdx, crIdx)}
                                      className="text-gray-400 hover:text-rose-600 p-1 mt-4 cursor-pointer"
                                      title="Remove Criterion"
                                    >
                                      <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE ACCEPTANCE TEST SIMULATOR SANDBOX */}
              {firstCriterion && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-emerald-800 text-base">science</span>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                      Interactive Tolerance Simulator (Demo Preview)
                    </h4>
                  </div>
                  <p className="text-[11px] text-emerald-800 mb-3">
                    Test the configured acceptance limit: Reference{' '}
                    <strong className="font-mono">
                      {simRefVal} {simUnit}
                    </strong>
                    , Configured Tolerance{' '}
                    <strong className="font-mono">
                      ±{simTol} {simUnit}
                    </strong>
                    .
                  </p>

                  <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-emerald-200 text-xs">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-500">Test Observed Value</span>
                      <input
                        type="number"
                        step="any"
                        value={simulatorObserved}
                        onChange={(e) => setSimulatorObserved(e.target.value)}
                        className="w-32 px-2.5 py-1 bg-gray-50 border border-gray-300 rounded font-mono font-bold text-gray-900 mt-0.5 outline-none focus:border-[#023625]"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-500">Calculated Error</span>
                      <span className="font-mono font-extrabold text-gray-800 block mt-1">
                        {simError > 0 ? `+${simError}` : simError} {simUnit}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-500">Permissible Band</span>
                      <span className="font-mono text-gray-600 block mt-1">
                        [{Number((simRefVal - simTol).toFixed(4))}, {Number((simRefVal + simTol).toFixed(4))}] {simUnit}
                      </span>
                    </div>
                    <div className="ml-auto">
                      <span className="block text-[10px] uppercase font-bold text-gray-500 mb-0.5">Rules Engine Verdict</span>
                      {simPassed ? (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs inline-flex items-center gap-1 border border-emerald-300">
                          <span className="material-symbols-outlined text-sm">check_circle</span>
                          PASS
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 font-extrabold text-xs inline-flex items-center gap-1 border border-rose-300">
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          FAIL (Outside Limit)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#023625] hover:bg-[#1b4a36] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>{modalMode === 'edit' ? 'Update Verification Rule' : 'Save & Activate Rule'}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG FOR DESTRUCTIVE ACTIONS */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-xl">
                {confirmDialog.actionType === 'delete' ? 'delete_forever' : 'warning'}
              </span>
            </div>
            <h3 className="text-base font-bold text-gray-900">{confirmDialog.title}</h3>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{confirmDialog.message}</p>
            <div className="flex items-center justify-end gap-2.5 mt-5">
              <button
                type="button"
                onClick={() => setConfirmDialog({ isOpen: false, title: '', message: '', actionType: null, ruleId: null, ruleName: '' })}
                className="px-3.5 py-1.5 rounded-lg border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedAction}
                className={`px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer ${
                  confirmDialog.actionType === 'delete' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-[#023625] hover:bg-[#1b4a36]'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
