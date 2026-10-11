import React, { useState, useEffect } from 'react';
import './index.css';

// Screens
import Screen1Welcome        from './screens/Screen1Welcome';
import Screen2UploadMethod   from './screens/Screen2UploadMethod';
import Screen3UploadProgress from './screens/Screen3UploadProgress';
import Screen4CustomiseHub   from './screens/Screen4CustomiseHub';
import Screen5PrintConfig    from './screens/Screen5PrintConfig';
import Screen6DocPreview     from './screens/Screen6DocPreview';
import Screen7OrderSummary   from './screens/Screen7OrderSummary';
import Screen8Payment        from './screens/Screen8Payment';
import Screen8ReleaseCode    from './screens/Screen8ReleaseCode';
import Screen9PrintingProgress from './screens/Screen9PrintingProgress';
import Screen10Completion    from './screens/Screen10Completion';
import Screen11HelpFaq       from './screens/Screen11HelpFaq';
import Screen12FileError     from './screens/Screen12FileError';
import BoothScreenSimulator  from './screens/BoothScreenSimulator';

import {
  ChevronLeft, HelpCircle, Printer, Check, X,
  Zap, ShieldCheck, Clock, CreditCard, MapPin,
  Upload, UploadCloud, SlidersHorizontal, Eye, CheckCircle2,
  KeyRound, Smartphone, Monitor,
} from 'lucide-react';

/* ═══════════════════════════════════════════
   SHARED COMPONENTS (mobile + desktop)
═══════════════════════════════════════════ */

