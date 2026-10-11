import React from 'react';
import { Wifi, ShieldCheck } from 'lucide-react';

export default function Footer({ kioskId = 'QW-024', status = 'READY TO PRINT' }) {
  return (
    <footer className="kiosk-footer-status">
      <div className="kiosk-status-badge">
        <span className="kiosk-status-dot" />
        <span>KIOSK {kioskId} · {status}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.75 }}>
        <ShieldCheck size={13} strokeWidth={2} title="Secure Kiosk Session" />
        <Wifi size={13} strokeWidth={2.2} title="High Speed Kiosk Network Connected" />
      </div>
    </footer>
  );
}
