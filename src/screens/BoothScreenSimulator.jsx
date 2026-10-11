import React, { useState, useEffect, useCallback } from 'react';
import { Printer, Check, Delete, Smartphone, ShieldCheck, Sparkles, KeyRound, Clipboard } from 'lucide-react';

export default function BoothScreenSimulator({
  kioskId = 'QW-024',
  expectedCode = '849201',
  activeFile = null,
  activeConfig = null,
  onSwitchToPhone,
  onPrintSuccess,
}) {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'verifying' | 'printing' | 'completed' | 'error'
  const [errorText, setErrorText] = useState('');
  const [printProgress, setPrintProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);

  // Subtle tactile audio feedback
  const playTactileClick = (freq = 700) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {}
  };

  const handleKey = (digit) => {
    if (status === 'printing' || status === 'verifying') return;
    playTactileClick(600 + parseInt(digit, 10) * 35);
    setErrorText('');
    if (pin.length < 6) {
      setPin(prev => prev + digit);
    }
  };

  const handleClear = () => {
    if (status === 'printing') return;
    playTactileClick(450);
    setPin('');
    setErrorText('');
    setStatus('idle');
  };

  const handleBackspace = () => {
    if (status === 'printing') return;
    playTactileClick(450);
    setPin(prev => prev.slice(0, -1));
    setErrorText('');
  };

  // Robust paste handler (accepts full string from clipboard or event)
  const handlePasteText = (text) => {
    if (!text || status === 'printing') return;
    const clean = text.toString().replace(/\D/g, '').slice(0, 6);
    if (clean.length > 0) {
      playTactileClick(800);
      setPin(clean);
      setErrorText('');
    }
  };

  // Clipboard read action
  const handleClipboardPaste = async () => {
    try {
      if (navigator.clipboard?.readText) {
        const clipText = await navigator.clipboard.readText();
        const clean = clipText.replace(/\D/g, '').slice(0, 6);
        if (clean.length > 0) {
          handlePasteText(clean);
          return;
        }
      }
    } catch (err) {
      console.warn('Clipboard reading blocked:', err);
    }
    // Fallback to active expected code if clipboard permission is denied
    if (expectedCode) {
      handlePasteText(expectedCode);
    }
  };

  // Global Paste Event Listener (Ctrl+V / Cmd+V)
  useEffect(() => {
    const onPaste = (e) => {
      if (status === 'printing') return;
      const pastedData = e.clipboardData?.getData('text');
      if (pastedData) {
        e.preventDefault();
        handlePasteText(pastedData);
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [status]);

  // Global Keyboard listener (Physical keyboard numbers, Backspace, Enter)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (status === 'printing') return;
      if (e.key >= '0' && e.key <= '9') {
        handleKey(e.key);
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Enter') {
        handlePrint();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [status, pin]);

  const handlePrint = () => {
    if (pin.length !== 6) {
      triggerError('Please enter all 6 digits of your release code');
      return;
    }

    playTactileClick(900);
    setStatus('verifying');
    setErrorText('');

    setTimeout(() => {
      // Validate against the active generated code or universal test codes
      const isValid = pin === expectedCode || pin === '123456' || pin === '849201';

      if (!isValid) {
        triggerError('Invalid or expired code. Please verify on your phone.');
        return;
      }

      // Valid: Start realistic printing process
      setStatus('printing');
      setPrintProgress(12);

      const interval = setInterval(() => {
        setPrintProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setStatus('completed');
            if (onPrintSuccess) onPrintSuccess();
            return 100;
          }
          return prev + 16;
        });
      }, 450);
    }, 600);
  };

  const triggerError = (msg) => {
    setStatus('error');
    setErrorText(msg);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const handleResetForNext = () => {
    playTactileClick(500);
    setPin('');
    setStatus('idle');
    setPrintProgress(0);
    setErrorText('');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      background: '#F4F7FC',
      color: '#0F172A',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Manrope", sans-serif',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      {/* ── Soft Ambient Pastel Light Orbs (Powers Light Glass Refraction) ── */}
      <div style={{
        position: 'fixed',
        top: '-15%',
        left: '5%',
        width: '580px',
        height: '580px',
        background: 'radial-gradient(circle, rgba(199, 221, 255, 0.75) 0%, rgba(199, 221, 255, 0) 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        bottom: '-15%',
        right: '5%',
        width: '640px',
        height: '640px',
        background: 'radial-gradient(circle, rgba(224, 231, 255, 0.85) 0%, rgba(224, 231, 255, 0) 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />
      <div style={{
        position: 'fixed',
        top: '35%',
        left: '40%',
        width: '480px',
        height: '480px',
        background: 'radial-gradient(circle, rgba(186, 230, 253, 0.6) 0%, rgba(186, 230, 253, 0) 70%)',
        filter: 'blur(90px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── Apple Light Frosted Glass Top Header ── */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.82)',
        backdropFilter: 'blur(30px) saturate(180%)',
        WebkitBackdropFilter: 'blur(30px) saturate(180%)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.85)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        {/* Left: Kiosk Identification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0052FF 0%, #003ECC 100%)',
            boxShadow: '0 4px 14px rgba(0, 82, 255, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Printer size={20} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' }}>
              QWIKPRINT BOOTH #{kioskId}
            </div>
            <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
              CAMPUS TERMINAL · AIRPRINT HARDWARE NODE
            </div>
          </div>
        </div>

        {/* Right: Hardware Status & Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Hardware Status Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            borderRadius: 9999,
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: 700,
            color: '#047857',
            boxShadow: '0 1px 3px rgba(16, 185, 129, 0.1)',
          }}>
            <span style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 6px #10B981',
              display: 'inline-block',
            }} />
            READY · 150 SHEETS IN TRAY
          </div>

          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 700 }}>
            {currentTime}
          </div>

          {onSwitchToPhone && (
            <button
              type="button"
              onClick={onSwitchToPhone}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#0052FF',
                borderRadius: 12,
                padding: '8px 16px',
                fontSize: 12.5,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
            >
              <Smartphone size={14} color="#0052FF" />
              Customer Phone View
            </button>
          )}
        </div>
      </header>

      {/* ── Main Kiosk Touchscreen Body ── */}
      <main style={{
        position: 'relative',
        zIndex: 1,
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 28,
        padding: '32px 28px',
        alignItems: 'stretch',
        maxWidth: 1240,
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>

        {/* ── LEFT LIGHT GLASS PANEL: Step 1 Scan QR ── */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(35px) saturate(190%)',
          WebkitBackdropFilter: 'blur(35px) saturate(190%)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          borderRadius: 32,
          padding: 36,
          boxShadow: '0 20px 45px -10px rgba(0, 82, 255, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03), inset 0 1px 0 #FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
        }}>
          {/* Step Pill */}
          <div style={{
            background: '#EBF2FF',
            border: '1px solid #C7DDFF',
            color: '#0052FF',
            borderRadius: 9999,
            padding: '5px 16px',
            fontSize: 11.5,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 16,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <Sparkles size={12} color="#0052FF" />
            STEP 1 · PHONE WEB APP
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 8, lineHeight: 1.25 }}>
            Scan to Print Files
          </h1>
          <p style={{ fontSize: 14, color: '#64748B', maxWidth: 320, lineHeight: 1.5, marginBottom: 24 }}>
            Point your camera to upload instantly. No app installation or sign-up needed.
          </p>

          {/* Floating High-Contrast QR Code */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 24,
            padding: 18,
            boxShadow: '0 16px 36px rgba(0, 82, 255, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E2E8F0',
            marginBottom: 20,
            position: 'relative',
          }}>
            <svg viewBox="0 0 100 100" width="180" height="180">
              <rect width="100" height="100" fill="white"/>
              <rect x="6" y="6" width="28" height="28" fill="#0F172A" rx="4"/>
              <rect x="12" y="12" width="16" height="16" fill="white" rx="2"/>
              <rect x="16" y="16" width="8" height="8" fill="#0052FF" rx="1"/>
              <rect x="66" y="6" width="28" height="28" fill="#0F172A" rx="4"/>
              <rect x="72" y="12" width="16" height="16" fill="white" rx="2"/>
              <rect x="76" y="16" width="8" height="8" fill="#0052FF" rx="1"/>
              <rect x="6" y="66" width="28" height="28" fill="#0F172A" rx="4"/>
              <rect x="12" y="72" width="16" height="16" fill="white" rx="2"/>
              <rect x="16" y="76" width="8" height="8" fill="#0052FF" rx="1"/>
              <rect x="38" y="10" width="8" height="8" fill="#0F172A"/>
              <rect x="50" y="10" width="10" height="8" fill="#0052FF"/>
              <rect x="38" y="24" width="12" height="10" fill="#0F172A"/>
              <rect x="10" y="42" width="8" height="12" fill="#0052FF"/>
              <rect x="24" y="42" width="10" height="8" fill="#0F172A"/>
              <rect x="42" y="42" width="16" height="16" fill="#0052FF" rx="3"/>
              <rect x="66" y="42" width="10" height="8" fill="#0F172A"/>
              <rect x="82" y="42" width="8" height="8" fill="#0052FF"/>
              <rect x="42" y="66" width="10" height="16" fill="#0F172A"/>
              <rect x="56" y="74" width="16" height="8" fill="#0052FF"/>
              <rect x="76" y="66" width="8" height="8" fill="#0F172A"/>
              <rect x="84" y="82" width="8" height="8" fill="#0052FF"/>
            </svg>
          </div>

          {/* URL Pill */}
          <div style={{
            background: '#F1F5F9',
            border: '1px solid #E2E8F0',
            borderRadius: 9999,
            padding: '6px 18px',
            fontSize: 13,
            color: '#0052FF',
            fontWeight: 800,
            marginBottom: 16,
          }}>
            kiosk.qwikprint.in/?kiosk={kioskId}
          </div>

          {/* Trust badge */}
          <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
            <ShieldCheck size={15} color="#10B981" />
            Zero-Retention Memory · Documents Shredded Post-Print
          </div>
        </section>

        {/* ── RIGHT LIGHT GLASS PANEL: iPhone Calculator-Inspired Keypad ── */}
        <section style={{
          background: 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(35px) saturate(190%)',
          WebkitBackdropFilter: 'blur(35px) saturate(190%)',
          border: '1.5px solid rgba(255, 255, 255, 0.95)',
          borderRadius: 32,
          padding: '32px 36px',
          boxShadow: '0 20px 45px -10px rgba(0, 82, 255, 0.08), 0 1px 3px rgba(0, 0, 0, 0.03), inset 0 1px 0 #FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Step Pill */}
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#047857',
            borderRadius: 9999,
            padding: '5px 16px',
            fontSize: 11.5,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: 14,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <KeyRound size={12} color="#059669" />
            STEP 2 · PRINT RELEASE KEYPAD
          </div>

          <h2 style={{ fontSize: 26, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: 6 }}>
            Enter Release PIN
          </h2>
          <p style={{ fontSize: 13.5, color: '#64748B', marginBottom: 20 }}>
            Enter the 6-digit code from your phone screen to dispense.
          </p>

          {/* ── 6-Digit Passcode Display (Clickable & Pasteable) ── */}
          <div
            tabIndex={0}
            onClick={handleClipboardPaste}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData?.getData('text');
              if (pasted) handlePasteText(pasted);
            }}
            title="Click to paste code or press Ctrl+V"
            style={{
              display: 'flex',
              gap: 10,
              marginBottom: 14,
              cursor: 'pointer',
              outline: 'none',
              transform: isShaking ? 'translateX(-8px)' : 'none',
              transition: 'transform 0.1s ease',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map(idx => {
              const isFilled = pin[idx] !== undefined;
              return (
                <div
                  key={idx}
                  style={{
                    width: 48,
                    height: 56,
                    borderRadius: 16,
                    background: isFilled
                      ? 'linear-gradient(135deg, #0052FF 0%, #1D4ED8 100%)'
                      : 'rgba(255, 255, 255, 0.85)',
                    border: isFilled
                      ? '2px solid #0052FF'
                      : '1.5px solid #CBD5E1',
                    borderTop: isFilled
                      ? '2px solid #60A5FA'
                      : '1.5px solid #E2E8F0',
                    boxShadow: isFilled
                      ? '0 6px 18px rgba(0, 82, 255, 0.35)'
                      : '0 2px 6px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 26,
                    fontWeight: 800,
                    color: isFilled ? '#FFFFFF' : '#0F172A',
                    transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isFilled ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {pin[idx] || ''}
                </div>
              );
            })}
          </div>

          {/* ── Paste Code & Session Helper Actions ── */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleClipboardPaste}
              style={{
                background: '#EFF6FF',
                border: '1.5px solid #93C5FD',
                color: '#0052FF',
                borderRadius: 9999,
                padding: '6px 16px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                boxShadow: '0 2px 8px rgba(0, 82, 255, 0.08)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#DBEAFE'}
              onMouseLeave={e => e.currentTarget.style.background = '#EFF6FF'}
            >
              <Clipboard size={14} color="#0052FF" />
              Paste Code (Ctrl+V)
            </button>

            {expectedCode && pin !== expectedCode && (
              <button
                type="button"
                onClick={() => {
                  playTactileClick(700);
                  handlePasteText(expectedCode);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  borderRadius: 9999,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.85)'}
              >
                Auto-fill ({expectedCode})
              </button>
            )}

            {pin.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                style={{
                  background: '#FEE2E2',
                  border: '1px solid #FECACA',
                  color: '#EF4444',
                  borderRadius: 9999,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {errorText && (
            <div style={{
              color: '#DC2626',
              fontSize: 12.5,
              fontWeight: 700,
              marginBottom: 14,
              background: '#FEE2E2',
              border: '1px solid #FECACA',
              borderRadius: 10,
              padding: '6px 14px',
            }}>
              ⚠️ {errorText}
            </div>
          )}

          {/* ── Printing State Card ── */}
          {status === 'printing' && (
            <div style={{
              width: '100%',
              maxWidth: 320,
              background: '#EFF6FF',
              border: '1.5px solid #93C5FD',
              borderRadius: 24,
              padding: 24,
              textAlign: 'center',
              marginBottom: 18,
              boxShadow: '0 8px 24px rgba(0, 82, 255, 0.1)',
            }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0052FF', marginBottom: 6 }}>
                Printing in progress...
              </div>
              <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
                {activeFile?.name || 'Assignment.pdf'} · Dispensing to tray below
              </div>
              <div style={{
                height: 10,
                background: '#E2E8F0',
                borderRadius: 9999,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${printProgress}%`,
                  background: 'linear-gradient(90deg, #0052FF 0%, #38BDF8 100%)',
                  boxShadow: '0 0 10px rgba(0, 82, 255, 0.4)',
                  transition: 'width 0.4s ease',
                }} />
              </div>
            </div>
          )}

          {/* ── Completed State Card ── */}
          {status === 'completed' && (
            <div style={{
              width: '100%',
              maxWidth: 320,
              background: '#ECFDF5',
              border: '1.5px solid #A7F3D0',
              borderRadius: 24,
              padding: 24,
              textAlign: 'center',
              marginBottom: 18,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.1)',
            }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#047857', marginBottom: 6 }}>
                ✓ Printing Complete!
              </div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.4, marginBottom: 16 }}>
                Please collect your pages from the output tray. Your file has been erased from memory.
              </div>
              <button
                type="button"
                onClick={handleResetForNext}
                style={{
                  background: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: 14,
                  padding: '10px 22px',
                  fontWeight: 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                }}
              >
                Ready for Next Customer
              </button>
            </div>
          )}

          {/* ── iPhone Calculator Keypad (Circular Light Glassmorphic Buttons) ── */}
          {status !== 'printing' && status !== 'completed' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 76px)',
              gap: 14,
              justifyContent: 'center',
              marginTop: 4,
            }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKey(num.toString())}
                  style={{
                    width: 76,
                    height: 76,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(25px)',
                    WebkitBackdropFilter: 'blur(25px)',
                    border: '1px solid rgba(226, 232, 240, 0.95)',
                    borderTop: '1.5px solid #FFFFFF',
                    fontSize: 27,
                    fontWeight: 700,
                    color: '#0F172A',
                    cursor: 'pointer',
                    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.04), inset 0 1px 1px #FFFFFF',
                    transition: 'all 0.12s ease',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onMouseDown={e => {
                    e.currentTarget.style.transform = 'scale(0.91)';
                    e.currentTarget.style.background = '#E2E8F0';
                  }}
                  onMouseUp={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
                  }}
                >
                  {num}
                </button>
              ))}

              {/* Clear / Backspace Button (Light Coral / Red Glass Key) */}
              <button
                type="button"
                onClick={handleBackspace}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: '#FEE2E2',
                  border: '1px solid #FECACA',
                  borderTop: '1.5px solid #FFFFFF',
                  color: '#EF4444',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 16px rgba(239, 68, 68, 0.08), inset 0 1px 1px #FFFFFF',
                  transition: 'all 0.12s ease',
                  userSelect: 'none',
                }}
                onMouseDown={e => {
                  e.currentTarget.style.transform = 'scale(0.91)';
                  e.currentTarget.style.background = '#FCA5A5';
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#FEE2E2';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = '#FEE2E2';
                }}
              >
                <Delete size={22} strokeWidth={2.2} />
              </button>

              {/* 0 Button */}
              <button
                type="button"
                onClick={() => handleKey('0')}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(226, 232, 240, 0.95)',
                  borderTop: '1.5px solid #FFFFFF',
                  fontSize: 27,
                  fontWeight: 700,
                  color: '#0F172A',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.04), inset 0 1px 1px #FFFFFF',
                  transition: 'all 0.12s ease',
                  userSelect: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseDown={e => {
                  e.currentTarget.style.transform = 'scale(0.91)';
                  e.currentTarget.style.background = '#E2E8F0';
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
                }}
              >
                0
              </button>

              {/* Print Action Button (Vibrant Electric Blue Glass) */}
              <button
                type="button"
                onClick={handlePrint}
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0052FF 0%, #003ECC 100%)',
                  border: '1px solid #3B82F6',
                  borderTop: '1.5px solid rgba(255, 255, 255, 0.65)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0, 82, 255, 0.38), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 3,
                  transition: 'all 0.12s ease',
                  userSelect: 'none',
                }}
                onMouseDown={e => {
                  e.currentTarget.style.transform = 'scale(0.91)';
                  e.currentTarget.style.filter = 'brightness(1.15)';
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'none';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.filter = 'none';
                }}
              >
                <Printer size={20} strokeWidth={2.4} />
                <span style={{ fontSize: 10, letterSpacing: '0.04em', fontWeight: 800 }}>PRINT</span>
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
