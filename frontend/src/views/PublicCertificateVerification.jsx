import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const PublicCertificateVerification = ({ certificateId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await api.verifyCertificate(certificateId);
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.message || 'Certificate not found');
        }
      } catch (err) {
        setError(err.message || 'Certificate not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#023625] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#023625] font-bold text-lg">Verifying Certificate...</p>
      </div>
    );
  }

  // Handle NOT FOUND state
  if (error || !data || data.currentStatus === 'NOT_FOUND') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <span className="material-symbols-outlined text-4xl">error</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Certificate Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8 text-sm sm:text-base">
          The requested certificate ID <strong className="text-gray-900">{certificateId}</strong> could not be found in the official MetrX registry.
        </p>
        <button
          onClick={() => window.location.href = '/'}
          className="px-6 py-2.5 bg-[#023625] hover:bg-[#1b4a36] text-white rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">home</span>
          Return to Home
        </button>
      </div>
    );
  }

  const {
    currentStatus,
    certId,
    instrumentModel,
    serialNumber,
    shopName,
    shopAddress,
    verifiedDate,
    validUntil,
    inspectorName,
    inspectorBadge
  } = data;

  const isExpired = currentStatus === 'EXPIRED';
  const isRevoked = currentStatus === 'REVOKED';
  const isValid = currentStatus === 'VALID' || currentStatus === 'EXPIRING_SOON';

  return (
    <div className="w-full max-w-2xl mx-auto my-8 px-4">
      <div className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden selection:bg-[#E7F0E8] selection:text-[#023625]">
        
        {/* Header */}
        <div className="bg-[#023625] text-white p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden">
          {/* Subtle background crest */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-[160px]">verified_user</span>
          </div>

          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 flex items-center justify-center text-emerald-300 shadow-inner mb-3 border border-white/20 relative z-10">
            <span className="material-symbols-outlined text-3xl">balance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-1 relative z-10">MetrX</h1>
          <p className="text-emerald-200 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase mb-5 relative z-10">Certificate Verification</p>
          
          {/* Status Badge */}
          <div className={`px-5 py-2 sm:px-6 sm:py-2.5 rounded-full border-2 font-black text-base sm:text-xl uppercase tracking-widest shadow-lg relative z-10 flex items-center gap-2 ${
            isValid ? 'bg-emerald-100 text-emerald-800 border-emerald-400' :
            isExpired ? 'bg-rose-100 text-rose-800 border-rose-400' :
            isRevoked ? 'bg-red-100 text-red-900 border-red-500' :
            'bg-gray-100 text-gray-800 border-gray-400'
          }`}>
            <span className="material-symbols-outlined text-[1.2em]">
              {isValid ? 'check_circle' : (isExpired || isRevoked) ? 'cancel' : 'help'}
            </span>
            {currentStatus}
          </div>
        </div>

        {/* Certificate Details */}
        <div className="p-5 sm:p-8 bg-[#F9FAFB] flex flex-col gap-4">
          <div className="flex flex-col text-center mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Certificate ID</span>
            <span className="text-xl sm:text-2xl font-mono font-black text-gray-900 bg-white border border-gray-200 rounded-lg px-4 py-1.5 self-center shadow-sm">
              {certId}
            </span>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-[11px] font-bold text-gray-500 uppercase mb-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">scale</span> Instrument
                </span>
                <span className="block text-sm font-bold text-gray-900">{instrumentModel}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-500 uppercase mb-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">pin</span> Serial Number
                </span>
                <span className="block text-sm font-bold text-gray-900">{serialNumber}</span>
              </div>
            </div>
            
            <hr className="border-gray-100" />
            
            <div>
              <span className="block text-[11px] font-bold text-gray-500 uppercase mb-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">storefront</span> Owner / Shop
              </span>
              <span className="block text-sm font-bold text-gray-900">{shopName}</span>
              <span className="block text-xs text-gray-600 mt-0.5">{shopAddress}</span>
            </div>

            <hr className="border-gray-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="block text-[11px] font-bold text-gray-500 uppercase mb-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">event_available</span> Verification Date
                </span>
                <span className="block text-sm font-bold text-gray-900">{verifiedDate}</span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-gray-500 uppercase mb-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">event_busy</span> Valid Until
                </span>
                <span className={`block text-sm font-bold ${isExpired ? 'text-rose-600' : 'text-gray-900'}`}>{validUntil}</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            <div>
              <span className="block text-[11px] font-bold text-gray-500 uppercase mb-0.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">badge</span> Verified By
              </span>
              <span className="block text-sm font-bold text-gray-900">{inspectorName}</span>
              <span className="block text-xs text-gray-600 mt-0.5">Officer Badge: {inspectorBadge}</span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-500 font-medium">
            <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
            <p>Fetched securely from State Metrology Registry.</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-95"
          >
            Scan Another
          </button>
        </div>

      </div>
    </div>
  );
};
