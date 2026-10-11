import React from 'react';
import { AlertCircle, FolderOpen, Headphones } from 'lucide-react';

export default function Screen12FileError({ onTryAgain, onHelp }) {
  return (
    <div className="screen-content screen-content-padded fade-slide-up" style={{ alignItems: 'center' }}>
      {/* Error icon */}
      <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#FEF2F2', border: '2px solid #FECACA', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '12px auto 16px', boxShadow: '0 6px 18px -4px rgba(239,68,68,0.25)' }}>
        <AlertCircle size={36} strokeWidth={2.2} />
      </div>

      <h1 className="page-title" style={{ textAlign: 'center', fontSize: 22 }}>Couldn't read file</h1>
      <p style={{ fontSize: 13.5, color: '#64748B', textAlign: 'center', marginBottom: 24, lineHeight: 1.5 }}>
        Something is wrong with the document you selected.
      </p>

      {/* Checklist */}
      <div className="card" style={{ width: '100%', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>Try these fixes:</div>
        {[
          'File must not be password-protected or corrupted',
          'Supported formats: PDF, DOCX, DOC, JPG, PNG',
          'File size must be under 20 MB',
        ].map((tip, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 13, color: '#475569', alignItems: 'flex-start' }}>
            <span style={{ color: '#EF4444', fontWeight: 800, marginTop: 1 }}>•</span>
            <span>{tip}</span>
          </div>
        ))}
      </div>

      {/* No charge notice */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#1D4ED8', fontWeight: 600, textAlign: 'center', marginBottom: 24, width: '100%' }}>
        ✓ No payment has been taken. Your session is safe.
      </div>

      <button type="button" className="btn-primary" onClick={onTryAgain} style={{ marginBottom: 10 }}>
        <FolderOpen size={18} /> Choose another file
      </button>
      <button type="button" className="btn-secondary" onClick={onHelp}>
        <Headphones size={15} /> Get help from support
      </button>
    </div>
  );
}
