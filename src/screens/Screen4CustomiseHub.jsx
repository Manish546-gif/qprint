import React from 'react';
import { Check, Eye, Copy, Palette, RefreshCw, SlidersHorizontal, Plus } from 'lucide-react';

export default function Screen4CustomiseHub({ file, onSettings, onPreview, onReplace }) {
  const actions = [
    { icon: <Eye size={18} />, title: 'Preview', desc: 'Check pages & quality', onClick: onPreview },
    { icon: <Copy size={18} />, title: 'Pages & copies', desc: 'Set print count', onClick: onSettings },
    { icon: <Palette size={18} />, title: 'Colour & sides', desc: 'B&W or full colour', onClick: onSettings },
    { icon: <RefreshCw size={18} />, title: 'Replace file', desc: 'Choose another', onClick: onReplace },
  ];

  return (
    <div className="screen-content screen-content-padded fade-slide-up">
      <h1 className="page-title">All set to customise</h1>
      <p className="page-sub">Your file is ready. Quick actions below.</p>

      {/* Uploaded file banner */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
            PDF
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>{file?.name || 'Assignment.pdf'}</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>{file?.pages || 6} pages · {file?.size || '2.4 MB'}</div>
          </div>
        </div>
        <span className="pill success"><Check size={11} strokeWidth={3} /> Uploaded</span>
      </div>

      {/* 2x2 grid of quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {actions.map((a, i) => (
          <button key={i} type="button" onClick={a.onClick} style={{
            background: 'white', border: '1px solid #E2E8F0', borderRadius: 16,
            padding: '14px 12px', textAlign: 'left', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', gap: 8,
            transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
            onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
            onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div className="icon-box sm">{a.icon}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{a.title}</div>
              <div style={{ fontSize: 11.5, color: '#64748B', marginTop: 2 }}>{a.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Main CTA */}
      <button type="button" className="btn-primary" onClick={onSettings}>
        <SlidersHorizontal size={18} />
        Choose print settings
      </button>
    </div>
  );
}