function Stepper({ screen }) {
  let active = 1;
  if ([4,5,6,7].includes(screen)) active = 2;
  else if ([8,9,13,10].includes(screen)) active = 3;
  const done = screen === 10;

  const steps = [{ n:1, label:'Upload' }, { n:2, label:'Customise' }, { n:3, label:'Pay & Print' }];
  let fill = '0%';
  if (active === 2) fill = '50%';
  if (active === 3 || done) fill = '100%';

  return (
    <div className="stepper-wrap">
      <div className="stepper">
        <div className="stepper-line">
          <div className="stepper-line-fill" style={{ width: fill }} />
        </div>
        {steps.map(s => {
          const isDone   = done || s.n < active;
          const isActive = !done && s.n === active;
          return (
            <div key={s.n} className={`step${isDone?' done':isActive?' active':''}`}>
              <div className="step-dot">
                {isDone ? <Check size={13} strokeWidth={3} /> : s.n}
              </div>
              <span className="step-text">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopBar({ screen, onBack, onHelp, helpActive }) {
  const canBack     = [3,4,5,6,7,8,11,12].includes(screen);
  const showStepper = [3,4,5,6,7,8,9,10,13].includes(screen);
  const titleMap = {
    3:'Uploading…', 4:'Customise', 5:'Print settings',
    6:'Preview', 7:'Order summary', 8:'Razorpay Payment',
    9:'Print Release Code', 13:'Printing in Progress',
    10:'Complete', 11:'Help', 12:'File error',
  };

  if (screen === 1) {
    return (
      <div className="topbar-home">
        <span className="brand-logo-text">qwikprint</span>
        <button type="button" className="home-help-btn" onClick={onHelp}>
          ? Help
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="app-status-bar" />
      <div className="app-topbar">
        <div className="topbar-left">
          {canBack
            ? <button type="button" className="back-btn" onClick={onBack}><ChevronLeft size={22} strokeWidth={2.5}/></button>
            : <div style={{ width: 36 }} />}
        </div>
        <div className="topbar-center">
          <span style={{ fontSize:15, fontWeight:700, color:'#0F172A' }}>{titleMap[screen]||''}</span>
        </div>
        <div className="topbar-right">
          {screen !== 10 && screen !== 13 && (
            <button type="button" className={`help-btn${helpActive?' active':''}`} onClick={onHelp}>
              <HelpCircle size={15} strokeWidth={2}/> Help
            </button>
          )}
        </div>
      </div>
      {showStepper && <Stepper screen={screen} />}
    </>
  );
}

/* ═══════════════════════════════════════════
   DESKTOP SIDEBAR
═══════════════════════════════════════════ */

const ALL_STEPS = [
  { id:1,  icon:<Upload size={14}/>,           label:'Upload file',      group:null },
  { id:3,  icon:<UploadCloud size={14}/>,      label:'Uploading',        group:'Upload' },
  { id:4,  icon:<SlidersHorizontal size={14}/>,label:'Customise hub',    group:'Customise' },
  { id:5,  icon:<SlidersHorizontal size={14}/>,label:'Print settings',   group:'Customise' },
  { id:6,  icon:<Eye size={14}/>,              label:'Preview',          group:'Customise' },
  { id:7,  icon:<CreditCard size={14}/>,       label:'Order summary',    group:'Pay & Print' },
  { id:8,  icon:<CreditCard size={14}/>,       label:'Razorpay payment', group:'Pay & Print' },
  { id:9,  icon:<KeyRound size={14}/>,         label:'Release code',     group:'Pay & Print' },
  { id:10, icon:<CheckCircle2 size={14}/>,     label:'Complete!',        group:'Pay & Print' },
];

const SIDEBAR_CONTEXT = {
  1: {
    tag: 'Instant Printing',
    headline: 'Your files. Freshly printed.',
    bullets: [
      { icon: <Upload size={14}/>,      text: 'Direct upload (PDF, DOCX, JPG, PNG)' },
      { icon: <ShieldCheck size={14}/>, text: 'Auto-deleted after printing session' },
      { icon: <Clock size={14}/>,       text: 'Collect from tray in under 2 mins' },
    ],
    footer: 'B&W from ₹2/page · Colour from ₹10/page',
  },
  3: {
    tag: 'Uploading',
    headline: 'Transferring your file securely.',
    bullets: [
      { icon: <ShieldCheck size={14}/>, text: 'End-to-end encrypted transfer' },
      { icon: <Clock size={14}/>,       text: 'Usually takes under 5 seconds' },
      { icon: <Zap size={14}/>,         text: 'Ready to customise instantly' },
    ],
    footer: 'Do not close this screen',
  },
  4: {
    tag: 'Step 2 of 3',
    headline: 'Your file is ready to customise.',
    bullets: [
      { icon: <Eye size={14}/>,                text: 'Preview before printing' },
      { icon: <SlidersHorizontal size={14}/>,  text: 'Choose colour, sides & copies' },
      { icon: <Printer size={14}/>,            text: 'Select custom page ranges' },
    ],
    footer: 'B&W saves money — ₹2 vs ₹10/page',
  },
  5: {
    tag: 'Print settings',
    headline: 'Every print is different.',
    bullets: [
      { icon: <SlidersHorizontal size={14}/>, text: 'B&W (₹2) or Colour (₹10) per page' },
      { icon: <Printer size={14}/>,           text: 'Single or double-sided printing' },
      { icon: <CreditCard size={14}/>,        text: 'Live price updates as you choose' },
    ],
    footer: 'Default: A4 · 80 GSM paper',
  },
  6: {
    tag: 'Preview',
    headline: 'See your document before printing.',
    bullets: [
      { icon: <Eye size={14}/>,         text: 'Check every page carefully' },
      { icon: <ShieldCheck size={14}/>, text: 'What you see is what prints' },
      { icon: <Printer size={14}/>,     text: 'B&W filter shows print output' },
    ],
    footer: 'Tap the preview card to open full view',
  },
  7: {
    tag: 'Almost there!',
    headline: 'Review your order summary.',
    bullets: [
      { icon: <MapPin size={14}/>,      text: 'Prints dispensed from tray below screen' },
      { icon: <ShieldCheck size={14}/>, text: 'No charge if printing fails' },
      { icon: <CreditCard size={14}/>,  text: 'Pay securely via Razorpay' },
    ],
    footer: 'Release PIN generated immediately after payment',
  },
  8: {
    tag: 'Step 3 of 3',
    headline: 'Pay securely via Razorpay.',
    bullets: [
      { icon: <CreditCard size={14}/>, text: 'UPI (GPay, PhonePe, Paytm), Cards & NetBanking' },
      { icon: <ShieldCheck size={14}/>,text: '100% Instant auto-refund if print fails' },
      { icon: <Clock size={14}/>,      text: 'Instant payment verification' },
    ],
    footer: 'Secured with 256-bit encryption by Razorpay',
  },
  9: {
    tag: 'Collection PIN',
    headline: 'Your 6-Digit Print Release Code.',
    bullets: [
      { icon: <KeyRound size={14}/>,    text: 'Enter code on booth keypad to dispense' },
      { icon: <ShieldCheck size={14}/>, text: 'Paper prints only when you are at the tray' },
      { icon: <Clock size={14}/>,       text: 'Code valid for 15 minutes' },
    ],
    footer: 'Unused codes automatically expire & refund',
  },
  10: {
    tag: '🎉 Done!',
    headline: 'Collect your prints from the tray.',
    bullets: [
      { icon: <CheckCircle2 size={14}/>, text: 'Payment receipt above for reference' },
      { icon: <ShieldCheck size={14}/>,  text: 'Session ended — file deleted' },
      { icon: <Printer size={14}/>,      text: 'Print again anytime you need' },
    ],
    footer: 'Thank you for using Qwikprint!',
  },
  11: {
    tag: 'Help & Support',
    headline: 'We are here to help.',
    bullets: [
      { icon: <Clock size={14}/>,        text: '24/7 attendant support available' },
      { icon: <ShieldCheck size={14}/>,  text: 'No charge for failed prints' },
      { icon: <HelpCircle size={14}/>,   text: 'FAQs cover most common issues' },
    ],
    footer: 'Or call our helpline: 1800-000-PRINT',
  },
  12: {
    tag: 'File Error',
    headline: 'Something went wrong with the file.',
    bullets: [
      { icon: <ShieldCheck size={14}/>, text: 'No payment has been taken' },
      { icon: <Upload size={14}/>,      text: 'Try a different file format' },
      { icon: <HelpCircle size={14}/>,  text: 'Contact support if problem persists' },
    ],
    footer: 'Supported: PDF, DOCX, JPG, PNG (≤20MB)',
  },
};

function DesktopSidebar({ screen }) {
  const ctx = SIDEBAR_CONTEXT[screen] || SIDEBAR_CONTEXT[1];
  const flowSteps = ALL_STEPS.filter(s => s.id !== 1);

  return (
    <div className="desktop-sidebar">
      {/* Brand */}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:32 }}>
        <div style={{ width:36,height:36,borderRadius:11,background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center' }}>
          <Printer size={18} color="white" strokeWidth={2.2}/>
        </div>
        <div>
          <div style={{ fontSize:18,fontWeight:800,color:'white',letterSpacing:'-0.04em' }}>qwikprint</div>
          <div style={{ fontSize:10,color:'rgba(255,255,255,0.55)',fontWeight:600,marginTop:1 }}>KIOSK PRINT SYSTEM</div>
        </div>
      </div>

      {/* Context for this screen */}
      <div style={{ marginBottom:28 }}>
        <span style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:'0.07em' }}>
          {ctx.tag}
        </span>
        <h2 style={{ fontSize:20,fontWeight:800,color:'white',letterSpacing:'-0.03em',lineHeight:1.3,marginTop:6,marginBottom:16 }}>
          {ctx.headline}
        </h2>
        <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
          {ctx.bullets.map((b,i) => (
            <div key={i} style={{ display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:28,height:28,borderRadius:8,background:'rgba(255,255,255,0.14)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.85)',flexShrink:0 }}>
                {b.icon}
              </div>
              <span style={{ fontSize:13,color:'rgba(255,255,255,0.8)',fontWeight:500,lineHeight:1.4 }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      {screen > 1 && (
        <div style={{ height:1,background:'rgba(255,255,255,0.12)',marginBottom:20 }} />
      )}

      {/* Step tracker */}
      {screen > 1 && (
        <div style={{ marginBottom:20 }}>
          <div style={{ fontSize:11,fontWeight:700,color:'rgba(255,255,255,0.45)',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10 }}>
            Progress
          </div>
          <div style={{ display:'flex',flexDirection:'column',gap:2 }}>
            {flowSteps.map(s => {
              const isActive = s.id === screen;
              const isDone   = s.id < screen;
              return (
                <div key={s.id} className={`sidebar-step${isActive?' active':isDone?' done':''}`}>
                  <div className="sidebar-step-dot">
                    {isDone ? <Check size={13} strokeWidth={3}/> : s.icon}
                  </div>
                  <span className="sidebar-step-label">{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer note */}
      <div style={{ marginTop:'auto' }}>
        <div style={{ height:1,background:'rgba(255,255,255,0.1)',marginBottom:16 }} />
        <p style={{ fontSize:11.5,color:'rgba(255,255,255,0.45)',fontWeight:500,lineHeight:1.5 }}>
          {ctx.footer}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DESKTOP TOP NAV
═══════════════════════════════════════════ */
function DesktopTopNav({ screen, onBack, onHelp, onReset, helpActive }) {
  const canBack = [3,4,5,6,7,8,11,12].includes(screen);
  const titleMap = {
    1:'Home', 3:'Uploading…', 4:'Customise',
    5:'Print Settings', 6:'Preview', 7:'Order Summary',
    8:'Razorpay Payment', 9:'Print Release Code',
    13:'Printing…', 10:'Order Complete', 11:'Help & FAQ', 12:'File Error',
  };

  return (
    <div className="desktop-topnav">
      {/* Left: Brand */}
      <div className="desktop-topnav-brand">
        <div style={{ width:32,height:32,borderRadius:9,background:'#0052FF',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 3px 8px rgba(0,82,255,0.35)' }}>
          <Printer size={16} color="white" strokeWidth={2.5}/>
        </div>
        <span style={{ fontSize:17,fontWeight:800,color:'#0F172A',letterSpacing:'-0.04em' }}>
          qwik<span style={{ color:'#0052FF' }}>print</span>
        </span>
        <div style={{ width:1,height:20,background:'#E2E8F0',margin:'0 8px' }} />
        <span style={{ fontSize:14,fontWeight:600,color:'#475569' }}>{titleMap[screen]||''}</span>
      </div>

      {/* Right: nav buttons */}
      <div className="desktop-topnav-links">
        {canBack && (
          <button type="button" className="desktop-topnav-link" onClick={onBack}>
            ← Back
          </button>
        )}
        <button
          type="button"
          className={`desktop-topnav-link${helpActive?' active':''}`}
          onClick={onHelp}
        >
          <HelpCircle size={14} style={{ verticalAlign:'middle', marginRight:5 }}/>
          Help
        </button>
        <button type="button" className="desktop-topnav-link" onClick={onReset}>
          ↺ New session
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   PWA INSTALL BANNER
═══════════════════════════════════════════ */
function InstallBanner({ onInstall, onDismiss }) {
  return (
    <div className="install-banner">
      <div className="brand-icon" style={{ flexShrink:0 }}><Printer size={16} strokeWidth={2.5}/></div>
      <div className="install-banner-text">Add Qwikprint to your home screen for instant access</div>
      <button type="button" className="install-banner-btn" onClick={onInstall}>Install</button>
      <button type="button" className="install-banner-close" onClick={onDismiss}><X size={16}/></button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════ */
export default function App() {
  const [screen, setScreen] = useState(1);
  const [prev,   setPrev]   = useState(1);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  // Kiosk URL binding: reads ?kiosk=QW-024 from URL
  const searchParams = new URLSearchParams(window.location.search);
  const initialKiosk = searchParams.get('kiosk') || 'QW-024';
  const [kioskId, setKioskId] = useState(initialKiosk);

  // Mode: 'phone' (mobile web user view) or 'booth' (physical kiosk touchscreen)
  const [viewMode, setViewMode] = useState('phone');

  // Random 6-digit Release Code generated for the user
  const [releaseCode, setReleaseCode] = useState(() => Math.floor(100000 + Math.random() * 900000).toString());
  const [paymentId, setPaymentId] = useState('');

  const [file, setFile]     = useState({ name:'Assignment.pdf', pages:6, size:'2.4 MB' });
  const [config, setConfig] = useState({ colorMode:'bw', sides:'double', pageSelection:'all', customRange:'', copies:1 });
  const [orderId, setOrderId] = useState('QW-1048');

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall,    setShowInstall]    = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
    const handler = e => { e.preventDefault(); setDeferredPrompt(e); setShowInstall(true); };
    window.addEventListener('beforeinstallprompt', handler);

    const resizeHandler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstall(false);
    setDeferredPrompt(null);
  };

  const go  = s => { setPrev(screen); setScreen(s); };
  const back = () => {
    if (screen === 11 || screen === 12) { setScreen(prev); return; }
    if (screen === 3) { setScreen(1); return; }
    if (screen > 1) setScreen(s => s - 1);
  };
  const onHelp = () => {
    if (screen === 11) { setScreen(prev); return; }
    setPrev(screen); setScreen(11);
  };
  const reset = () => {
    setScreen(1); setPrev(1);
    setConfig({ colorMode:'bw', sides:'double', pageSelection:'all', customRange:'', copies:1 });
    setOrderId('QW-' + Math.floor(1000 + Math.random() * 9000));
    setReleaseCode(Math.floor(100000 + Math.random() * 900000).toString());
    setPaymentId('');
  };

  const ratePerPage = config.colorMode === 'bw' ? 2 : 10;
  const effPages    = config.pageSelection === 'all' ? (file.pages||6) : 4;
  const amount      = effPages * ratePerPage * config.copies;

  /* ── Screens renderer ── */
  const renderScreen = () => {
    switch(screen) {
      case 1:
      case 2:  return <Screen1Welcome onStart={f => { if (f) setFile(f); go(3); }} onHelp={onHelp} />;
      case 3:  return <Screen3UploadProgress file={file} onComplete={() => go(4)} onCancel={() => go(1)} />;
      case 4:  return <Screen4CustomiseHub file={file} onSettings={() => go(5)} onPreview={() => go(6)} onReplace={() => go(1)} />;
      case 5:  return <Screen5PrintConfig config={config} onChange={setConfig} totalPages={file.pages} onPreview={() => go(6)} />;
      case 6:  return <Screen6DocPreview file={file} config={config} onContinue={() => go(7)} onEdit={() => go(5)} />;
      case 7:  return <Screen7OrderSummary file={file} config={config} kioskId={kioskId} amount={amount} onPay={() => go(8)} onEdit={() => go(5)} />;
      case 8:  return <Screen8Payment
                        amount={amount}
                        file={file}
                        kioskId={kioskId}
                        onSuccess={payId => { setPaymentId(payId); go(9); }}
                        onBack={() => go(7)} />;
      case 9:  return <Screen8ReleaseCode
                        releaseCode={releaseCode}
                        kioskId={kioskId}
                        file={file}
                        amount={amount}
                        onReleasePrints={() => go(13)}
                        onOpenBoothView={() => setViewMode('booth')} />;
      case 13: return <Screen9PrintingProgress totalPages={file.pages} kioskId={kioskId} onDone={() => go(10)} />;
      case 10: return <Screen10Completion orderId={orderId} file={file} amount={amount} config={config}
                        onPrintAnother={() => { setOrderId('QW-'+Math.floor(1000+Math.random()*9000)); setReleaseCode(Math.floor(100000+Math.random()*900000).toString()); go(1); }}
                        onHome={reset} />;
      case 11: return <Screen11HelpFaq kioskId={kioskId} onBack={back} />;
      case 12: return <Screen12FileError onTryAgain={() => go(1)} onHelp={() => go(11)} />;
      default: return null;
    }
  };

  /* ── If in Booth Screen Mode, render the Physical Booth Touchscreen Simulator ── */
  if (viewMode === 'booth') {
    return (
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
        <BoothScreenSimulator
          kioskId={kioskId}
          expectedCode={releaseCode}
          activeFile={file}
          activeConfig={config}
          onSwitchToPhone={() => setViewMode('phone')}
          onPrintSuccess={() => {
            setTimeout(() => {
              setScreen(10);
            }, 1200);
          }}
        />

        {/* Global Floating Switcher */}
        <div className="mode-switcher-bar">
          <button
            type="button"
            className={`mode-btn ${viewMode === 'phone' ? 'active' : ''}`}
            onClick={() => setViewMode('phone')}
          >
            <Smartphone size={14} /> Customer Phone App
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === 'booth' ? 'active' : ''}`}
            onClick={() => setViewMode('booth')}
          >
            <Monitor size={14} /> Kiosk Booth Screen
          </button>
        </div>
      </div>
    );
  }

  /* ── DESKTOP PHONE / WEBSITE VIEW ── */
  if (isDesktop) {
    return (
      <div className="desktop-root" style={{ position: 'relative' }}>
        {showInstall && (
          <InstallBanner onInstall={handleInstall} onDismiss={() => setShowInstall(false)} />
        )}

        {/* Top nav */}
        <DesktopTopNav
          screen={screen}
          onBack={back}
          onHelp={onHelp}
          onReset={reset}
          helpActive={screen === 11}
        />

        {/* Two-col body */}
        <div className="desktop-body">
          {/* Blue sidebar */}
          <DesktopSidebar screen={screen} />

          {/* Content panel */}
          <div className="desktop-content">
            <div className="desktop-screen-card">
              {renderScreen()}
            </div>
          </div>
        </div>

        {/* Global Floating Switcher */}
        <div className="mode-switcher-bar">
          <button
            type="button"
            className={`mode-btn ${viewMode === 'phone' ? 'active' : ''}`}
            onClick={() => setViewMode('phone')}
          >
            <Smartphone size={14} /> Customer Phone App
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === 'booth' ? 'active' : ''}`}
            onClick={() => setViewMode('booth')}
          >
            <Monitor size={14} /> Kiosk Booth Screen
          </button>
        </div>
      </div>
    );
  }

  /* ── MOBILE PHONE APP LAYOUT ── */
  return (
    <div className="app-shell" style={{ position: 'relative' }}>
      {showInstall && (
        <InstallBanner onInstall={handleInstall} onDismiss={() => setShowInstall(false)} />
      )}
      <TopBar screen={screen} onBack={back} onHelp={onHelp} helpActive={screen === 11} />
      <div className="screen-scroll">
        {renderScreen()}
      </div>

      {/* Global Floating Switcher */}
      <div className="mode-switcher-bar">
        <button
          type="button"
          className={`mode-btn ${viewMode === 'phone' ? 'active' : ''}`}
          onClick={() => setViewMode('phone')}
        >
          <Smartphone size={13} /> Phone View
        </button>
        <button
          type="button"
          className={`mode-btn ${viewMode === 'booth' ? 'active' : ''}`}
          onClick={() => setViewMode('booth')}
        >
          <Monitor size={13} /> Booth Screen
        </button>
      </div>
    </div>
  );
}
