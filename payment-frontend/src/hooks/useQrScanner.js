import { useEffect, useRef, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

// This is our custom hook
export function useQrScanner(onScanSuccess, onScanError) {
  const scannerRef = useRef(null);

  const startScan = useCallback((elementId) => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(elementId);
    }
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    scannerRef.current.start({ facingMode: "environment" }, config, onScanSuccess, onScanError)
      .catch(err => {
        console.error("Unable to start scanning.", err);
        onScanError("Unable to start scanning. Check camera permissions.");
      });
  }, [onScanSuccess, onScanError]);

  const stopScan = useCallback(() => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop()
        .then(() => {
          // console.log("QR Code scanning stopped.");
        })
        .catch(err => {
          console.error("Failed to stop scanning.", err);
        });
    }
  }, []);

  // Cleanup effect to stop the scanner when the component unmounts
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        stopScan();
      }
    };
  }, [stopScan]);

  return { startScan, stopScan };
}
