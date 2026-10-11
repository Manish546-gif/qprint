import React, { useState, useEffect } from 'react';
import { Printer, CheckCircle2, Clock } from 'lucide-react';

export default function Screen9PrintingProgress({ totalPages, kioskId, onDone }) {
  const [printed, setPrinted] = useState(0);
  const [progress, setProgress] = useState(0);
  const [secs, setSecs] = useState(20);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress(p => {
        const next = p + 4;
        setPrinted(Math.min(totalPages, Math.ceil((next / 100) * totalPages)));
        setSecs(s => Math.max(0, s - 1));
        if (next >= 100) { clearInterval(t); setTimeout(onDone, 700); return 100; }
        return next;
      });
    }, 350);
    return () => clearInterval(t);
  }, [totalPages, onDone]);

  return (
    <div className="screen-content fade-slide-up" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100%', paddingTop: 32 }}>
      {/* Printer animation */}
      <div className="pulse" style={{ width: 90, height: 90, borderRadius: '50%', background: '#EBF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, boxShadow: '0 0 30px rgba(0,82,255,0.15)' }}>
        <Printer size={44} color="#0052FF" strokeWidth={2} />
      </div>

      <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', textAlign: 'center', marginBottom: 6 }}>
        {progress < 100 ? `Printing page ${printed} of ${totalPages}` : 'Finalizing...'}
      </h2>
      <p style={{ fontSize: 13, color: '#64748B', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6, textAlign: 'center' }}>
        <Clock size={13} /> {progress < 100 ? `~${secs}s remaining` : 'Sending to output tray...'}
      </p>

      {/* Progress */}
      <div style={{ width: '100%', padding: '0 16px', marginBottom: 20 }}>
        <div className="progress-track" style={{ height: 12 }}>
          <div className="progress-fill" style={{ width: `${progress}%`, transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748B', marginTop: 8 }}>
          <span>Kiosk {kioskId}</span>
          <span style={{ fontWeight: 700, color: '#0052FF' }}>{progress}%</span>
        </div>
      </div>

      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: '12px 16px', fontSize: 13, color: '#1E40AF', margin: '0 16px', textAlign: 'center' }}>
        💡 <strong>Please wait near the output tray</strong> below the touchscreen.
      </div>

      <button type="button" className="btn-primary" onClick={onDone} style={{ margin: '24px 16px 0', width: 'calc(100% - 32px)' }}>
        <CheckCircle2 size={18} /> View order completion
      </button>
    </div>
  );
}
