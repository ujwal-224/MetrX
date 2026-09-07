import React from 'react';
import { useApp } from '../context/AppContext';

export const Toast = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const isSuccess = toastMessage.type === 'success';
  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short transition-all">
      <div
        className={`px-4 py-3 rounded-lg shadow-xl border flex items-center gap-3 ${
          isSuccess
            ? 'bg-[#023625] text-white border-[#1f4d3a]'
            : isError
            ? 'bg-[#ba1a1a] text-white border-red-800'
            : 'bg-[#1f4d3a] text-white border-[#416654]'
        }`}
      >
        <span className="material-symbols-outlined text-xl text-[#ff985f]">
          {isSuccess ? 'verified' : isError ? 'error' : 'info'}
        </span>
        <span className="text-sm font-medium font-body-sm">{toastMessage.message}</span>
      </div>
    </div>
  );
};
