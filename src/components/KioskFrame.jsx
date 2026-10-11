import React from 'react';

export default function KioskFrame({ 
  children, 
  isFullscreen = false, 
  isPaperDispensed = false 
}) {
  return (
    <div className={isFullscreen ? 'kiosk-fullscreen-mode' : 'kiosk-chassis-wrapper'}>
      <div className={`kiosk-stand-frame ${isFullscreen ? 'kiosk-fullscreen-frame' : ''}`}>
        {!isFullscreen && (
          <div className="kiosk-bezel-top">
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.02em' }}>QWIKPRINT KIOSK</span>
            <div className="kiosk-speaker" />
            <div className="kiosk-camera" />
          </div>
        )}

        <div className="kiosk-screen">
          {children}
        </div>

        {!isFullscreen && (
          <div className="kiosk-output-tray-slot">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="kiosk-tray-light" />
              <span style={{ fontWeight: 700, letterSpacing: '0.05em' }}>OUTPUT TRAY SLOT</span>
            </div>
            <span>80 GSM LASER</span>

            {isPaperDispensed && (
              <div className="kiosk-dispensed-paper">
                <span>📄 PRINTS READY IN TRAY</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
