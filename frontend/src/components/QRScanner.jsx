import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export const QRScanner = ({ onScanSuccess, onClose }) => {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const html5Qrcode = new Html5Qrcode('qr-reader');

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    html5Qrcode.start({ facingMode: 'environment' }, config, (decodedText) => {
      // Pause or stop scanning on success
      html5Qrcode.stop().then(() => {
        onScanSuccess(decodedText);
      }).catch((err) => {
        console.error('Failed to stop scanner', err);
        onScanSuccess(decodedText);
      });
    }, (errorMessage) => {
      // Ignored for now, continuously throws on empty frames
    }).catch((err) => {
      console.error('Failed to start scanner', err);
      setError('Could not access camera. Please ensure camera permissions are granted.');
    });

    scannerRef.current = html5Qrcode;

    return () => {
      if (scannerRef.current?.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 text-[#023625] flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
            </span>
            <h3 className="text-base font-bold text-[#023625]">Scan Official QR Code</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {error ? (
          <div className="text-center p-4">
            <div className="text-rose-600 mb-2 flex justify-center">
              <span className="material-symbols-outlined text-3xl">no_photography</span>
            </div>
            <p className="text-sm text-gray-700">{error}</p>
          </div>
        ) : (
          <div className="w-full flex justify-center bg-black rounded-lg overflow-hidden">
            <div id="qr-reader" className="w-full max-w-[300px]" />
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-[11px] text-gray-500 font-medium">
            Point your camera at the QR code on the MetrX Verification Certificate.
          </p>
        </div>
      </div>
    </div>
  );
};
