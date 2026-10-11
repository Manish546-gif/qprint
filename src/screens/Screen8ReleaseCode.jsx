import React, { useState, useEffect } from 'react';
import { Copy, Check, Clock, ShieldCheck, Printer, KeyRound, Monitor, ArrowRight } from 'lucide-react';

export default function Screen8ReleaseCode({ releaseCode, kioskId, file, amount, onReleasePrints, onOpenBoothView }) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft(s => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(releaseCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const digits = releaseCode ? releaseCode.toString().split('') : ['8','4','9','2','0','1'];

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      {/* Success Badge */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span className="pill success" style={{ fontSize: 11, padding: '4px 12px', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <Check size={12} strokeWidth={3} /> Payment of ₹{amount.toFixed(2)} Confirmed
        </span>
        <h1 className="page-title" style={{ marginTop: 10, marginBottom: 4 }}>
          Enter code at the booth
        </h1>
        <p className="page-sub">
          Walk up to <strong>Booth {kioskId}</strong> and type this code on the touchscreen.
        </p>
      </div>

      {/* ── 6-Digit Release Code Glassmorphic Card ── */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(240, 246, 255, 0.78) 100%)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1.5px solid #C7DDFF',
        borderTop: '2px solid rgba(255, 255, 255, 0.95)',
        borderRadius: 24,
        padding: '24px 16px',
        textAlign: 'center',
        marginBottom: 16,
        boxShadow: '0 12px 32px rgba(0, 82, 255, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
      }}>
        <div style={{ fontSize: 11.5, fontWeight: 800, color: '#0052FF', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Your 6-Digit Print Release Code
        </div>

        {/* Digit glass boxes */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
          {digits.map((d, i) => (
            <div
              key={i}
              style={{
                width: 44,
                height: 56,
                background: 'linear-gradient(180deg, #FFFFFF 0%, #EFF6FF 100%)',
                border: '1.5px solid #93C5FD',
                borderTop: '2px solid #FFFFFF',
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 27,
                fontWeight: 800,
                color: '#0052FF',
                boxShadow: '0 4px 12px rgba(0, 82, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Copy button */}
        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: copied ? '#ECFDF5' : '#F8FAFC',
            border: copied ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
            color: copied ? '#059669' : '#475569',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? (
            <>
              <Check size={14} /> Code Copied!
            </>
          ) : (
            <>
              <Copy size={14} /> Tap to Copy Code
            </>
          )}
        </button>

        <div style={{
          marginTop: 14,
          paddingTop: 12,
          borderTop: '1px dashed #E2E8F0',
          fontSize: 12,
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}>
          <Clock size={13} color="#F59E0B" />
          <span>Code expires in <strong style={{ color: '#0F172A' }}>{formatTime(timeLeft)}</strong></span>
        </div>
      </div>

      {/* ── Instructions list ── */}
      <div className="card" style={{ marginBottom: 18, padding: '16px 18px' }}>
        <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <KeyRound size={15} color="#0052FF" />
          <span>How to collect your prints:</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { step: '1', title: `Go to Booth ${kioskId}`, desc: 'Locate the physical printer tray and screen' },
            { step: '2', title: 'Enter the 6 digits on screen', desc: 'Type code on the booth numeric keypad' },
            { step: '3', title: 'Collect your document', desc: 'Pages will print and dispense into tray' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: '#0052FF',
                color: 'white',
                fontSize: 11,
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: 1,
              }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Privacy guarantee ── */}
      <div style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: 14,
        padding: '10px 14px',
        fontSize: 12,
        color: '#64748B',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <ShieldCheck size={16} color="#10B981" style={{ flexShrink: 0 }} />
        <span>
          <strong>Privacy Protected:</strong> Your file is never printed until you enter the code in person. Unused files are auto-refunded and wiped.
        </span>
      </div>

      {/* ── Action Buttons ── */}
      <button
        type="button"
        className="btn-primary"
        onClick={onReleasePrints}
        style={{ marginBottom: 10, height: 48, fontSize: 14.5 }}
      >
        <Printer size={18} />
        Simulate Entering Code on Booth (Print Now)
      </button>

      {onOpenBoothView && (
        <button
          type="button"
          className="btn-secondary"
          onClick={onOpenBoothView}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <Monitor size={16} />
          Open Booth Keypad Screen Simulator
        </button>
      )}
    </div>
  );
}
