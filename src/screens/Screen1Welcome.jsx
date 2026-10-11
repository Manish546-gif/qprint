import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

/* ── Inline kiosk illustration (matches Figma blue & white vector style) ── */
function KioskIllustration() {
  return (
    <svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: 290, display: 'block' }}>
      {/* Soft ground shadow */}
      <ellipse cx="160" cy="182" rx="100" ry="10" fill="#D6E8FD" />

      {/* Floating light blue blob */}
      <circle cx="76" cy="52" r="7" fill="#BBD7FD" opacity="0.9" />

      {/* Floating plus signs */}
      <text x="60" y="105" fontSize="18" fontWeight="800" fill="#68A5FD">+</text>
      <text x="250" y="58" fontSize="18" fontWeight="800" fill="#68A5FD">+</text>

      {/* Floating document on left */}
      <rect x="62" y="76" width="28" height="36" rx="4" fill="white" filter="url(#drop-shadow)" />
      <rect x="67" y="83" width="14" height="3" rx="1.5" fill="#0052FF" />
      <rect x="67" y="90" width="10" height="3" rx="1.5" fill="#0052FF" />

      {/* ── Kiosk machine ── */}
      {/* Main royal blue body */}
      <rect x="172" y="44" width="68" height="134" rx="14" fill="#0052FF" />

      {/* Angled door / side panel on the right */}
      <path d="M236 48 L250 54 L250 174 L236 178 Z" fill="#0F3DA6" />

      {/* Kiosk top screen */}
      <rect x="180" y="54" width="52" height="42" rx="7" fill="white" />
      <rect x="195" y="66" width="22" height="4" rx="2" fill="#0052FF" />
      <rect x="195" y="74" width="14" height="3" rx="1.5" fill="#BFDBFE" />

      {/* Middle dark blue slot bar */}
      <rect x="180" y="112" width="52" height="8" rx="3" fill="#0A3496" />

      {/* Paper coming out of slot */}
      <rect x="190" y="116" width="32" height="20" rx="2" fill="white" filter="url(#drop-shadow)" />
      <rect x="196" y="123" width="16" height="2.5" rx="1" fill="#0052FF" />
      <rect x="196" y="128" width="10" height="2.5" rx="1" fill="#93C5FD" />

      {/* ── Person ── */}
      {/* Dark navy legs */}
      <rect x="91" y="146" width="14" height="38" rx="6" fill="#1E3A8A" />
      <rect x="115" y="146" width="14" height="38" rx="6" fill="#1E3A8A" />

      {/* Royal blue shirt / tunic (trapezoidal flare) */}
      <path d="M96 92 L124 92 L142 148 L86 148 Z" fill="#0052FF" />

      {/* Right arm hanging */}
      <path d="M98 96 Q86 116 88 134" stroke="#0052FF" strokeWidth="12" strokeLinecap="round" fill="none" />

      {/* Left arm reaching towards phone */}
      <path d="M122 96 Q138 106 148 114" stroke="#0052FF" strokeWidth="11" strokeLinecap="round" fill="none" />

      {/* Smartphone */}
      <rect x="146" y="98" width="18" height="28" rx="4" fill="#1E293B" />
      <rect x="149" y="102" width="12" height="20" rx="2" fill="white" />

      {/* Head with cool blue-white tone matching Figma */}
      <circle cx="110" cy="74" r="18" fill="#E8F1FD" />

      {/* Dark hair */}
      <path d="M92 68 Q92 50 110 50 Q128 50 128 68 Q120 58 110 60 Q100 58 92 68 Z" fill="#1E293B" />

      {/* Eyes */}
      <circle cx="103" cy="72" r="2.5" fill="#1E293B" />
      <circle cx="117" cy="72" r="2.5" fill="#1E293B" />

      {/* Smile */}
      <path d="M104 80 Q110 86 116 80" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />

      <defs>
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.08" />
        </filter>
      </defs>
    </svg>
  );
}

export default function Screen1Welcome({ onStart }) {
  const fileRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (f) => {
    if (!f) return;
    if (window.__qwikprintBlobUrl) URL.revokeObjectURL(window.__qwikprintBlobUrl);
    const blobUrl = URL.createObjectURL(f);
    window.__qwikprintBlobUrl = blobUrl;
    const estimatedPages = f.type === 'application/pdf' ? Math.max(1, Math.round(f.size / 40000)) : 1;
    const fileObj = {
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
      pages: Math.min(estimatedPages, 20),
      type: f.type,
      url: blobUrl,
      isReal: true,
    };
    window.__qwikprintFile = fileObj;
    onStart(fileObj);
  };

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) processFile(f);
  };

  return (
    <div className="screen-content fade-slide-up" style={{ gap: 0, paddingBottom: 24 }}>
      {/* ── Hero text ── */}
      <div style={{ marginBottom: 18, marginTop: 4 }}>
        <h1 style={{ fontSize: 27, fontWeight: 800, color: '#0F172A', letterSpacing: '-0.035em', lineHeight: 1.25, marginBottom: 6 }}>
          Your files. Freshly printed.
        </h1>
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.5 }}>
          Fast, easy prints. Right here at your kiosk.
        </p>
      </div>

      {/* ── Illustration card ── */}
      <div style={{
        background: '#EDF4FE',
        borderRadius: 24,
        padding: '16px 12px 10px',
        marginBottom: 18,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <KioskIllustration />
      </div>

      {/* ── Upload card (Ready to print?) ── */}
      <div
        className="card"
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          marginBottom: 12,
          background: '#FFFFFF',
          borderRadius: 22,
          padding: '22px 20px 20px',
          border: isDragging ? '2px dashed #0052FF' : '1px solid #EBF1F8',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
            Ready to print?
          </div>
          <div style={{ fontSize: 13.5, color: '#64748B', fontWeight: 500 }}>
            Documents, assignments, resumes and more.
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={handleFile}
        />

        <button
          type="button"
          className="btn-primary"
          onClick={() => fileRef.current?.click()}
          style={{
            width: '100%',
            height: 50,
            borderRadius: 14,
            background: '#1A64F8',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            boxShadow: '0 6px 16px rgba(26,100,248,0.3)',
            marginBottom: 12,
            cursor: 'pointer',
          }}
        >
          <Upload size={18} strokeWidth={2.4} />
          Upload file
        </button>

        <p style={{ fontSize: 12, color: '#64748B', textAlign: 'center', fontWeight: 500 }}>
          PDF, DOCX, JPG, PNG · Up to 20 MB
        </p>
      </div>

      {/* ── 2 Coming soon cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <div style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '16px 18px',
          border: '1px solid #EBF1F8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Blank A4 sheets
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
            Coming soon
          </div>
        </div>

        <div style={{
          background: '#FFFFFF',
          borderRadius: 20,
          padding: '16px 18px',
          border: '1px solid #EBF1F8',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
            Photo prints
          </div>
          <div style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
            Coming soon
          </div>
        </div>
      </div>

      {/* ── Footer tagline ── */}
      <p style={{ textAlign: 'center', fontSize: 12, color: '#64748B', fontWeight: 500, marginBottom: 32 }}>
        Print thoughtfully. Choose double-sided.
      </p>

      {/* ── Kiosk ID indicator ── */}
      <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', paddingBottom: 12 }}>
        KIOSK QW-024 · READY TO PRINT
      </div>
    </div>
  );
}
