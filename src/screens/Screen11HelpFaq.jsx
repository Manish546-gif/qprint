import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Headphones, PhoneCall, ArrowLeft } from 'lucide-react';

const FAQS = [
  { q: 'Which files can I print?', a: 'PDF, DOCX, DOC, JPG, PNG — up to 20 MB. PDFs give the most accurate output.' },
  { q: 'Where do I collect my prints?', a: 'From the physical output tray slot right below this touchscreen.' },
  { q: 'Paid but nothing printed?', a: 'Check the tray. If the issue persists, note your order ID and tap "Contact support" below.' },
  { q: 'Is my file private & secure?', a: 'Yes. Files are encrypted in temporary memory and permanently deleted after your session.' },
  { q: 'Can I print colour & double-sided?', a: 'Yes — choose between B&W (₹2/page) or Colour (₹10/page), and single/double-sided on the settings screen.' },
];

export default function Screen11HelpFaq({ kioskId, onBack }) {
  const [open, setOpen] = useState(0);
  const [calling, setCalling] = useState(false);

  const callSupport = () => {
    setCalling(true);
    setTimeout(() => {
      alert(`An attendant has been notified for kiosk ${kioskId}. They will assist you shortly!`);
      setCalling(false);
    }, 1000);
  };

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      <h1 className="page-title">Help & FAQs</h1>
      <p className="page-sub">Common questions — answered fast.</p>

      {/* Support card */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#EBF2FF', border: '1px solid #C7DDFF', borderRadius: 14, padding: '12px 14px', marginBottom: 20 }}>
        <div className="icon-box" style={{ flexShrink: 0 }}><Headphones size={20} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: '#0F172A' }}>Kiosk {kioskId}</div>
          <div style={{ fontSize: 12, color: '#3366CC' }}>24/7 attendant support available</div>
        </div>
      </div>

      {/* FAQ accordion */}
      <div style={{ marginBottom: 24 }}>
        {FAQS.map((f, i) => (
          <div key={i} className="faq-item" onClick={() => setOpen(open === i ? -1 : i)}>
            <div className="faq-q">
              <span>{f.q}</span>
              {open === i ? <ChevronUp size={16} color="#0052FF" /> : <ChevronDown size={16} color="#94A3B8" />}
            </div>
            {open === i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>

      <button type="button" className="btn-primary" onClick={callSupport} disabled={calling} style={{ marginBottom: 10 }}>
        <PhoneCall size={18} />
        {calling ? 'Calling attendant...' : 'Contact kiosk support'}
      </button>
      <button type="button" className="btn-secondary" onClick={onBack}>
        <ArrowLeft size={15} /> Go back
      </button>
    </div>
  );
}
